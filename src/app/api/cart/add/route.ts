import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity = 1, size } = await request.json();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Authentication required. Please log in to add items to your cart.",
        },
        { status: 401 }
      );
    }

    // Verify the user exists (basic authentication check)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid user. Please log in again." },
        { status: 401 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Verify the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find or create cart for the user
    let cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS", // Using the storefront from the schema
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
      });
    }

    // Check if the product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size: size || null, // Handle size if provided
      },
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Item quantity updated in cart",
        cartItem: updatedCartItem,
      });
    } else {
      // Create new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
        },
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Item added to cart",
        cartItem: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
