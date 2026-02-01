import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedRoute, isGuestOnlyRoute, isPublicRoute, isAdminRoute } from '@/lib/auth/middleware-config';
import { validateRefreshToken, isAdminFromToken } from '@/lib/auth/auth-utils';

/**
 * Simplified Authentication Middleware
 * 
 * Validates refresh_token JWT from cookies set by Spring backend
 * No token refresh logic - just validation and role checking
 */


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check route type using middleware-config helpers
  const isProtected = isProtectedRoute(pathname);
  const isGuestOnly = isGuestOnlyRoute(pathname);
  const isPublic = isPublicRoute(pathname);
  const isAdmin = isAdminRoute(pathname);

  // Skip middleware for public routes (no auth check needed)
  if (isPublic && !isProtected && !isGuestOnly) {
    return NextResponse.next();
  }



  // Get refresh token from cookies
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log(`[Middleware] ${pathname} | Protected: ${isProtected} | GuestOnly: ${isGuestOnly} | Admin: ${isAdmin} | Token: ${refreshToken ? 'Found' : 'Not Found'}`);
  
  if (!refreshToken) {
    // No token found - redirect to login for protected routes
    if (isProtected || isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Validate and decode the refresh token
  const decoded = validateRefreshToken(refreshToken);
  const authenticated = !!decoded;

  // Create response based on authentication result
  let response: NextResponse;

  // Redirect to login if accessing protected route without auth
  if (isProtected && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    response = NextResponse.redirect(loginUrl);
  }
  // Redirect to home if accessing guest-only routes while authenticated
  else if (isGuestOnly && authenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  }
  // Admin routes require admin role
  else if (isAdmin && (!authenticated || !isAdminFromToken(decoded))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    response = NextResponse.redirect(loginUrl);
  }
  // Continue normally
  else {
    response = NextResponse.next();
  }

  return response;
}

/**
 * Configure which routes middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
