import { cookies } from 'next/headers';
import { decodeJWT, isTokenExpired, hasRole as checkRole } from './utils';

interface ServerAuth {
  user: {
    id?: string;
    email?: string;
    role?: string;
  } | null;
  isAuthenticated: boolean;
  token?: string;
}

export async function getServerAuth(): Promise<ServerAuth> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  if (!accessToken || isTokenExpired(accessToken)) {
    return { user: null, isAuthenticated: false };
  }
  
  const payload = decodeJWT(accessToken);
  
  return {
    user: {
      id: payload?.sub,
      email: payload?.email,
      role: payload?.role,
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

export async function requireRole(role: string): Promise<ServerAuth> {
  const auth = await requireAuth();
  if (!auth.token || !checkRole(auth.token, role)) {
    throw new Error(`Role ${role} required`);
  }
  return auth;
}