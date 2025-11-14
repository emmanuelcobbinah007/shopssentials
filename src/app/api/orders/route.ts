import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

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
      totalAmount,
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

    // Start a transaction to ensure data consistency
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
            totalAmount,
          },
        });

        // Create order items
        await Promise.all(
          items.map(
            (item: { productId: string; quantity: number; size?: string }) =>
              (async () => {
                // Fetch product to determine the effective price at order time
                const product = await tx.product.findUnique({
                  where: { id: item.productId },
                });

                const effectivePrice = product
                  ? product.salePercent > 0
                    ? product.price -
                      (product.price * product.salePercent) / 100
                    : product.price
                  : 0;

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

        // Fetch the complete order with items and product details
        const completeOrder = await tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    images: true,
                    category: true,
                    subCategory: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });

        // Clear the user's cart after successful order creation
        await tx.cartItem.deleteMany({
          where: {
            cart: {
              userId,
              storefront: storefront as "SHOPSSENTIALS",
            },
          },
        });

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

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

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
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
