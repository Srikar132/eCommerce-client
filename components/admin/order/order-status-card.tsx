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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm border border-primary/10">
                            <Truck className="h-5 w-5" />
                        </div>
                        Fulfillment Status
                    </CardTitle>
                    <OrderStatusUpdate
                        orderId={orderId}
                        currentStatus={currentStatus}
                        onStatusUpdate={onStatusUpdate}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <OrderStatusProgress currentStatus={currentStatus} />
            </CardContent>
        </Card>
    );
}
