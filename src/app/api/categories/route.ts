import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// Default category images mapping
const defaultCategoryImages: Record<string, string> = {
  "Shelving and Stands":
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0TEA4NDxEVFhANDQ0NDQ0PDQ8QDw0PFREYGBUVFRUYKCggGBsqGxUVITEiJSkrLi4uFyszODMtNygtLisBCgoKDg0OFQ8PGSsZFRk3Nys3Ky0rKy0tLSsrNysrLTcrNzcrLS0tKysrKysrKysrLSsrKysrKystKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABgcEBQIDCAH/xABTEAABAwIDBQUECAQFBQoFAwABAAIDBBEFEiUGBzETIkEVIjlhccEygdHQQmKBkqGxshclYnLwJDODosLhFBUXNFJTY3STstLhJkPT8fIZNUSDk8P/...",
  "Displays & Boards":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7P0vA1HVksNiRx1_H9NjfcinzleHNX_KUaQ&s",
  "POS & Electronics":
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  "POS & Electronics ": // Note the trailing space to match database
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  "Baskets & Accessories":
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDhAQERASFRUXEBYVFRcQEBYVFRYWFhYWGhYWFhgZHyggGBolHRUYITUhJSkrMzouGB8zODMtNygtMSsBCgoKDg0OGxAQGy0lICUtLy8wKy0wLi0tLystLS0yLSstLi0tLS8tLS0tLy0tLSstLS0tLy0tLS0tLS8tLS0tL//...",
  "Starter Kits & New Arrivals":
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=300&fit=crop&crop=center",
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
