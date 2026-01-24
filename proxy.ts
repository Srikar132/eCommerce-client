import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedRoute, isGuestOnlyRoute, isPublicRoute, isAdminRoute } from '@/lib/auth/middleware-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Check if user is authenticated by calling backend
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.error('[Middleware] Auth check failed:', error);
    return false;
  }
}

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

  // Check authentication for protected, admin, or guest-only routes
  const authenticated = await isAuthenticated(request);

  // Redirect to login if accessing protected route without auth
  if (isProtected && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing guest-only routes while authenticated
  if (isGuestOnly && authenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin routes require authentication (add admin check later if needed)
  if (isAdmin && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
