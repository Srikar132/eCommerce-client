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
import { eq, and, desc, asc, or, ilike, sql, count } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import Razorpay from "razorpay";
import { CheckoutRequest, CheckoutResponse, Order, OrderItem, OrderStatus, PaymentStatus, PaymentVerificationRequest, OrderParams, OrderWithUser } from "@/types/orders";
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
 * Receipt is now a temporary ID since order doesn't exist yet
 */
async function createRazorpayOrder(amount: number, tempReceiptId: string): Promise<string> {
    try {
        const options = {
            amount: amount, // in paise
            currency: "INR",
            receipt: tempReceiptId,
            notes: {
                tempReceiptId: tempReceiptId,
            },
        };

        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created successfully:", order.id);

        return order.id; // Razorpay Order ID
    } catch (error: unknown) {
        console.error("Razorpay order creation error:", JSON.stringify(error, null, 2));
        const errorMessage = error instanceof Error
            ? error.message
            : (error as { error?: { description?: string } })?.error?.description || JSON.stringify(error);
        throw new Error(`Failed to create Razorpay order: ${errorMessage}`);
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
 * Initiate checkout and create Razorpay payment order
 * This does NOT create the order in database - order is only created after successful payment
 * Returns checkout session data needed for order creation after payment
 */
export async function checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        // 1. Calculate cart totals and validate
        const { subtotal, taxAmount, shippingCost, discountAmount, totalAmount, items } =
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
        const billingAddressId = request.billingAddressId || request.shippingAddressId;

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

        // 4. Create Razorpay order (NOT the database order)
        const amountInPaise = Math.round(totalAmount * 100); // Convert to paise
        // Receipt max 40 chars: use short user ID + timestamp
        const tempReceiptId = `chk_${userId.slice(-8)}_${Date.now()}`;
        const razorpayOrderId = await createRazorpayOrder(amountInPaise, tempReceiptId);

        // 5. Get user details for Razorpay prefill
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        // 6. Prepare cart items snapshot for order creation after payment
        const cartItemsSnapshot = items.map(item => ({
            productVariantId: item.productVariantId!,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            itemTotal: item.itemTotal,
        }));

        // 7. Return checkout response with session data
        // The order will be created only after successful payment verification
        return {
            razorpayOrderId,
            razorpayKeyId: RAZORPAY_KEY_ID,
            amount: amountInPaise,
            currency: "INR",
            customerName: user?.name || undefined,
            customerEmail: user?.email || undefined,
            customerPhone: user?.phone || undefined,
            checkoutSession: {
                shippingAddressId: request.shippingAddressId,
                billingAddressId,
                paymentMethod: request.paymentMethod,
                notes: request.notes,
                subtotal,
                taxAmount,
                shippingCost,
                discountAmount,
                totalAmount,
                cartItems: cartItemsSnapshot,
            },
        };

    } catch (error) {
        console.error("Checkout error:", error);
        throw error;
    }
}

/**
 * Verify Razorpay payment and create the order
 * This creates the order in database ONLY after successful payment verification
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
        // 1. Verify payment signature FIRST (before creating any database records)
        const isValid = verifyPaymentSignature(
            request.razorpayOrderId,
            request.razorpayPaymentId,
            request.razorpaySignature
        );

        if (!isValid) {
            throw new Error("Payment verification failed - invalid signature");
        }

        // 2. Validate checkout session data
        const { checkoutSession } = request;
        if (!checkoutSession || !checkoutSession.cartItems || checkoutSession.cartItems.length === 0) {
            throw new Error("Invalid checkout session data");
        }

        // 3. Verify addresses belong to user
        const shippingAddress = await db.query.addresses.findFirst({
            where: and(
                eq(addresses.id, checkoutSession.shippingAddressId),
                eq(addresses.userId, userId)
            ),
        });

        if (!shippingAddress) {
            throw new Error("Invalid shipping address");
        }

        // 4. Generate order number
        const orderNumber = generateOrderNumber();

        // 5. Create order in database (CONFIRMED status since payment is verified)
        const [order] = await db
            .insert(orders)
            .values({
                userId,
                orderNumber,
                status: "CONFIRMED",
                paymentStatus: "PAID",
                paymentMethod: checkoutSession.paymentMethod,
                razorpayOrderId: request.razorpayOrderId,
                razorpayPaymentId: request.razorpayPaymentId,
                razorpaySignature: request.razorpaySignature,
                subtotal: checkoutSession.subtotal.toString(),
                taxAmount: checkoutSession.taxAmount.toString(),
                shippingCost: checkoutSession.shippingCost.toString(),
                discountAmount: checkoutSession.discountAmount.toString(),
                totalAmount: checkoutSession.totalAmount.toString(),
                shippingAddressId: checkoutSession.shippingAddressId,
                billingAddressId: checkoutSession.billingAddressId,
                notes: checkoutSession.notes,
            })
            .returning();

        // 6. Create order items
        const orderItemsData = checkoutSession.cartItems.map(item => ({
            orderId: order.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.itemTotal,
            productionStatus: "PENDING" as const,
        }));

        await db.insert(orderItems).values(orderItemsData);

        // 7. Deduct stock quantities
        for (const item of checkoutSession.cartItems) {
            await db
                .update(productVariants)
                .set({
                    stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}`,
                })
                .where(eq(productVariants.id, item.productVariantId));
        }

        // 8. Clear user's cart
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

        // 9. Revalidate paths
        revalidatePath("/orders");
        revalidatePath("/cart");

        // 10. Return the created order
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
/**
 * Cancel an order
 * Only allowed for orders in PENDING, CONFIRMED, or PROCESSING status
 * within the cancellation time limit (3 days from order creation)
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

        // Check if order can be cancelled (status check)
        // With payment-first flow, orders start in CONFIRMED status (not PENDING)
        const cancellableStatuses = ["CONFIRMED", "PROCESSING"];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error(`Cannot cancel order with status: ${order.status}`);
        }

        // Check cancellation time limit (3 days from order creation)
        const CANCELLATION_TIME_LIMIT_DAYS = 3;
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        const timeLimitHours = CANCELLATION_TIME_LIMIT_DAYS * 24;

        if (hoursSinceOrder > timeLimitHours) {
            throw new Error(`Cancellation period has expired. Orders can only be cancelled within ${CANCELLATION_TIME_LIMIT_DAYS} days.`);
        }

        // Determine new payment status based on current payment status
        let newPaymentStatus = order.paymentStatus;
        if (order.paymentStatus === "PAID") {
            // Payment was completed, request refund
            newPaymentStatus = "REFUND_REQUESTED";
        }

        // Update order status
        await db
            .update(orders)
            .set({
                status: "CANCELLED",
                paymentStatus: newPaymentStatus,
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

        revalidatePath("/orders");
        revalidatePath(`/orders/${orderNumber}`);
        revalidatePath("/admin/orders");

        return await mapOrderToResponse(order.id);

    } catch (error) {
        console.error("Cancel order error:", error);
        throw error;
    }
}

// Note: Return functionality has been removed. Only cancellation is allowed.
// Note: Payment retry functionality has been removed since orders are only created after successful payment.

// ============================================================================
// ADMIN ORDER ACTIONS  
// ============================================================================

/**
 * Get all orders with pagination, filtering, and sorting (Admin only)
 */
export async function getAllOrders(params: OrderParams = {}): Promise<PagedResponse<OrderWithUser>> {
    const {
        searchQuery,
        status,
        paymentStatus,
        page = 0,
        limit = 20,
        sortBy = "CREATED_AT_DESC"
    } = params;

    try {
        // Build where conditions
        const conditions = [];

        // Status filter
        if (status) {
            conditions.push(eq(orders.status, status));
        }

        // Payment status filter
        if (paymentStatus) {
            conditions.push(eq(orders.paymentStatus, paymentStatus));
        }

        // Search filter (order number, user name, email, phone)
        if (searchQuery) {
            conditions.push(
                or(
                    ilike(orders.orderNumber, `%${searchQuery}%`),
                    ilike(users.name, `%${searchQuery}%`),
                    ilike(users.email, `%${searchQuery}%`),
                    ilike(users.phone, `%${searchQuery}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build order by clause
        let orderBy;
        switch (sortBy) {
            case "ORDER_NUMBER_ASC":
                orderBy = asc(orders.orderNumber);
                break;
            case "ORDER_NUMBER_DESC":
                orderBy = desc(orders.orderNumber);
                break;
            case "STATUS_ASC":
                orderBy = asc(orders.status);
                break;
            case "STATUS_DESC":
                orderBy = desc(orders.status);
                break;
            case "PAYMENT_STATUS_ASC":
                orderBy = asc(orders.paymentStatus);
                break;
            case "PAYMENT_STATUS_DESC":
                orderBy = desc(orders.paymentStatus);
                break;
            case "TOTAL_AMOUNT_ASC":
                orderBy = asc(orders.totalAmount);
                break;
            case "TOTAL_AMOUNT_DESC":
                orderBy = desc(orders.totalAmount);
                break;
            case "CREATED_AT_ASC":
                orderBy = asc(orders.createdAt);
                break;
            case "CREATED_AT_DESC":
            default:
                orderBy = desc(orders.createdAt);
                break;
        }

        // Get orders with user information
        const ordersWithUsers = await db
            .select({
                id: orders.id,
                orderNumber: orders.orderNumber,
                status: orders.status,
                paymentStatus: orders.paymentStatus,
                paymentMethod: orders.paymentMethod,
                razorpayOrderId: orders.razorpayOrderId,
                razorpayPaymentId: orders.razorpayPaymentId,
                razorpaySignature: orders.razorpaySignature,
                subtotal: orders.subtotal,
                taxAmount: orders.taxAmount,
                shippingCost: orders.shippingCost,
                discountAmount: orders.discountAmount,
                totalAmount: orders.totalAmount,
                trackingNumber: orders.trackingNumber,
                carrier: orders.carrier,
                estimatedDeliveryDate: orders.estimatedDeliveryDate,
                deliveredAt: orders.deliveredAt,
                cancelledAt: orders.cancelledAt,
                cancellationReason: orders.cancellationReason,
                returnRequestedAt: orders.returnRequestedAt,
                returnReason: orders.returnReason,
                notes: orders.notes,
                createdAt: orders.createdAt,
                updatedAt: orders.updatedAt,
                userId: orders.userId,
                userName: users.name,
                userEmail: users.email,
                userPhone: users.phone,
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(limit)
            .offset(page * limit);

        // Get total count
        const [{ totalCount }] = await db
            .select({
                totalCount: count(),
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(whereClause);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: ordersWithUsers.map(order => ({
                ...order,
                status: order.status as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                userName: order.userName || undefined,
                userEmail: order.userEmail || undefined,
                userPhone: order.userPhone || undefined,
                trackingNumber: order.trackingNumber || undefined,
                carrier: order.carrier || undefined,
                cancellationReason: order.cancellationReason || undefined,
                returnReason: order.returnReason || undefined,
                notes: order.notes || undefined,
                razorpayOrderId: order.razorpayOrderId || undefined,
                razorpayPaymentId: order.razorpayPaymentId || undefined,
                razorpaySignature: order.razorpaySignature || undefined,
                paymentMethod: order.paymentMethod as "card" | "upi" | "netbanking" | undefined,
                subtotal: parseFloat(order.subtotal),
                taxAmount: parseFloat(order.taxAmount),
                shippingCost: parseFloat(order.shippingCost),
                discountAmount: parseFloat(order.discountAmount),
                totalAmount: parseFloat(order.totalAmount),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                estimatedDeliveryDate: order.estimatedDeliveryDate?.toISOString(),
                deliveredAt: order.deliveredAt?.toISOString(),
                cancelledAt: order.cancelledAt?.toISOString(),
                returnRequestedAt: order.returnRequestedAt?.toISOString(),
            })),
            page,
            size: limit,
            totalPages,
            totalElements: totalCount,
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    try {
        await db
            .update(orders)
            .set({
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === "DELIVERED" && { deliveredAt: new Date() }),
                ...(newStatus === "SHIPPED" && {
                    trackingNumber: `TRK${Date.now()}`, // Generate tracking number
                    carrier: "BlueDart" // Default carrier
                })
            })
            .where(eq(orders.id, orderId));

        // Revalidate pages to reflect changes
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

/**
 * Get order details by ID (Admin only)
 */
export async function getOrderByIdAdmin(orderId: string) {
    try {
        // Get order with user info
        const orderData = await db
            .select({
                id: orders.id,
                orderNumber: orders.orderNumber,
                status: orders.status,
                paymentStatus: orders.paymentStatus,
                paymentMethod: orders.paymentMethod,
                razorpayOrderId: orders.razorpayOrderId,
                razorpayPaymentId: orders.razorpayPaymentId,
                subtotal: orders.subtotal,
                taxAmount: orders.taxAmount,
                shippingCost: orders.shippingCost,
                discountAmount: orders.discountAmount,
                totalAmount: orders.totalAmount,
                trackingNumber: orders.trackingNumber,
                carrier: orders.carrier,
                estimatedDeliveryDate: orders.estimatedDeliveryDate,
                deliveredAt: orders.deliveredAt,
                cancelledAt: orders.cancelledAt,
                cancellationReason: orders.cancellationReason,
                returnRequestedAt: orders.returnRequestedAt,
                returnReason: orders.returnReason,
                notes: orders.notes,
                createdAt: orders.createdAt,
                updatedAt: orders.updatedAt,
                userId: orders.userId,
                shippingAddressId: orders.shippingAddressId,
                billingAddressId: orders.billingAddressId,
                userName: users.name,
                userEmail: users.email,
                userPhone: users.phone,
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(eq(orders.id, orderId))
            .limit(1);

        if (orderData.length === 0) {
            return { success: false, error: "Order not found" };
        }

        const order = orderData[0];

        // Get order items with product details
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

        // Get shipping address and transform to expected format
        let shippingAddress = null;
        if (order.shippingAddressId) {
            const addr = await db.query.addresses.findFirst({
                where: eq(addresses.id, order.shippingAddressId),
            });
            if (addr) {
                shippingAddress = {
                    id: addr.id,
                    fullName: order.userName || "N/A",
                    phone: order.userPhone || "N/A",
                    addressLine1: addr.streetAddress || "N/A",
                    addressLine2: null,
                    city: addr.city,
                    state: addr.state,
                    postalCode: addr.postalCode,
                    country: addr.country,
                };
            }
        }

        // Get billing address and transform to expected format
        let billingAddress = null;
        if (order.billingAddressId && order.billingAddressId !== order.shippingAddressId) {
            const addr = await db.query.addresses.findFirst({
                where: eq(addresses.id, order.billingAddressId),
            });
            if (addr) {
                billingAddress = {
                    id: addr.id,
                    fullName: order.userName || "N/A",
                    phone: order.userPhone || "N/A",
                    addressLine1: addr.streetAddress || "N/A",
                    addressLine2: null,
                    city: addr.city,
                    state: addr.state,
                    postalCode: addr.postalCode,
                    country: addr.country,
                };
            }
        }

        return {
            success: true,
            data: {
                ...order,
                subtotal: parseFloat(order.subtotal),
                taxAmount: parseFloat(order.taxAmount),
                shippingCost: parseFloat(order.shippingCost),
                discountAmount: parseFloat(order.discountAmount),
                totalAmount: parseFloat(order.totalAmount),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                estimatedDeliveryDate: order.estimatedDeliveryDate?.toISOString(),
                deliveredAt: order.deliveredAt?.toISOString(),
                cancelledAt: order.cancelledAt?.toISOString(),
                returnRequestedAt: order.returnRequestedAt?.toISOString(),
                items: items.map(item => ({
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
                    productionStatus: item.productionStatus || "PENDING",
                    imageUrl: item.imageUrl,
                })),
                shippingAddress,
                billingAddress,
            }
        };
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        return { success: false, error: "Failed to fetch order details" };
    }
}

/**
 * Process refund for an order (Admin only)
 * Only works for orders with REFUND_REQUESTED payment status
 */
export async function refundOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Get the order
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        });

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        // Check if refund is requested
        if (order.paymentStatus !== "REFUND_REQUESTED") {
            return { success: false, error: "Order is not eligible for refund. Payment status must be REFUND_REQUESTED." };
        }

        // Check if we have razorpay payment ID
        if (!order.razorpayPaymentId) {
            return { success: false, error: "No Razorpay payment ID found for this order. Cannot process refund." };
        }

        // Validate payment ID format (should start with pay_)
        if (!order.razorpayPaymentId.startsWith("pay_")) {
            return { success: false, error: `Invalid Razorpay payment ID format: ${order.razorpayPaymentId}` };
        }

        // Calculate refund amount in paise
        const refundAmountInPaise = Math.round(parseFloat(order.totalAmount) * 100);

        console.log("Processing refund:", {
            paymentId: order.razorpayPaymentId,
            amountPaise: refundAmountInPaise,
            orderNumber: order.orderNumber,
        });

        try {
            // Process refund via Razorpay REST API directly
            const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

            // First, fetch payment details to check status
            const paymentResponse = await fetch(
                `https://api.razorpay.com/v1/payments/${order.razorpayPaymentId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                    },
                }
            );

            const paymentData = await paymentResponse.json();
            console.log("Payment status:", paymentData);

            if (!paymentResponse.ok) {
                return { success: false, error: `Could not fetch payment: ${paymentData.error?.description || "Unknown error"}` };
            }

            // Check if payment is in a refundable state
            if (paymentData.status !== "captured") {
                return {
                    success: false,
                    error: `Payment cannot be refunded. Current status: ${paymentData.status}. Payment must be "captured" to refund.`
                };
            }

            // Now process the refund using the Refunds API
            const refundResponse = await fetch(
                `https://api.razorpay.com/v1/refunds`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_id: order.razorpayPaymentId,
                        amount: refundAmountInPaise,
                    }),
                }
            );

            const refundData = await refundResponse.json();

            console.log("Razorpay refund response:", refundData);

            if (!refundResponse.ok) {
                const errorDesc = refundData.error?.description || refundData.message || "Unknown error";
                return { success: false, error: `Razorpay refund failed: ${errorDesc}` };
            }

            // Update order payment status to REFUNDED
            await db
                .update(orders)
                .set({
                    paymentStatus: "REFUNDED",
                    razorpayRefundId: refundData.id,
                    refundedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, orderId));

            // Revalidate paths
            revalidatePath("/admin/orders");
            revalidatePath(`/admin/orders/${orderId}`);
            revalidatePath("/orders");
            revalidatePath(`/orders/${order.orderNumber}`);

            return { success: true };

        } catch (razorpayError: unknown) {
            console.error("Razorpay refund error:", razorpayError);
            const errorMessage = razorpayError instanceof Error ? razorpayError.message : "Unknown Razorpay error";
            return { success: false, error: `Razorpay refund failed: ${errorMessage}` };
        }

    } catch (error) {
        console.error("Refund order error:", error);
        return { success: false, error: "Failed to process refund" };
    }
}
