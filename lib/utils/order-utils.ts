import { OrderStatus, PaymentStatus } from '@/types/orders';

/**
 * Status styling configurations for order statuses
 * Uses OKLCH color space for consistent theming
 */
export const orderStatusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-[oklch(0.82_0.05_60)] text-[oklch(0.42_0.08_60)] border-[oklch(0.72_0.05_60)]',
  [OrderStatus.CONFIRMED]: 'bg-[oklch(0.85_0.05_220)] text-[oklch(0.45_0.08_220)] border-[oklch(0.75_0.05_220)]',
  [OrderStatus.PROCESSING]: 'bg-[oklch(0.85_0.05_240)] text-[oklch(0.45_0.08_240)] border-[oklch(0.75_0.05_240)]',
  [OrderStatus.SHIPPED]: 'bg-[oklch(0.85_0.05_200)] text-[oklch(0.45_0.08_200)] border-[oklch(0.75_0.05_200)]',
  [OrderStatus.DELIVERED]: 'bg-[oklch(0.85_0.05_140)] text-[oklch(0.35_0.08_140)] border-[oklch(0.75_0.05_140)]',
  [OrderStatus.CANCELLED]: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)] border-[oklch(0.75_0.05_25)]',
  [OrderStatus.RETURN_REQUESTED]: 'bg-[oklch(0.82_0.05_45)] text-[oklch(0.42_0.08_45)] border-[oklch(0.72_0.05_45)]',
  [OrderStatus.RETURNED]: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)] border-[oklch(0.75_0.05_25)]',
  [OrderStatus.REFUNDED]: 'bg-[oklch(0.85_0.05_180)] text-[oklch(0.45_0.08_180)] border-[oklch(0.75_0.05_180)]',
};

/**
 * Status styling configurations for payment statuses
 * Uses OKLCH color space for consistent theming
 */
export const paymentStatusStyles: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'bg-[oklch(0.82_0.05_60)] text-[oklch(0.42_0.08_60)] border-[oklch(0.72_0.05_60)]',
  [PaymentStatus.PROCESSING]: 'bg-[oklch(0.85_0.05_240)] text-[oklch(0.45_0.08_240)] border-[oklch(0.75_0.05_240)]',
  [PaymentStatus.PAID]: 'bg-[oklch(0.85_0.05_140)] text-[oklch(0.35_0.08_140)] border-[oklch(0.75_0.05_140)]',
  [PaymentStatus.FAILED]: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)] border-[oklch(0.75_0.05_25)]',
  [PaymentStatus.REFUND_REQUESTED]: 'bg-[oklch(0.85_0.05_45)] text-[oklch(0.42_0.08_45)] border-[oklch(0.75_0.05_45)]',
  [PaymentStatus.REFUNDED]: 'bg-[oklch(0.85_0.05_180)] text-[oklch(0.45_0.08_180)] border-[oklch(0.75_0.05_180)]',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'bg-[oklch(0.85_0.05_200)] text-[oklch(0.45_0.08_200)] border-[oklch(0.75_0.05_200)]',
};

/**
 * Human-readable labels for order statuses
 */
export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Payment pending',
  [OrderStatus.CONFIRMED]: 'Order confirmed',
  [OrderStatus.PROCESSING]: 'Order is being processed',
  [OrderStatus.SHIPPED]: 'Order has been shipped',
  [OrderStatus.DELIVERED]: 'Order delivered successfully',
  [OrderStatus.CANCELLED]: 'Order cancelled',
  [OrderStatus.RETURN_REQUESTED]: 'Return requested by customer',
  [OrderStatus.RETURNED]: 'Order returned',
  [OrderStatus.REFUNDED]: 'Payment refunded',
};

/**
 * Human-readable labels for payment statuses
 */
export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Payment pending',
  [PaymentStatus.PROCESSING]: 'Payment is being processed',
  [PaymentStatus.PAID]: 'Payment successful',
  [PaymentStatus.FAILED]: 'Payment failed',
  [PaymentStatus.REFUND_REQUESTED]: 'Refund requested',
  [PaymentStatus.REFUNDED]: 'Payment refunded',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'Partially refunded',
};

/**
 * Predefined cancellation reasons
 */
export const CANCELLATION_REASONS = [
  { value: "ordered_by_mistake", label: "Ordered by mistake" },
  { value: "found_cheaper_elsewhere", label: "Found cheaper elsewhere" },
  { value: "delivery_time_too_long", label: "Delivery time too long" },
  { value: "changed_my_mind", label: "Changed my mind" },
  { value: "incorrect_address", label: "Incorrect address" },
  { value: "other", label: "Other" },
] as const;

/**
 * Cancellation time limit in days (from order confirmation)
 */
export const CANCELLATION_TIME_LIMIT_DAYS = 3;

/**
 * Check if order can be cancelled based on time limit
 * Note: With payment-first flow, orders start in CONFIRMED status (not PENDING)
 * @param confirmedAt - The date when order was confirmed (or created if not confirmed)
 * @returns Object with canCancel boolean and remaining time info
 */
export function canCancelOrder(order: { status: string; createdAt: string; paymentStatus: string }): {
  canCancel: boolean;
  daysRemaining: number | null;
  message: string;
} {
  // Only specific statuses can be cancelled
  // With payment-first flow, PENDING status is rare (orders start as CONFIRMED)
  const cancellableStatuses = ["CONFIRMED", "PROCESSING"];
  if (!cancellableStatuses.includes(order.status)) {
    return { canCancel: false, daysRemaining: null, message: `Cannot cancel order with status: ${order.status}` };
  }

  // Calculate time since order creation
  const orderDate = new Date(order.createdAt);
  const now = new Date();
  const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
  const timeLimitHours = CANCELLATION_TIME_LIMIT_DAYS * 24;

  if (hoursSinceOrder > timeLimitHours) {
    return {
      canCancel: false,
      daysRemaining: null,
      message: `Cancellation period has expired. Orders can only be cancelled within ${CANCELLATION_TIME_LIMIT_DAYS} days.`
    };
  }

  const remainingHours = Math.max(0, timeLimitHours - hoursSinceOrder);
  const daysRemaining = Math.floor(remainingHours / 24);
  return { canCancel: true, daysRemaining, message: '' };
}
