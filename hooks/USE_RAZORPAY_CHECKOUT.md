# useRazorpayCheckout Hook

A clean, optimized, and reusable React hook for handling Razorpay payment integration across your application.

## Features

- ✅ **Centralized Payment Logic** - All Razorpay payment handling in one place
- ✅ **Automatic Cart Clearing** - Invalidates cart cache on successful payment
- ✅ **Flexible Callbacks** - Custom success, failure, and cancel handlers
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **TypeScript Support** - Full type safety and IntelliSense
- ✅ **Loading States** - Built-in processing state management
- ✅ **Razorpay SDK Check** - Validates SDK availability before payment

## Usage

### Basic Example

```tsx
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";

function CheckoutPage() {
  const router = useRouter();

  const { openCheckout, isProcessing } = useRazorpayCheckout({
    onSuccess: (orderNumber) => {
      router.push(`/orders/${orderNumber}`);
    },
  });

  const handleCheckout = async () => {
    const checkoutData = await checkout({ shippingAddressId, billingAddressId });
    openCheckout(checkoutData);
  };

  return (
    <Button onClick={handleCheckout} disabled={isProcessing}>
      {isProcessing ? "Processing..." : "Pay Now"}
    </Button>
  );
}
```

### Payment Retry Example

```tsx
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";

function RetryPaymentButton({ orderNumber }) {
  const router = useRouter();

  const { openCheckout, isProcessing } = useRazorpayCheckout({
    onSuccess: () => router.refresh(),
    refreshOnSuccess: true,
    clearCartOnSuccess: true,
  });

  const handleRetry = async () => {
    const paymentData = await getPaymentDetailsForRetry(orderNumber);
    openCheckout(paymentData);
  };

  return (
    <Button onClick={handleRetry} disabled={isProcessing}>
      Retry Payment
    </Button>
  );
}
```

## API Reference

### Parameters

```typescript
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
```

### Return Values

```typescript
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
```

### CheckoutData Interface

```typescript
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
```

## Options Explained

### onSuccess

Called when payment is successfully verified. Receives the order number.

```tsx
onSuccess: (orderNumber) => {
  console.log(`Order ${orderNumber} confirmed!`);
  router.push(`/orders/${orderNumber}`);
}
```

### onFailure

Called when payment fails (card declined, insufficient funds, etc.). Receives the order number.

```tsx
onFailure: (orderNumber) => {
  router.push(`/orders/${orderNumber}`); // Let user retry
}
```

### onCancel

Called when user closes the Razorpay modal without completing payment.

```tsx
onCancel: (orderNumber) => {
  router.push(`/orders/${orderNumber}`);
}
```

### clearCartOnSuccess

When `true`, automatically invalidates the cart cache after successful payment, triggering a refetch that shows an empty cart.

**Default:** `true`

```tsx
clearCartOnSuccess: true // Cart will be cleared automatically
```

### refreshOnSuccess

When `true`, calls `router.refresh()` after successful payment to refresh server components.

**Default:** `false`

```tsx
refreshOnSuccess: true // Useful for order tracking pages
```

### themeColor

Customize the Razorpay modal's primary color to match your brand.

**Default:** `"#ff6376"`

```tsx
themeColor: "#000000" // Black theme
```

## Complete Examples

### Checkout Flow

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { checkout } from "@/lib/actions/order-actions";
import Script from "next/script";

export default function CheckoutClient() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const { openCheckout, isProcessing } = useRazorpayCheckout({
    onSuccess: (orderNumber) => router.push(`/orders/${orderNumber}`),
    onFailure: (orderNumber) => router.push(`/orders/${orderNumber}`),
    onCancel: (orderNumber) => router.push(`/orders/${orderNumber}`),
    clearCartOnSuccess: true,
  });

  const handleCheckout = async () => {
    try {
      const checkoutData = await checkout({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
      });
      
      openCheckout(checkoutData);
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  return (
    <>
      <Button onClick={handleCheckout} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Proceed to Payment"}
      </Button>
      
      {/* Load Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
```

### Payment Retry Flow

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { getPaymentDetailsForRetry } from "@/lib/actions/order-actions";
import Script from "next/script";

export default function RetryPaymentButton({ orderNumber }) {
  const router = useRouter();

  const { openCheckout, isProcessing } = useRazorpayCheckout({
    onSuccess: () => router.refresh(),
    onFailure: () => router.refresh(),
    refreshOnSuccess: true,
    clearCartOnSuccess: true,
  });

  const handleRetry = async () => {
    try {
      const paymentData = await getPaymentDetailsForRetry(orderNumber);
      openCheckout(paymentData);
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <>
      <Button onClick={handleRetry} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
      
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
```

## Payment Flow

1. User clicks payment button
2. `isProcessing` becomes `true`
3. `openCheckout()` is called with payment details
4. Razorpay modal opens
5. User completes payment OR cancels OR payment fails
6. Hook handles the outcome:
   - **Success:** Verifies payment → Clears cart → Calls `onSuccess`
   - **Failure:** Shows error → Calls `onFailure`
   - **Cancel:** Shows info → Calls `onCancel`
7. `isProcessing` becomes `false`

## Benefits Over Manual Implementation

### Before (Manual Razorpay Integration)

```tsx
// ❌ Lots of boilerplate
const [isProcessing, setIsProcessing] = useState(false);
const queryClient = useQueryClient();
const router = useRouter();

const handleCheckout = async () => {
  setIsProcessing(true);
  
  try {
    const checkoutData = await checkout({...});
    
    const options = {
      key: checkoutData.razorpayKeyId,
      amount: checkoutData.amount,
      // ... 30+ lines of Razorpay config
      handler: async function (response) {
        try {
          await verifyPaymentAndConfirmOrder({...});
          queryClient.invalidateQueries({...});
          toast.success("Payment successful!");
          router.push(`/orders/${order.orderNumber}`);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.info("Payment cancelled");
          router.push(`/orders/${orderNumber}`);
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      setIsProcessing(false);
      toast.error("Payment failed");
      router.push(`/orders/${orderNumber}`);
    });
    razorpay.open();
  } catch (error) {
    setIsProcessing(false);
    toast.error(error.message);
  }
};
```

### After (With useRazorpayCheckout Hook)

```tsx
// ✅ Clean and simple
const { openCheckout, isProcessing } = useRazorpayCheckout({
  onSuccess: (orderNumber) => router.push(`/orders/${orderNumber}`),
  onFailure: (orderNumber) => router.push(`/orders/${orderNumber}`),
  onCancel: (orderNumber) => router.push(`/orders/${orderNumber}`),
});

const handleCheckout = async () => {
  const checkoutData = await checkout({...});
  openCheckout(checkoutData);
};
```

**Benefits:**
- 📉 **90% Less Code** - From ~70 lines to ~7 lines
- 🔄 **Reusable** - Use in checkout, retry payment, subscriptions, etc.
- 🧪 **Testable** - Easy to mock and test
- 🐛 **Bug-Free** - Single source of truth, fix once
- 📚 **Maintainable** - Update Razorpay logic in one place
- 🎯 **Type-Safe** - Full TypeScript support

## Notes

- Ensure Razorpay SDK is loaded before calling `openCheckout()`
- Use the `isRazorpayLoaded` property to check SDK availability
- Hook automatically handles cart clearing and page refreshes
- All toast messages are handled internally
- Payment verification is automatic

## Razorpay SDK

Don't forget to include the Razorpay SDK in your component:

```tsx
import Script from "next/script";

<Script
  id="razorpay-checkout-js"
  src="https://checkout.razorpay.com/v1/checkout.js"
/>
```

## Error Handling

The hook handles these scenarios automatically:

- ✅ Payment verification failures
- ✅ Network errors
- ✅ User cancellation
- ✅ Card declines
- ✅ Razorpay SDK not loaded
- ✅ Invalid payment signatures

All errors are logged to console and shown to users via toast notifications.
