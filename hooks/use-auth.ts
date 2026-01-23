"use client";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoginRequest, RegisterRequest } from "@/types";
import { clearAuthCookies } from "@/lib/auth/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      
      // Tokens are in HTTP-only cookies, just store user
      setUser(response.user);
      
      console.log('[Auth] Registration successful:', response.user);

      toast.success("Registration Successful!", {
        description: `Verification email sent to ${data.email}. Please check your inbox.`,
        duration: 8000,
      });

      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error; // Re-throw to let form handle it
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      
      // Tokens are in HTTP-only cookies, just store user
      setUser(response.user);
      
      console.log('[Auth] Login successful, user stored:', response.user);
      
      // Wait for next tick to ensure Zustand store is fully updated
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Use replace instead of push to avoid back button issues
      router.replace("/");
      
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      throw error; // Re-throw to let form handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      console.log('[Auth] Starting logout process...');
      
      // Call logout API and WAIT for it to complete
      await authApi.logout();
      
      console.log('[Auth] ✅ Backend logout successful');
    } catch (error: unknown) {
      console.error('[Auth] ❌ Backend logout failed:', error);
      // Continue with client-side cleanup even if backend fails
    }
    
    try {
      // Clear Zustand state
      clearUser();

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('cart-storage');
        
        // Clear any other app-specific storage
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
        
        // Clear session storage
        sessionStorage.clear();
      }

      // Clear cookies as backup
      clearAuthCookies();

      console.log('[Auth] ✅ Client-side cleanup complete');
      
      // Hard navigation to clear all client state
      // Using window.location ensures complete state reset
      window.location.href = '/login';
    } catch (cleanupError) {
      console.error('[Auth] ❌ Cleanup failed:', cleanupError);
      
      // Force navigation even if cleanup fails
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      console.log('[Auth] Checking current auth status...');
      const response = await authApi.getCurrentUser();
      setUser(response.user);
      console.log('[Auth] ✅ Auth check successful:', response.user);
      return true;
    } catch {
      console.log('[Auth] ❌ Auth check failed, clearing user');
      clearUser();
      return false;
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyEmail(token);
      toast.success("Email verified successfully!", {
        description: "You can now login to your account.",
      });
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Email verification failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      toast.success("Password reset email sent!", {
        description: `Check your inbox at ${email}`,
      });
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Failed to send reset email";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.resetPassword(token, newPassword);
      toast.success("Password reset successful!", {
        description: "You can now login with your new password.",
      });
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Failed to reset password";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.resendVerification(email);
      toast.success("Verification email sent!", {
        description: `Check your inbox at ${email}`,
      });
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Failed to send verification email";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    checkAuth,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
  };
};