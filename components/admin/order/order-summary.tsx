"use client";

import { IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface OrderSummaryProps {
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    totalAmount: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SummaryRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
    highlight?: boolean;
}

function SummaryRow({ label, value, className, highlight }: SummaryRowProps) {
    return (
        <div
            className={`flex justify-between items-center p-2.5 rounded-xl transition-all ${highlight ? "" : "hover:bg-muted/40"
                } ${className || ""}`}
        >
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="font-bold text-foreground/90">{value}</span>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderSummary({
    subtotal,
    taxAmount,
    shippingCost,
    discountAmount,
    totalAmount,
}: OrderSummaryProps) {
    return (
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-sm border border-emerald-500/10">
                        <IndianRupee className="h-5 w-5" />
                    </div>
                    Order Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Estimated Tax (GST)" value={formatCurrency(taxAmount)} />
                <SummaryRow
                    label="Shipping & Handling"
                    value={
                        shippingCost === 0 ? (
                            <span className="text-emerald-600 font-bold">Free</span>
                        ) : (
                            formatCurrency(shippingCost)
                        )
                    }
                />

                {discountAmount > 0 && (
                    <SummaryRow
                        label="Applied Discount"
                        value={
                            <span className="text-emerald-600">
                                -{formatCurrency(discountAmount)}
                            </span>
                        }
                        className="bg-emerald-500/5 text-emerald-700"
                    />
                )}

                <Separator className="my-4 opacity-50" />

                <div className="flex justify-between items-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 shadow-inner">
                    <span className="font-bold text-emerald-900">Final Total</span>
                    <span className="font-black text-2xl text-emerald-600">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
