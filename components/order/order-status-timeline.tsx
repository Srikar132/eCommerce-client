"use client";

import { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Package, Truck, Home, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
    order: Order;
}

export default function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
    const getStatusSteps = () => {
        // Handle cancelled orders
        if (order.status === "CANCELLED") {
            return [
                { label: "Order Placed", status: "completed", date: order.createdAt },
                { label: "Cancelled", status: "cancelled", date: order.cancelledAt, icon: XCircle },
            ];
        }

        // Handle return requested/returned orders
        if (order.status === "RETURN_REQUESTED" || order.status === "RETURNED") {
            return [
                { label: "Order Placed", status: "completed", date: order.createdAt },
                { label: "Confirmed", status: "completed", date: null },
                { label: "Shipped", status: "completed", date: null },
                { label: "Delivered", status: "completed", date: order.deliveredAt },
                { 
                    label: order.status === "RETURNED" ? "Returned" : "Return Requested", 
                    status: "return", 
                    date: order.returnRequestedAt,
                    icon: RotateCcw 
                },
            ];
        }

        // Handle refunded orders
        if (order.status === "REFUNDED") {
            return [
                { label: "Order Placed", status: "completed", date: order.createdAt },
                { label: "Refunded", status: "refunded", date: null, icon: RotateCcw },
            ];
        }

        // Normal flow
        const steps = [
            { 
                label: "Order Placed", 
                status: order.status === "PENDING" ? "current" : "completed", 
                date: order.createdAt,
                icon: Package
            },
            { 
                label: "Confirmed", 
                status: order.status === "CONFIRMED" ? "current" : 
                       ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) ? "completed" : "pending",
                date: null,
                icon: CheckCircle2
            },
            { 
                label: "Processing", 
                status: order.status === "PROCESSING" ? "current" : 
                       ["SHIPPED", "DELIVERED"].includes(order.status) ? "completed" : "pending",
                date: null,
                icon: Package
            },
            { 
                label: "Shipped", 
                status: order.status === "SHIPPED" ? "current" : 
                       order.status === "DELIVERED" ? "completed" : "pending",
                date: null,
                icon: Truck
            },
            { 
                label: "Delivered", 
                status: order.status === "DELIVERED" ? "completed" : "pending",
                date: order.deliveredAt,
                icon: Home
            },
        ];

        return steps;
    };

    const steps = getStatusSteps();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {steps.map((step, index) => {
                        const Icon = step.icon || Circle;
                        const isLast = index === steps.length - 1;
                        const isCompleted = step.status === "completed";
                        const isCurrent = step.status === "current";
                        const isCancelled = step.status === "cancelled";
                        const isReturn = step.status === "return";
                        const isRefunded = step.status === "refunded";

                        return (
                            <div key={index} className="flex gap-4 pb-8 relative">
                                {/* Timeline Line */}
                                {!isLast && (
                                    <div
                                        className={cn(
                                            "absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2",
                                            isCompleted || isCurrent ? "bg-primary" : "bg-border"
                                        )}
                                    />
                                )}

                                {/* Icon */}
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-primary text-primary-foreground animate-pulse",
                                        isCancelled && "bg-destructive text-destructive-foreground",
                                        isReturn && "bg-orange-500 text-white",
                                        isRefunded && "bg-orange-500 text-white",
                                        !isCompleted && !isCurrent && !isCancelled && !isReturn && !isRefunded && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted || isCurrent ? (
                                        <Icon className="w-4 h-4" />
                                    ) : (
                                        <Circle className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-0.5">
                                    <p
                                        className={cn(
                                            "font-medium text-sm",
                                            (isCompleted || isCurrent) && "text-foreground",
                                            isCancelled && "text-destructive",
                                            isReturn && "text-orange-600",
                                            isRefunded && "text-orange-600",
                                            !isCompleted && !isCurrent && !isCancelled && !isReturn && !isRefunded && "text-muted-foreground"
                                        )}
                                    >
                                        {step.label}
                                    </p>
                                    {step.date && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(step.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
