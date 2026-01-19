import { AxiosError } from "axios";

/**
 * Backend error response structure from GlobalExceptionHandler
 */
export interface BackendErrorResponse {
  status: number;
  message: string;
  errorCode: string;
  timestamp: string;
  success: boolean;
  details?: Record<string, string>; // For validation errors
}

/**
 * Extract user-friendly error message from backend error response
 * Handles both standard errors and validation errors
 */
export function getErrorMessage(error: unknown): string {
  // Handle Axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      
      // If there are validation details, format them
      if (errorData.details && Object.keys(errorData.details).length > 0) {
        const validationErrors = Object.entries(errorData.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        return `${errorData.message} - ${validationErrors}`;
      }
      
      // Return the backend's custom message
      return errorData.message || "An error occurred";
    }
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown errors
  return "An unexpected error occurred";
}

/**
 * Extract validation errors from backend response
 * Returns a map of field names to error messages
 */
export function getValidationErrors(error: unknown): Record<string, string> | null {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    return axiosError.response?.data?.details || null;
  }
  return null;
}

/**
 * Check if error is a specific error code from backend
 */
export function isErrorCode(error: unknown, code: string): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    return axiosError.response?.data?.errorCode === code;
  }
  return false;
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    return axiosError.response?.status || null;
  }
  return null;
}
