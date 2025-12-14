"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { authApi } from "@/lib/api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: any; // Pass from server
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { setUser, clearUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Hydrate store with server data on mount
    if (initialUser) {
      setUser(initialUser);
    } else {
      clearUser();
    }
  }, [initialUser, setUser, clearUser]);

  // Optional: Revalidate auth on route changes
  useEffect(() => {
    const revalidateAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        clearUser();
      }
    };

    // Only revalidate on specific routes if needed
    if (pathname.startsWith('/account') || pathname.startsWith('/orders')) {
      revalidateAuth();
    }
  }, [pathname]);

  return <>{children}</>;
}