"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { refundOrder } from "@/lib/actions/order-actions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, AlertTriangle } from "lucide-react";

interface RefundOrderDialogProps {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentId?: string | null;
}

export function RefundOrderDialog({
    orderId,
    orderNumber,
    totalAmount,
    paymentId
}: RefundOrderDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRefund = async () => {
        setIsProcessing(true);

        try {
            const result = await refundOrder(orderId);

            if (result.success) {
                toast.success("Refund processed successfully");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to process refund");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!paymentId) {
        return (
            <Button variant="outline" size="sm" disabled>
                <RefreshCw className="w-4 h-4 mr-2" />
                No Payment ID
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Process Refund
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Process Refund
                    </DialogTitle>
                    <DialogDescription>
                        You are about to refund this order. This action will initiate a refund via Razorpay.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order Number</span>
                            <span className="font-mono">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment ID</span>
                            <span className="font-mono text-xs">{paymentId.slice(0, 16)}...</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Refund Amount</span>
                            <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            The refund will be processed through Razorpay. It may take 5-7 business days for the amount to reflect in the customer&apos;s account.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRefund}
                        disabled={isProcessing}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Confirm Refund
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
