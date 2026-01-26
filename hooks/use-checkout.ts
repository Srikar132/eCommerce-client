"use client";
import { useUserAddresses } from "@/lib/tanstack/queries/user-profile.queries";
import { useCheckout as useCheckoutMutation, useVerifyPayment } from "@/lib/tanstack/queries/orders.queries";
import { Address } from "@/types";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Store configuration - move to env or constants file
const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || 'The Nala Armoire',
  logo: process.env.NEXT_PUBLIC_STORE_LOGO || '/logo.webp',
  primaryColor: process.env.NEXT_PUBLIC_THEME_COLOR || '#3399cc',
};

export default function useCheckout() {
  const router = useRouter();
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const {
    data: addresses,
    isLoading: loadingAddresses,
    isError: addressesError,
  } = useUserAddresses();

  // Mutations
  const checkoutMutation = useCheckoutMutation();
  const verifyPaymentMutation = useVerifyPayment();

  const handleCheckout = useCallback(async () => {
    if (!selectedShippingAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Step 1: Create order using mutation
      const orderData = await checkoutMutation.mutateAsync({
        shippingAddressId: selectedShippingAddress.id,
        billingAddressId: selectedShippingAddress.id, // same as shipping
        notes: null
      });

      // Step 2: Open Razorpay payment modal
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: STORE_CONFIG.name,
        description: `Order #${orderData.orderNumber}`,
        image: STORE_CONFIG.logo,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        theme: {
          color: STORE_CONFIG.primaryColor
        },
        handler: async function (razorpayResponse: any) {
          // Step 3: Payment successful, verify it using mutation
          try {
            // Determine payment method from Razorpay response
            // Map Razorpay payment methods to backend supported types
            let paymentMethod: "card" | "upi" | null = null;
            
            const method = razorpayResponse.razorpay_payment_method || razorpayResponse.method;
            if (method === 'upi') {
              paymentMethod = 'upi';
            } else if (method === 'card') {
              paymentMethod = 'card';
            }
            // netbanking and other methods will be null

            const order = await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
              paymentMethod: paymentMethod
            });

            // Success! Navigate to order confirmation
            setIsProcessing(false);
            toast.success('Payment successful! Redirecting...');
            router.replace(`/orders/${order.orderNumber}/success`);
          } catch (err: any) {
            setIsProcessing(false);
            const errorMessage = err.response?.data?.message || 'Payment verification failed. Please contact support.';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Payment verification error:', err);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled. Your order is saved and you can complete it later.');
          },
          escape: true,
          backdropclose: false
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 900, // 15 minutes
        notes: {
          order_number: orderData.orderNumber
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        const errorMessage = response.error?.description || 'Payment failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Payment failed:', response.error);
      });

      rzp.open();

    } catch (err: any) {
      setIsProcessing(false);
      const errorMessage = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Checkout error:', err);
    }
  }, [selectedShippingAddress, checkoutMutation, verifyPaymentMutation, router]);

  return {
    selectedShippingAddress,
    setSelectedShippingAddress,
    addresses,
    loadingAddresses,
    addressesError,
    handleCheckout,
    isProcessing,
    error,
    isCheckingOut: checkoutMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending
  };
}