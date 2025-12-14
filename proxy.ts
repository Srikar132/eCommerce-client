import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired, hasRole } from './lib/auth/utils';
import { ROUTE_CONFIG, isRouteMatch } from './lib/auth/middleware-config';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  console.log('[Middleware] Processing:', pathname);

  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  console.log('[Middleware] Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('[Middleware] Refresh Token:', refreshToken ? 'Present' : 'Missing');
  
  let isAuthenticated = false;

  // Check route type first to avoid unnecessary processing
  const isProtectedRoute = isRouteMatch(pathname, ROUTE_CONFIG.protected);
  const isGuestOnlyRoute = isRouteMatch(pathname, ROUTE_CONFIG.guestOnly);
  const isAdminRoute = isRouteMatch(pathname, ROUTE_CONFIG.admin);

  // Check if access token is valid
  if (accessToken && !isTokenExpired(accessToken)) {
    isAuthenticated = true;
  } 
  // Only attempt refresh if we're accessing a protected route and have a valid refresh token
  else if (refreshToken && !isTokenExpired(refreshToken) && (isProtectedRoute || isAdminRoute)) {
    console.log('[Middleware] Access token expired, redirecting to refresh endpoint');
    
    // Redirect to a special refresh route that will handle the token refresh
    const refreshUrl = new URL('/api/auth/refresh-redirect', request.url);
    refreshUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(refreshUrl);
  }

  console.log('[Middleware] Auth status:', isAuthenticated ? 'Authenticated' : 'Not authenticated');

  // Handle guest-only routes (login, signup)
  if (isGuestOnlyRoute && isAuthenticated) {
    console.log('[Middleware] Redirecting authenticated user away from guest-only route');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing guest-only routes without authentication, allow it
  if (isGuestOnlyRoute && !isAuthenticated) {
    console.log('[Middleware] Allowing access to guest-only route');
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log('[Middleware] Redirecting unauthenticated user to login');
    const loginUrl = new URL('/login', request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Clear expired cookies
    redirectResponse.cookies.delete('accessToken');
    redirectResponse.cookies.delete('refreshToken');
    return redirectResponse;
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      console.log('[Middleware] Redirecting unauthenticated user to login (admin route)');
      const loginUrl = new URL('/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.delete('refreshToken');
      return redirectResponse;
    }

    if (!hasRole(accessToken!, 'ADMIN')) {
      console.log('[Middleware] User lacks admin role, redirecting to unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Allow request to proceed
  console.log('[Middleware] Request allowed');
  return NextResponse.next();
}

// Config moved to middleware.ts

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};