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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-base font-bold flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm border border-primary/5 ${paymentConfig.bg}`}>
                        <PaymentIcon className={`h-5 w-5 ${paymentConfig.text}`} />
                    </div>
                    Financial Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
                {/* Payment Status */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                    <Badge className={`${getPaymentBadgeStyle(paymentStatus)} border-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest`}>
                        {getPaymentStatusLabel(paymentStatus)}
                    </Badge>
                </div>

                {/* Payment Method */}
                {paymentMethod && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-colors">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                            <CreditCard className="h-3.5 w-3.5" />
                            Method
                        </span>
                        <span className="text-sm font-bold capitalize text-foreground/90">{paymentMethod}</span>
                    </div>
                )}

                {/* Razorpay Payment ID */}
                {razorpayPaymentId && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-colors">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                            <Hash className="h-3.5 w-3.5" />
                            Ref ID
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1.5 px-3 text-[11px] font-bold font-mono rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 transition-all"
                            onClick={() => copyToClipboard(razorpayPaymentId, "Payment ID")}
                        >
                            {razorpayPaymentId.slice(0, 12)}
                            <Copy className="ml-1.5 h-3 w-3" />
                        </Button>
                    </div>
                )}

                {/* Refund Button for REFUND_REQUESTED orders */}
                {paymentStatus === "REFUND_REQUESTED" && (
                    <div className="pt-3">
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
