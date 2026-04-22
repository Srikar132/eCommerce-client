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
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-all hover:scale-[1.01]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 shadow-sm border border-violet-500/10">
                {icon}
            </div>
            <div className="flex-1 text-sm overflow-hidden">
                {children}
            </div>
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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-base font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 shadow-sm border border-violet-500/10">
                        <User className="h-5 w-5" />
                    </div>
                    Customer Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
                {userName && (
                    <DetailRow icon={<User className="h-4 w-4" />}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Name</p>
                        <span className="font-bold text-foreground/90">{userName}</span>
                    </DetailRow>
                )}

                {userEmail && (
                    <DetailRow icon={<Mail className="h-4 w-4" />}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Email Address</p>
                        <Link
                            href={`mailto:${userEmail}`}
                            className="text-primary font-bold hover:underline truncate block"
                        >
                            {userEmail}
                        </Link>
                    </DetailRow>
                )}

                {userPhone && (
                    <DetailRow icon={<Phone className="h-4 w-4" />}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Phone Number</p>
                        <Link
                            href={`tel:${userPhone}`}
                            className="text-primary font-bold hover:underline block"
                        >
                            {userPhone}
                        </Link>
                    </DetailRow>
                )}
            </CardContent>
        </Card>
    );
}
