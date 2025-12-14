import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    console.log('[Logout] Refresh Token:', refreshToken ? 'Present' : 'Missing');

    // Call backend logout if we have a refresh token
    if (refreshToken && process.env.NEXT_PUBLIC_API_URL) {
      try {
        // Call backend logout endpoint to invalidate refresh token
        console.log('[Logout] Calling backend logout endpoint');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refreshToken=${refreshToken}`
          },
          credentials: 'include',
        });
        
        // make 10sec delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 10000));

      } catch (error) {
        console.error('[Logout] Backend logout failed:', error);
        // Continue with client logout even if backend fails
      }
    }

    // Create response and clear cookies
    const response = NextResponse.json({ success: true });
    
    // Clear authentication cookies with proper options
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    console.log('[Logout] Cookies cleared successfully');
    return response;

  } catch (error) {
    console.error('[Logout] Error:', error);
    
    // Still try to clear cookies even on error
    const response = NextResponse.json(
      { error: 'Logout failed' }, 
      { status: 500 }
    );
    
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    
    return response;
  }
}
