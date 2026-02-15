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
        default: "bg-muted/30",
        error: "bg-red-500/20 border border-red-500/30",
        warning: "bg-orange-500/20 border border-orange-500/30",
    };

    const textStyles = {
        default: "text-muted-foreground",
        error: "text-red-400",
        warning: "text-orange-400",
    };

    return (
        <div className={`flex justify-between p-3 rounded-xl ${variantStyles[variant]}`}>
            <span className={`text-sm flex items-center gap-2 ${textStyles[variant]}`}>
                <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                {label}
            </span>
            <span className={`text-sm font-medium ${variant !== "default" ? textStyles[variant] : ""}`}>
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
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500">
                        <Calendar className="h-4 w-4 text-white" />
                    </div>
                    Timeline
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                <TimelineEvent
                    label="Created"
                    date={createdAt}
                    dotColor="bg-emerald-500"
                />

                <TimelineEvent
                    label="Updated"
                    date={updatedAt}
                    dotColor="bg-blue-500"
                />

                {cancelledAt && (
                    <TimelineEvent
                        label="Cancelled"
                        date={cancelledAt}
                        dotColor="bg-red-500"
                        variant="error"
                    />
                )}

                {returnRequestedAt && (
                    <TimelineEvent
                        label="Return Requested"
                        date={returnRequestedAt}
                        dotColor="bg-orange-500"
                        variant="warning"
                    />
                )}
            </CardContent>
        </Card>
    );
}
