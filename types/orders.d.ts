
export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    variantId: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    hasCustomization: boolean;
    customizationSnapshot?: string | null;  // JSON string
    productionStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    imageUrl?: string | null; // Primary image URL
}


export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURNED = "RETURNED",
    REFUNDED = "REFUNDED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}

export interface Order {
    id: string;

    orderNumber: string;

    status: OrderStatus;
    paymentStatus: PaymentStatus;

    paymentMethod?: "card" | "upi" | "netbanking";

    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    totalAmount: number;

    //   shippingAddress?: Address;
    //   billingAddress?: Address;

    trackingNumber?: string;
    carrier?: string;
    estimatedDeliveryDate?: string;
    deliveredAt?: string;


    cancelledAt?: string;
    cancellationReason?: string;
    returnRequestedAt?: string;
    returnReason?: string;

    notes?: string;

    createdAt: string;
    updatedAt: string;

    items: OrderItem[];
}


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CheckoutRequest {
    shippingAddressId: string;
    billingAddressId?: string; // Optional, defaults to shipping address
    paymentMethod?: "card" | "upi" | "netbanking";
    notes?: string;
}

export interface CheckoutResponse {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number; // in paise (smallest currency unit)
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

export interface PaymentVerificationRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

// Order Params for admin table
export type OrderParams = {
    searchQuery?: string;     // Full-text search query (order number, user name, email)
    status?: OrderStatus;     // Filter by order status
    paymentStatus?: PaymentStatus; // Filter by payment status
    page?: number;            // 0-based page number
    limit?: number;           // Page size (items per page)
    sortBy?: "ORDER_NUMBER_ASC" | "ORDER_NUMBER_DESC" | "STATUS_ASC" | "STATUS_DESC" | "PAYMENT_STATUS_ASC" | "PAYMENT_STATUS_DESC" | "TOTAL_AMOUNT_ASC" | "TOTAL_AMOUNT_DESC" | "CREATED_AT_ASC" | "CREATED_AT_DESC"
};

// Extended Order interface for admin table (includes user info)
export interface OrderWithUser extends Omit<Order, 'items'> {
    userId: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
}