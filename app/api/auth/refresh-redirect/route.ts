import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      console.log('[Refresh] No refresh token found');
      return redirectToLogin(request);
    }

    // Validate API URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('[Refresh] API URL not configured');
      return redirectToLogin(request);
    }

    console.log('[Refresh] Attempting token refresh');

    // Call backend refresh endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${refreshToken}`,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      console.log('[Refresh] Token refresh failed');
      return redirectToLogin(request);
    }

    console.log('[Refresh] Token refresh successful');

    // Extract new cookies from response
    const setCookieHeaders = response.headers.getSetCookie?.() || [];

    // Determine redirect location
    let redirectTo = returnTo;
    if (['/login', '/register', '/sign-up'].includes(redirectTo)) {
      redirectTo = '/';
    }

    // Create redirect response
    const redirectResponse = NextResponse.redirect(
      new URL(redirectTo, request.url)
    );

    // Forward new cookies to client
    setCookieHeaders.forEach((cookieHeader) => {
      const [nameValue, ...attributes] = cookieHeader
        .split(';')
        .map((s) => s.trim());
      const [name, value] = nameValue.split('=');

      if (name && value) {
        const options: {
          httpOnly: boolean;
          path: string;
          sameSite: 'lax';
          secure: boolean;
          maxAge?: number;
        } = {
          httpOnly: true,
          path: '/',
          sameSite: 'lax' as const,
          secure: process.env.NODE_ENV === 'production',
        };

        attributes.forEach((attr) => {
          const [key, val] = attr.split('=');
          if (key.toLowerCase() === 'max-age') {
            options.maxAge = parseInt(val);
          }
        });

        redirectResponse.cookies.set(name, value, options);
      }
    });

    return redirectResponse;
  } catch (error) {
    console.error('[Refresh] Error:', error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginResponse = NextResponse.redirect(new URL('/login', request.url));
  loginResponse.cookies.delete('accessToken');
  loginResponse.cookies.delete('refreshToken');
  return loginResponse;
}
