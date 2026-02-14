"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { verifyPaymentAndConfirmOrder } from "@/lib/actions/order-actions";
import { queryKeys } from "@/lib/tanstack/query-keys";
import { toast } from "sonner";

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayError {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id: string;
        };
    };
}

interface CheckoutData {
    razorpayKeyId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    // Checkout session data for order creation after payment
    checkoutSession: {
        shippingAddressId: string;
        billingAddressId: string;
        paymentMethod?: "card" | "upi" | "netbanking";
        notes?: string;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        totalAmount: number;
        cartItems: {
            productVariantId: string;
            quantity: number;
            unitPrice: string;
            itemTotal: string;
        }[];
    };
}

interface UseRazorpayCheckoutOptions {
    /**
     * Called after successful payment verification
     */
    onSuccess?: (orderNumber: string) => void;


    /**
     * Called when payment fails
     */
    onFailure?: (orderNumber: string) => void;


    /**
     * Called when user cancels the payment
     */
    onCancel?: (orderNumber: string) => void;


    /**
     * Whether to invalidate cart cache after successful payment
     * @default true
     */
    clearCartOnSuccess?: boolean;


    /**
     * Whether to refresh the page after payment
     * @default false
     */
    refreshOnSuccess?: boolean;


    /**
     * Custom theme color for Razorpay modal
     * @default "#ff6376"
     */
    themeColor?: string;
}

interface UseRazorpayCheckoutReturn {
    /**
     * Whether a payment is currently being processed
     */
    isProcessing: boolean;


    /**
     * Open Razorpay checkout modal with payment details
     */
    openCheckout: (checkoutData: CheckoutData) => void;


    /**
     * Check if Razorpay SDK is loaded
     */
    isRazorpayLoaded: boolean;
}

/**
 * Check if Razorpay is available in the window object
 */
const checkRazorpayLoaded = (): boolean => {
    return typeof window !== "undefined" && !!(window as any).Razorpay;
};

/**
 * Custom hook for handling Razorpay checkout flow
 * 
 * Provides a clean interface for initiating payments, handling success/failure,
 * and managing the Razorpay modal lifecycle.
 * 
 * @example
 * ```tsx
 * const { openCheckout, isProcessing } = useRazorpayCheckout({
 *   onSuccess: (orderNumber) => router.push(`/orders/${orderNumber}`),
 *   onFailure: (orderNumber) => router.push(`/orders/${orderNumber}`),
 * });
 * 
 * // Later...
 * const checkoutData = await checkout({ shippingAddressId, billingAddressId });
 * openCheckout(checkoutData);
 * ```
 */
export function useRazorpayCheckout(options: UseRazorpayCheckoutOptions = {}): UseRazorpayCheckoutReturn {
    const {
        onSuccess,
        onFailure,
        onCancel,
        clearCartOnSuccess = true,
        refreshOnSuccess = false,
        themeColor = "#ff6376",
    } = options;

    const router = useRouter();
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

    /**
     * Check if Razorpay SDK is loaded on mount and periodically
     */
    useEffect(() => {
        // Initial check
        if (checkRazorpayLoaded()) {
            setIsRazorpayLoaded(true);
            return;
        }

        // Poll for Razorpay to be loaded (useful for slow connections)
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total (500ms * 20)


        const checkInterval = setInterval(() => {
            attempts++;


            if (checkRazorpayLoaded()) {
                setIsRazorpayLoaded(true);
                clearInterval(checkInterval);
            } else if (attempts >= maxAttempts) {
                console.error('Razorpay SDK failed to load after 10 seconds');
                clearInterval(checkInterval);
            }
        }, 500);

        return () => clearInterval(checkInterval);
    }, []);

    /**
     * Handle successful payment
     */
    const handlePaymentSuccess = useCallback(async (
        response: RazorpayResponse,
        checkoutData: CheckoutData
    ) => {
        try {
            const order = await verifyPaymentAndConfirmOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                checkoutSession: checkoutData.checkoutSession,
            });

            // Clear cart cache if needed
            if (clearCartOnSuccess) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.cart.details(),
                });
            }

            // Refresh page if needed
            if (refreshOnSuccess) {
                router.refresh();
            }

            toast.success("Payment successful! Order confirmed.");

            // Call custom success handler
            if (onSuccess) {
                onSuccess(order.orderNumber);
            }
        } catch (error: any) {
            console.error("Payment verification error:", error);
            toast.error(error.message || "Payment verification failed. Please contact support.");

            // On verification failure, stay on checkout (no order was created)
            setIsProcessing(false);
        }
    }, [clearCartOnSuccess, refreshOnSuccess, onSuccess, queryClient, router]);

    /**
     * Handle payment failure
     * No order exists yet, so user stays on checkout page
     */
    const handlePaymentFailure = useCallback((
        response: RazorpayError
    ) => {
        setIsProcessing(false);


        const errorMessage = response.error?.description || "Payment failed";
        toast.error(`${errorMessage}. Please try again.`);

        console.error("Payment failed:", response.error);

        // Call custom failure handler (no orderNumber since order wasn't created)
        if (onFailure) {
            onFailure("");
        }
    }, [onFailure]);

    /**
     * Handle payment cancellation
     * No order exists yet, so user stays on checkout page
     */
    const handlePaymentCancel = useCallback(() => {
        setIsProcessing(false);
        toast.info("Payment cancelled. Your cart is still available.");

        // Call custom cancel handler (no orderNumber since order wasn't created)
        if (onCancel) {
            onCancel("");
        }
    }, [onCancel]);

    /**
     * Open Razorpay checkout modal
     */
    const openCheckout = useCallback((checkoutData: CheckoutData) => {
        // Double-check if Razorpay is loaded before opening
        const isLoaded = checkRazorpayLoaded();


        if (!isLoaded) {
            toast.error("Payment gateway is loading. Please wait a moment and try again.");
            console.error('Razorpay SDK not loaded when attempting to open checkout');
            return;
        }

        setIsProcessing(true);

        const options = {
            key: checkoutData.razorpayKeyId,
            amount: checkoutData.amount,
            currency: checkoutData.currency,
            name: "NALA ARMOIRE",
            description: `Order Payment`,
            order_id: checkoutData.razorpayOrderId,

            handler: function (response: RazorpayResponse) {
                handlePaymentSuccess(response, checkoutData);
            },

            prefill: {
                name: checkoutData.customerName,
                email: checkoutData.customerEmail,
                contact: checkoutData.customerPhone,
            },

            theme: {
                color: themeColor,
            },

            modal: {
                ondismiss: function () {
                    handlePaymentCancel();
                },
            },
        };

        const razorpay = new (window as any).Razorpay(options);

        // Handle payment failure event
        razorpay.on("payment.failed", function (response: RazorpayError) {
            handlePaymentFailure(response);
        });

        razorpay.open();
    }, [
        isRazorpayLoaded,
        themeColor,
        handlePaymentSuccess,
        handlePaymentFailure,
        handlePaymentCancel,
    ]);

    return {
        isProcessing,
        openCheckout,
        isRazorpayLoaded,
    };
}
