// app/api/auth/refresh-redirect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      console.log('[Refresh] No refresh token found, redirecting to login');
      const loginResponse = NextResponse.redirect(new URL('/login', request.url));
      loginResponse.cookies.delete('accessToken');
      loginResponse.cookies.delete('refreshToken');
      return loginResponse;
    }

    // Check if API_URL is properly configured
    if (!process.env.NEXT_PUBLIC_API_URL || 
        process.env.NEXT_PUBLIC_API_URL === 'https://api.example.com' ||
        process.env.NEXT_PUBLIC_API_URL.includes('example.com')) {
      console.error('[Refresh] API URL not properly configured. Please set NEXT_PUBLIC_API_URL in .env.local');
      const loginResponse = NextResponse.redirect(new URL('/login', request.url));
      loginResponse.cookies.delete('accessToken');
      loginResponse.cookies.delete('refreshToken');
      return loginResponse;
    }

    console.log('[Refresh] Attempting token refresh');

    // Call backend refresh endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.log('[Refresh] Token refresh failed, clearing cookies');
      // Refresh failed, clear cookies and redirect to login
      const loginResponse = NextResponse.redirect(new URL('/login', request.url));
      loginResponse.cookies.delete('accessToken');
      loginResponse.cookies.delete('refreshToken');
      return loginResponse;
    }

    console.log('[Refresh] Token refresh successful');

    // Extract cookies from backend response
    const setCookieHeader = response.headers.get('set-cookie');
    
    // Determine where to redirect - if returnTo is login/register, redirect to home instead
    let redirectTo = returnTo;
    if (redirectTo === '/login' || redirectTo === '/register' || redirectTo === '/sign-up') {
      redirectTo = '/';
      console.log('[Refresh] Redirecting to home instead of', returnTo);
    }
    
    // Redirect back to original page or home
    const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Forward the Set-Cookie headers from backend to client
    if (setCookieHeader) {
      // Parse the Set-Cookie header and set cookies
      // Handle multiple Set-Cookie headers properly
      const cookieHeaders = response.headers.getSetCookie?.() || [setCookieHeader];
      
      cookieHeaders.forEach(cookieHeader => {
        const [nameValue, ...attributes] = cookieHeader.split(';').map(s => s.trim());
        const [name, value] = nameValue.split('=');
        
        if (name && value) {
          // Parse cookie attributes
          const options: any = {
            httpOnly: true,
            path: '/',
            sameSite: 'lax' as const,
          };
          
          attributes.forEach(attr => {
            const [key, val] = attr.split('=');
            if (key.toLowerCase() === 'max-age') {
              options.maxAge = parseInt(val);
            } else if (key.toLowerCase() === 'secure') {
              options.secure = true;
            }
          });
          
          redirectResponse.cookies.set(name, value, options);
        }
      });
    } else {
      console.warn('[Refresh] No set-cookie header found in refresh response');
    }
    
    console.log('[Refresh] Redirecting to:', redirectTo);
    return redirectResponse;
  } catch (error) {
    console.error('[Refresh] Refresh redirect error:', error);
    const loginResponse = NextResponse.redirect(new URL('/login', request.url));
    loginResponse.cookies.delete('accessToken');
    loginResponse.cookies.delete('refreshToken');
    return loginResponse;
  }
}