"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "@/lib/api/auth";
import { ROUTE_CONFIG } from "@/lib/auth/middleware-config";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: any;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { setUser, clearUser, isAuthenticated , user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
  console.log('[AuthProvider] Current User:', user);

  // Hydrate store with server data on mount
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);

    } else {
      clearUser();
    }
  }, [initialUser, setUser, clearUser]);

  // Periodic auth check to catch token expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAuthStatus = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.log('[Auth] Session expired, clearing user');
        clearUser();
        
        // Only redirect if on protected route
        if (ROUTE_CONFIG.protected.some(route => 
            pathname === route || pathname.startsWith(`${route}/`))) {
          router.push('/login');
        }
      }
    };

    // Check auth every 5 minutes
    checkIntervalRef.current = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAuthenticated, pathname, router, setUser, clearUser]);

  // Revalidate on route changes to protected routes
  useEffect(() => {
    if (!isAuthenticated) return;

    const revalidateAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        clearUser();
        router.push('/login');
      }
    };

    // Revalidate when navigating to sensitive routes
    if (pathname.startsWith('/account') || 
        pathname.startsWith('/orders') || 
        pathname.startsWith('/checkout')) {
      revalidateAuth();
    }
  }, [pathname, isAuthenticated, setUser, clearUser, router]);

  return <>{children}</>;
}