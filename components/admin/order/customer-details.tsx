"use client";

import Link from "next/link";
import { User, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// TYPES
// ============================================================================

interface CustomerDetailsProps {
    userName?: string | null;
    userEmail?: string | null;
    userPhone?: string | null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface DetailRowProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

function DetailRow({ icon, children }: DetailRowProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            {icon}
            {children}
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CustomerDetails({ userName, userEmail, userPhone }: CustomerDetailsProps) {
    // Don't render if no customer info
    if (!userName && !userEmail && !userPhone) {
        return null;
    }

    return (
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    Customer Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {userName && (
                    <DetailRow icon={<User className="h-4 w-4 text-muted-foreground" />}>
                        <span className="font-medium">{userName}</span>
                    </DetailRow>
                )}

                {userEmail && (
                    <DetailRow icon={<Mail className="h-4 w-4 text-muted-foreground" />}>
                        <Link
                            href={`mailto:${userEmail}`}
                            className="text-primary hover:underline truncate flex-1"
                        >
                            {userEmail}
                        </Link>
                    </DetailRow>
                )}

                {userPhone && (
                    <DetailRow icon={<Phone className="h-4 w-4 text-muted-foreground" />}>
                        <Link
                            href={`tel:${userPhone}`}
                            className="text-primary hover:underline"
                        >
                            {userPhone}
                        </Link>
                    </DetailRow>
                )}
            </CardContent>
        </Card>
    );
}
