"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/lib/actions/order-actions";
import { CANCELLATION_REASONS, canCancelOrder } from "@/lib/utils/order-utils";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { XCircle, Loader2, AlertCircle } from "lucide-react";
import { Order } from "@/types/orders";

interface CancelOrderDialogProps {
    orderNumber: string;
    order?: Order; // Optional order object for time limit check
}

export default function CancelOrderDialog({ orderNumber, order }: CancelOrderDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if order can still be cancelled
    const { canCancel, daysRemaining, message } = order
        ? canCancelOrder(order)
        : { canCancel: true, daysRemaining: 3, message: "" };

    const isOtherSelected = selectedReason === "other";
    const selectedReasonLabel = CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
    const finalReason = isOtherSelected ? customReason.trim() : selectedReasonLabel;

    const handleCancel = async () => {
        if (!finalReason) {
            toast.error("Please select or provide a reason for cancellation");
            return;
        }

        if (isOtherSelected && customReason.trim().length < 10) {
            toast.error("Please provide a detailed reason (minimum 10 characters)");
            return;
        }

        setIsSubmitting(true);

        try {
            await cancelOrder(orderNumber, finalReason);
            toast.success("Order cancelled successfully");
            setOpen(false);
            setSelectedReason("");
            setCustomReason("");
            router.refresh();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to cancel order";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen && !canCancel) {
            toast.error(message || "This order can no longer be cancelled");
            return;
        }
        setOpen(newOpen);
    };

    const isSubmitDisabled =
        isSubmitting ||
        !selectedReason ||
        (isOtherSelected && customReason.trim().length < 10);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={!canCancel}
                    title={!canCancel ? message : undefined}
                >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. If payment was completed, a refund will be requested.
                    </DialogDescription>
                </DialogHeader>

                {/* Time Warning */}
                {daysRemaining !== null && daysRemaining <= 1 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            {daysRemaining === 0
                                ? "Last day to cancel this order!"
                                : `Only ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left to cancel`}
                        </p>
                    </div>
                )}

                <div className="space-y-4 py-4">
                    {/* Predefined Reasons Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Cancellation Reason *</Label>
                        <Select
                            value={selectedReason}
                            onValueChange={setSelectedReason}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="reason">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {CANCELLATION_REASONS.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Reason Input (shown when "Other" is selected) */}
                    {isOtherSelected && (
                        <div className="space-y-2">
                            <Label htmlFor="customReason">Please specify *</Label>
                            <Textarea
                                id="customReason"
                                placeholder="Please provide your reason for cancellation..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={3}
                                disabled={isSubmitting}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 10 characters required ({customReason.length}/10)
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            "Cancel Order"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
