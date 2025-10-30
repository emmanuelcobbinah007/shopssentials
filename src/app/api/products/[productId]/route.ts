import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        storefront: "SHOPSSENTIALS",
        isHidden: false,
      },
      include: {
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
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform product to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: `₵${product.price.toFixed(2)}`,
      originalPrice:
        product.salePercent > 0
          ? `₵${(product.price / (1 - product.salePercent / 100)).toFixed(2)}`
          : undefined,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      images: product.images.map((img) => img.url),
      description: product.descriptionLong || product.descriptionShort,
      shortDescription: product.descriptionShort,
      category: product.category.name.toLowerCase().replace(/\s+/g, "-"),
      categoryName: product.category.name,
      subCategoryName: product.subCategory?.name,
      rating: 4.5, // Default rating since we don't have ratings in schema
      reviews: Math.floor(Math.random() * 50) + 1, // Mock reviews count
      inStock: product.stock > 0,
      isOnSale: product.salePercent > 0,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      stock: product.stock,
      salePercent: product.salePercent,
      features: [
        `Stock: ${product.stock} units`,
        product.salePercent > 0
          ? `${product.salePercent}% off`
          : "Regular price",
        `Category: ${product.category.name}`,
        product.subCategory
          ? `Sub-category: ${product.subCategory.name}`
          : null,
      ].filter(Boolean),
    };

    return NextResponse.json({
      product: transformedProduct,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
