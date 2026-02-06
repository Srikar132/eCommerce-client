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
        <>
            <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg font-semibold">Account Details</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditOpen(true)}
                        className="gap-2 hover:bg-accent"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                    {/* Name */}
                    <div className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                        <div className="p-2 rounded-full bg-primary/10 shrink-0">
                            <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Full Name</p>
                            <p className="text-sm font-medium truncate">
                                {user.name || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                        <div className="p-2 rounded-full bg-primary/10 shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Email Address</p>
                                {user.emailVerified ? (
                                    <Badge variant="default" className="text-[10px] h-4 px-1.5">
                                        Verified
                                    </Badge>
                                ) : user.email ? (
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                        Not Verified
                                    </Badge>
                                ) : null}
                            </div>
                            <p className="text-sm font-medium truncate">
                                {user.email || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                        <div className="p-2 rounded-full bg-primary/10 shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Phone Number</p>
                                {user.phoneVerified && (
                                    <Badge variant="default" className="text-[10px] h-4 px-1.5">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm font-medium">{user.phone}</p>
                        </div>
                    </div>

                    {/* Account Created */}
                    <div className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                        <div className="p-2 rounded-full bg-primary/10 shrink-0">
                            <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Member Since</p>
                            <p className="text-sm font-medium">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditAccountDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                currentName={user.name || ''}
                currentEmail={user.email || ''}
            />
        </>
    );
}
