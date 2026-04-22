'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, Shield, Calendar } from 'lucide-react';
import { useAccountDetails } from '@/lib/tanstack/queries/account.queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { EditAccountDialog } from '@/components/cards/edit-account-dialog';

export function AccountDetailsSection() {
    const { data: user, isLoading, error } = useAccountDetails();
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error || !user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-destructive">Failed to load account details.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-[2rem] border-none shadow-sm bg-background overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-muted/20">
                <CardTitle className="h4 !text-xl font-bold">Personal Details</CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    className="rounded-full px-4 py-2 h-auto font-bold text-accent hover:bg-accent/5 transition-all gap-2"
                >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                </Button>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0">
                            <Shield className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="p-xs uppercase font-bold tracking-widest opacity-50 text-[9px] mb-0.5">Name</p>
                            <p className="text-sm font-bold truncate">
                                {user.name || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0">
                            <Mail className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="p-xs uppercase font-bold tracking-widest opacity-50 text-[9px]">Email</p>
                                {user.emailVerified && (
                                    <Badge className="bg-accent/10 text-accent border-none text-[8px] h-3.5 px-1.5 font-bold uppercase tracking-tighter">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm font-bold truncate">
                                {user.email || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0">
                            <Phone className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="p-xs uppercase font-bold tracking-widest opacity-50 text-[9px] mb-0.5">Phone</p>
                            <p className="text-sm font-bold truncate">
                                {user.phone || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0">
                            <Calendar className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="p-xs uppercase font-bold tracking-widest opacity-50 text-[9px] mb-0.5">Member Since</p>
                            <p className="text-sm font-bold">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <EditAccountDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                currentName={user.name || ''}
                currentEmail={user.email || ''}
            />
        </Card>
    );
}