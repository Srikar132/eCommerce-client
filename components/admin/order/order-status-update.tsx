"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUpdateOrderStatus } from "@/lib/tanstack/queries/order.queries";
import { OrderStatus } from "@/types/orders";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    canTransitionToStatus,
    getOrderStatusLabel,
    isSpecialStatus,
} from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface OrderStatusUpdateProps {
    orderId: string;
    currentStatus: OrderStatus;
    onStatusUpdate?: (newStatus: OrderStatus) => void;
}

interface StatusOption {
    value: OrderStatus;
    label: string;
    disabled: boolean;
    reason?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ALL_STATUSES: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
];

// ============================================================================
// COMPONENT
// ============================================================================

export function OrderStatusUpdate({
    orderId,
    currentStatus,
    onStatusUpdate,
}: OrderStatusUpdateProps) {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
    const updateStatusMutation = useUpdateOrderStatus();

    const hasChanges = selectedStatus !== currentStatus;
    const isUpdating = updateStatusMutation.isPending;

    // Generate status options with disabled state based on transition rules
    const statusOptions = useMemo<StatusOption[]>(() => {
        return ALL_STATUSES.map((status) => {
            const canTransition = canTransitionToStatus(currentStatus, status);
            const isCurrent = status === currentStatus;

            let reason: string | undefined;
            if (!canTransition && !isCurrent) {
                if (isSpecialStatus(currentStatus)) {
                    reason = "Cannot change from terminal status";
                } else {
                    reason = "Cannot move backwards";
                }
            }

            return {
                value: status,
                label: getOrderStatusLabel(status),
                disabled: !canTransition && !isCurrent,
                reason,
            };
        });
    }, [currentStatus]);

    const handleStatusChange = (value: string) => {
        const newStatus = value as OrderStatus;
        if (canTransitionToStatus(currentStatus, newStatus)) {
            setSelectedStatus(newStatus);
        }
    };

    const handleUpdate = async () => {
        if (!hasChanges) return;

        // Double-check transition is valid before submitting
        if (!canTransitionToStatus(currentStatus, selectedStatus)) {
            toast.error("Invalid status transition");
            setSelectedStatus(currentStatus);
            return;
        }

        try {
            await updateStatusMutation.mutateAsync({
                orderId,
                newStatus: selectedStatus,
            });
            toast.success("Order status updated successfully");
            onStatusUpdate?.(selectedStatus);
            router.refresh();
        } catch {
            toast.error("Failed to update order status");
            setSelectedStatus(currentStatus);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
            >
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className={cn(
                                option.disabled && "opacity-50 cursor-not-allowed",
                                option.value === currentStatus && "font-medium"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {option.disabled && option.value !== currentStatus && (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                )}
                                {option.label}
                                {option.value === currentStatus && (
                                    <span className="text-xs text-muted-foreground">(current)</span>
                                )}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                onClick={handleUpdate}
                disabled={!hasChanges || isUpdating}
                size="sm"
                className="min-w-28"
            >
                {isUpdating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Update
                    </>
                )}
            </Button>
        </div>
    );
}
