import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Razorpay Webhook Handler
 * 
 * Configure this webhook URL in Razorpay Dashboard:
 * https://your-domain.com/api/webhooks/razorpay
 * 
 * Webhook Secret: Set in Razorpay Dashboard and add to .env as RAZORPAY_WEBHOOK_SECRET
 */

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!RAZORPAY_WEBHOOK_SECRET) {
        console.warn("Razorpay webhook secret not configured");
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");

    return expectedSignature === signature;
}

/**
 * POST /api/webhooks/razorpay
 * Handle Razorpay webhook events
 */
export async function POST(request: NextRequest) {
    try {
        // Get raw body as text
        const payload = await request.text();
        
        // Get signature from header
        const signature = request.headers.get("X-Razorpay-Signature") || "";

        // Verify signature
        const isValid = verifyWebhookSignature(payload, signature);

        if (!isValid) {
            console.warn("Invalid Razorpay webhook signature");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Parse webhook payload
        const webhook = JSON.parse(payload);
        const event = webhook.event;

        console.log(`Processing Razorpay webhook event: ${event}`);

        // Handle different webhook events
        switch (event) {
            case "payment.authorized":
                await handlePaymentAuthorized(webhook);
                break;

            case "payment.captured":
                await handlePaymentCaptured(webhook);
                break;

            case "payment.failed":
                await handlePaymentFailed(webhook);
                break;

            case "order.paid":
                await handleOrderPaid(webhook);
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

/**
 * Handle payment.authorized event
 * Payment has been authorized but not captured yet
 */
async function handlePaymentAuthorized(webhook: any) {
    try {
        const payment = webhook.payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        const order = await db.query.orders.findFirst({
            where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (order) {
            await db
                .update(orders)
                .set({
                    razorpayPaymentId,
                    paymentStatus: "PROCESSING",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            console.log(`Payment authorized for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error("Error handling payment.authorized:", error);
    }
}

/**
 * Handle payment.captured event
 * Payment has been captured successfully
 */
async function handlePaymentCaptured(webhook: any) {
    try {
        const payment = webhook.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await db.query.orders.findFirst({
            where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (order) {
            await db
                .update(orders)
                .set({
                    paymentStatus: "PAID",
                    status: "CONFIRMED",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            console.log(`Payment captured for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error("Error handling payment.captured:", error);
    }
}

/**
 * Handle payment.failed event
 * Payment attempt failed
 */
async function handlePaymentFailed(webhook: any) {
    try {
        const payment = webhook.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await db.query.orders.findFirst({
            where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (order) {
            await db
                .update(orders)
                .set({
                    paymentStatus: "FAILED",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            console.log(`Payment failed for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error("Error handling payment.failed:", error);
    }
}

/**
 * Handle order.paid event
 * Order has been paid successfully
 */
async function handleOrderPaid(webhook: any) {
    try {
        const orderData = webhook.payload.order.entity;
        const razorpayOrderId = orderData.id;

        const order = await db.query.orders.findFirst({
            where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (order) {
            await db
                .update(orders)
                .set({
                    paymentStatus: "PAID",
                    status: "CONFIRMED",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            console.log(`Order paid event for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error("Error handling order.paid:", error);
    }
}
