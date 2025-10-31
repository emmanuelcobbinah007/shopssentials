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
        // For now, we'll sort by createdAt as we don't have ratings in the schema
        orderBy.createdAt = "desc";
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
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform products to match frontend expectations
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: `₵${product.price.toFixed(2)}`,
      originalPrice:
        product.salePercent > 0
          ? `₵${(product.price / (1 - product.salePercent / 100)).toFixed(2)}`
          : undefined,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      description: product.descriptionShort,
      category: product.category.name.toLowerCase().replace(/\s+/g, "-"),
      rating: 4.5, // Default rating since we don't have ratings in schema
      reviews: Math.floor(Math.random() * 50) + 1, // Mock reviews count
      inStock: product.stock > 0,
      isOnSale: product.salePercent > 0,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
    }));

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
