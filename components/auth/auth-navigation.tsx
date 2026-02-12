/**
 * Authentication Status Component for Navigation
 * Shows login/logout buttons and role-based quick links
 */

"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Shield,
    LogOut,
    ShoppingBag,
    Heart
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function AuthNavigation() {
    const {
        isAuthenticated,
        isLoading,
        user,
        userRole,
        isAdmin,
        getRoleDisplayName
    } = useAuth();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
        );
    }

    // Not authenticated - show login button
    if (!isAuthenticated) {
        return (
            <Link href="/login">
                <Button variant="default" size="sm">
                    Sign In
                </Button>
            </Link>
        );
    }

    // Get user's initials for avatar
    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Role-based menu items
    const getRoleMenuItems = () => {
        const items = [];

        // Standard user items
        items.push(
            <DropdownMenuItem key="account" asChild>
                <Link href="/account" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Account
                </Link>
            </DropdownMenuItem>
        );

        items.push(
            <DropdownMenuItem key="orders" asChild>
                <Link href="/orders" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                </Link>
            </DropdownMenuItem>
        );

        items.push(
            <DropdownMenuItem key="wishlist" asChild>
                <Link href="/wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlist
                </Link>
            </DropdownMenuItem>
        );

        // Admin-only items
        if (isAdmin) {
            items.push(
                <DropdownMenuSeparator key="admin-sep" />,
                <DropdownMenuItem key="admin" asChild>
                    <Link href="/admin" className="flex items-center gap-2 text-red-600">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                </DropdownMenuItem>
            );
        }

        return items;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                        <AvatarFallback className="text-xs">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">
                                {user?.name || 'User'}
                            </p>
                            <Badge
                                variant={userRole === 'ADMIN' ? 'destructive' : 'outline'}
                                className="text-xs"
                            >
                                {getRoleDisplayName()}
                            </Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || user?.phone}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Navigation Items */}
                {getRoleMenuItems()}

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Simple login/logout button (alternative to dropdown)
 */
export function SimpleAuthButton() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />;
    }

    if (!isAuthenticated) {
        return (
            <Link href="/login">
                <Button variant="default" size="sm">
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.name?.split(' ')[0] || 'User'}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
            >
                Sign Out
            </Button>
        </div>
    );
}