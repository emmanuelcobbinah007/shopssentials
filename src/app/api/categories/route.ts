import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch categories for SHOPSSENTIALS storefront
    const categories = await prisma.category.findMany({
      where: {
        storefront: "SHOPSSENTIALS",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        subCategories: {
          where: {
            isHidden: false,
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match the expected format
    const transformedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: category._count.products,
      subCategories: category.subCategories,
    }));

    return NextResponse.json({
      categories: transformedCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
