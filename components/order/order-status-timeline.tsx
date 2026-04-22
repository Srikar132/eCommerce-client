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
                { label: "Order Placed", status: "completed", date: order.createdAt, icon: Package },
                { label: "Cancelled", status: "cancelled", date: order.cancelledAt, icon: XCircle },
            ];
        }

        // Handle return requested/returned orders
        if (order.status === "RETURN_REQUESTED" || order.status === "RETURNED") {
            return [
                { label: "Order Placed", status: "completed", date: order.createdAt, icon: Package },
                { label: "Confirmed", status: "completed", date: null, icon: CheckCircle2 },
                { label: "Shipped", status: "completed", date: null, icon: Truck },
                { label: "Delivered", status: "completed", date: order.deliveredAt, icon: Home },
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
                { label: "Order Placed", status: "completed", date: order.createdAt, icon: Package },
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
        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-muted-foreground/5 p-content py-4">
                <CardTitle className="text-lg font-bold">Order Journey</CardTitle>
            </CardHeader>
            <CardContent className="p-content pt-8">
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
                            <div key={index} className="flex gap-6 pb-10 relative last:pb-0">
                                {/* Timeline Line */}
                                {!isLast && (
                                    <div
                                        className={cn(
                                            "absolute left-[19px] top-10 w-[2px] h-full -translate-x-1/2 transition-colors duration-500",
                                            isCompleted ? "bg-accent" : "bg-muted"
                                        )}
                                    />
                                )}

                                {/* Icon Container */}
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 transition-all duration-300 shadow-sm",
                                        isCompleted && "bg-accent text-white",
                                        isCurrent && "bg-accent text-white ring-4 ring-accent/20 animate-pulse",
                                        isCancelled && "bg-destructive text-white",
                                        isReturn && "bg-orange-500 text-white",
                                        isRefunded && "bg-orange-500 text-white",
                                        !isCompleted && !isCurrent && !isCancelled && !isReturn && !isRefunded && "bg-muted text-muted-foreground/40"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", !isCompleted && !isCurrent && !isCancelled && !isReturn && !isRefunded && "opacity-50")} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1.5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p
                                                className={cn(
                                                    "h4 !text-base mb-1",
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
                                                <p className="p-xs text-muted-foreground">
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
                                        {isCompleted && (
                                            <div className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight">
                                                Done
                                            </div>
                                        )}
                                        {isCurrent && (
                                            <div className="bg-accent text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight">
                                                In Progress
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

