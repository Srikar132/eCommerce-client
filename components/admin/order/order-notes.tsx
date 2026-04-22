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
        default: "bg-muted/10 border border-border/40",
        error: "bg-destructive/5 border border-destructive/20",
        warning: "bg-amber-500/5 border border-amber-500/20",
    };

    const titleStyles = {
        default: "text-muted-foreground",
        error: "text-destructive font-bold",
        warning: "text-amber-700 font-bold",
    };

    const contentStyles = {
        default: "text-foreground font-medium",
        error: "text-destructive/90 font-medium",
        warning: "text-amber-800 font-medium",
    };

    return (
        <div className={`p-4 rounded-2xl ${variantStyles[variant]} transition-colors`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 ${titleStyles[variant]}`}>
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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shadow-sm border border-amber-500/10">
                        <FileText className="h-5 w-5" />
                    </div>
                    Notes & Remarks
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {notes && (
                    <NoteBlock
                        icon={<MessageSquare className="h-3.5 w-3.5" />}
                        title="Customer Remarks"
                        content={notes}
                    />
                )}

                {cancellationReason && (
                    <NoteBlock
                        icon={<XCircle className="h-3.5 w-3.5" />}
                        title="Cancellation Details"
                        content={cancellationReason}
                        variant="error"
                    />
                )}

                {returnReason && (
                    <NoteBlock
                        icon={<RefreshCcw className="h-3.5 w-3.5" />}
                        title="Return Information"
                        content={returnReason}
                        variant="warning"
                    />
                )}
            </CardContent>
        </Card>
    );
}
