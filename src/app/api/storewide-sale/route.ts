import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storefront = searchParams.get("storefront") || "SHOPSSENTIALS";

    const storewideSale = await prisma.storewideSale.findFirst({
      where: {
        storefront: storefront as
          | "SHOPSSENTIALS"
          | "LORACE"
          | "LYLA"
          | "ThreeLs"
          | "ALL",
        isActive: true,
      },
    });

    return NextResponse.json({
      hasSale: !!storewideSale,
      discountPercent: storewideSale?.discountPercent || 0,
      sale: storewideSale,
    });
  } catch (error) {
    console.error("Error fetching storewide sale:", error);
    return NextResponse.json(
      { error: "Failed to fetch storewide sale" },
      { status: 500 }
    );
  }
}
