import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { sendOrderCompletionEmail } from "../../../utils/sendEmail";

const prisma = new PrismaClient();

// POST /api/orders/mark-complete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, adminApiKey } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Validate admin API key (you should set this in your environment variables)
    const expectedApiKey = process.env.ADMIN_API_KEY;
    if (!expectedApiKey || adminApiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API key" },
        { status: 401 }
      );
    }

    // Find the order with user and order items details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already completed
    if (order.status === "COMPLETED") {
      return NextResponse.json(
        {
          message: "Order is already completed",
          orderId: order.id,
          status: order.status,
        },
        { status: 200 }
      );
    }

    // Update order status to COMPLETED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        updatedAt: new Date(),
      },
    });

    // Prepare order items for email
    const orderItems = order.orderItems.map((item: any) => ({
      productName: item.product.name,
      quantity: item.quantity,
      size: item.size || undefined,
    }));

    // Send completion email with review request
    try {
      await sendOrderCompletionEmail(
        order.user.email,
        `${order.user.firstname} ${order.user.lastname}`,
        order.id,
        orderItems
      );

      return NextResponse.json({
        success: true,
        message: "Order marked as completed and email sent successfully",
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        emailSent: true,
        customerEmail: order.user.email,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Order was updated successfully, but email failed
      return NextResponse.json({
        success: true,
        message: "Order marked as completed but email sending failed",
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        emailSent: false,
        emailError:
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
        customerEmail: order.user.email,
      });
    }
  } catch (error) {
    console.error("Error marking order as complete:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/orders/mark-complete (for testing/health check)
export async function GET() {
  return NextResponse.json({
    message: "Order completion API endpoint",
    methods: ["POST"],
    requiredFields: ["orderId", "adminApiKey"],
    description:
      "Marks an order as completed and sends email to customer with review request",
  });
}
