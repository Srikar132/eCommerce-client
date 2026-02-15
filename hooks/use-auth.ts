/**
 * Authentication Hook
 * Provides authentication state and utilities for client components
 */

import { useSession } from 'next-auth/react';
import {
    UserRole,
    hasRoutePermission,
    getRoleDisplayName,
    hasPermission,
    canShop,
    ActionPermission,
} from '@/lib/auth-utils';

export function useAuth() {
    const { data: session, status } = useSession();

    const user = session?.user;
    const isAuthenticated = status === 'authenticated' && !!user;
    const isLoading = status === 'loading';
    const userRole = user?.role as UserRole | undefined;

    return {
        // User info
        user,
        userRole,
        isAuthenticated,
        isLoading,

        // Role checks
        isAdmin: userRole === 'ADMIN',
        isUser: userRole === 'USER',

        // RBAC permission checks
        canShop: canShop(userRole),
        canAddToCart: hasPermission(userRole, 'cart:add'),
        canCheckout: hasPermission(userRole, 'checkout:initiate'),
        canPlaceOrder: hasPermission(userRole, 'order:create'),

        // Generic permission check
        hasActionPermission: (action: ActionPermission) => hasPermission(userRole, action),

        // Utilities
        hasRoutePermission: (pathname: string) => hasRoutePermission(userRole, pathname),
        getRoleDisplayName: () => userRole ? getRoleDisplayName(userRole) : 'Guest',

        // Session status
        status,
    };
}

/**
 * Higher-order component for route protection
 * Redirects to login if not authenticated
 */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth(redirectTo = '/login') {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, redirectTo, router]);

    return { isAuthenticated, isLoading };
}

/**
 * Hook for role-based access control
 * Returns whether user has required role
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
    const { userRole, isAuthenticated, isLoading } = useAuth();

    const hasRequiredRole = () => {
        if (!isAuthenticated || !userRole) return false;

        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(userRole);
        }

        return userRole === requiredRole;
    };

    return {
        hasRequiredRole: hasRequiredRole(),
        userRole,
        isAuthenticated,
        isLoading,
    };
}