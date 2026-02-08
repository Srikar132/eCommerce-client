
export interface OrderItem {
    id: UUID;
    productId: UUID;
    productName: string;
    productSlug: string;
    variantId: UUID;
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
};

export interface Order {
    id: UUID;

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
    estimatedDeliveryDate?: ISODateString;
    deliveredAt?: ISODateString;


    cancelledAt?: ISODateString;
    cancellationReason?: string;
    returnRequestedAt?: ISODateString;
    returnReason?: string;

    notes?: string;

    createdAt: ISODateString;
    updatedAt: ISODateString;

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