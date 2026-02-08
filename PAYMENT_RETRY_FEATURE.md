# Payment Retry Feature

## Overview
Allows users to complete payment for orders with PENDING payment status directly from the order tracking page.

## Use Case
When a user creates an order but doesn't complete the Razorpay payment (closes the payment modal, payment fails, etc.), the order remains in PENDING status with PENDING payment. This feature allows them to retry payment without creating a new order.

## Implementation

### 1. **Server Action: `getPaymentDetailsForRetry()`**
**Location:** `lib/actions/order-actions.ts`

**Purpose:** Retrieves Razorpay payment details for a pending order

**Validation:**
- User must be authenticated
- Order must belong to the user
- Payment status must be PENDING
- Razorpay order ID must exist

**Returns:** `CheckoutResponse` with existing Razorpay order details
```typescript
{
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string; // Existing Razorpay order
    razorpayKeyId: string;
    amount: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}
```

### 2. **Component: `RetryPaymentButton`**
**Location:** `components/order/retry-payment-button.tsx`

**Features:**
- Fetches payment details for the order
- Opens Razorpay checkout modal with existing order
- Handles payment success/failure
- Verifies payment signature
- Updates order status on success
- Shows loading states
- Toast notifications

**Flow:**
1. User clicks "Pay Now"
2. Calls `getPaymentDetailsForRetry(orderNumber)`
3. Opens Razorpay UI with existing `razorpayOrderId`
4. On success: calls `verifyPaymentAndConfirmOrder()`
5. Refreshes page to show updated status

### 3. **UI Integration**
**Location:** `components/order/order-tracking-client.tsx`

**Display Logic:**
```typescript
const canRetryPayment = order.paymentStatus === "PENDING" && order.status === "PENDING";
```

**UI Elements:**
- **Orange Alert Card:** Prominent warning about pending payment
- **Message:** "Complete your payment to confirm this order..."
- **Pay Now Button:** Large, accessible button with icon
- **Responsive:** Full width on mobile, auto width on desktop

## Security

✅ **Authentication:** User must be logged in
✅ **Authorization:** Order must belong to the user
✅ **Status Validation:** Only PENDING payments allowed
✅ **Signature Verification:** Uses HMAC-SHA256 on payment response
✅ **Idempotency:** Uses existing Razorpay order (no duplicate charges)

## User Experience

### Before Payment Retry
- Order shows PENDING status
- Payment shows PENDING status
- Orange alert prominently displayed
- Clear call-to-action

### During Payment
- Loading state on button
- Razorpay modal opens
- User completes payment
- Button disabled to prevent double-click

### After Success
- Page refreshes automatically
- Order status → CONFIRMED
- Payment status → PAID
- Success toast notification
- Alert disappears

### After Failure
- Error toast with message
- Button re-enabled
- User can retry again
- Order remains PENDING

## Edge Cases Handled

1. **Multiple Retry Attempts:** Uses same Razorpay order, no duplicate charges
2. **Order Not Found:** Shows error toast
3. **Already Paid:** Button not shown (validation in server action)
4. **Cancelled Order:** Button not shown (status check)
5. **Payment Modal Dismissed:** Button remains available
6. **Network Error:** Shows error toast, allows retry

## Testing Scenarios

### Successful Payment Retry
1. Create order, close Razorpay modal
2. Go to order tracking page
3. See "Payment Pending" alert
4. Click "Pay Now"
5. Complete payment with test card
6. Verify order status updates to CONFIRMED
7. Verify payment status updates to PAID

### Failed Payment Retry
1. Create order, close Razorpay modal
2. Go to order tracking page
3. Click "Pay Now"
4. Use a failing test card
5. Verify error toast shows
6. Verify button re-enables
7. Verify order remains PENDING

### Invalid Retry Attempt
1. Try to retry on already paid order
2. Verify button doesn't show
3. Try to call API directly
4. Verify error returned

## Razorpay Test Cards

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## Benefits

✅ **No Cart Loss:** User doesn't lose their cart/order
✅ **No Re-entry:** No need to re-enter address/items
✅ **Single Order ID:** Maintains order continuity
✅ **No Stock Issues:** Items already reserved
✅ **Better Conversion:** Easy to complete abandoned payments
✅ **Clean UX:** Clear, prominent call-to-action

## Related Files

- `lib/actions/order-actions.ts` - Server actions
- `components/order/retry-payment-button.tsx` - Payment button
- `components/order/order-tracking-client.tsx` - Main tracking page
- `types/orders.d.ts` - Type definitions

## Future Enhancements

1. **Payment Link via Email:** Send payment link in email
2. **Expiry Timer:** Auto-cancel after X hours
3. **Payment Methods:** Show multiple payment options
4. **Partial Payments:** Support COD conversion
5. **Payment History:** Show all payment attempts
6. **Auto-Retry:** Automatic retry with saved cards
