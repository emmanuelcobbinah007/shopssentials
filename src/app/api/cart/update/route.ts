import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: "userId, productId, and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      const cart = await prisma.cart.findUnique({
        where: {
          userId_storefront: {
            userId,
            storefront: "SHOPSSENTIALS",
          },
        },
        include: { cartItems: true },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId: productId,
          },
        });
      }
      return NextResponse.json({ success: true });
    }

    // Find the user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
      },
      include: { cartItems: true },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if the item exists
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity },
      });
    } else {
      // Get product price for new item
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Calculate effective price (considering sale)
      const effectivePrice =
        product.salePercent > 0
          ? product.price - (product.price * product.salePercent) / 100
          : product.price;

      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity,
          priceAtTimeOfAddition: effectivePrice,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
