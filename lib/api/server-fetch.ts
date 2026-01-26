import type { ProductResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Fetch best sellers from backend
 * Server-side only function with cookie forwarding
 */
export async function fetchBestSellers(): Promise<ProductResponse[]> {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/products/best-sellers?limit=4`);

    if (!response.ok) {
      console.error(`Failed to fetch best sellers: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}
