import { cookies } from 'next/headers';
import { decodeJWT, isTokenExpired, hasRole as checkRole } from './utils';

interface ServerAuth {
  user: {
    id?: string;
    email?: string;
    role?: string;
    emailVerified?: boolean;
    username? : string;
    phone? : string;
  } | null;
  isAuthenticated: boolean;
  token?: string;
}

export async function getServerAuth(): Promise<ServerAuth> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  if (!accessToken) {
    return { user: null, isAuthenticated: false };
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    return { user: null, isAuthenticated: false };
  }
  
  const payload = decodeJWT(accessToken);
  
  if (!payload) {
    return { user: null, isAuthenticated: false };
  }
  
  return {
    user: {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      emailVerified: payload.emailVerified,
      username: payload.username,
      phone: payload.phone,
    },
    isAuthenticated: true,
    token: accessToken,
  };
}

export async function hasRole(role: string): Promise<boolean> {
  const auth = await getServerAuth();
  if (!auth.token) return false;
  return checkRole(auth.token, role);
}

export async function requireAuth(): Promise<ServerAuth> {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated) {
    throw new Error('Authentication required');
  }
  return auth;
}
