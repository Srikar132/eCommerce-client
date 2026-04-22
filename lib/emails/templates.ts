// ==================== EMAIL TEMPLATES ====================
// Reusable HTML email templates for Nala Armoire

const BRAND_COLOR = "#ff909a";
const BRAND_NAME = "Nala Armoire";

/**
 * Base layout wrapper for all emails
 */

function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:1px;font-style:italic;">
                ${BRAND_NAME}
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                Where beauty roars in every stitch
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.<br/>
                <a href="https://nalaarmoire.com" style="color:${BRAND_COLOR};text-decoration:none;">nalaarmoire.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ==================== WELCOME EMAIL ====================

export interface WelcomeEmailProps {
  name: string;
}

export function welcomeEmail({ name }: WelcomeEmailProps): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:600;">
      Welcome to ${BRAND_NAME}, ${name}! 🎉
    </h2>
    <p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.7;">
      We're thrilled to have you join our community of fashion enthusiasts. At ${BRAND_NAME}, we believe in
      handcrafted elegance and personalized style.
    </p>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
      Here's what you can do now:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#4b5563;font-size:15px;line-height:2;">
      <li>Browse our curated collections</li>
      <li>Add items to your wishlist</li>
      <li>Enjoy a seamless checkout experience</li>
    </ul>
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="https://nalaarmoire.com/products" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
        Start Shopping
      </a>
    </div>
  `;

  return {
    subject: `Welcome to ${BRAND_NAME}, ${name}!`,
    html: emailLayout(content),
  };
}

// ==================== NOTIFICATION EMAIL ====================

export interface NotificationEmailProps {
  name: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function notificationEmail({
  name,
  title,
  message,
  actionUrl,
  actionLabel,
}: NotificationEmailProps): { subject: string; html: string } {
  const actionButton = actionUrl
    ? `
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${actionUrl}" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
        ${actionLabel || "View Details"}
      </a>
    </div>`
    : "";

  const content = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:600;">
      ${title}
    </h2>
    <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Hi ${name},</p>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
      ${message}
    </p>
    ${actionButton}
  `;

  return {
    subject: `${title} — ${BRAND_NAME}`,
    html: emailLayout(content),
  };
}

// ==================== ORDER CONFIRMATION EMAIL ====================

export interface OrderConfirmationEmailProps {
  name: string;
  orderNumber: string;
  totalAmount: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress?: string;
}

export function orderConfirmationEmail({
  name,
  orderNumber,
  totalAmount,
  items,
  shippingAddress,
}: OrderConfirmationEmailProps): { subject: string; html: string } {
  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${item.name}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right;font-weight:500;">${item.price}</td>
    </tr>`
    )
    .join("");

  const shippingSection = shippingAddress
    ? `
    <div style="margin:24px 0 0;padding:16px;background-color:#f9fafb;border-radius:8px;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Shipping To</p>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">${shippingAddress}</p>
    </div>`
    : "";

  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:600;">
      Order Confirmed! 🛍️
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${name}, thank you for your order.
    </p>
    <div style="padding:16px;background-color:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-size:14px;">
        <strong>Order #${orderNumber}</strong> has been placed successfully.
      </p>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr style="border-bottom:2px solid #e5e7eb;">
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;">Item</td>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;text-align:center;">Qty</td>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;text-align:right;">Price</td>
      </tr>
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:16px 0 0;color:#111827;font-size:16px;font-weight:700;">Total</td>
        <td style="padding:16px 0 0;color:#111827;font-size:16px;font-weight:700;text-align:right;">${totalAmount}</td>
      </tr>
    </table>
    ${shippingSection}
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="https://nalaarmoire.com/orders" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
        View Order
      </a>
    </div>
  `;

  return {
    subject: `Order #${orderNumber} Confirmed — ${BRAND_NAME}`,
    html: emailLayout(content),
  };
}

// ==================== ORDER DELIVERED EMAIL ====================

export interface OrderDeliveredEmailProps {
  name: string;
  orderNumber: string;
  deliveredAt: string;
}

export function orderDeliveredEmail({
  name,
  orderNumber,
  deliveredAt,
}: OrderDeliveredEmailProps): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:600;">
      Your Order Has Been Delivered! 📦✨
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${name}, great news!
    </p>
    <div style="padding:16px;background-color:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-size:14px;">
        <strong>Order #${orderNumber}</strong> was delivered on <strong>${deliveredAt}</strong>.
      </p>
    </div>
    <p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.7;">
      We hope you love your new pieces! If you have any questions or concerns about your order, don't hesitate to reach out.
    </p>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
      We'd love to hear your feedback — consider leaving a review to help other shoppers.
    </p>
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="https://nalaarmoire.com/orders" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
        View Order Details
      </a>
    </div>
  `;

  return {
    subject: `Order #${orderNumber} Delivered — ${BRAND_NAME}`,
    html: emailLayout(content),
  };
}

// ==================== ORDER SHIPPED EMAIL ====================

export interface OrderShippedEmailProps {
  name: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
}

export function orderShippedEmail({
  name,
  orderNumber,
  trackingNumber,
  carrier,
}: OrderShippedEmailProps): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:600;">
      Your Order Has Been Shipped! 🚚
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${name}, your order is on its way!
    </p>
    <div style="padding:16px;background-color:#eff6ff;border-radius:8px;border-left:4px solid #3b82f6;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;">
        <strong>Order #${orderNumber}</strong>
      </p>
      <p style="margin:0;color:#1e40af;font-size:14px;">
        Carrier: <strong>${carrier}</strong> &nbsp;|&nbsp; Tracking: <strong>${trackingNumber}</strong>
      </p>
    </div>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
      You can track your package using the tracking number above. We'll also notify you once it's delivered.
    </p>
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="https://nalaarmoire.com/orders" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
        Track Order
      </a>
    </div>
  `;

  return {
    subject: `Order #${orderNumber} Shipped — ${BRAND_NAME}`,
    html: emailLayout(content),
  };
}


// emails/contact.ts
export function contactFormEmail({ name, email, message }: {
  name: string;
  email: string;
  message: string;
}) {
  return {
    subject: `New Contact Form Submission from ${name}`,
    html: `
            <h2>New message from ${name}</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
  };
}