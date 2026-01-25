export const ROUTE_CONFIG = {
  // Routes that REQUIRE authentication
  protected: [
    '/account', 
    '/checkout', 
    '/orders',
  ],
  
  // Routes that REQUIRE being logged OUT (redirect to home if authenticated)
  guestOnly: [
    '/login', 
  ],
  
  // Admin-only routes
  admin: ['/admin'],
  
  // Public routes (accessible to everyone, optional auth)
  public: [
    '/', 
    '/products', 
    '/about', 
    '/contact', 
    '/category',
    '/customization',
    '/cart',
    '/customization-studio',
  ],
} as const;

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return isRouteMatch(pathname, ROUTE_CONFIG.protected);
}

/**
 * Check if a route is guest-only (must be logged out)
 */
export function isGuestOnlyRoute(pathname: string): boolean {
  return isRouteMatch(pathname, ROUTE_CONFIG.guestOnly);
}

/**
 * Check if a route is public (accessible to all)
 */
export function isPublicRoute(pathname: string): boolean {
  return isRouteMatch(pathname, ROUTE_CONFIG.public);
}

/**
 * Check if a route is admin-only
 */
export function isAdminRoute(pathname: string): boolean {
  return isRouteMatch(pathname, ROUTE_CONFIG.admin);
}

export function isRouteMatch(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    // Exact match or starts with route + slash
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}
