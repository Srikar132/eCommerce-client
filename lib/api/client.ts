import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Track refresh requests to prevent race conditions
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// print what requesting along with cookies
apiClient.interceptors.request.use((config) => {
  // not entire config , but some information
  const { method, url, headers, data } = config;
  console.log("Requesting:", { method, url, headers, data });
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if ((error.response?.status === 401 || error?.response?.status === 403)&& !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint - cookies are sent automatically
        await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshed("refreshed");

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        
        // Refresh failed - redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/account/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);