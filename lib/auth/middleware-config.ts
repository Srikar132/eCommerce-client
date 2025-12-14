export const ROUTE_CONFIG = {
  protected: ['/account', '/orders', '/wishlist', '/checkout', '/cart'],
  guestOnly: ['/login', '/register', '/sign-up'],
  admin: ['/admin'],
  public: ['/', '/products', '/about', '/contact', '/search', '/category', 
           '/customization', '/product'],
} as const;

export function isRouteMatch(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    // Exact match or starts with route + slash
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}
