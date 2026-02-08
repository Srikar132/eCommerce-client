"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/lib/actions/order-actions";
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
import { XCircle, Loader2 } from "lucide-react";

interface CancelOrderDialogProps {
    orderNumber: string;
}

export default function CancelOrderDialog({ orderNumber }: CancelOrderDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for cancellation");
            return;
        }

        setIsSubmitting(true);

        try {
            await cancelOrder(orderNumber, reason.trim());
            toast.success("Order cancelled successfully");
            setOpen(false);
            setReason("");
            router.refresh(); // Refresh the page to show updated order status
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for cancelling this order. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Cancellation Reason *</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., Changed my mind, Found a better price elsewhere..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            disabled={isSubmitting}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Minimum 10 characters required
                        </p>
                    </div>
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
                        disabled={isSubmitting || reason.trim().length < 10}
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
