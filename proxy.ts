import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

/**
 * NextAuth-based Authentication Middleware
 * 
 * Uses NextAuth session for authentication and authorization
 * Supports role-based access control (USER, ADMIN)
 */

// Route configuration
const PUBLIC_ROUTES = [
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

const GUEST_ONLY_ROUTES = [
  '/login',
];

const PROTECTED_ROUTES = [
  '/account',
  '/cart',
  '/checkout',
  '/orders',
  '/customization',
  '/customization-studio',
];

const ADMIN_ROUTES = [
  '/admin',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some(route => pathname === route);
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session using NextAuth
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // Check route types
  const isPublic = isPublicRoute(pathname);
  const isGuestOnly = isGuestOnlyRoute(pathname);
  const isProtected = isProtectedRoute(pathname);
  const isAdmin = isAdminRoute(pathname);

  console.log(`[Middleware] ${pathname} | Auth: ${isAuthenticated} | Role: ${userRole || 'None'} | Protected: ${isProtected} | Admin: ${isAdmin}`);

  // Allow public routes without authentication
  if (isPublic && !isProtected && !isAdmin) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from guest-only routes (login)
  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access
  if (isAdmin) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== 'ADMIN') {
      // Non-admin trying to access admin routes - redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
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
     * - public folder (images, icons, etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|tiff)$|api).*)',
  ],
};
