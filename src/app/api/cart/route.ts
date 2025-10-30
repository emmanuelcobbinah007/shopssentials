import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
      },
      include: {
        cartItems: {
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
    });

    // If no cart exists, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
        include: {
          cartItems: {
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
      });
    }

    return NextResponse.json({
      success: true,
      items: cart.cartItems,
      total: cart.cartItems.length,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity = 1, size } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS",
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

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size: size || null,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size: size || null,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
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
    });

    return NextResponse.json({
      cart: {
        id: updatedCart!.id,
        items: updatedCart!.cartItems,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, quantity, size } = await request.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: "User ID, Product ID, and quantity are required" },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item from cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
          size: size || null,
        },
      });
    } else {
      // Update quantity
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          size: size || null,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity },
        });
      }
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
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
    });

    return NextResponse.json({
      cart: {
        id: updatedCart!.id,
        items: updatedCart!.cartItems,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");
    const size = searchParams.get("size");

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId_storefront: {
          userId,
          storefront: "SHOPSSENTIALS",
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove item from cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
        size: size || null,
      },
    });

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
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
    });

    return NextResponse.json({
      cart: {
        id: updatedCart!.id,
        items: updatedCart!.cartItems,
      },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
