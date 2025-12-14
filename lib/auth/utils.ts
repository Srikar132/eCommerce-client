interface JWTPayload {
  sub?: string;  // This is where the user ID actually is!
  email?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
  exp?: number;
  iat?: number;  // issued at time
}


export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Use Buffer for Node.js (middleware) or atob for browser
    const payload = typeof Buffer !== 'undefined'
      ? JSON.parse(Buffer.from(parts[1], 'base64').toString())
      : JSON.parse(atob(parts[1]));
    
    return payload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function hasRole(token: string, role: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;
  
  return (
    payload.role === role ||
    payload.roles?.includes(role) ||
    payload.authorities?.includes(`ROLE_${role}`)
  )!;
}


export function getUserFromToken(token: string) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.sub,  // Use 'sub' instead of 'id'
    email: payload.email,
    role: payload.role,
  };
}

// Client-side cookie clearing utility
export function clearAuthCookies() {
  if (typeof document !== 'undefined') {
    // Clear cookies by setting them to expire in the past
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    console.log('[Auth] Client-side cookies cleared');
  }
} 