import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// Update user phone number
export async function PATCH(request: NextRequest) {
  try {
    const { userId, phone } = await request.json();

    // Validate input
    if (!userId || !phone) {
      return NextResponse.json(
        { error: "userId and phone are required" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Use +233XXXXXXXXX" },
        { status: 400 }
      );
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { phone },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Phone number updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating phone:", error);
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}
