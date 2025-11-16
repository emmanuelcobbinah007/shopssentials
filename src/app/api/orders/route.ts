import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

// Helper function to validate promo code
async function validatePromoCode(
  code: string,
  userId: string,
  storefront: string,
  subtotal: number
): Promise<{
  valid: boolean;
  error?: string;
  discountAmount?: number;
  promoCode?: Prisma.PromoCodeGetPayload<{}>;
}> {
  const promoCode = await prisma.promoCode.findFirst({
    where: {
      code: code.toUpperCase(),
      storefront: storefront as "SHOPSSENTIALS",
      isActive: true,
    },
    include: {
      usages: true,
    },
  });

  if (!promoCode) {
    return { valid: false, error: "Invalid promo code" };
  }

  if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
    return { valid: false, error: "Promo code has expired" };
  }

  if (promoCode.usageLimit && promoCode.usages.length >= promoCode.usageLimit) {
    return { valid: false, error: "Promo code usage limit exceeded" };
  }

  const userUsages = promoCode.usages.filter(
    (usage) => usage.userId === userId
  );
  if (promoCode.perUserLimit && userUsages.length >= promoCode.perUserLimit) {
    return { valid: false, error: "Promo code per-user limit exceeded" };
  }

  let discountAmount = 0;
  if (promoCode.discountType === "PERCENTAGE") {
    discountAmount = (promoCode.discountValue / 100) * subtotal;
  } else if (promoCode.discountType === "FIXED") {
    discountAmount = Math.min(promoCode.discountValue, subtotal);
  }

  return {
    valid: true,
    discountAmount,
    promoCode,
  };
}

// Types for the API responses
interface OrderItemWithProduct {
  id: string;
  quantity: number;
  size: string | null;
  priceAtTimeOfOrder: number | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
  };
}

interface OrderWithItems {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemWithProduct[];
}

interface OrderWithTotals extends OrderWithItems {
  total: number;
  itemCount: number;
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      storefront = "SHOPSSENTIALS",
      shippingInfo,
      paymentReference,
      promoCode,
    } = body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: userId, items" },
        { status: 400 }
      );
    }

    // Validate that all items have required fields
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Each item must have productId and positive quantity" },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal and handle promo code
    let subtotal = 0;
    let discountAmount = 0;
    let promoCodeRecord = null;

    // Fetch all products at once to avoid multiple queries
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
        category: true,
        subCategory: true,
      },
    });

    // Fetch user data for the response
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist and calculate subtotal
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      const effectivePrice =
        product.salePercent > 0
          ? product.price - (product.price * product.salePercent) / 100
          : product.price;
      subtotal += effectivePrice * item.quantity;
    }

    // Validate promo code if provided
    if (promoCode) {
      const promoValidation = await validatePromoCode(
        promoCode,
        userId,
        storefront,
        subtotal
      );
      if (!promoValidation.valid) {
        return NextResponse.json(
          { error: promoValidation.error },
          { status: 400 }
        );
      }
      discountAmount = promoValidation.discountAmount || 0;
      promoCodeRecord = promoValidation.promoCode;
    }

    const finalTotal = subtotal - discountAmount;
    const order = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            userId,
            storefront,
            status: "PENDING",
            // Shipping information
            shippingFirstName: shippingInfo?.firstName,
            shippingLastName: shippingInfo?.lastName,
            shippingEmail: shippingInfo?.email,
            shippingStreetAddress: shippingInfo?.address,
            shippingCity: shippingInfo?.city,
            shippingPostalCode: shippingInfo?.postalCode,
            // Payment information
            paymentReference,
            totalAmount: finalTotal,
          },
        });

        // Create order items
        await Promise.all(
          items.map(
            (item: { productId: string; quantity: number; size?: string }) =>
              (async () => {
                // Use product from the map (already fetched outside transaction)
                const product = productMap.get(item.productId)!; // We know it exists from validation above

                const effectivePrice =
                  product.salePercent > 0
                    ? product.price -
                      (product.price * product.salePercent) / 100
                    : product.price;

                return tx.orderItem.create({
                  data: {
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size || null,
                    priceAtTimeOfOrder: effectivePrice,
                  },
                });
              })()
          )
        );

        // Create promo code usage if applicable
        if (promoCodeRecord) {
          await tx.promoCodeUsage.create({
            data: {
              promoCodeId: promoCodeRecord.id,
              userId,
              orderId: newOrder.id,
              discountApplied: discountAmount,
            },
          });
        }

        // Clear the user's cart after successful order creation
        await tx.cartItem.deleteMany({
          where: {
            cart: {
              userId,
              storefront: storefront as "SHOPSSENTIALS",
            },
          },
        });

        // Build the complete order object manually to avoid expensive query
        const orderItemsWithProducts = items.map((item, index) => {
          const product = productMap.get(item.productId)!;
          const effectivePrice =
            product.salePercent > 0
              ? product.price - (product.price * product.salePercent) / 100
              : product.price;

          return {
            id: `temp-${index}`, // Temporary ID since we don't have the real one yet
            quantity: item.quantity,
            size: item.size || null,
            priceAtTimeOfOrder: effectivePrice,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              category: product.category,
              subCategory: product.subCategory,
            },
          };
        });

        const completeOrder = {
          ...newOrder,
          orderItems: orderItemsWithProducts,
          user: userData || {
            id: userId,
            firstname: "",
            lastname: "",
            email: "",
          },
        };

        return completeOrder;
      }
    );

    return NextResponse.json(
      {
        success: true,
        order,
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get user orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const storefront = searchParams.get("storefront") || "SHOPSSENTIALS";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: {
        userId,
        storefront: storefront as "SHOPSSENTIALS",
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        userId,
        storefront: storefront as "SHOPSSENTIALS",
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Transform the orders to include calculated totals
    const ordersWithTotals: OrderWithTotals[] = orders.map(
      (order: OrderWithItems) => ({
        ...order,
        total: order.orderItems.reduce(
          (sum: number, item: OrderItemWithProduct) =>
            sum +
            (item.priceAtTimeOfOrder ?? item.product.price) * item.quantity,
          0
        ),
        itemCount: order.orderItems.reduce(
          (sum: number, item: OrderItemWithProduct) => sum + item.quantity,
          0
        ),
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithTotals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
