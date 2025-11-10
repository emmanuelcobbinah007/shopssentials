import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// GET /api/reviews/check - Check if user has reviewed all products in an order
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    let decoded: { userId?: string; id?: string } | undefined;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      ) as { userId?: string; id?: string };
    } catch (error) {
      // Try with fallback secret for backward compatibility
      try {
        decoded = jwt.verify(token, "fallback-secret") as {
          userId?: string;
          id?: string;
        };
      } catch (_fallbackError) {
        throw error; // Throw original error if both fail
      }
    }

    // Handle both old format (id) and new format (userId)
    const userId = decoded?.userId || decoded?.id;

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Get the order with all its items
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: "COMPLETED",
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or not completed",
        },
        { status: 404 }
      );
    }

    // Get all reviews for this order by the user
    const reviews = await prisma.review.findMany({
      where: {
        orderId,
        userId,
      },
    });

    // Check if user has reviewed all products in the order
    const totalProducts = order.orderItems.length;
    const reviewedProducts = reviews.length;
    const hasReviewedAll = totalProducts === reviewedProducts;

    // Get list of unreviewed products
    const reviewedProductIds = reviews.map((r) => r.productId);
    const unreviewedProducts = order.orderItems
      .filter((item) => !reviewedProductIds.includes(item.productId))
      .map((item) => ({
        id: item.product.id,
        name: item.product.name,
      }));

    return NextResponse.json({
      success: true,
      hasReviewedAll,
      totalProducts,
      reviewedProducts,
      unreviewedProducts,
      reviews,
    });
  } catch (error) {
    console.error("Error checking review status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check review status",
      },
      { status: 500 }
    );
  }
}
