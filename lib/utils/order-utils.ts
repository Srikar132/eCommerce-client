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
  [PaymentStatus.REFUNDED]: 'Payment refunded',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'Partially refunded',
};
