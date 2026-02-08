# Razorpay Checkout - Quick Implementation Guide

This is a quick reference for implementing the Razorpay checkout in your components.

## 1. Install Razorpay Package

```bash
npm install razorpay
# or
yarn add razorpay
# or
pnpm add razorpay
```

## 2. Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Available Server Actions

All actions are in `lib/actions/order-actions.ts`:

```typescript
import {
    checkout,
    verifyPaymentAndConfirmOrder,
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    requestReturn,
} from "@/lib/actions/order-actions";
```

## 4. Checkout Button Component

Create `components/checkout/razorpay-checkout-button.tsx`:

```typescript
"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { checkout, verifyPaymentAndConfirmOrder } from "@/lib/actions/order-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RazorpayCheckoutButtonProps {
    shippingAddressId: string;
    billingAddressId?: string;
    disabled?: boolean;
}

export default function RazorpayCheckoutButton({
    shippingAddressId,
    billingAddressId,
    disabled = false,
}: RazorpayCheckoutButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        setIsProcessing(true);

        try {
            // Step 1: Create order and get Razorpay details
            const checkoutData = await checkout({
                shippingAddressId,
                billingAddressId,
                paymentMethod: "card",
            });

            // Step 2: Open Razorpay checkout
            const options = {
                key: checkoutData.razorpayKeyId,
                amount: checkoutData.amount,
                currency: checkoutData.currency,
                name: "Your Store Name",
                description: `Order #${checkoutData.orderNumber}`,
                order_id: checkoutData.razorpayOrderId,
                
                handler: async function (response: any) {
                    try {
                        // Step 3: Verify payment
                        const order = await verifyPaymentAndConfirmOrder({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        toast.success("Payment successful! Order confirmed.");
                        router.push(`/orders/${order.orderNumber}`);
                    } catch (error: any) {
                        toast.error(error.message || "Payment verification failed");
                        router.push("/orders");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                
                prefill: {
                    name: checkoutData.customerName,
                    email: checkoutData.customerEmail,
                    contact: checkoutData.customerPhone,
                },
                
                theme: {
                    color: "#3399cc",
                },
                
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                        toast.info("Payment cancelled");
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            
            razorpay.on("payment.failed", function (response: any) {
                setIsProcessing(false);
                toast.error("Payment failed. Please try again.");
                console.error("Payment failed:", response.error);
            });
            
            razorpay.open();

        } catch (error: any) {
            setIsProcessing(false);
            toast.error(error.message || "Checkout failed");
        }
    };

    return (
        <>
            <Button
                onClick={handleCheckout}
                disabled={disabled || isProcessing}
                size="lg"
                className="w-full"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </Button>

            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
        </>
    );
}
```

## 5. Using in Checkout Page

```typescript
// app/(root)/checkout/page.tsx
import RazorpayCheckoutButton from "@/components/checkout/razorpay-checkout-button";

export default function CheckoutPage() {
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    return (
        <div>
            {/* Address selection */}
            <AddressSelection onSelect={setSelectedAddress} />

            {/* Order summary */}
            <OrderSummary />

            {/* Payment button */}
            <RazorpayCheckoutButton
                shippingAddressId={selectedAddress}
                disabled={!selectedAddress}
            />
        </div>
    );
}
```

## 6. Orders Page

```typescript
// app/(root)/orders/page.tsx
import { getUserOrders } from "@/lib/actions/order-actions";

export default async function OrdersPage() {
    const { data: orders } = await getUserOrders(0, 10);

    return (
        <div>
            <h1>My Orders</h1>
            {orders.map(order => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
```

## 7. Order Details Page

```typescript
// app/(root)/orders/[orderNumber]/page.tsx
import { getOrderDetails } from "@/lib/actions/order-actions";

export default async function OrderDetailsPage({ 
    params 
}: { 
    params: { orderNumber: string } 
}) {
    const order = await getOrderDetails(params.orderNumber);

    return (
        <div>
            <h1>Order {order.orderNumber}</h1>
            <OrderStatus status={order.status} />
            <OrderItems items={order.items} />
        </div>
    );
}
```

## 8. Cancel Order Button

```typescript
// components/order/cancel-order-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/actions/order-actions";
import { toast } from "sonner";

export default function CancelOrderButton({ orderNumber }: { orderNumber: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        const reason = prompt("Please provide a reason for cancellation:");
        if (!reason) return;

        setIsLoading(true);
        try {
            await cancelOrder(orderNumber, reason);
            toast.success("Order cancelled successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
        >
            {isLoading ? "Cancelling..." : "Cancel Order"}
        </Button>
    );
}
```

## 9. Request Return Button

```typescript
// components/order/request-return-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestReturn } from "@/lib/actions/order-actions";
import { toast } from "sonner";

export default function RequestReturnButton({ orderNumber }: { orderNumber: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReturn = async () => {
        const reason = prompt("Please provide a reason for return:");
        if (!reason) return;

        setIsLoading(true);
        try {
            await requestReturn(orderNumber, reason);
            toast.success("Return request submitted");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleReturn}
            disabled={isLoading}
        >
            {isLoading ? "Submitting..." : "Request Return"}
        </Button>
    );
}
```

## 10. TypeScript Types

All types are available in `types/orders.d.ts`:

```typescript
import { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types/orders";
```

## 11. Testing with Test Cards

Use these test card numbers in test mode:

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

**Failure:**
- Card: `4111 1111 1111 1234`

## 12. Common Issues

### Issue: "Razorpay is not defined"

**Solution:** Make sure Script component is included:
```typescript
<Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
/>
```

### Issue: "Unauthorized"

**Solution:** Ensure user is logged in using `useSession()` or check auth on server.

### Issue: "Cart is empty"

**Solution:** Add items to cart before checkout.

### Issue: Payment verification fails

**Solution:** Check that `RAZORPAY_KEY_SECRET` is correctly set in `.env.local`.

## 13. Production Checklist

Before going live:

- [ ] Switch to live Razorpay keys (remove `_test_`)
- [ ] Update company/store name in checkout options
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Test with real payment methods
- [ ] Set up proper error logging
- [ ] Add analytics tracking
- [ ] Configure email notifications for orders
- [ ] Set up customer support for payment issues

---

**Need Help?**
- Read the full documentation: `RAZORPAY_CHECKOUT_FLOW.md`
- Razorpay Docs: https://razorpay.com/docs
- Check server actions: `lib/actions/order-actions.ts`
- Review webhook handler: `app/api/webhooks/razorpay/route.ts`
