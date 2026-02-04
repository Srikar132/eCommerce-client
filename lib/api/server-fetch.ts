"use server";

import type { ProductResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Fetch best sellers from backend
 * Server-side only function with cookie forwarding
 */
  
/**
 * Fetch product recommendations
 * Server-side only function for personalized recommendations
 * 
 * @param excludeProductSlug - Product slug to exclude (useful on product pages)
 * @param category - Filter by category slug
 * @param limit - Number of recommendations (default: 10)
 */
export async function fetchRecommendations(params?: {
  excludeProductSlug?: string;
  category?: string;
  limit?: number;
}): Promise<ProductResponse[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.excludeProductSlug) {
      searchParams.append('excludeProductSlug', params.excludeProductSlug);
    }
    if (params?.category) {
      searchParams.append('category', params.category);
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const url = `${API_BASE_URL}/api/v1/products/recommendations?${searchParams.toString()}`;
    const response = await fetch(url, {
      cache: 'no-store', // Don't cache personalized recommendations
    });

    if (!response.ok) {
      console.error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}
