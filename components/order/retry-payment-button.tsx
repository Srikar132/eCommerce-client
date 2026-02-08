"use client";

import { useRouter } from "next/navigation";
import { getPaymentDetailsForRetry } from "@/lib/actions/order-actions";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface RetryPaymentButtonProps {
    orderNumber: string;
}

export default function RetryPaymentButton({ orderNumber }: RetryPaymentButtonProps) {
    const router = useRouter();

    // Use Razorpay checkout hook with refresh on success
    const { openCheckout, isProcessing } = useRazorpayCheckout({
        onSuccess: () => {
            router.refresh(); // Refresh to show updated order status
        },
        onFailure: () => {
            router.refresh();
        },
        clearCartOnSuccess: true,
        refreshOnSuccess: true,
    });

    const handleRetryPayment = async () => {
        try {
            // Get payment details for the pending order
            const paymentData = await getPaymentDetailsForRetry(orderNumber);

            // Open Razorpay checkout using the hook
            openCheckout(paymentData);
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate payment");
        }
    };

    return (
        <Button 
            onClick={handleRetryPayment} 
            disabled={isProcessing}
            className="w-full sm:w-auto"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                </>
            )}
        </Button>
    );
}
