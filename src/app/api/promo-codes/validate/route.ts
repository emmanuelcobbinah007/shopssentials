import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { code, userId, storefront, subtotal } = await request.json();

    if (!code || !userId || !storefront || subtotal === undefined) {
      return NextResponse.json(
        { valid: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the promo code
    const promoCode = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(), // Assume codes are case-insensitive
        storefront: storefront as "SHOPSSENTIALS",
        isActive: true,
      },
      include: {
        usages: true,
      },
    });

    if (!promoCode) {
      return NextResponse.json(
        { valid: false, error: "Invalid promo code" },
        { status: 400 }
      );
    }

    // Check expiration
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return NextResponse.json(
        { valid: false, error: "Promo code has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (
      promoCode.usageLimit &&
      promoCode.usages.length >= promoCode.usageLimit
    ) {
      return NextResponse.json(
        { valid: false, error: "Promo code usage limit exceeded" },
        { status: 400 }
      );
    }

    // Check per-user limit
    const userUsages = promoCode.usages.filter(
      (usage) => usage.userId === userId
    );
    if (promoCode.perUserLimit && userUsages.length >= promoCode.perUserLimit) {
      return NextResponse.json(
        { valid: false, error: "Promo code per-user limit exceeded" },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "PERCENTAGE") {
      discountAmount = (promoCode.discountValue / 100) * subtotal;
    } else if (promoCode.discountType === "FIXED") {
      discountAmount = Math.min(promoCode.discountValue, subtotal);
    }

    return NextResponse.json({
      valid: true,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
