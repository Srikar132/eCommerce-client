"use client";

import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus } from "@/types/orders";
import { OrderStatusUpdate } from "./order-status-update";
import { OrderStatusProgress } from "./order-status-progress";

// ============================================================================
// TYPES
// ============================================================================

interface OrderStatusCardProps {
    orderId: string;
    currentStatus: OrderStatus;
    onStatusUpdate: (newStatus: OrderStatus) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderStatusCard({
    orderId,
    currentStatus,
    onStatusUpdate,
}: OrderStatusCardProps) {
    return (
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Truck className="h-4 w-4 text-white" />
                        </div>
                        Order Status
                    </CardTitle>
                    <OrderStatusUpdate
                        orderId={orderId}
                        currentStatus={currentStatus}
                        onStatusUpdate={onStatusUpdate}
                    />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <OrderStatusProgress currentStatus={currentStatus} />
            </CardContent>
        </Card>
    );
}
