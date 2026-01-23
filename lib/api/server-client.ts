"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Backend error response structure
 */
interface BackendErrorResponse {
  status: number;
  message: string;
  errorCode: string;
  timestamp: string;
  success: boolean;
  details?: Record<string, string>;
}

/**
 * Server-side API client for Next.js Server Components
 * Automatically forwards cookies from the incoming request
 */
export async function getServerApiClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    // Don't use withCredentials on server (it's for browsers)
    withCredentials: false,
  });
}

/**
 * Make an authenticated GET request from server component
 */
export async function serverGet<T>(url: string): Promise<T> {
  try {
    const client = await getServerApiClient();
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(`[Server API] Error fetching ${url}:`, {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      errorCode: axiosError.response?.data?.errorCode,
    });
    // Re-throw with backend error message if available
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw error;
  }
}

/**
 * Make an authenticated POST request from server component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function serverPost<T>(url: string, data?: any): Promise<T> {
  try {
    const client = await getServerApiClient();
    const response = await client.post(url, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(`[Server API] Error posting to ${url}:`, {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      errorCode: axiosError.response?.data?.errorCode,
    });
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw error;
  }
}

/**
 * Make an authenticated PUT request from server component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function serverPut<T>(url: string, data?: any): Promise<T> {
  try {
    const client = await getServerApiClient();
    const response = await client.put(url, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(`[Server API] Error putting to ${url}:`, {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      errorCode: axiosError.response?.data?.errorCode,
    });
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw error;
  }
}

/**
 * Make an authenticated DELETE request from server component
 */
export async function serverDelete<T>(url: string): Promise<T> {
  try {
    const client = await getServerApiClient();
    const response = await client.delete(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(`[Server API] Error deleting ${url}:`, {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      errorCode: axiosError.response?.data?.errorCode,
    });
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw error;
  }
}
