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
import { Loader2, AlertCircle } from "lucide-react";
import { Order } from "@/types/orders";
import CustomButton from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";

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
                <div className="inline-block cursor-pointer">
                    <CustomButton
                        circleSize={30}
                        circleColor="#ef4444"
                        textColor="#ef4444"
                        textHoverColor="#ffffff"
                        disabled={!canCancel}
                        className={cn("!px-4 !py-1 text-[10px] uppercase tracking-widest", !canCancel && "opacity-50 grayscale")}
                    >
                        Cancel Order
                    </CustomButton>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-8 border-none shadow-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="h3 !text-2xl mb-2">Cancel Order</DialogTitle>
                    <DialogDescription className="p-sm text-muted-foreground">
                        This action cannot be undone. If payment was completed, a refund will be requested automatically.
                    </DialogDescription>
                </DialogHeader>

                {/* Time Warning */}
                {daysRemaining !== null && daysRemaining <= 1 && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-4">
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                        <p className="p-sm text-orange-800 font-medium leading-tight">
                            {daysRemaining === 0
                                ? "Last day to cancel this order!"
                                : `Only ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left to cancel.`}
                        </p>
                    </div>
                )}

                <div className="space-y-6 py-4">
                    {/* Predefined Reasons Dropdown */}
                    <div className="space-y-3">
                        <Label htmlFor="reason" className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Cancellation Reason *</Label>
                        <Select
                            value={selectedReason}
                            onValueChange={setSelectedReason}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="reason" className="h-12 rounded-2xl border-muted-foreground/10 focus:ring-accent/20">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                {CANCELLATION_REASONS.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value} className="rounded-xl my-1 focus:bg-muted">
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Reason Input (shown when "Other" is selected) */}
                    {isOtherSelected && (
                        <div className="space-y-3">
                            <Label htmlFor="customReason" className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Please specify *</Label>
                            <Textarea
                                id="customReason"
                                placeholder="Tell us why you're cancelling..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={4}
                                disabled={isSubmitting}
                                className="resize-none rounded-2xl border-muted-foreground/10 focus:ring-accent/20 p-4"
                            />
                            <p className={cn("p-xs text-right font-medium", customReason.length < 10 ? "text-destructive" : "text-accent")}>
                                {customReason.length < 10
                                    ? `Minimum 10 characters required (${customReason.length}/10)`
                                    : "Looks good!"}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                        className="rounded-full px-8 h-12 flex-1 font-bold border-muted-foreground/10"
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isSubmitDisabled}
                        className="rounded-full px-8 h-12 flex-1 font-bold shadow-lg shadow-destructive/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Confirm Cancellation"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

