/**
 * Authentication Utilities
 * Shared utilities for authentication logic between server and client
 */

export type UserRole = 'USER' | 'ADMIN';

// Role-based default redirects after authentication
export const ROLE_REDIRECTS: Record<UserRole, string> = {
    ADMIN: '/admin',
    USER: '/account',
};

// Route definitions (matching middleware)
export const PUBLIC_ROUTES = [
    '/',
    '/about',
    '/contact',
    '/products',
    '/faq',
    '/terms',
    '/returns',
    '/privacy',
    '/help',
];

export const GUEST_ONLY_ROUTES = [
    '/login',
    '/register',
    '/forgot-password',
];

export const PROTECTED_ROUTES = [
    '/account',
    '/cart',
    '/checkout',
    '/orders',
    '/wishlist',
    '/customization',
    '/customization-studio',
];

export const ADMIN_ROUTES = ['/admin'];

/**
 * Get redirect URL after successful authentication
 * Takes into account user role and redirect parameter
 * Note: Admin users are ALWAYS redirected to admin panel
 */
export function getPostAuthRedirect(userRole: UserRole, redirectParam?: string | null): string {
    // Admin users always go to admin panel - no exceptions
    if (userRole === 'ADMIN') {
        return ROLE_REDIRECTS.ADMIN;
    }

    // For regular users, check redirect parameter first
    if (redirectParam && isValidRedirect(redirectParam)) {
        return redirectParam;
    }

    // Otherwise, redirect based on role
    return ROLE_REDIRECTS[userRole] || '/account';
}

/**
 * Check if a redirect URL is safe to use
 * Prevents redirecting to guest-only routes or external URLs
 */
export function isValidRedirect(pathname: string): boolean {
    // Prevent external redirects
    if (pathname.includes('://') || pathname.startsWith('//')) {
        return false;
    }

    // Prevent redirect to guest-only routes
    if (GUEST_ONLY_ROUTES.some(route => pathname === route)) {
        return false;
    }

    // Must start with /
    if (!pathname.startsWith('/')) {
        return false;
    }

    return true;
}

/**
 * Get user-friendly role name
 */
export function getRoleDisplayName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
        USER: 'Customer',
        ADMIN: 'Administrator',
    };

    return roleNames[role] || 'User';
}

/**
 * Check if user has permission to access a route
 */
export function hasRoutePermission(userRole: UserRole | undefined, pathname: string): boolean {
    // Public routes are accessible to everyone
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return true;
    }

    // Protected routes require some authentication
    if (PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return !!userRole;
    }

    // Admin routes
    if (ADMIN_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return userRole === 'ADMIN';
    }

    return true; // Default allow
}

/**
 * Get welcome message based on user role
 */
export function getWelcomeMessage(role: UserRole, name: string): string {
    const greeting = name ? `Welcome back, ${name}!` : 'Welcome back!';

    const roleMessages: Record<UserRole, string> = {
        USER: `${greeting} Ready to explore our latest products?`,
        ADMIN: `${greeting} Your admin dashboard is ready.`,
    };

    return roleMessages[role] || greeting;
}