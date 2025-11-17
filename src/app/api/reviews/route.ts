import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const orderId = searchParams.get("orderId");
    const userId = searchParams.get("userId");

    if (productId) {
      // Get pagination parameters
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const skip = (page - 1) * limit;

      // Get all reviews for a specific product with pagination
      const [reviews, totalReviews] = await Promise.all([
        prisma.review.findMany({
          where: { productId },
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.review.count({
          where: { productId },
        }),
      ]);

      return NextResponse.json({
        success: true,
        reviews,
        totalReviews,
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
      });
    }

    if (orderId && userId) {
      // Get reviews for a specific order by a user
      const reviews = await prisma.review.findMany({
        where: {
          orderId,
          userId,
        },
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        reviews,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Missing required parameters",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
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
      } catch {
        throw error; // Throw original error if both fail
      }
    }

    // Handle both old format (id) and new format (userId)
    const userId = decoded?.userId || decoded?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      productId: string;
      orderId: string;
      rating: number;
      comment?: string | null;
    };
    const { productId, orderId, rating, comment } = body;

    // Validate required fields
    if (!productId || !orderId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review data. Rating must be between 1-5.",
        },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId_orderId: {
          userId,
          productId,
          orderId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this product for this order",
        },
        { status: 400 }
      );
    }

    // Verify that the order belongs to the user and is completed
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: "COMPLETED",
      },
      include: {
        orderItems: {
          where: {
            productId,
          },
        },
      },
    });

    if (!order || order.orderItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order or product not found in this order",
        },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        orderId,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create review",
      },
      { status: 500 }
    );
  }
}

// PUT /api/reviews - Update an existing review
export async function PUT(request: NextRequest) {
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId?: string; id?: string };
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      reviewId: string;
      rating: number;
      comment?: string | null;
    };
    const { reviewId, rating, comment } = body;

    if (!reviewId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review data",
        },
        { status: 400 }
      );
    }

    // Verify the review belongs to the user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "Review not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update review",
      },
      { status: 500 }
    );
  }
}
