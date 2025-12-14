export const ROUTE_CONFIG = {
  // Routes that require authentication
  protected: ['/account', '/orders', '/wishlist', '/checkout' , '/cart', '/auth-test'],
  
  // Routes only accessible to guests (not authenticated)
  guestOnly: ['/login', '/sign-up'],
  
  // Routes that require admin role
  admin: ['/admin'],
  
  // Public routes (no authentication needed)
  public: ['/', '/products', '/about', '/contact' , '/search' , '/category', '/customization'],
} as const;

export function isRouteMatch(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}