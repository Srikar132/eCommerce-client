import { apiClient } from "./client";
import { UUID,  PagedResponse , Order } from "@/types";

// ================================================
// ORDER REQUEST TYPES
// ================================================

/**
 * Request to initiate checkout and create order
 */
export interface CheckoutRequest {
    shippingAddressId: UUID;
    billingAddressId?: UUID | null;
    notes?: string | null;
}

/**
 * Request to verify Razorpay payment
 */
export interface PaymentVerificationRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: "card" | "upi" | null;
}

/**
 * Request to cancel an order
 */
export interface CancelOrderRequest {
    reason: string;
}

/**
 * Request to return an order
 */
export interface ReturnOrderRequest {
    reason: string;
}

// ================================================
// ORDER RESPONSE TYPES
// ================================================

/**
 * Response after initiating checkout
 * Contains Razorpay payment details
 */
export interface CheckoutResponse {
    orderNumber: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;          // In rupees (BigDecimal from backend)
    currency: string;        // e.g., "INR"
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}


/**
 * Complete order response with all details
 */
export type OrderResponse = Omit<Order,
    | "paymentMethod"
    | "razorpayPaymentId"
    | "razorpaySignature"
    | "cancelledAt"
    | "cancellationReason"
    | "returnRequestedAt"
    | "returnReason"
    | "returnedAt"
>;




// ================================================
// ORDER API CLIENT
// ================================================

export const ordersApi = {
    /**
     * POST /api/v1/orders/checkout
     * Create order from cart and initiate payment
     * Returns Razorpay payment details
     * 
     * @param checkoutData - Checkout request data with address IDs
     * @returns CheckoutResponse with Razorpay payment details
     * @requires Authentication (CUSTOMER role)
     */
    checkout: async (checkoutData: CheckoutRequest): Promise<CheckoutResponse> => {
        const { data } = await apiClient.post<CheckoutResponse>(
            '/api/v1/orders/checkout',
            checkoutData
        );
        return data;
    },

    /**
     * POST /api/v1/orders/verify-payment
     * Verify Razorpay payment and confirm order
     * 
     * @param verificationData - Payment verification request with Razorpay IDs
     * @returns OrderResponseDTO with confirmed order details
     * @requires Authentication (CUSTOMER role)
     */
    verifyPayment: async (
        verificationData: PaymentVerificationRequest
    ): Promise<OrderResponse> => {
        const { data } = await apiClient.post<OrderResponse>(
            '/api/v1/orders/verify-payment',
            verificationData
        );
        return data;
    },

    /**
     * GET /api/v1/orders
     * Get user's order history with pagination
     * 
     * @param page - Page number (default: 0)
     * @param size - Items per page (default: 10)
     * @returns Paginated list of orders
     * @requires Authentication (CUSTOMER role)
     */
    getMyOrders: async (
        page: number = 0,
        size: number = 10
    ): Promise<PagedResponse<OrderResponse>> => {
        const { data } = await apiClient.get<PagedResponse<OrderResponse>>(
            '/api/v1/orders',
            { params: { page, size } }
        );
        return data;
    },

    /**
     * GET /api/v1/orders/{orderNumber}
     * Get single order details by order number
     * 
     * @param orderNumber - Unique order number
     * @returns Complete order details
     * @requires Authentication (CUSTOMER role)
     */
    getOrderDetails: async (orderNumber: string): Promise<OrderResponse> => {
        const { data } = await apiClient.get<OrderResponse>(
            `/api/v1/orders/${orderNumber}`
        );
        return data;
    },

    /**
     * POST /api/v1/orders/{orderNumber}/cancel
     * Cancel an order
     * 
     * @param orderNumber - Unique order number
     * @param reason - Cancellation reason
     * @returns Updated order details
     * @requires Authentication (CUSTOMER role)
     */
    cancelOrder: async (
        orderNumber: string,
        reason: string
    ): Promise<OrderResponse> => {
        const { data } = await apiClient.post<OrderResponse>(
            `/api/v1/orders/${orderNumber}/cancel`,
            null,
            { params: { reason } }
        );
        return data;
    },

    /**
     * POST /api/v1/orders/{orderNumber}/return
     * Request order return
     * 
     * @param orderNumber - Unique order number
     * @param reason - Return reason
     * @returns Updated order details
     * @requires Authentication (CUSTOMER role)
     */
    requestReturn: async (
        orderNumber: string,
        reason: string
    ): Promise<OrderResponse> => {
        const { data } = await apiClient.post<OrderResponse>(
            `/api/v1/orders/${orderNumber}/return`,
            null,
            { params: { reason } }
        );
        return data;
    },
};
