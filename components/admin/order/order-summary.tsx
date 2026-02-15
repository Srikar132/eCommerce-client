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
            className={`flex justify-between p-2 rounded-lg transition-colors ${highlight ? "" : "hover:bg-muted/30"
                } ${className || ""}`}
        >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
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
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                        <IndianRupee className="h-4 w-4 text-white" />
                    </div>
                    Order Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Tax (GST)" value={formatCurrency(taxAmount)} />
                <SummaryRow
                    label="Shipping"
                    value={
                        shippingCost === 0 ? (
                            <span className="text-emerald-400">Free</span>
                        ) : (
                            formatCurrency(shippingCost)
                        )
                    }
                />

                {discountAmount > 0 && (
                    <SummaryRow
                        label="Discount"
                        value={
                            <span className="text-emerald-400">
                                -{formatCurrency(discountAmount)}
                            </span>
                        }
                        className="bg-emerald-500/20"
                    />
                )}

                <Separator className="my-2" />

                <div className="flex justify-between p-3 rounded-xl bg-emerald-500/20">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg text-emerald-400">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
