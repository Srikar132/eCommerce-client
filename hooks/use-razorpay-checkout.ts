"use client";

import { useState, useCallback } from "react";
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
    orderNumber: string;
    amount: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
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

    /**
     * Check if Razorpay SDK is loaded
     */
    const isRazorpayLoaded = typeof window !== "undefined" && !!(window as any).Razorpay;

    /**
     * Handle successful payment
     */
    const handlePaymentSuccess = useCallback(async (
        response: RazorpayResponse,
        orderNumber: string
    ) => {
        try {
            const order = await verifyPaymentAndConfirmOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
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
            toast.error(error.message || "Payment verification failed");
            
            // Navigate to order page even on verification failure
            if (onFailure) {
                onFailure(orderNumber);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [clearCartOnSuccess, refreshOnSuccess, onSuccess, onFailure, queryClient, router]);

    /**
     * Handle payment failure
     */
    const handlePaymentFailure = useCallback((
        response: RazorpayError,
        orderNumber: string
    ) => {
        setIsProcessing(false);
        
        const errorMessage = response.error?.description || "Payment failed";
        toast.error(`${errorMessage}. You can retry from order details.`);
        
        console.error("Payment failed:", response.error);

        // Call custom failure handler
        if (onFailure) {
            onFailure(orderNumber);
        }
    }, [onFailure]);

    /**
     * Handle payment cancellation
     */
    const handlePaymentCancel = useCallback((orderNumber: string) => {
        setIsProcessing(false);
        toast.info("Payment cancelled. You can complete payment from order details.");

        // Call custom cancel handler
        if (onCancel) {
            onCancel(orderNumber);
        }
    }, [onCancel]);

    /**
     * Open Razorpay checkout modal
     */
    const openCheckout = useCallback((checkoutData: CheckoutData) => {
        if (!isRazorpayLoaded) {
            toast.error("Payment gateway not loaded. Please refresh the page.");
            return;
        }

        setIsProcessing(true);

        const options = {
            key: checkoutData.razorpayKeyId,
            amount: checkoutData.amount,
            currency: checkoutData.currency,
            name: "NALA ARMOIRE",
            description: `Order #${checkoutData.orderNumber}`,
            order_id: checkoutData.razorpayOrderId,

            handler: function (response: RazorpayResponse) {
                handlePaymentSuccess(response, checkoutData.orderNumber);
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
                    handlePaymentCancel(checkoutData.orderNumber);
                },
            },
        };

        const razorpay = new (window as any).Razorpay(options);

        // Handle payment failure event
        razorpay.on("payment.failed", function (response: RazorpayError) {
            handlePaymentFailure(response, checkoutData.orderNumber);
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
