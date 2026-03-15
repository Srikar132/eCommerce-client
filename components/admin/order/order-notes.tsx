"use client";

import { FileText, MessageSquare, XCircle, RefreshCcw } from "lucide-react";
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
    icon: React.ReactNode;
    title: string;
    content: string;
    variant?: "default" | "error" | "warning";
}

function NoteBlock({ icon, title, content, variant = "default" }: NoteBlockProps) {
    const variantStyles = {
        default: "bg-muted/30 border border-border",
        error: "bg-destructive/10 border border-destructive/30",
        warning: "bg-orange-500/10 border border-orange-500/30",
    };

    const titleStyles = {
        default: "text-muted-foreground",
        error: "text-destructive",
        warning: "text-orange-600 dark:text-orange-400",
    };

    const contentStyles = {
        default: "text-foreground",
        error: "text-destructive/90",
        warning: "text-orange-700 dark:text-orange-300",
    };

    return (
        <div className={`p-3.5 rounded-xl ${variantStyles[variant]}`}>
            <p className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${titleStyles[variant]}`}>
                {icon}
                {title}
            </p>
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${contentStyles[variant]}`}>{content}</p>
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
                    <NoteBlock
                        icon={<MessageSquare className="h-3.5 w-3.5" />}
                        title="Customer Notes"
                        content={notes}
                    />
                )}

                {cancellationReason && (
                    <NoteBlock
                        icon={<XCircle className="h-3.5 w-3.5" />}
                        title="Cancellation Reason"
                        content={cancellationReason}
                        variant="error"
                    />
                )}

                {returnReason && (
                    <NoteBlock
                        icon={<RefreshCcw className="h-3.5 w-3.5" />}
                        title="Return Reason"
                        content={returnReason}
                        variant="warning"
                    />
                )}
            </CardContent>
        </Card>
    );
}
