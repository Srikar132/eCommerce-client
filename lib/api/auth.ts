import { User , LoginRequest , AuthResponse , RegisterRequest } from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";




export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/api/v1/auth/login",
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/api/v1/auth/register",
      data
    );
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/api/v1/auth/refresh"
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Use local API route that handles both backend logout and cookie clearing
    await apiClient.post("/api/v1/auth/logout");

    
  },

  // Get current user (verify session)
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.get(
      "/api/v1/auth/me"
    );
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.get(
      `/api/v1/auth/verify-email?token=${token}`
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.post(
      "/api/v1/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.post(
      "/api/v1/auth/reset-password",
      { token, newPassword }
    );
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.post(
      "/api/v1/auth/resend-verification",
      { email }
    );
    return response.data;
  },
};