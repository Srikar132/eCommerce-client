"use client";

/**
 * @deprecated This component is no longer used.
 * Return functionality has been removed. Only cancellation is allowed.
 * This file is kept for reference but is not imported anywhere.
 */

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ReturnOrderDialogProps {
    orderNumber: string;
}

export default function ReturnOrderDialog({ orderNumber }: ReturnOrderDialogProps) {
    // Return functionality has been removed
    // Only cancellation is allowed within the time limit
    return (
        <Button variant="outline" size="sm" disabled title="Returns are not available. Only cancellation is allowed.">
            <RotateCcw className="w-4 h-4 mr-2" />
            Returns Unavailable
        </Button>
    );
}
