'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { authApi } from '@/lib/api/auth';

/**
 * Auth Provider Component
 * 
 * Initializes authentication state on app load.
 * Always checks auth status to maintain state (cart count, wishlist, etc.)
 * but doesn't force redirects - let middleware/page guards handle that.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    // Only initialize once per session
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Always try to get current user to maintain auth state
        // This keeps cart count, wishlist, and other user data in sync
        console.log('[Auth] Checking authentication status...');
        
        try {
          const response = await authApi.getCurrentUser();
          
          if (response?.user) {
            console.log('[Auth] ✅ User authenticated:', response.user.username);
            setUser(response.user);
          } else {
            console.log('[Auth] ❌ No user found');
            setUser(null);
          }
        } catch (error: any) {
          // If 401, user is not authenticated - this is normal for guest users
          if (error.response?.status === 401) {
            console.log('[Auth] User not authenticated (guest mode)');
            setUser(null);
          } else {
            // Other errors (network, server issues)
            console.error('[Auth] Failed to check auth status:', error);
            setUser(null);
          }
        }
        
      } catch (error) {
        console.error('[Auth] Initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
