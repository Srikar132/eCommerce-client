'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SendOtpRequest, VerifyOtpRequest } from '@/types';
import { useState } from 'react';

/**
 * Enhanced Auth Hook
 * 
 * Provides authentication methods and state
 * Handles all auth operations with proper error handling
 */
export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, logout: clearAuth } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Send OTP to phone number
   */
  const sendOtp = async (data: SendOtpRequest) => {
    setIsProcessing(true);
    try {
      const response = await authApi.sendOtp(data);
      toast.success(response.message || 'OTP sent successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Verify OTP and login
   */
  const verifyOtp = async (data: VerifyOtpRequest) => {
    setIsProcessing(true);
    try {
      const response = await authApi.verifyOtp(data);
      
      if (response.user) {
        setUser(response.user);
        toast.success(response.message || 'Login successful');
        
        // Check for redirect parameter
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        
        router.push(redirect);
        return response;
      }
      
      throw new Error('No user data received');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setIsProcessing(true);
    try {
      await authApi.logout();
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      console.error('[Auth] Logout error:', error);
      // Clear local state even if API fails
      clearAuth();
      router.push('/login');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response?.user) {
        setUser(response.user);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('[Auth] Refresh user failed:', error);
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isProcessing,
    sendOtp,
    verifyOtp,
    logout,
    refreshUser,
  };
}
