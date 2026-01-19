interface JWTPayload {
  sub?: string;
  email?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
  emailVerified?: boolean;
  username?: string;
  phone?: string;
  exp?: number;
  iat?: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = typeof Buffer !== 'undefined'
      ? JSON.parse(Buffer.from(parts[1], 'base64').toString())
      : JSON.parse(atob(parts[1]));
    
    return payload;
  } catch (error) {
    console.error('[JWT] Decode error:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  
  // Add 30 second buffer to account for clock skew
  const currentTime = Math.floor(Date.now() / 1000) + 30;
  return payload.exp < currentTime;
}

export function hasRole(token: string, role: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;
  
  return (
    payload.role === role ||
    payload.roles?.includes(role) ||
    payload.authorities?.includes(`ROLE_${role}`) ||
    payload.authorities?.includes(role)
  ) ?? false;
}

export function getUserFromToken(token: string) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    emailVerified: payload.emailVerified,
  };
}

export function clearAuthCookies() {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}