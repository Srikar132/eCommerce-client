"use client";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoginRequest, RegisterRequest } from "@/types/auth";
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

      toast.success("Registration Successful!", {
        description: `Verification email sent to ${data.email}. Please check your inbox.`,
        duration: 8000,
      });

      return response;
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || "Registration failed";
      toast.error(message);
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
      router.push("/");
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call logout API which handles backend logout and cookie clearing
      await authApi.logout();

      // Clear client state
      clearUser();

      // Clear any remaining client-side cookies as backup
      clearAuthCookies();

      // Force a hard navigation to ensure all client state is cleared
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Logout failed:", error);

      // Always clear user session and cookies on logout attempt
      clearUser();
      clearAuthCookies();

      // Force a hard navigation even on error to ensure cleanup
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
      return true;
    } catch (error) {
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
    } catch (error: any) {
      const message = error?.response?.data?.message || "Email verification failed";
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
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to send reset email";
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
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to reset password";
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
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to send verification email";
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