"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "@/lib/api/auth";
import { ROUTE_CONFIG } from "@/lib/auth/middleware-config";
import { User } from "@/types";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { setUser, clearUser, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const hasHydratedRef = useRef(false);

  // ============================================
  // PRIORITY 1: Hydrate store on mount (ONCE)
  // ============================================
  // auth-provider.tsx
  useEffect(() => {
    // Prevent double hydration in strict mode
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    if (initialUser) {
      console.log('[AuthProvider] ✅ Hydrating store with server data:', initialUser);
      setUser(initialUser);
    } else {
      console.log('[AuthProvider] ℹ️ No initial user from server, using persisted state');

      // ✅ FIX: Only check for refreshed auth if we have persisted state
      const persistedState = localStorage.getItem('auth-storage');

      if (persistedState) {
        try {
          const parsed = JSON.parse(persistedState);

          // Only attempt to revalidate if store thinks user is authenticated
          if (parsed?.state?.isAuthenticated) {
            const checkForRefreshedAuth = async () => {
              try {
                const response = await authApi.getCurrentUser();
                if (response.user) {
                  console.log('[AuthProvider] 🔄 Found refreshed session, hydrating store');
                  setUser(response.user);
                }
              } catch {
                // Session is invalid, clear persisted state
                console.log('[AuthProvider] ℹ️ No active session found, clearing store');
                clearUser();
              }
            };

            checkForRefreshedAuth();
          } else {
            console.log('[AuthProvider] ℹ️ No authenticated user in persisted state');
          }
        } catch {
          console.error('[AuthProvider] Failed to parse persisted state');
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // PRIORITY 2: Smart revalidation on visibility change
  // Only check auth when user returns after 10+ minutes
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const lastCheck = sessionStorage.getItem('lastAuthCheck');
        const now = Date.now();

        // Only revalidate if 10+ minutes passed since last check
        if (!lastCheck || now - parseInt(lastCheck) > 10 * 60 * 1000) {
          console.log('[AuthProvider] 🔍 Revalidating auth after inactivity');

          try {
            const response = await authApi.getCurrentUser();
            setUser(response.user);
            sessionStorage.setItem('lastAuthCheck', now.toString());
            console.log('[AuthProvider] ✅ Auth still valid');
          } catch {
            console.log('[AuthProvider] ❌ Session expired, logging out');
            clearUser();

            // Only redirect if on protected route
            if (ROUTE_CONFIG.protected.some(route =>
              pathname === route || pathname.startsWith(`${route}/`))) {
              router.push('/login');
            }
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, pathname, router, setUser, clearUser]);

  // ============================================
  // PRIORITY 3: Revalidate only on sensitive routes
  // Skip if already checked recently
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) return;

    const sensitiveRoutes = ['/account', '/orders', '/checkout'];
    const isSensitiveRoute = sensitiveRoutes.some(route =>
      pathname.startsWith(route)
    );

    if (!isSensitiveRoute) return;

    const revalidateAuth = async () => {
      const lastCheck = sessionStorage.getItem('lastAuthCheck');
      const now = Date.now();

      // Skip if checked within last 2 minutes
      if (lastCheck && now - parseInt(lastCheck) < 2 * 60 * 1000) {
        console.log('[AuthProvider] ⏭️ Skipping revalidation (recent check)');
        return;
      }

      console.log('[AuthProvider] 🔐 Revalidating auth for sensitive route:', pathname);

      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
        sessionStorage.setItem('lastAuthCheck', now.toString());
      } catch {
        console.log('[AuthProvider] ❌ Auth failed on sensitive route');
        clearUser();
        router.push('/login');
      }
    };

    revalidateAuth();
  }, [pathname, isAuthenticated, setUser, clearUser, router]);

  return <>{children}</>;
}