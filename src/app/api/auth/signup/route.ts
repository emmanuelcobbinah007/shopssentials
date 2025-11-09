import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
      confirmPassword,
      storefront = "SHOPSSENTIALS",
    } = await request.json();

    // Validate input
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      console.log("Validation failed: Missing fields", {
        firstname,
        lastname,
        email,
        phone,
        password: password ? "provided" : "missing",
        confirmPassword: confirmPassword ? "provided" : "missing",
      });

      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
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

    // Check if user exists with email
    const existingUser = await prisma.user.findUnique({
      where: {
        email_storefront: {
          email,
          storefront,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        phone,
        password: hashedPassword,
        storefront,
      },
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
