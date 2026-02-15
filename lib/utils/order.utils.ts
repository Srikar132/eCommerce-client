import { OrderStatus, PaymentStatus } from "@/types/orders";
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    type LucideIcon,
} from "lucide-react";

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export function formatOrderDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// ============================================================================
// STATUS FLOW UTILITIES
// ============================================================================

/**
 * Main order flow progression (sequential)
 */
export const ORDER_STATUS_FLOW = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
] as const;

/**
 * Special statuses that break the normal flow
 * Note: RETURN_REQUESTED and RETURNED are kept in enum for backward compatibility
 * but are not selectable since there is no return policy
 */
export const SPECIAL_ORDER_STATUSES = [
    "CANCELLED",
    "REFUNDED",
] as const;

/**
 * Get the index/priority of a status in the main flow
 * Returns -1 for special statuses
 */
export function getStatusFlowIndex(status: OrderStatus): number {
    return ORDER_STATUS_FLOW.indexOf(status as typeof ORDER_STATUS_FLOW[number]);
}

/**
 * Check if a status is a special (non-sequential) status
 */
export function isSpecialStatus(status: OrderStatus): boolean {
    return SPECIAL_ORDER_STATUSES.includes(status as typeof SPECIAL_ORDER_STATUSES[number]);
}

/**
 * Determines if transitioning from currentStatus to targetStatus is allowed
 * 
 * Rules:
 * - Can always move forward in the main flow
 * - Cannot move backward in the main flow (DELIVERED → SHIPPED not allowed)
 * - Can transition to special statuses from most states
 * - Once DELIVERED, cannot change (except special statuses)
 * - CANCELLED/REFUNDED are terminal states
 */
export function canTransitionToStatus(
    currentStatus: OrderStatus,
    targetStatus: OrderStatus
): boolean {
    // Same status - no change
    if (currentStatus === targetStatus) return true;

    // Terminal states - cannot transition out
    if (
        currentStatus === OrderStatus.CANCELLED ||
        currentStatus === OrderStatus.REFUNDED
    ) {
        return false;
    }

    // If current status is in main flow
    const currentIndex = getStatusFlowIndex(currentStatus);
    const targetIndex = getStatusFlowIndex(targetStatus);

    // Both in main flow - can only move forward
    if (currentIndex !== -1 && targetIndex !== -1) {
        return targetIndex > currentIndex;
    }

    // Target is a special status - check specific rules
    if (isSpecialStatus(targetStatus)) {
        // DELIVERED is a terminal state - can only be refunded
        if (currentStatus === OrderStatus.DELIVERED) {
            return targetStatus === OrderStatus.REFUNDED;
        }

        // Can cancel before delivery
        if (targetStatus === OrderStatus.CANCELLED) {
            return currentIndex < ORDER_STATUS_FLOW.indexOf("DELIVERED");
        }

        // Can refund at any stage
        if (targetStatus === OrderStatus.REFUNDED) {
            return true;
        }

        return true;
    }

    // Cannot go from special status back to main flow
    if (isSpecialStatus(currentStatus)) {
        return false;
    }

    return false;
}

// ============================================================================
// PAYMENT STATUS CONFIGURATION
// ============================================================================

interface PaymentStatusConfig {
    icon: LucideIcon;
    bg: string;
    text: string;
    labelColor: string;
}

export function getPaymentStatusConfig(status: PaymentStatus): PaymentStatusConfig {
    const configs: Record<PaymentStatus, PaymentStatusConfig> = {
        PENDING: {
            icon: Clock,
            bg: "bg-amber-500",
            text: "text-white",
            labelColor: "text-amber-400",
        },
        PROCESSING: {
            icon: Clock,
            bg: "bg-blue-500",
            text: "text-white",
            labelColor: "text-blue-400",
        },
        PAID: {
            icon: CheckCircle,
            bg: "bg-emerald-500",
            text: "text-white",
            labelColor: "text-emerald-400",
        },
        FAILED: {
            icon: XCircle,
            bg: "bg-red-500",
            text: "text-white",
            labelColor: "text-red-400",
        },
        REFUND_REQUESTED: {
            icon: AlertCircle,
            bg: "bg-orange-500",
            text: "text-white",
            labelColor: "text-orange-400",
        },
        REFUNDED: {
            icon: RefreshCw,
            bg: "bg-purple-500",
            text: "text-white",
            labelColor: "text-purple-400",
        },
        PARTIALLY_REFUNDED: {
            icon: RefreshCw,
            bg: "bg-violet-500",
            text: "text-white",
            labelColor: "text-violet-400",
        },
    };

    return configs[status];
}

export function getPaymentBadgeStyle(status: PaymentStatus): string {
    const styles: Record<PaymentStatus, string> = {
        PENDING: "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
        PROCESSING: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
        PAID: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
        FAILED: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
        REFUND_REQUESTED: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
        REFUNDED: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
        PARTIALLY_REFUNDED: "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30",
    };

    return styles[status];
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
        PENDING: "Pending",
        PROCESSING: "Processing",
        PAID: "Paid",
        FAILED: "Failed",
        REFUND_REQUESTED: "Refund Requested",
        REFUNDED: "Refunded",
        PARTIALLY_REFUNDED: "Partially Refunded",
    };

    return labels[status];
}

// ============================================================================
// ORDER STATUS CONFIGURATION
// ============================================================================

export function getOrderStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
        PENDING: "Pending",
        CONFIRMED: "Confirmed",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
        RETURN_REQUESTED: "Return Requested",
        RETURNED: "Returned",
        REFUNDED: "Refunded",
    };

    return labels[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
        PENDING: "bg-amber-500/20 text-amber-400",
        CONFIRMED: "bg-blue-500/20 text-blue-400",
        PROCESSING: "bg-indigo-500/20 text-indigo-400",
        SHIPPED: "bg-cyan-500/20 text-cyan-400",
        DELIVERED: "bg-emerald-500/20 text-emerald-400",
        CANCELLED: "bg-red-500/20 text-red-400",
        RETURN_REQUESTED: "bg-orange-500/20 text-orange-400",
        RETURNED: "bg-orange-500/20 text-orange-400",
        REFUNDED: "bg-purple-500/20 text-purple-400",
    };

    return colors[status];
}
