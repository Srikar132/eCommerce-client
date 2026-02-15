/**
 * Authentication Utilities
 * Shared utilities for authentication logic between server and client
 */

export type UserRole = 'USER' | 'ADMIN';

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================

/**
 * Actions that require specific role permissions
 * ADMIN: Can manage products, orders, and view store
 * USER: Can shop, add to cart, checkout, and place orders
 */
export type ActionPermission =
    // Cart actions - USER only
    | 'cart:view'
    | 'cart:add'
    | 'cart:update'
    | 'cart:remove'
    | 'cart:clear'
    // Checkout & Payment - USER only
    | 'checkout:initiate'
    | 'checkout:complete'
    | 'payment:process'
    | 'payment:verify'
    // Order actions
    | 'order:create'      // USER only
    | 'order:view-own'    // USER only
    | 'order:view-all'    // ADMIN only
    | 'order:update'      // ADMIN only
    // Product management - ADMIN only
    | 'product:create'
    | 'product:update'
    | 'product:delete'
    // Wishlist - USER only
    | 'wishlist:add'
    | 'wishlist:remove';

/**
 * Permission matrix defining which roles can perform which actions
 */
const ROLE_PERMISSIONS: Record<UserRole, ActionPermission[]> = {
    USER: [
        // Cart
        'cart:view',
        'cart:add',
        'cart:update',
        'cart:remove',
        'cart:clear',
        // Checkout & Payment
        'checkout:initiate',
        'checkout:complete',
        'payment:process',
        'payment:verify',
        // Orders
        'order:create',
        'order:view-own',
        // Wishlist
        'wishlist:add',
        'wishlist:remove',
    ],
    ADMIN: [
        // Orders (admin can view all orders but cannot create/checkout)
        'order:view-all',
        'order:update',
        // Product management
        'product:create',
        'product:update',
        'product:delete',
    ],
};

/**
 * Check if a role has permission to perform an action
 * @param role - User role
 * @param action - Action to check
 * @returns boolean - Whether the role has permission
 */
export function hasPermission(role: UserRole | undefined, action: ActionPermission): boolean {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

/**
 * Check if a role can perform shopping actions (cart, checkout, orders)
 * Quick helper for common checks
 */
export function canShop(role: UserRole | undefined): boolean {
    return role === 'USER';
}

/**
 * Check if a role has admin privileges
 */
export function isAdmin(role: UserRole | undefined): boolean {
    return role === 'ADMIN';
}

/**
 * RBAC error class for consistent error handling
 */
export class RBACError extends Error {
    public readonly statusCode: number;
    public readonly action: string;
    public readonly role: string | undefined;

    constructor(action: string, role: string | undefined) {
        super(`Forbidden: Role '${role || 'unknown'}' cannot perform action '${action}'`);
        this.name = 'RBACError';
        this.statusCode = 403;
        this.action = action;
        this.role = role;
    }
}

/**
 * Assert that a role has permission to perform an action
 * Throws RBACError if permission is denied
 * @param role - User role
 * @param action - Action to check
 * @throws RBACError if permission denied
 */
export function requirePermission(role: UserRole | undefined, action: ActionPermission): void {
    if (!hasPermission(role, action)) {
        throw new RBACError(action, role);
    }
}

/**
 * Assert that user can shop (not admin)
 * Throws RBACError if user is admin trying to shop
 * @param role - User role
 * @param action - Action being attempted (for error message)
 * @throws RBACError if admin user
 */
export function requireShoppingRole(role: UserRole | undefined, action: string): void {
    if (!canShop(role)) {
        throw new RBACError(action, role);
    }
}

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

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