# 🔒 Razorpay Checkout Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Security Features](#security-features)
4. [Setup & Configuration](#setup--configuration)
5. [Checkout Flow](#checkout-flow)
6. [Payment Verification](#payment-verification)
7. [Webhook Integration](#webhook-integration)
8. [Order Management](#order-management)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

---

## Overview

This document explains the complete Razorpay payment integration for the eCommerce platform. The implementation follows industry best practices with proper security measures, error handling, and webhook integration.

### Key Features
✅ Server-side order creation with Razorpay SDK
✅ Client-side payment UI with Razorpay Checkout
✅ Cryptographic payment signature verification
✅ Webhook support for real-time payment updates
✅ Automatic stock management
✅ Cart clearing after successful payment
✅ Order cancellation and refund support
✅ Return request handling

---

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │         │   Next.js    │         │  Razorpay   │
│  (Browser)  │ ◄────► │    Server    │ ◄────► │     API     │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │                        │
       │  1. Checkout          │                        │
       ├──────────────────────►│  2. Create Order      │
       │                       ├───────────────────────►│
       │                       │  3. Order ID          │
       │  4. Checkout Data     │◄───────────────────────┤
       │◄──────────────────────┤                        │
       │                       │                        │
       │  5. Show Razorpay UI  │                        │
       │  6. User pays         ├───────────────────────►│
       │                       │  7. Payment Success   │
       │  8. Payment Response  │◄───────────────────────┤
       │◄──────────────────────┤                        │
       │                       │                        │
       │  9. Verify Payment    │                        │
       ├──────────────────────►│ 10. Verify Signature  │
       │                       │ 11. Confirm Order     │
       │                       │ 12. Clear Cart        │
       │ 13. Order Confirmed   │                        │
       │◄──────────────────────┤                        │
       │                       │                        │
       │                       │ Webhook (async)       │
       │                       │◄───────────────────────┤
```

---

## Security Features

### 1. **Server-Side Order Creation**
- Orders are created on the server using `auth()` for authentication
- Razorpay credentials never exposed to client
- Amount calculated server-side (prevents tampering)

### 2. **Payment Signature Verification**
```typescript
function verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

    return generated_signature === razorpaySignature;
}
```

### 3. **Webhook Signature Verification**
```typescript
function verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");

    return expectedSignature === signature;
}
```

### 4. **Address Validation**
- Shipping and billing addresses are verified to belong to the authenticated user
- Prevents address hijacking

### 5. **Stock Management**
- Atomic stock deduction using SQL operations
- Stock is only deducted after payment verification
- Automatic stock restoration on cancellation

---

## Setup & Configuration

### 1. Environment Variables

Create or update your `.env.local` file:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth
AUTH_SECRET=your_auth_secret_here
```

### 2. Install Dependencies

```bash
npm install razorpay
# or
yarn add razorpay
# or
pnpm add razorpay
```

### 3. Razorpay Dashboard Setup

1. **Create Account**: Sign up at https://razorpay.com
2. **Get API Keys**:
   - Go to Settings > API Keys
   - Generate Test/Live keys
   - Copy Key ID and Key Secret

3. **Configure Webhooks** (Optional but recommended):
   - Go to Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`
   - Select events:
     - `payment.authorized`
     - `payment.captured`
     - `payment.failed`
     - `order.paid`
     - `refund.created`
   - Copy Webhook Secret

---

## Checkout Flow

### Step 1: User Initiates Checkout

```typescript
// components/checkout/checkout-client.tsx
import { checkout } from "@/lib/actions/order-actions";

const handleCheckout = async () => {
    try {
        const checkoutData = await checkout({
            shippingAddressId: selectedAddress,
            billingAddressId: selectedAddress,
            paymentMethod: "card",
            notes: "Express delivery please"
        });
        
        // checkoutData contains:
        // - orderId
        // - orderNumber
        // - razorpayOrderId
        // - razorpayKeyId
        // - amount (in paise)
        // - currency
        // - customerName, customerEmail, customerPhone
        
        openRazorpayCheckout(checkoutData);
    } catch (error) {
        toast.error("Checkout failed");
    }
};
```

### Step 2: Server Creates Order

```typescript
// lib/actions/order-actions.ts
export async function checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    
    // 2. Calculate cart totals (server-side)
    const { subtotal, taxAmount, shippingCost, totalAmount } = 
        await calculateCartTotals(userId);
    
    // 3. Verify addresses belong to user
    // 4. Generate unique order number
    // 5. Create order in database (PENDING status)
    // 6. Copy cart items to order items
    // 7. Create Razorpay order using SDK
    const razorpayOrderId = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderId,
    });
    
    // 8. Update order with Razorpay order ID
    // 9. Return checkout response
}
```

### Step 3: Show Razorpay Checkout UI

```typescript
// components/checkout/razorpay-button.tsx
"use client";

import Script from "next/script";
import { verifyPaymentAndConfirmOrder } from "@/lib/actions/order-actions";

const openRazorpayCheckout = (checkoutData: CheckoutResponse) => {
    const options = {
        key: checkoutData.razorpayKeyId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: "Your Store Name",
        description: `Order #${checkoutData.orderNumber}`,
        order_id: checkoutData.razorpayOrderId,
        
        handler: async function (response: any) {
            // Payment successful
            try {
                const order = await verifyPaymentAndConfirmOrder({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });
                
                toast.success("Payment successful!");
                router.push(`/orders/${order.orderNumber}`);
            } catch (error) {
                toast.error("Payment verification failed");
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
    };

    const razorpay = new (window as any).Razorpay(options);
    
    razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed");
        console.error(response.error);
    });
    
    razorpay.open();
};

// Don't forget to include Razorpay script
<Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
/>
```

---

## Payment Verification

### Client sends verification request

After Razorpay checkout success, the handler receives:
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`

### Server verifies signature

```typescript
export async function verifyPaymentAndConfirmOrder(
    request: PaymentVerificationRequest
): Promise<Order> {
    // 1. Authenticate user
    // 2. Find order by Razorpay order ID
    // 3. Verify payment signature using HMAC-SHA256
    const isValid = verifyPaymentSignature(
        request.razorpayOrderId,
        request.razorpayPaymentId,
        request.razorpaySignature
    );
    
    if (!isValid) {
        // Mark payment as FAILED
        throw new Error("Payment verification failed");
    }
    
    // 4. Update order: PAID + CONFIRMED
    // 5. Deduct stock quantities
    // 6. Clear user's cart
    // 7. Return updated order
}
```

### Signature Verification Formula

```
text = razorpay_order_id + "|" + razorpay_payment_id
expected_signature = hmac_sha256(text, razorpay_key_secret)
is_valid = (expected_signature == razorpay_signature)
```

---

## Webhook Integration

Webhooks provide real-time updates about payment status changes.

### Webhook Events

1. **payment.authorized**
   - Payment authorized but not captured
   - Update: `paymentStatus = PROCESSING`

2. **payment.captured**
   - Payment successfully captured
   - Update: `paymentStatus = PAID`

3. **payment.failed**
   - Payment attempt failed
   - Update: `paymentStatus = FAILED`

4. **order.paid**
   - Order fully paid
   - Update: `paymentStatus = PAID`, `status = CONFIRMED`

5. **refund.created**
   - Refund initiated
   - Update: `paymentStatus = REFUNDED` or `PARTIALLY_REFUNDED`

### Webhook Configuration

```typescript
// app/api/webhooks/razorpay/route.ts
export async function POST(request: NextRequest) {
    // 1. Get raw body and signature
    const payload = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    
    // 2. Verify webhook signature
    const isValid = verifyWebhookSignature(payload, signature);
    if (!isValid) return error response;
    
    // 3. Parse and handle event
    const webhook = JSON.parse(payload);
    switch (webhook.event) {
        case "payment.captured":
            await handlePaymentCaptured(webhook.payload);
            break;
        // ... other events
    }
    
    return success response;
}
```

### Testing Webhooks Locally

Use ngrok or similar tools:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL in Razorpay dashboard
https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/webhooks/razorpay
```

---

## Order Management

### 1. Get User Orders

```typescript
const orders = await getUserOrders(page, size);
// Returns paginated list of orders
```

### 2. Get Order Details

```typescript
const order = await getOrderDetails(orderNumber);
// Returns single order with items
```

### 3. Cancel Order

```typescript
const cancelledOrder = await cancelOrder(orderNumber, reason);
// Cancellable statuses: PENDING, CONFIRMED, PROCESSING
// Automatically restores stock
// Initiates refund if payment was made
```

### 4. Request Return

```typescript
const returnedOrder = await requestReturn(orderNumber, reason);
// Only for DELIVERED orders
// 7-day return window
```

---

## Error Handling

### Common Errors

1. **Cart is empty**
   ```
   Error: Cart is empty
   Solution: Add items to cart before checkout
   ```

2. **Invalid address**
   ```
   Error: Invalid shipping address
   Solution: Ensure address belongs to user
   ```

3. **Payment verification failed**
   ```
   Error: Payment verification failed
   Solution: Signature mismatch - contact support
   ```

4. **Order not found**
   ```
   Error: Order not found
   Solution: Check order number and user authentication
   ```

5. **Cannot cancel order**
   ```
   Error: Cannot cancel order with status: DELIVERED
   Solution: Use return request for delivered orders
   ```

### Error Response Format

```typescript
{
    error: string;
    message?: string;
    code?: string;
}
```

---

## Testing

### Test Mode

Razorpay provides test mode for development:

**Test Card Numbers:**
- Success: `4111 1111 1111 1111`
- Failure: `4111 1111 1111 1234`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Scenarios

1. **Successful Payment Flow**
   ```
   1. Add items to cart
   2. Proceed to checkout
   3. Select address
   4. Click "Pay Now"
   5. Enter test card: 4111 1111 1111 1111
   6. Verify payment success
   7. Check order status: CONFIRMED
   8. Verify cart is cleared
   9. Check stock is deducted
   ```

2. **Failed Payment Flow**
   ```
   1. Use test card: 4111 1111 1111 1234
   2. Verify payment fails
   3. Check order status: PENDING (not FAILED)
   4. Verify stock is NOT deducted
   5. Verify cart is NOT cleared
   ```

3. **Order Cancellation**
   ```
   1. Create order with successful payment
   2. Cancel order with reason
   3. Verify order status: CANCELLED
   4. Verify stock is restored
   5. Check refund status
   ```

4. **Webhook Testing**
   ```
   1. Set up ngrok tunnel
   2. Configure webhook in Razorpay dashboard
   3. Make a payment
   4. Check server logs for webhook events
   5. Verify order status updates
   ```

### Testing Checklist

- [ ] User authentication works
- [ ] Cart total calculation is correct
- [ ] Tax and shipping are applied correctly
- [ ] Address validation works
- [ ] Razorpay order creation succeeds
- [ ] Payment UI opens correctly
- [ ] Successful payment flow works
- [ ] Failed payment is handled gracefully
- [ ] Payment signature verification works
- [ ] Stock is deducted after payment
- [ ] Cart is cleared after payment
- [ ] Order status updates correctly
- [ ] Webhooks are received and processed
- [ ] Order cancellation works
- [ ] Stock is restored on cancellation
- [ ] Return request works for delivered orders

---

## Best Practices

1. **Always verify payment signatures server-side**
2. **Never trust client-side data for amounts**
3. **Use webhooks for reliable payment updates**
4. **Log all payment events for debugging**
5. **Handle network failures gracefully**
6. **Test thoroughly in test mode before going live**
7. **Keep Razorpay SDK updated**
8. **Monitor webhook delivery in dashboard**
9. **Implement idempotency for order creation**
10. **Use environment variables for sensitive data**

---

## Production Checklist

Before going live:

- [ ] Switch to live Razorpay API keys
- [ ] Update webhook URL to production domain
- [ ] Enable webhook event subscriptions
- [ ] Test with real payment methods
- [ ] Set up proper error monitoring (Sentry, etc.)
- [ ] Configure proper logging
- [ ] Set up alerts for failed payments
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for checkout (optional)
- [ ] Review and test refund flow
- [ ] Set up customer support for payment issues
- [ ] Document troubleshooting procedures
- [ ] Train support team on payment flow

---

## Support & Resources

- **Razorpay Documentation**: https://razorpay.com/docs
- **API Reference**: https://razorpay.com/docs/api
- **Webhook Guide**: https://razorpay.com/docs/webhooks
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details

---

## Troubleshooting

### Issue: Webhook not received

**Solution:**
1. Check webhook URL is publicly accessible
2. Verify webhook secret is correct
3. Check Razorpay dashboard for delivery logs
4. Ensure SSL certificate is valid

### Issue: Payment verification fails

**Solution:**
1. Check Razorpay key secret is correct
2. Verify signature calculation logic
3. Ensure no whitespace in signature
4. Check server logs for exact error

### Issue: Stock not deducted

**Solution:**
1. Verify payment verification succeeded
2. Check order status is CONFIRMED
3. Look for database errors in logs
4. Verify SQL transaction completed

---

**Last Updated**: February 8, 2026
**Version**: 1.0.0
