"use client";

import { useState } from "react";
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
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface OrderStatusUpdateProps {
    orderId: string;
    currentStatus: OrderStatus;
    onStatusUpdate?: (newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: "PENDING" as OrderStatus, label: "Pending" },
    { value: "CONFIRMED" as OrderStatus, label: "Confirmed" },
    { value: "PROCESSING" as OrderStatus, label: "Processing" },
    { value: "SHIPPED" as OrderStatus, label: "Shipped" },
    { value: "DELIVERED" as OrderStatus, label: "Delivered" },
    { value: "CANCELLED" as OrderStatus, label: "Cancelled" },
    { value: "RETURN_REQUESTED" as OrderStatus, label: "Return Requested" },
    { value: "RETURNED" as OrderStatus, label: "Returned" },
    { value: "REFUNDED" as OrderStatus, label: "Refunded" },
];

export function OrderStatusUpdate({ orderId, currentStatus, onStatusUpdate }: OrderStatusUpdateProps) {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
    const updateStatusMutation = useUpdateOrderStatus();

    const hasChanges = selectedStatus !== currentStatus;
    const isUpdating = updateStatusMutation.isPending;

    const handleUpdate = async () => {
        if (!hasChanges) return;

        try {
            await updateStatusMutation.mutateAsync({
                orderId,
                newStatus: selectedStatus,
            });
            toast.success("Order status updated successfully");
            onStatusUpdate?.(selectedStatus);
            router.refresh(); // Refresh to sync server state
        } catch (error) {
            toast.error("Failed to update order status");
            setSelectedStatus(currentStatus); // Reset on error
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                disabled={isUpdating}
            >
                <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                onClick={handleUpdate}
                disabled={!hasChanges || isUpdating}
                size="sm"
                className="min-w-24"
            >
                {isUpdating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Update
                    </>
                )}
            </Button>
        </div>
    );
}
