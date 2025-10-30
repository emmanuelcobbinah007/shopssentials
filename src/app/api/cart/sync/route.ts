import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { userId, items } = await request.json();

    if (!userId || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find or create the cart for this user
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Delete all existing cart items for this cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Create new cart items
    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cart synced successfully",
    });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync cart" },
      { status: 500 }
    );
  }
}
