import nodemailer from "nodemailer";

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string;
}

// Create transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendOrderCompletionEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  orderItems: OrderItem[]
) {
  try {
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();

    // Generate order items HTML
    const orderItemsHtml = orderItems
      .map(
        (item) => `
        <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">${
              item.productName
            }</h4>
            ${
              item.size
                ? `<p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Size: ${item.size}</p>`
                : ""
            }
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 500;">Qty: ${
              item.quantity
            }</p>
          </div>
        </div>
      `
      )
      .join("");

    // Use the correct base URL for the frontend (port 3000 for Next.js)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const reviewUrl = `${baseUrl}/orders?review=${orderId}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order is Complete!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3474c0 0%, #4fb3e5 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Order Complete! 🎉</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been successfully completed</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Hi ${customerName}!</h2>
              <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                Great news! Your order has been completed and is ready. Thank you for choosing Shopssentials!
              </p>
            </div>

            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Order Details</h3>
              <div style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
                <div style="background-color: #f8fafc; padding: 15px; border-bottom: 2px solid #e5e7eb;">
                  <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 16px;">Order #${orderId
                    .slice(-8)
                    .toUpperCase()}</p>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Completed on ${new Date().toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}</p>
                </div>
                ${orderItemsHtml}
              </div>
            </div>

            <!-- Review Request -->
            <div style="background: linear-gradient(135deg, #3474c0 0%, #4fb3e5 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
              <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Share Your Experience!</h3>
              <p style="color: #ffffff; margin: 0 0 20px 0; font-size: 16px; opacity: 0.9; line-height: 1.6;">
                Your feedback helps us improve and helps other customers make informed decisions.
              </p>
              <a href="${reviewUrl}" style="display: inline-block; background-color: #ffffff; color: #3474c0; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
                Leave a Review
              </a>
            </div>

            <!-- Support -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; text-align: center;">
              <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
                Need help? Contact our support team anytime.
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Email: <a href="mailto:support@shopssentials.com" style="color: #3474c0; text-decoration: none;">support@shopssentials.com</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
              Thank you for shopping with Shopssentials!
            </p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Shopssentials. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Order Complete!

Hi ${customerName}!

Great news! Your order has been completed and is ready. Thank you for choosing Shopssentials!

Order Details:
Order #${orderId.slice(-8).toUpperCase()}
Completed on ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

Items:
${orderItems
  .map(
    (item) =>
      `- ${item.productName} (Qty: ${item.quantity}${
        item.size ? `, Size: ${item.size}` : ""
      })`
  )
  .join("\n")}

Share Your Experience!
Your feedback helps us improve and helps other customers make informed decisions.
Leave a review: ${reviewUrl}

Need help? Contact our support team anytime.
Email: support@shopssentials.com

Thank you for shopping with Shopssentials!
© ${new Date().getFullYear()} Shopssentials. All rights reserved.
    `;

    const mailOptions = {
      from: `"Shopssentials" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: customerEmail,
      subject: `🎉 Your Order is Complete! - Order #${orderId
        .slice(-8)
        .toUpperCase()}`,
      text: textContent,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order completion email sent successfully:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending order completion email:", error);
    throw error;
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
