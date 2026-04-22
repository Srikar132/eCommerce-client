"use server";

import { revalidateTag, unstable_cache, revalidatePath } from "next/cache";
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
import crypto from "crypto";
import Razorpay from "razorpay";
import { 
    CheckoutRequest, 
    CheckoutResponse, 
    Order, 
    OrderItem, 
    OrderStatus, 
    PaymentStatus, 
    PaymentVerificationRequest, 
    OrderParams, 
    OrderWithUser 
} from "@/types/orders";
import { PagedResponse } from "@/types";
import { requirePermission, UserRole } from "@/lib/auth-utils";
import { 
    sendEmail, 
    orderConfirmationEmail, 
    orderDeliveredEmail, 
    orderShippedEmail 
} from "@/lib/emails";

// ============================================================================
// RAZORPAY CONFIGURATION
// ============================================================================

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
}

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

// ============================================================================
// PRIVATE HELPERS & MAPPERS
// These functions are used internally by both Customer and Admin actions.
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
async function createRazorpayOrder(amount: number, tempReceiptId: string): Promise<string> {
    try {
        const options = {
            amount: amount, // in paise
            currency: "INR",
            receipt: tempReceiptId,
            notes: { tempReceiptId },
        };

        const order = await razorpay.orders.create(options);
        return order.id;
    } catch (error: unknown) {
        console.error("Razorpay order creation error:", error);
        throw new Error(`Failed to create Razorpay order`);
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
 * Calculate cart totals, taxes, and shipping
 */
async function calculateCartTotals(userId: string) {
    const cart = await db.query.carts.findFirst({
        where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
    });

    if (!cart) throw new Error("Cart not found");

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
    if (items.length === 0) throw new Error("Cart is empty");

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.itemTotal), 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const shippingCost = subtotal >= 1000 ? 0 : 100;
    const discountAmount = parseFloat(cart.discountAmount);
    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;

    return { subtotal, taxAmount, shippingCost, discountAmount, totalAmount, cart, items };
}

/**
 * Map database order record to a clean TypeScript Order response object
 */
/**
 * Map database order record to a clean TypeScript Order response object
 */
async function mapOrderToResponse(orderId: string): Promise<Order> {
    const orderData = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
    });

    if (!orderData) throw new Error("Order not found");

    // Fetch user for fallbacks
    const user = await db.query.users.findFirst({
        where: eq(users.id, orderData.userId),
    });

    // Fetch addresses
    const shippingAddressData = orderData.shippingAddressId 
        ? await db.query.addresses.findFirst({ where: eq(addresses.id, orderData.shippingAddressId) })
        : null;
    
    const billingAddressData = orderData.billingAddressId 
        ? await db.query.addresses.findFirst({ where: eq(addresses.id, orderData.billingAddressId) })
        : null;

    const mapAddress = (addr: any) => {
        if (!addr) return null;
        return {
            id: addr.id,
            fullName: user?.name || "Customer",
            phone: user?.phone || "N/A",
            addressLine1: addr.streetAddress || "",
            addressLine2: null,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            isDefault: addr.isDefault,
        };
    };

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
            and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true))
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
        shippingAddress: mapAddress(shippingAddressData),
        billingAddress: mapAddress(billingAddressData),
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
// CUSTOMER ACTIONS (STOREFRONT)
// Functions for placing orders, tracking, and customer-side management.
// ============================================================================

/**
 * Initiate checkout and create Razorpay payment order
 */
export async function checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    requirePermission(session.user.role as UserRole, 'checkout:initiate');
    const userId = session.user.id;

    try {
        const { subtotal, taxAmount, shippingCost, discountAmount, totalAmount, items } =
            await calculateCartTotals(userId);

        const shippingAddress = await db.query.addresses.findFirst({
            where: and(eq(addresses.id, request.shippingAddressId), eq(addresses.userId, userId)),
        });
        if (!shippingAddress) throw new Error("Invalid shipping address");

        const billingAddressId = request.billingAddressId || request.shippingAddressId;
        
        const amountInPaise = Math.round(totalAmount * 100);
        const tempReceiptId = `chk_${userId.slice(-8)}_${Date.now()}`;
        const razorpayOrderId = await createRazorpayOrder(amountInPaise, tempReceiptId);

        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

        const cartItemsSnapshot = items.map(item => ({
            productVariantId: item.productVariantId!,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            itemTotal: item.itemTotal,
        }));

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
 * Verify payment and create the database order record
 */
export async function verifyPaymentAndConfirmOrder(request: PaymentVerificationRequest): Promise<Order> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    requirePermission(session.user.role as UserRole, 'payment:verify');
    const userId = session.user.id;

    try {
        const isValid = verifyPaymentSignature(
            request.razorpayOrderId,
            request.razorpayPaymentId,
            request.razorpaySignature
        );
        if (!isValid) throw new Error("Payment verification failed");

        const { checkoutSession } = request;
        if (!checkoutSession || !checkoutSession.cartItems.length) throw new Error("Invalid session");

        const orderNumber = generateOrderNumber();

        const [order] = await db.insert(orders).values({
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
        }).returning();

        const orderItemsData = checkoutSession.cartItems.map(item => ({
            orderId: order.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.itemTotal,
            productionStatus: "PENDING" as const,
        }));
        await db.insert(orderItems).values(orderItemsData);

        for (const item of checkoutSession.cartItems) {
            await db.update(productVariants)
                .set({ stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}` })
                .where(eq(productVariants.id, item.productVariantId));
        }

        const cart = await db.query.carts.findFirst({
            where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
        });
        if (cart) {
            await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
            await db.update(carts).set({ subtotal: "0", total: "0" }).where(eq(carts.id, cart.id));
        }

        // Email Notification
        if (session.user.email) {
            try {
                const emailOrderItems = await db
                    .select({ productName: products.name, quantity: orderItems.quantity, unitPrice: orderItems.unitPrice })
                    .from(orderItems)
                    .leftJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
                    .leftJoin(products, eq(productVariants.productId, products.id))
                    .where(eq(orderItems.orderId, order.id));

                const { subject, html } = orderConfirmationEmail({
                    name: session.user.name || "there",
                    orderNumber,
                    totalAmount: `₹${checkoutSession.totalAmount.toLocaleString("en-IN")}`,
                    items: emailOrderItems.map(item => ({
                        name: item.productName || "Product",
                        quantity: item.quantity,
                        price: `₹${Number(item.unitPrice).toLocaleString("en-IN")}`,
                    })),
                });
                await sendEmail({ to: session.user.email, subject, html });
            } catch (e) { console.error("Email failed", e); }
        }

        revalidatePath("/orders");
        revalidatePath("/cart");
        revalidateTag(`user-orders-${userId}`, 'max');
        revalidateTag("orders", 'max');

        return await mapOrderToResponse(order.id);
    } catch (error) {
        console.error("Verification error:", error);
        throw error;
    }
}

/**
 * Get user's order history with pagination (CACHED)
 */
export async function getUserOrders(page: number = 0, size: number = 10): Promise<PagedResponse<Order>> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    return unstable_cache(
        async () => {
            const totalOrders = await db.select().from(orders).where(eq(orders.userId, userId));
            const totalElements = totalOrders.length;
            const totalPages = Math.ceil(totalElements / size);

            const userOrders = await db.select().from(orders)
                .where(eq(orders.userId, userId))
                .orderBy(desc(orders.createdAt))
                .limit(size).offset(page * size);

            const data = await Promise.all(userOrders.map(order => mapOrderToResponse(order.id)));
            return { data, page, size, totalElements, totalPages };
        },
        ["user-orders", userId, String(page), String(size)],
        { revalidate: 30, tags: [`user-orders-${userId}`, "orders"] }
    )();
}

/**
 * Get single order details (CACHED FETCHER)
 */
export const getOrderDetailsCached = unstable_cache(
    async (orderNumber: string, userId: string) => {
        const order = await db.query.orders.findFirst({
            where: and(eq(orders.orderNumber, orderNumber), eq(orders.userId, userId)),
        });
        if (!order) throw new Error("Order not found");
        return await mapOrderToResponse(order.id);
    },
    ["order-details"],
    { revalidate: 60, tags: ["orders"] }
);

/**
 * Get single order details (WRAPPER with dynamic tags)
 */
export async function getOrderDetails(orderNumber: string): Promise<Order> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return unstable_cache(
        () => getOrderDetailsCached(orderNumber, session.user.id),
        ["order-details", orderNumber, session.user.id],
        { revalidate: 60, tags: [`order-${orderNumber}`, "orders"] }
    )();
}

/**
 * Cancel an order (within 3 days and valid status)
 */
export async function cancelOrder(orderNumber: string, reason: string): Promise<Order> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const order = await db.query.orders.findFirst({
            where: and(eq(orders.orderNumber, orderNumber), eq(orders.userId, userId)),
        });
        if (!order) throw new Error("Order not found");

        const cancellableStatuses = ["CONFIRMED", "PROCESSING"];
        if (!cancellableStatuses.includes(order.status)) throw new Error("Cannot cancel now");

        const orderDate = new Date(order.createdAt);
        if ((new Date().getTime() - orderDate.getTime()) / (1000 * 3600) > 72) throw new Error("Past limit");

        let newPaymentStatus = order.paymentStatus === "PAID" ? "REFUND_REQUESTED" : order.paymentStatus;

        await db.update(orders).set({
            status: "CANCELLED",
            paymentStatus: newPaymentStatus,
            cancelledAt: new Date(),
            cancellationReason: reason,
            updatedAt: new Date(),
        }).where(eq(orders.id, order.id));

        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        for (const item of items) {
            await db.update(productVariants)
                .set({ stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}` })
                .where(eq(productVariants.id, item.productVariantId));
        }

        revalidatePath("/orders");
        revalidatePath(`/orders/${orderNumber}`);
        revalidatePath("/admin/orders");
        revalidateTag(`order-${orderNumber}`, 'max');
        revalidateTag(`user-orders-${userId}`, 'max');
        revalidateTag("orders", 'max');

        return await mapOrderToResponse(order.id);
    } catch (error) {
        console.error("Cancel error:", error);
        throw error;
    }
}

// ============================================================================
// ADMIN ORDER ACTIONS (DASHBOARD)
// Functions for order fulfillment, status updates, and admin management.
// ============================================================================

/**
 * Get all orders with pagination, filtering, and sorting
 */
export async function getAllOrders(params: OrderParams = {}): Promise<PagedResponse<OrderWithUser>> {
    const { searchQuery, status, paymentStatus, page = 0, limit = 20, sortBy = "CREATED_AT_DESC" } = params;

    try {
        const conditions = [];
        if (status) conditions.push(eq(orders.status, status));
        if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus));
        if (searchQuery) {
            conditions.push(or(
                ilike(orders.orderNumber, `%${searchQuery}%`),
                ilike(users.name, `%${searchQuery}%`),
                ilike(users.email, `%${searchQuery}%`),
                ilike(users.phone, `%${searchQuery}%`)
            ));
        }
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        let orderBy;
        switch (sortBy) {
            case "ORDER_NUMBER_ASC": orderBy = asc(orders.orderNumber); break;
            case "ORDER_NUMBER_DESC": orderBy = desc(orders.orderNumber); break;
            case "TOTAL_AMOUNT_ASC": orderBy = asc(orders.totalAmount); break;
            case "TOTAL_AMOUNT_DESC": orderBy = desc(orders.totalAmount); break;
            case "CREATED_AT_ASC": orderBy = asc(orders.createdAt); break;
            default: orderBy = desc(orders.createdAt);
        }

        const ordersWithUsers = await db.select({
            id: orders.id, orderNumber: orders.orderNumber, status: orders.status,
            paymentStatus: orders.paymentStatus, paymentMethod: orders.paymentMethod,
            totalAmount: orders.totalAmount, createdAt: orders.createdAt, updatedAt: orders.updatedAt,
            userId: orders.userId, userName: users.name, userEmail: users.email,
        }).from(orders).leftJoin(users, eq(orders.userId, users.id))
            .where(whereClause).orderBy(orderBy).limit(limit).offset(page * limit);

        const [{ totalCount }] = await db.select({ totalCount: count() }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(whereClause);

        return {
            data: ordersWithUsers.map(order => ({
                ...order,
                status: order.status as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                totalAmount: parseFloat(order.totalAmount),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
            }) as any),
            page, size: limit, totalPages: Math.ceil(totalCount / limit), totalElements: totalCount,
        };
    } catch (error) { throw error; }
}

/**
 * Update order status and send notification emails
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    try {
        await db.update(orders).set({
            status: newStatus,
            updatedAt: new Date(),
            ...(newStatus === "DELIVERED" && { deliveredAt: new Date() }),
            ...(newStatus === "SHIPPED" && { trackingNumber: `TRK${Date.now()}`, carrier: "BlueDart" })
        }).where(eq(orders.id, orderId));

        const [updatedOrder] = await db.select({ orderNumber: orders.orderNumber, userName: users.name, userEmail: users.email, trackingNumber: orders.trackingNumber, carrier: orders.carrier, userId: orders.userId })
            .from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, orderId)).limit(1);

        if (updatedOrder?.userEmail) {
            if (newStatus === "DELIVERED") {
                const { subject, html } = orderDeliveredEmail({ name: updatedOrder.userName || "Customer", orderNumber: updatedOrder.orderNumber, deliveredAt: new Date().toLocaleDateString() });
                await sendEmail({ to: updatedOrder.userEmail, subject, html });
            }
            if (newStatus === "SHIPPED") {
                const { subject, html } = orderShippedEmail({ name: updatedOrder.userName || "Customer", orderNumber: updatedOrder.orderNumber, trackingNumber: updatedOrder.trackingNumber || "N/A", carrier: updatedOrder.carrier || "N/A" });
                await sendEmail({ to: updatedOrder.userEmail, subject, html });
            }
        }

        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
        if (updatedOrder) {
            revalidateTag(`order-${updatedOrder.orderNumber}`, 'max');
            revalidateTag(`user-orders-${updatedOrder.userId}`, 'max');
        }
        revalidateTag("orders", 'max');
    } catch (error) { throw error; }
}

/**
 * Get full order details for admin dashboard
 */
export async function getOrderByIdAdmin(orderId: string) {
    try {
        const orderData = await db.select().from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, orderId)).limit(1);
        if (!orderData.length) return { success: false, error: "Order not found" };
        
        const order = await mapOrderToResponse(orderId);
        const user = orderData[0].user;

        return { 
            success: true, 
            data: { ...order, userName: user?.name, userEmail: user?.email, userPhone: user?.phone } 
        };
    } catch (error) { return { success: false, error: "Failed to fetch" }; }
}

/**
 * Process Razorpay refund for a cancelled order
 */
export async function refundOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
        if (!order || order.paymentStatus !== "REFUND_REQUESTED") return { success: false, error: "Not eligible" };

        const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const refundResponse = await fetch(`https://api.razorpay.com/v1/refunds`, {
            method: 'POST',
            headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id: order.razorpayPaymentId, amount: Math.round(parseFloat(order.totalAmount) * 100) }),
        });

        if (!refundResponse.ok) return { success: false, error: "Refund failed" };

        await db.update(orders).set({ paymentStatus: "REFUNDED", refundedAt: new Date() }).where(eq(orders.id, orderId));

        revalidatePath("/admin/orders");
        revalidateTag("orders", 'max');
        return { success: true };
    } catch (error) { return { success: false, error: "Refund failed" }; }
}
