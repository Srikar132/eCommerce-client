"use client";

import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatOrderDate } from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface OrderTimelineProps {
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string | null;
    returnRequestedAt?: string | null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TimelineEventProps {
    label: string;
    date: string;
    dotColor: string;
    variant?: "default" | "error" | "warning";
}

function TimelineEvent({ label, date, dotColor, variant = "default" }: TimelineEventProps) {
    const variantStyles = {
        default: "bg-muted/10 border border-border/40",
        error: "bg-red-500/5 border border-red-500/20",
        warning: "bg-amber-500/5 border border-amber-500/20",
    };

    const textStyles = {
        default: "text-muted-foreground",
        error: "text-red-600 font-bold",
        warning: "text-amber-700 font-bold",
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-2xl ${variantStyles[variant]} transition-all hover:bg-muted/20`}>
            <span className={`text-sm flex items-center gap-3 font-medium ${textStyles[variant]}`}>
                <div className={`h-2.5 w-2.5 rounded-full shadow-sm animate-pulse ${dotColor}`} />
                {label}
            </span>
            <span className={`text-xs font-bold font-mono tracking-tight ${variant !== "default" ? textStyles[variant] : "text-foreground/80"}`}>
                {formatOrderDate(date)}
            </span>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderTimeline({
    createdAt,
    updatedAt,
    cancelledAt,
    returnRequestedAt,
}: OrderTimelineProps) {
    return (
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 shadow-sm border border-slate-500/10">
                        <Calendar className="h-5 w-5" />
                    </div>
                    Order Timeline
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
                <TimelineEvent
                    label="Order Placed"
                    date={createdAt}
                    dotColor="bg-emerald-500"
                />

                <TimelineEvent
                    label="Last Modified"
                    date={updatedAt}
                    dotColor="bg-blue-500"
                />

                {cancelledAt && (
                    <TimelineEvent
                        label="Order Cancelled"
                        date={cancelledAt}
                        dotColor="bg-red-500"
                        variant="error"
                    />
                )}

                {returnRequestedAt && (
                    <TimelineEvent
                        label="Return Initiated"
                        date={returnRequestedAt}
                        dotColor="bg-amber-500"
                        variant="warning"
                    />
                )}
            </CardContent>
        </Card>
    );
}
