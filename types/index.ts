
// ================================================
// COMMON TYPES USED ACROSS THE APPLICATION
// ================================================


export type UUID = string;
export type ISODateString = string;


export interface PagedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// ===================================

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
    imageUrl?: string | null;
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
