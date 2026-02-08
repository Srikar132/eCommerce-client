"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestReturn } from "@/lib/actions/order-actions";
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
import { RotateCcw, Loader2 } from "lucide-react";

interface ReturnOrderDialogProps {
    orderNumber: string;
}

export default function ReturnOrderDialog({ orderNumber }: ReturnOrderDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReturn = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for return");
            return;
        }

        setIsSubmitting(true);

        try {
            await requestReturn(orderNumber, reason.trim());
            toast.success("Return request submitted successfully");
            setOpen(false);
            setReason("");
            router.refresh(); // Refresh the page to show updated order status
        } catch (error: any) {
            toast.error(error.message || "Failed to request return");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Request Return
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Request Return</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for returning this order. Returns are accepted within 7 days of delivery.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="return-reason">Return Reason *</Label>
                        <Textarea
                            id="return-reason"
                            placeholder="e.g., Product damaged, Wrong size, Quality issues..."
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

                    <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">
                            <strong>Return Policy:</strong> Products must be unused and in original packaging. 
                            Refund will be processed within 7-10 business days after we receive the returned item.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReturn}
                        disabled={isSubmitting || reason.trim().length < 10}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Request"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
