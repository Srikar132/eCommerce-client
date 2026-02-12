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
    Settings,
    ShoppingBag,
    Star,
    LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';
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
        hasPermission
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
            <Card className="max-w-md mx-auto">
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

    const getRoleActions = () => {
        switch (userRole) {
            case 'ADMIN':
                return [
                    { label: 'Admin Dashboard', href: '/admin', icon: <Settings className="h-4 w-4" /> },
                    { label: 'User Management', href: '/admin/users', icon: <User className="h-4 w-4" /> },
                    { label: 'System Settings', href: '/admin/settings', icon: <Shield className="h-4 w-4" /> },
                ];
            default:
                return [
                    { label: 'My Account', href: '/account', icon: <User className="h-4 w-4" /> },
                    { label: 'My Orders', href: '/orders', icon: <ShoppingBag className="h-4 w-4" /> },
                    { label: 'Wishlist', href: '/wishlist', icon: <Star className="h-4 w-4" /> },
                ];
        }
    };

    const actions = getRoleActions();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Welcome Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RoleIcon role={userRole} />
                            <div>
                                <CardTitle className="text-xl">
                                    {user.name || 'Welcome!'}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Badge variant={userRole === 'ADMIN' ? 'destructive' : 'outline'}>
                                        {getRoleDisplayName()}
                                    </Badge>
                                    <span>•</span>
                                    <span>{user.email || user.phone}</span>
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{welcomeMessage}</p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>
                        Actions available based on your role and permissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {actions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12"
                                    disabled={!hasPermission(action.href)}
                                >
                                    {action.icon}
                                    <span className="ml-2">{action.label}</span>
                                </Button>
                            </Link>
                        ))}
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
                                    <span className={hasPermission(route) ? 'text-green-600' : 'text-red-600'}>
                                        {hasPermission(route) ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}