/**
 * Wishlist API Client
 * 
 * Handles all wishlist-related API calls for authenticated users.
 * Wishlist is only available for logged-in users.
 */

import { apiClient } from "./client";
import { AxiosResponse } from "axios";

/**
 * Wishlist item structure
 */
export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  sku: string;
  isActive: boolean;
  isCustomizable: boolean;
  primaryImageUrl: string | null;
  categoryName: string | null;
  brandName: string | null;
  addedAt: string;
  inStock: boolean;
}

/**
 * Wishlist response with items and count
 */
export interface WishlistResponse {
  items: WishlistItem[];
  totalItems: number;
}

/**
 * Request to add product to wishlist
 */
export interface AddToWishlistRequest {
  productId: string;
}

/**
 * Check wishlist response
 */
export interface CheckWishlistResponse {
  inWishlist: boolean;
}

/**
 * Wishlist count response
 */
export interface WishlistCountResponse {
  count: number;
}

/**
 * Message response for operations like clear
 */
export interface MessageResponse {
  message: string;
}

export const wishlistApi = {
  /**
   * GET /api/v1/wishlist
   * Retrieves the current user's wishlist
   * 
   * Used in:
   * - Wishlist page - Display all wishlist items
   * - Header - Show wishlist count badge
   * 
   * @returns Complete wishlist with all items
   */
  getWishlist: async (): Promise<WishlistResponse> => {
    const response: AxiosResponse<WishlistResponse> = await apiClient.get(
      "/api/v1/wishlist"
    );
    return response.data;
  },

  /**
   * POST /api/v1/wishlist
   * Adds a product to the user's wishlist
   * 
   * Used in:
   * - Product page - "Add to Wishlist" heart icon
   * - Product cards - Quick add to wishlist
   * 
   * @param request - Product ID to add
   * @returns Updated wishlist
   */
  addToWishlist: async (
    request: AddToWishlistRequest
  ): Promise<WishlistResponse> => {
    const response: AxiosResponse<WishlistResponse> = await apiClient.post(
      "/api/v1/wishlist",
      request
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/wishlist/{productId}
   * Removes a product from the wishlist
   * 
   * Used in:
   * - Wishlist page - Remove button on items
   * - Product page - Toggle wishlist off
   * 
   * @param productId - ID of the product to remove
   * @returns Updated wishlist
   */
  removeFromWishlist: async (productId: string): Promise<WishlistResponse> => {
    const response: AxiosResponse<WishlistResponse> = await apiClient.delete(
      `/api/v1/wishlist/${productId}`
    );
    return response.data;
  },

  /**
   * GET /api/v1/wishlist/check/{productId}
   * Checks if a product is in the user's wishlist
   * 
   * Used in:
   * - Product page - Show filled/unfilled heart icon
   * - Product cards - Display wishlist status
   * 
   * @param productId - Product ID to check
   * @returns Boolean indicating if product is wishlisted
   */
  checkWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
    const response: AxiosResponse<CheckWishlistResponse> = await apiClient.get(
      `/api/v1/wishlist/check/${productId}`
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/wishlist
   * Clears all items from the wishlist
   * 
   * Used in:
   * - Wishlist page - "Clear All" button
   * 
   * @returns Success message
   */
  clearWishlist: async (): Promise<MessageResponse> => {
    const response: AxiosResponse<MessageResponse> = await apiClient.delete(
      "/api/v1/wishlist"
    );
    return response.data;
  },

  /**
   * GET /api/v1/wishlist/count
   * Gets the count of items in wishlist
   * 
   * Used in:
   * - Header - Display count badge
   * - Mobile menu - Show wishlist count
   * 
   * @returns Count of wishlist items
   */
  getWishlistCount: async (): Promise<WishlistCountResponse> => {
    const response: AxiosResponse<WishlistCountResponse> = await apiClient.get(
      "/api/v1/wishlist/count"
    );
    return response.data;
  },
};
