import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// Default category images mapping
const defaultCategoryImages: Record<string, string> = {
  "Shelving and Stands":
    "https://e7.pngegg.com/pngimages/900/711/png-clipart-shelf-pallet-racking-furniture-wire-shelving-garage-rack-angle-drawer.png",
  "Displays & Boards":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7P0vA1HVksNiRx1_H9NjfcinzleHNX_KUaQ&s",
  "POS & Electronics":
    "https://www.citypng.com/public/uploads/preview/hd-realistic-pos-machine-with-credit-card-png-704081695127077wwu2seys0q.png",
  // Note the trailing space to match database
  "POS & Electronics ":
    "https://www.citypng.com/public/uploads/preview/hd-realistic-pos-machine-with-credit-card-png-704081695127077wwu2seys0q.png",
  "Baskets & Accessories":
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDhAQERASFRUXEBYVFRcQEBYVFRYWFhYWGhYWFhgZHyggGBolHRUYITUhJSkrMzouGB8zODMtNygtMSsBCgoKDg0OGxAQGy0lICUtLy8wKy0wLi0tLystLS0yLSstLi0tLS8tLS0tLy0tLSstLS0tLy0tLS0tLS8tLS0tL//...",
  "Starter Kits & New Arrivals":
    "https://w7.pngwing.com/pngs/414/995/png-transparent-new-arrival-shop-now-sale-label-thumbnail.png",
  default: "/placeholder-category.jpg",
};

export async function GET() {
  try {
    // Fetch categories for SHOPSSENTIALS storefront with representative products
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
        products: {
          where: {
            isHidden: false,
          },
          select: {
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
          take: 1,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match the expected format
    const transformedCategories = categories.map((category) => {
      const imageUrl =
        category.products?.[0]?.images?.[0]?.url ||
        defaultCategoryImages[category.name] ||
        defaultCategoryImages.default;

      return {
        id: category.id,
        name: category.name,
        count: category._count.products,
        imageURL: imageUrl,
        subCategories: category.subCategories,
      };
    });

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
