import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { isProtectedRoute, isPublicRoute } from "@/lib/auth/middleware-config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * ⚠️ CLIENT-SIDE API CLIENT ONLY
 * 
 * This client is for browser/client-side requests only.
 * For Server Components, use `server-client.ts` instead to properly forward cookies.
 * 
 * Why? Server-side requests don't have automatic cookie access.
 * Using this client in Server Components will cause 401 errors.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Refresh token management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};




// Request interceptor (optional logging)
apiClient.interceptors.request.use(
  (config) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API]', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with proper refresh logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {

    if (!error.response) {
      console.error('[API] Network error:', error.message);

      if (typeof window !== 'undefined') {
        toast.error('Network Error', {
          description: 'Please check your internet connection',
        });
      }

      return Promise.reject(new Error('Network error'));
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401/403 errors
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry
    ) {

      if (
        originalRequest.url?.includes('/auth/send-otp') ||
        originalRequest.url?.includes('/auth/verify-otp') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refreshing
        console.log('[API] Queueing request while refresh in progress:', originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      console.log('[API] Starting token refresh due to 401/403 on:', originalRequest.url);
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint directly
        await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true, // Sends refreshToken cookie
          }
        );

        console.log('[API] ✅ Token refresh successful');
        processQueue(null);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[API] ❌ Token refresh failed:', refreshError);
        processQueue(refreshError as Error);

        // Clear auth state
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          
          // Clear client-side state
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();

          // Only redirect on protected routes
          // For public routes, just clear state silently (user can continue browsing)
          if (isProtectedRoute(currentPath)) {
            toast.error('Session Expired', {
              description: 'Please log in again',
            });

            // Redirect to login
            setTimeout(() => {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }, 500);
          } else {
            // On public/guest routes, just log - no toast, no redirect
            console.log('[API] Session expired on public route - cleared auth state');
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      if (typeof window !== 'undefined') {
        toast.error('Server Error', {
          description: 'Something went wrong. Please try again later.',
        });
      }
    }

    return Promise.reject(error);
  }
);