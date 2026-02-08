"use server";

import { db } from "@/drizzle/db";
import { 
    orders, 
    orderItems, 
    carts, 
    cartItems, 
    products, 
    productVariants, 
    productImages,
    addresses, 
    users
} from "@/drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import Razorpay from "razorpay";
import { CheckoutRequest, CheckoutResponse, Order, OrderItem, OrderStatus, PaymentStatus, PaymentVerificationRequest } from "@/types/orders";
import { PagedResponse } from "@/types";



// ============================================================================
// RAZORPAY CONFIGURATION
// ============================================================================

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXXXX
 */
function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Create Razorpay order using their SDK
 */
async function createRazorpayOrder(amount: number, orderId: string): Promise<string> {
    try {
        const options = {
            amount: amount, // in paise
            currency: "INR",
            receipt: orderId,
            notes: {
                orderId: orderId,
            },
        };

        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created successfully:", order.id);
        
        return order.id; // Razorpay Order ID
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        throw new Error(`Failed to create Razorpay order: ${error}`);
    }
}

/**
 * Verify Razorpay payment signature
 */
function verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

    return generated_signature === razorpaySignature;
}

/**
 * Calculate cart totals
 */
async function calculateCartTotals(userId: string) {
    const cart = await db.query.carts.findFirst({
        where: and(
            eq(carts.userId, userId),
            eq(carts.isActive, true)
        ),
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));

    if (items.length === 0) {
        throw new Error("Cart is empty");
    }

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.itemTotal), 0);
    
    // Calculate tax (18% GST for India)
    const taxAmount = subtotal * 0.18;
    
    // Calculate shipping (free for orders above 1000, else 100)
    const shippingCost = subtotal >= 1000 ? 0 : 100;
    
    // Apply discount if any (from cart)
    const discountAmount = parseFloat(cart.discountAmount);
    
    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;

    return {
        subtotal,
        taxAmount,
        shippingCost,
        discountAmount,
        totalAmount,
        cart,
        items,
    };
}

/**
 * Map database order to Order type
 */
async function mapOrderToResponse(orderId: string): Promise<Order> {
    const orderData = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
    });

    if (!orderData) {
        throw new Error("Order not found");
    }

    const items = await db
        .select({
            id: orderItems.id,
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            variantId: productVariants.id,
            size: productVariants.size,
            color: productVariants.color,
            quantity: orderItems.quantity,
            unitPrice: orderItems.unitPrice,
            totalPrice: orderItems.totalPrice,
            productionStatus: orderItems.productionStatus,
            imageUrl: productImages.imageUrl,
        })
        .from(orderItems)
        .leftJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
        .leftJoin(products, eq(productVariants.productId, products.id))
        .leftJoin(
            productImages,
            and(
                eq(productImages.productId, products.id),
                eq(productImages.isPrimary, true)
            )
        )
        .where(eq(orderItems.orderId, orderId));

    const orderItemsMapped: OrderItem[] = items.map(item => ({
        id: item.id,
        productId: item.productId!,
        productName: item.productName!,
        productSlug: item.productSlug!,
        variantId: item.variantId!,
        size: item.size!,
        color: item.color!,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice),
        hasCustomization: false,
        customizationSnapshot: null,
        productionStatus: item.productionStatus || "PENDING",
        imageUrl: item.imageUrl,
    }));

    return {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        status: orderData.status as OrderStatus,
        paymentStatus: orderData.paymentStatus as PaymentStatus,
        paymentMethod: orderData.paymentMethod as "card" | "upi" | "netbanking" | undefined,
        razorpayOrderId: orderData.razorpayOrderId || undefined,
        razorpayPaymentId: orderData.razorpayPaymentId || undefined,
        razorpaySignature: orderData.razorpaySignature || undefined,
        subtotal: parseFloat(orderData.subtotal),
        taxAmount: parseFloat(orderData.taxAmount),
        shippingCost: parseFloat(orderData.shippingCost),
        discountAmount: parseFloat(orderData.discountAmount),
        totalAmount: parseFloat(orderData.totalAmount),
        trackingNumber: orderData.trackingNumber || undefined,
        carrier: orderData.carrier || undefined,
        estimatedDeliveryDate: orderData.estimatedDeliveryDate?.toISOString(),
        deliveredAt: orderData.deliveredAt?.toISOString(),
        cancelledAt: orderData.cancelledAt?.toISOString(),
        cancellationReason: orderData.cancellationReason || undefined,
        returnRequestedAt: orderData.returnRequestedAt?.toISOString(),
        returnReason: orderData.returnReason || undefined,
        notes: orderData.notes || undefined,
        createdAt: orderData.createdAt.toISOString(),
        updatedAt: orderData.updatedAt.toISOString(),
        items: orderItemsMapped,
    };
}

// ============================================================================
// ORDER ACTIONS
// ============================================================================

/**
 * Create order from cart and initiate Razorpay payment
 * This creates a pending order and returns Razorpay details for payment
 */
export async function checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        // 1. Calculate cart totals and validate
        const { subtotal, taxAmount, shippingCost, discountAmount, totalAmount, cart, items } = 
            await calculateCartTotals(userId);

        // 2. Verify shipping address belongs to user
        const shippingAddress = await db.query.addresses.findFirst({
            where: and(
                eq(addresses.id, request.shippingAddressId),
                eq(addresses.userId, userId)
            ),
        });

        if (!shippingAddress) {
            throw new Error("Invalid shipping address");
        }

        // 3. Verify billing address if provided
        let billingAddressId = request.billingAddressId || request.shippingAddressId;
        
        if (request.billingAddressId) {
            const billingAddress = await db.query.addresses.findFirst({
                where: and(
                    eq(addresses.id, request.billingAddressId),
                    eq(addresses.userId, userId)
                ),
            });

            if (!billingAddress) {
                throw new Error("Invalid billing address");
            }
        }

        // 4. Generate order number
        const orderNumber = generateOrderNumber();

        // 5. Create order in database (PENDING status)
        const [order] = await db
            .insert(orders)
            .values({
                userId,
                orderNumber,
                status: "PENDING",
                paymentStatus: "PENDING",
                paymentMethod: request.paymentMethod,
                subtotal: subtotal.toString(),
                taxAmount: taxAmount.toString(),
                shippingCost: shippingCost.toString(),
                discountAmount: discountAmount.toString(),
                totalAmount: totalAmount.toString(),
                shippingAddressId: request.shippingAddressId,
                billingAddressId,
                notes: request.notes,
            })
            .returning();

        // 6. Copy cart items to order items
        const orderItemsData = await Promise.all(
            items.map(async (item) => {
                const variant = await db.query.productVariants.findFirst({
                    where: eq(productVariants.id, item.productVariantId!),
                });

                return {
                    orderId: order.id,
                    productVariantId: item.productVariantId!,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.itemTotal,
                    productionStatus: "PENDING" as const,
                };
            })
        );

        await db.insert(orderItems).values(orderItemsData);

        // 7. Create Razorpay order
        const amountInPaise = Math.round(totalAmount * 100); // Convert to paise
        const razorpayOrderId = await createRazorpayOrder(amountInPaise, order.id);

        // 8. Update order with Razorpay order ID
        await db
            .update(orders)
            .set({ 
                razorpayOrderId,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

        // 9. Get user details for Razorpay
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        // 10. Return checkout response
        return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            razorpayOrderId,
            razorpayKeyId: RAZORPAY_KEY_ID,
            amount: amountInPaise,
            currency: "INR",
            customerName: user?.name || undefined,
            customerEmail: user?.email || undefined,
            customerPhone: user?.phone || undefined,
        };

    } catch (error) {
        console.error("Checkout error:", error);
        throw error;
    }
}

/**
 * Verify Razorpay payment and confirm order
 * This verifies the payment signature and updates order status
 */
export async function verifyPaymentAndConfirmOrder(
    request: PaymentVerificationRequest
): Promise<Order> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        // 1. Find order by Razorpay order ID
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.razorpayOrderId, request.razorpayOrderId),
                eq(orders.userId, userId)
            ),
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // 2. Verify payment signature
        const isValid = verifyPaymentSignature(
            request.razorpayOrderId,
            request.razorpayPaymentId,
            request.razorpaySignature
        );

        if (!isValid) {
            // Mark payment as failed
            await db
                .update(orders)
                .set({
                    paymentStatus: "FAILED",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            throw new Error("Payment verification failed");
        }

        // 3. Update order with payment details and confirm
        await db
            .update(orders)
            .set({
                razorpayPaymentId: request.razorpayPaymentId,
                razorpaySignature: request.razorpaySignature,
                paymentStatus: "PAID",
                status: "CONFIRMED",
                updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

        // 4. Deduct stock quantities
        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

        for (const item of items) {
            await db
                .update(productVariants)
                .set({
                    stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}`,
                })
                .where(eq(productVariants.id, item.productVariantId));
        }

        // 5. Clear user's cart
        const cart = await db.query.carts.findFirst({
            where: and(
                eq(carts.userId, userId),
                eq(carts.isActive, true)
            ),
        });

        if (cart) {
            await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
            await db
                .update(carts)
                .set({
                    subtotal: "0",
                    total: "0",
                    updatedAt: new Date(),
                })
                .where(eq(carts.id, cart.id));
        }

        // 6. Revalidate paths
        revalidatePath("/orders");
        revalidatePath("/cart");

        // 7. Return updated order
        return await mapOrderToResponse(order.id);

    } catch (error) {
        console.error("Payment verification error:", error);
        throw error;
    }
}

/**
 * Get user's order history with pagination
 */
export async function getUserOrders(
    page: number = 0,
    size: number = 10
): Promise<PagedResponse<Order>> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        // Get total count
        const totalOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId));

        const totalElements = totalOrders.length;
        const totalPages = Math.ceil(totalElements / size);

        // Get paginated orders
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt))
            .limit(size)
            .offset(page * size);

        // Map orders to response format
        const data = await Promise.all(
            userOrders.map(order => mapOrderToResponse(order.id))
        );

        return {
            data,
            page,
            size,
            totalElements,
            totalPages,
        };

    } catch (error) {
        console.error("Get user orders error:", error);
        throw error;
    }
}

/**
 * Get single order details by order number
 */
export async function getOrderDetails(orderNumber: string): Promise<Order> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.orderNumber, orderNumber),
                eq(orders.userId, userId)
            ),
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return await mapOrderToResponse(order.id);

    } catch (error) {
        console.error("Get order details error:", error);
        throw error;
    }
}

/**
 * Cancel an order
 * Only allowed for orders in PENDING, CONFIRMED, or PROCESSING status
 */
export async function cancelOrder(
    orderNumber: string,
    reason: string
): Promise<Order> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.orderNumber, orderNumber),
                eq(orders.userId, userId)
            ),
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Check if order can be cancelled
        const cancellableStatuses = ["PENDING", "CONFIRMED", "PROCESSING"];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error(`Cannot cancel order with status: ${order.status}`);
        }

        // Update order status
        await db
            .update(orders)
            .set({
                status: "CANCELLED",
                cancelledAt: new Date(),
                cancellationReason: reason,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

        // Restore stock quantities
        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

        for (const item of items) {
            await db
                .update(productVariants)
                .set({
                    stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}`,
                })
                .where(eq(productVariants.id, item.productVariantId));
        }

        // If payment was made, initiate refund (you'll need to implement Razorpay refund API)
        if (order.paymentStatus === "PAID") {
            // TODO: Implement Razorpay refund
            await db
                .update(orders)
                .set({
                    paymentStatus: "REFUNDED",
                })
                .where(eq(orders.id, order.id));
        }

        revalidatePath("/orders");

        return await mapOrderToResponse(order.id);

    } catch (error) {
        console.error("Cancel order error:", error);
        throw error;
    }
}

/**
 * Request return for delivered order
 * Only allowed for orders in DELIVERED status
 */
export async function requestReturn(
    orderNumber: string,
    reason: string
): Promise<Order> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.orderNumber, orderNumber),
                eq(orders.userId, userId)
            ),
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Check if order can be returned
        if (order.status !== "DELIVERED") {
            throw new Error("Only delivered orders can be returned");
        }

        // Check if return window is still valid (e.g., 7 days)
        const deliveredDate = order.deliveredAt;
        if (deliveredDate) {
            const daysSinceDelivery = Math.floor(
                (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (daysSinceDelivery > 7) {
                throw new Error("Return window has expired");
            }
        }

        // Update order status
        await db
            .update(orders)
            .set({
                status: "RETURN_REQUESTED",
                returnRequestedAt: new Date(),
                returnReason: reason,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

        revalidatePath("/orders");

        return await mapOrderToResponse(order.id);

    } catch (error) {
        console.error("Request return error:", error);
        throw error;
    }
}

/**
 * Get payment details for a pending order to retry payment
 * Only works for orders with PENDING payment status
 */
export async function getPaymentDetailsForRetry(orderNumber: string): Promise<CheckoutResponse> {
    const session = await auth();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.orderNumber, orderNumber),
                eq(orders.userId, userId)
            ),
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Check if payment is pending
        if (order.paymentStatus !== "PENDING") {
            throw new Error("Payment is not pending for this order");
        }

        // Check if Razorpay order exists
        if (!order.razorpayOrderId) {
            throw new Error("Razorpay order not found");
        }

        // Get user details
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        const amountInPaise = Math.round(parseFloat(order.totalAmount) * 100);

        return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            razorpayOrderId: order.razorpayOrderId,
            razorpayKeyId: RAZORPAY_KEY_ID,
            amount: amountInPaise,
            currency: "INR",
            customerName: user?.name || undefined,
            customerEmail: user?.email || undefined,
            customerPhone: user?.phone || undefined,
        };

    } catch (error) {
        console.error("Get payment details error:", error);
        throw error;
    }
}
