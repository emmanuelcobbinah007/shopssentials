import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch featured products with their images and categories
    const featuredProducts = await prisma.featuredProduct.findMany({
      where: {
        storefront: "SHOPSSENTIALS",
        product: {
          storefront: "SHOPSSENTIALS",
        },
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            subCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recently featured first
      },
    });

    // Transform the data to match the component's expected format
    const products = featuredProducts.map((featured) => {
      const product = featured.product;
      const isOnSale = product.salePercent > 0;
      const originalPrice = isOnSale
        ? `GHS${product.price.toFixed(2)}`
        : undefined;
      const salePrice = isOnSale
        ? `GHS${(product.price * (1 - product.salePercent / 100)).toFixed(2)}`
        : `GHS${product.price.toFixed(2)}`;

      return {
        id: product.id,
        name: product.name,
        price: salePrice,
        originalPrice: originalPrice,
        image:
          product.images.length > 0
            ? product.images[0].url
            : "/images/placeholder.jpg",
        description: product.descriptionShort,
        categoryName: product.category.name,
        subCategoryName: product.subCategory?.name,
        inStock: product.stock > 0,
        rating: 4.5, // Default rating since it's not in schema
        reviews: 0, // Default reviews count
        isOnSale: isOnSale,
        salePercent: isOnSale ? product.salePercent : undefined,
      };
    });

    return NextResponse.json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
