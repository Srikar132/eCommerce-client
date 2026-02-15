"use client";

import { CreditCard, Hash, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PaymentStatus } from "@/types/orders";
import { RefundOrderDialog } from "./refund-order-dialog";
import {
    getPaymentStatusConfig,
    getPaymentStatusLabel,
    getPaymentBadgeStyle,
} from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface PaymentDetailsProps {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod?: "card" | "upi" | "netbanking" | null;
    razorpayPaymentId?: string | null;
}

// ============================================================================
// UTILITIES
// ============================================================================

function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PaymentDetails({
    orderId,
    orderNumber,
    totalAmount,
    paymentStatus,
    paymentMethod,
    razorpayPaymentId,
}: PaymentDetailsProps) {
    const paymentConfig = getPaymentStatusConfig(paymentStatus);
    const PaymentIcon = paymentConfig.icon;

    return (
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${paymentConfig.bg}`}>
                        <PaymentIcon className={`h-4 w-4 ${paymentConfig.text}`} />
                    </div>
                    Payment Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {/* Payment Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={`${getPaymentBadgeStyle(paymentStatus)} border-0`}>
                        {getPaymentStatusLabel(paymentStatus)}
                    </Badge>
                </div>

                {/* Payment Method */}
                {paymentMethod && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Method
                        </span>
                        <span className="font-medium capitalize">{paymentMethod}</span>
                    </div>
                )}

                {/* Razorpay Payment ID */}
                {razorpayPaymentId && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Payment ID
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 px-2 text-xs font-mono rounded-lg hover:bg-primary/10"
                            onClick={() => copyToClipboard(razorpayPaymentId, "Payment ID")}
                        >
                            {razorpayPaymentId.slice(0, 12)}...
                            <Copy className="ml-1 h-3 w-3" />
                        </Button>
                    </div>
                )}

                {/* Refund Button for REFUND_REQUESTED orders */}
                {paymentStatus === "REFUND_REQUESTED" && (
                    <div className="pt-3 border-t border-border">
                        <RefundOrderDialog
                            orderId={orderId}
                            orderNumber={orderNumber}
                            totalAmount={totalAmount}
                            paymentId={razorpayPaymentId}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
