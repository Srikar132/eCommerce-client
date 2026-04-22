/**
 * Role-based Welcome Component
 * Demonstrates the authentication system with role-based content
 */

"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getWelcomeMessage } from '@/lib/auth-utils';
import {
    Shield,
    User,

} from 'lucide-react';
import Link from 'next/link';

const RoleIcon = ({ role }: { role: string | undefined }) => {
    switch (role) {
        case 'ADMIN':
            return <Shield className="h-5 w-5 text-red-500" />;
        default:
            return <User className="h-5 w-5 text-green-500" />;
    }
};

export default function RoleBasedWelcome() {
    const {
        user,
        userRole,
        isAuthenticated,
        isLoading,
        getRoleDisplayName,
        hasRoutePermission
    } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-50">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Welcome, Guest!
                    </CardTitle>
                    <CardDescription>
                        Please log in to access personalized features.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/login">
                        <Button className="w-full">Sign In</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const welcomeMessage = getWelcomeMessage(userRole!, user.name || 'User');


    return (
        <>
            <Card className="rounded-[2rem] border-none shadow-sm bg-accent/5 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                <RoleIcon role={userRole} />
                            </div>
                            <div>
                                <h3 className="h3 !text-lg mb-0.5">
                                    Hello, {user.name?.split(' ')[0] || 'Member'}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="px-2 py-0 rounded-full font-bold text-[8px] uppercase tracking-wider bg-white border-none h-4">
                                        {getRoleDisplayName()}
                                    </Badge>
                                    <span className="text-muted-foreground/30">•</span>
                                    <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:text-right">
                            <p className="text-xs text-muted-foreground italic leading-relaxed opacity-70">
                                {welcomeMessage}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Debug (only for admin) */}
            {userRole === 'ADMIN' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-mono">Debug: Route Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            {['/admin', '/account', '/cart', '/orders'].map(route => (
                                <div key={route} className="flex justify-between">
                                    <span>{route}</span>
                                    <span className={hasRoutePermission(route) ? 'text-green-600' : 'text-red-600'}>
                                        {hasRoutePermission(route) ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}