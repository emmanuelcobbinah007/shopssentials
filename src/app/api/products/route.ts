import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      storefront: "SHOPSSENTIALS",
      isHidden: false,
    };

    // Category filter
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    // Subcategory filter
    if (subCategoryId && subCategoryId !== "all") {
      where.subCategoryId = subCategoryId;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { descriptionShort: { contains: search, mode: "insensitive" } },
        { descriptionLong: { contains: search, mode: "insensitive" } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Stock filter
    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "name":
        orderBy.name = sortOrder;
        break;
      case "price-low":
        orderBy.price = "asc";
        break;
      case "price-high":
        orderBy.price = "desc";
        break;
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "rating":
        // We'll handle rating sorting after fetching products
        orderBy.createdAt = "desc"; // Default fallback
        break;
      default:
        orderBy.name = "asc";
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products with count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            take: 1, // Get first image only
            orderBy: { id: "asc" },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform products to match frontend expectations
    let transformedProducts = products.map((product) => {
      // Calculate average rating from reviews
      const reviewCount = product.reviews.length;
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          : 0;

      const isOnSale = product.salePercent > 0;
      const originalPrice = isOnSale
        ? `GHS${product.price.toFixed(2)}`
        : undefined;
      const currentPrice = isOnSale
        ? `GHS${(product.price * (1 - product.salePercent / 100)).toFixed(2)}`
        : `GHS${product.price.toFixed(2)}`;

      return {
        id: product.id,
        name: product.name,
        price: currentPrice,
        originalPrice: originalPrice,
        image: product.images[0]?.url || "/images/placeholder.jpg",
        description: product.descriptionShort,
        category: product.category.name.toLowerCase().replace(/\s+/g, "-"),
        rating: averageRating,
        reviews: reviewCount,
        inStock: product.stock > 0,
        isOnSale: isOnSale,
        salePercent: isOnSale ? product.salePercent : undefined,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
      };
    });

    // Handle rating sorting (highest first)
    if (sortBy === "rating") {
      transformedProducts = transformedProducts.sort(
        (a, b) => b.rating - a.rating
      );
    }

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
