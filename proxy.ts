import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
  UserRole,
  ROLE_REDIRECTS,
  PUBLIC_ROUTES,
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  getPostAuthRedirect,
  hasRoutePermission,
} from '@/lib/auth-utils';

/**
 * Enhanced Authentication Middleware
 * Flow: /login → authenticate → role check → redirect
 * 
 * Features:
 * - Role-based access control (USER, ADMIN)
 * - Smart redirects based on user role
 * - Protected route handling
 * - Guest-only route restrictions
 */

// Route checking functions
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

// Check if user has required role for route
function hasRequiredRole(userRole: UserRole | undefined, pathname: string): boolean {
  return hasRoutePermission(userRole, pathname);
}

// Add security headers helper function
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get session using NextAuth
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role as UserRole | undefined;
  const redirectParam = searchParams.get('redirect');

  // Route type checks
  const isPublic = isPublicRoute(pathname);
  const isGuestOnly = isGuestOnlyRoute(pathname);
  const isProtected = isProtectedRoute(pathname);
  const isAdmin = isAdminRoute(pathname);

  // Enhanced logging with flow information
  console.log(`🔐 [AUTH FLOW] ${pathname}`);
  console.log(`├─ Authenticated: ${isAuthenticated ? '✅' : '❌'}`);
  console.log(`├─ Role: ${userRole || 'None'}`);
  console.log(`├─ Route Type: ${isPublic ? 'Public' :
    isGuestOnly ? 'Guest-Only' :
      isProtected ? 'Protected' :
        isAdmin ? 'Admin' : 'Unknown'
    }`);
  console.log(`└─ Redirect Param: ${redirectParam || 'None'}`);

  // ADMIN REDIRECT: Admin users should always be in admin panel
  // Exception: Preview mode allows admins to view the store
  const previewParam = searchParams.get('preview') === 'true';
  const previewCookie = request.cookies.get('admin_preview')?.value === 'true';
  const isPreviewMode = previewParam || previewCookie;

  // If admin is accessing admin routes, clear preview cookie
  if (isAuthenticated && userRole === 'ADMIN' && isAdmin && previewCookie) {
    const response = addSecurityHeaders(NextResponse.next());
    response.cookies.delete('admin_preview');
    console.log(`🔄 [PREVIEW] Admin returned to panel, clearing preview cookie`);
    return response;
  }

  // If preview param is set, create cookie for subsequent navigation
  if (isAuthenticated && userRole === 'ADMIN' && previewParam && !isAdmin) {
    const response = addSecurityHeaders(NextResponse.next());
    response.cookies.set('admin_preview', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    console.log(`🔄 [PREVIEW] Admin entered preview mode, setting cookie`);
    return response;
  }

  // Redirect admin to admin panel if not in preview mode
  if (isAuthenticated && userRole === 'ADMIN' && !isAdmin && !isPreviewMode) {
    console.log(`🔄 [REDIRECT] Admin user redirected from ${pathname} to /admin`);
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // STEP 1: Handle public routes (no authentication required)
  if (isPublic && !isProtected && !isAdmin) {
    console.log(`🟢 [ALLOW] Public route access granted`);
    return addSecurityHeaders(NextResponse.next());
  }

  // STEP 2: Guest-only routes (/login) - implement the core auth flow
  if (isGuestOnly) {
    if (isAuthenticated && userRole) {
      // User is already authenticated - redirect based on role
      const redirectUrl = getPostAuthRedirect(userRole, redirectParam);
      console.log(`🔄 [REDIRECT] Authenticated user (${userRole}) redirected from guest route to: ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      // User is not authenticated - allow access to login page
      console.log(`🟢 [ALLOW] Guest access to authentication page`);
      return addSecurityHeaders(NextResponse.next());
    }
  }

  // STEP 3: Protected routes - require authentication
  if (isProtected || isAdmin) {
    if (!isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      console.log(`🔄 [REDIRECT] Unauthenticated user redirected to login with redirect=${pathname}`);
      return NextResponse.redirect(loginUrl);
    }

    // STEP 4: Role-based access control
    if (!hasRequiredRole(userRole, pathname)) {
      // User authenticated but lacks required role
      const fallbackUrl = userRole ? ROLE_REDIRECTS[userRole] : '/account';
      console.log(`❌ [DENIED] User role '${userRole}' insufficient for ${pathname}. Redirecting to: ${fallbackUrl}`);
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }

    // Authentication and role check passed
    console.log(`✅ [AUTHORIZED] User '${userRole}' granted access to ${pathname}`);
    return addSecurityHeaders(NextResponse.next());
  }

  // Default: allow access
  console.log(`🟢 [ALLOW] Default access granted`);
  return addSecurityHeaders(NextResponse.next());
}

/**
 * Configure which routes middleware should run on
 * Excludes static files, API routes, and assets for better performance
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)  
     * - public folder assets (images, icons, etc.)
     * - api routes (handled separately)
     * - manifest and service worker files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest|sw\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|tiff|woff|woff2|eot|ttf|otf)$|api/).*)',
  ],
};

/**
 * Utility function to check if a user can access a specific route
 * Useful for conditional rendering in components
 */
export function canUserAccess(userRole: UserRole | undefined, pathname: string): boolean {
  const isPublic = isPublicRoute(pathname);

  // Public routes are accessible to everyone
  if (isPublic && !isProtectedRoute(pathname) && !isAdminRoute(pathname)) {
    return true;
  }

  // All other routes require authentication
  if (!userRole) return false;

  return hasRequiredRole(userRole, pathname);
}

/**
 * Get all accessible routes for a user role
 * Useful for generating navigation menus
 */
export function getAccessibleRoutes(userRole: UserRole): string[] {
  const accessible = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES];

  switch (userRole) {
    case 'ADMIN':
      return [...accessible, ...ADMIN_ROUTES];
    case 'USER':
    default:
      return accessible;
  }
}
