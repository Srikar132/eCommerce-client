"use client";

import { FileText, XCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// TYPES
// ============================================================================

interface OrderNotesProps {
    notes?: string | null;
    cancellationReason?: string | null;
    returnReason?: string | null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface NoteBlockProps {
    icon?: React.ReactNode;
    title: string;
    content: string;
    variant?: "default" | "error" | "warning";
}

function NoteBlock({ icon, title, content, variant = "default" }: NoteBlockProps) {
    const variantStyles = {
        default: "bg-muted/30",
        error: "bg-red-500/20 border border-red-500/30",
        warning: "bg-orange-500/20 border border-orange-500/30",
    };

    const titleStyles = {
        default: "text-muted-foreground",
        error: "text-red-400",
        warning: "text-orange-400",
    };

    const contentStyles = {
        default: "",
        error: "text-red-300",
        warning: "text-orange-300",
    };

    return (
        <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>
            <p className={`text-xs font-medium mb-2 flex items-center gap-1 ${titleStyles[variant]}`}>
                {icon}
                {title}
            </p>
            <p className={`text-sm leading-relaxed ${contentStyles[variant]}`}>{content}</p>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderNotes({ notes, cancellationReason, returnReason }: OrderNotesProps) {
    // Don't render if no content
    if (!notes && !cancellationReason && !returnReason) {
        return null;
    }

    return (
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                        <FileText className="h-4 w-4 text-white" />
                    </div>
                    Notes & Remarks
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {notes && (
                    <NoteBlock title="Order Notes" content={notes} />
                )}

                {cancellationReason && (
                    <NoteBlock
                        icon={<XCircle className="h-3 w-3" />}
                        title="Cancellation Reason"
                        content={cancellationReason}
                        variant="error"
                    />
                )}

                {returnReason && (
                    <NoteBlock
                        icon={<RefreshCcw className="h-3 w-3" />}
                        title="Return Reason"
                        content={returnReason}
                        variant="warning"
                    />
                )}
            </CardContent>
        </Card>
    );
}
