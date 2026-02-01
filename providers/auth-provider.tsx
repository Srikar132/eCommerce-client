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
        
        try {
          const response = await authApi.getCurrentUser();
          
          if (response?.user) {
            setUser(response.user);
          } else {
            setUser(null);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            setUser(null);
          } else {
            setUser(null);
          }
        }
        
      } catch (error) {
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
