'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Client-side authentication guard hook
 * 
 * Use this in client components that need authentication
 * For Server Components, use serverAuthApi.requireAuth() instead
 * 
 * @param redirectTo - Where to redirect if not authenticated (default: '/login')
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized || isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
