import { 
  User, 
  SendOtpRequest, 
  SendOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  MessageResponse
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";

/**
 * Phone OTP Based Authentication API
 */
export const authApi = {
  /**
   * Step 1: Send OTP to phone number
   * POST /api/v1/auth/send-otp
   */
  sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    const response: AxiosResponse<SendOtpResponse> = await apiClient.post(
      "/api/v1/auth/send-otp",
      data
    );
    return response.data;
  },

  /**
   * Step 2: Verify OTP and login/register user
   * POST /api/v1/auth/verify-otp
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/api/v1/auth/verify-otp",
      data
    );
    return response.data;
  },

  /**
   * Refresh access token using refresh token from cookie
   * POST /api/v1/auth/refresh
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/api/v1/auth/refresh"
    );
    return response.data;
  },

  /**
   * Logout current user
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<MessageResponse> => {
    const response: AxiosResponse<MessageResponse> = await apiClient.post(
      "/api/v1/auth/logout"
    );
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /api/v1/auth/me
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.get(
      "/api/v1/auth/me"
    );
    return response.data;
  },

  /**
   * Health check endpoint
   * GET /api/v1/auth/health
   */
  health: async (): Promise<MessageResponse> => {
    const response: AxiosResponse<MessageResponse> = await apiClient.get(
      "/api/v1/auth/health"
    );
    return response.data;
  },
};