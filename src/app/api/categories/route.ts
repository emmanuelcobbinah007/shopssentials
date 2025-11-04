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
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEhUSEBMVFhIVFRcYFhgSFxIXGxcSFRIXFhgVFhMaHCghGiYmHRUVITEkMSkrLi4uGh8/ODMtOCgtLisBCgoKDg0OGxAQGzAmHyUtLTUtLzctLS0uKy8tLS8vLjUtLy8rLzU3MC0vNS0tKy8tMCs1LzUtLS0tLS0tLS8tLf/...",
  "Baskets & Accessories":
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDhAQERASFRUXEBYVFRcQEBYVFRYWFhYWGhYWFhgZHyggGBolHRUYITUhJSkrMzouGB8zODMtNygtMSsBCgoKDg0OGxAQGy0lICUtLy8wKy0wLi0tLystLS0yLSstLi0tLS8tLS0tLy0tLSstLS0tLy0tLS0tLS8tLS0tL//...",
  "Starter Kits & New Arrivals":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA8FBMVEX///8AIz/m5ubl5eXk5OT/EDf4+Pjn5+fx8fHu7u7v7+/19fX7+/vr6+sAJD/z8/MAFjegoKEAAC60tLQAHzx0fIcMKEIAACYoOlC3u8Slpaa/v78AEDStra65ubm7GDqkGjsaIj5mHz3Kysra29tDID4AACEAACk4RFeRlZzW2t3R0tIAGjp1HTwAAACampuFi5UAAB5rdIHrEjiOHDxSW2qCHTybGzvNFjk5IT6xGTr1ETcAABaoq7EAADAvIT5UID3bFDhaYm9FT18dL0ZfHz3FFzrXFTl7HTwYIj+TGzt8g41VXmwAABNuHj1MID2NKquGAAAgAElEQVR4nOVdDVvbxtKVJUUfloTANjFgG5LYtTF2Ez5CQkhpEiA0DWny/...",
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
