import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

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

// Endpoints that should NOT trigger token refresh
const NO_REFRESH_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/verify-email',
  '/api/v1/auth/resend-verification',
];

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return false;
  return NO_REFRESH_ENDPOINTS.some(endpoint => url.includes(endpoint));
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
      // Skip refresh for specific auth endpoints (login, register, etc.)
      if (shouldSkipRefresh(originalRequest.url)) {
        console.log('[API] Skipping refresh for:', originalRequest.url);
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
        await apiClient.post('/api/v1/auth/refresh');

        console.log('[API] ✅ Token refresh successful');
        processQueue(null);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[API] ❌ Token refresh failed:', refreshError);
        processQueue(refreshError as Error);

        // Clear auth and redirect to login
        if (typeof window !== 'undefined') {
          // Clear client-side state
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();

          toast.error('Session Expired', {
            description: 'Please log in again',
          });

          // ✅ FIX: Prevent redirect loop - only redirect if not already on auth pages
          const currentPath = window.location.pathname;
          const authPages = ['/login', '/register', '/forgot-password' , '/verify-email' , '/reset-password'];
          const isOnAuthPage = authPages.some(page => currentPath.startsWith(page));

          if (!isOnAuthPage) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 500);
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