import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired, hasRole, decodeJWT } from './lib/auth/utils';
import { ROUTE_CONFIG, isRouteMatch } from './lib/auth/middleware-config';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('\n────────────────────────────');
  console.log('[Middleware] Incoming request:', pathname);

  // Skip static & API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Read cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  console.log('[Middleware] Access Token:', accessToken ? 'FOUND' : 'MISSING');
  console.log('[Middleware] Refresh Token:', refreshToken ? 'FOUND' : 'MISSING');

  // Route classification
  const isProtectedRoute = isRouteMatch(pathname, ROUTE_CONFIG.protected);
  const isGuestOnlyRoute = isRouteMatch(pathname, ROUTE_CONFIG.guestOnly);
  const isAdminRoute = isRouteMatch(pathname, ROUTE_CONFIG.admin);

  console.log('[Middleware] Route Type:', {
    protected: isProtectedRoute,
    guestOnly: isGuestOnlyRoute,
    admin: isAdminRoute,
  });

  let isAuthenticated = false;
  let userInfo: any = null;

  // Validate access token
  if (accessToken && !isTokenExpired(accessToken)) {
    isAuthenticated = true;
    userInfo = decodeJWT(accessToken);

    console.log('[Middleware] User authenticated');
    console.log('[Middleware] User info:', {
      id: userInfo?.sub,
      email: userInfo?.email,
      role: userInfo?.role || userInfo?.roles,
      emailVerified: userInfo?.emailVerified,
    });
  } else {
    console.log('[Middleware] User NOT authenticated');
  }

  // Guest-only routes
  if (isGuestOnlyRoute) {
    console.log('[Middleware] Guest-only route');

    if (isAuthenticated) {
      console.log('[Middleware] Authenticated user → redirecting to /');
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (refreshToken && !isTokenExpired(refreshToken)) {
      console.log('[Middleware] Guest route but Refresh Token valid → attempting auto-login');
      
      const refreshUrl = new URL('/api/auth/refresh-redirect', request.url);
      // IMPORTANT: After refresh, send them to Home ('/'), NOT back to '/login'
      refreshUrl.searchParams.set('returnTo', '/'); 
      
      return NextResponse.redirect(refreshUrl);
    }

    console.log('[Middleware] Guest allowed → continuing');
    return NextResponse.next();
  }

  // Protected & admin routes
  if (isProtectedRoute || isAdminRoute) {
    console.log('[Middleware] Protected/Admin route');

    if (!isAuthenticated) {
      console.log('[Middleware] No valid access token');

      if (refreshToken && !isTokenExpired(refreshToken)) {
        console.log('[Middleware] Refresh token valid → redirecting to refresh');

        const refreshUrl = new URL('/api/auth/refresh-redirect', request.url);
        refreshUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(refreshUrl);
      }

      console.log('[Middleware] No valid tokens → redirecting to /login');

      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Admin check
    if (isAdminRoute) {
      console.log('[Middleware] Admin route → checking role');

      if (!hasRole(accessToken!, 'ADMIN')) {
        console.log('[Middleware] Access denied (not ADMIN)');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      console.log('[Middleware] Admin access granted');
    }
  }

  console.log('[Middleware] Access allowed → continuing');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
