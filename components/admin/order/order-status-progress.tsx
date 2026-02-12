"use client";

import { cn } from "@/lib/utils";
import { Check, Clock, Package, Truck, Home, X, RotateCcw, RefreshCw } from "lucide-react";
import { OrderStatus } from "@/types/orders";

interface OrderStatusProgressProps {
    currentStatus: OrderStatus;
    className?: string;
}

// Define the order flow steps
const ORDER_STEPS = [
    { status: "PENDING", label: "Pending", icon: Clock },
    { status: "CONFIRMED", label: "Confirmed", icon: Check },
    { status: "PROCESSING", label: "Processing", icon: Package },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "DELIVERED", label: "Delivered", icon: Home },
] as const;

// Special statuses that break the normal flow
const SPECIAL_STATUSES = {
    CANCELLED: { label: "Cancelled", icon: X, color: "text-red-500 bg-red-50 border-red-200" },
    RETURN_REQUESTED: { label: "Return Requested", icon: RotateCcw, color: "text-orange-500 bg-orange-50 border-orange-200" },
    RETURNED: { label: "Returned", icon: RotateCcw, color: "text-orange-500 bg-orange-50 border-orange-200" },
    REFUNDED: { label: "Refunded", icon: RefreshCw, color: "text-purple-500 bg-purple-50 border-purple-200" },
} as const;

function getStepIndex(status: OrderStatus): number {
    return ORDER_STEPS.findIndex(step => step.status === status);
}

function isSpecialStatus(status: OrderStatus): boolean {
    return status in SPECIAL_STATUSES;
}

export function OrderStatusProgress({ currentStatus, className }: OrderStatusProgressProps) {
    // Handle special statuses (cancelled, returned, refunded)
    if (isSpecialStatus(currentStatus)) {
        const specialStatus = SPECIAL_STATUSES[currentStatus as keyof typeof SPECIAL_STATUSES];
        const Icon = specialStatus.icon;

        return (
            <div className={cn("w-full", className)}>
                <div className={cn(
                    "flex items-center justify-center gap-3 py-4 px-6 rounded-lg border",
                    specialStatus.color
                )}>
                    <Icon className="h-6 w-6" />
                    <span className="font-semibold text-lg">{specialStatus.label}</span>
                </div>
            </div>
        );
    }

    const currentIndex = getStepIndex(currentStatus);

    return (
        <div className={cn("w-full", className)}>
            {/* Progress Container */}
            <div className="relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />

                {/* Progress Line Active */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                    style={{
                        width: currentIndex === -1 ? '0%' : `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%`
                    }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {ORDER_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isPending = index > currentIndex;

                        return (
                            <div
                                key={step.status}
                                className="flex flex-col items-center"
                            >
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                                        isCompleted && "bg-primary border-primary text-primary-foreground",
                                        isCurrent && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                                        isPending && "bg-background border-muted-foreground/30 text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>

                                {/* Step Label */}
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium transition-colors",
                                        isCompleted && "text-primary",
                                        isCurrent && "text-primary font-semibold",
                                        isPending && "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
