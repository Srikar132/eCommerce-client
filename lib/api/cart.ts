import {
    Cart,
    UUID,
    AddToCartRequest
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";


export interface SyncCartRequest {
    productId: string;
    productVariantId: string;
    quantity: number;
    customizationData?: {
        designId: string;
        threadColorHex: string;
        additionalNotes?: string;
    };
}

/**
 * Cart summary for quick display (header, etc.)
 */
export interface CartSummaryResponse {
    totalItems: number;
    subtotal: number;
    discountAmount?: number;
    taxAmount?: number;
    total: number;
    couponCode?: string | null;
}

/**
 * Request to update cart item quantity
 */
export interface UpdateCartItemRequest {
    quantity: number;
}





export const cartApi = {
    /**
     * GET /api/v1/cart
     * Retrieves the current user's cart (or guest cart based on session)
     * 
     * Used in:
     * - Cart page - Display cart contents
     * - Header - Show cart item count
     * - Checkout page - Load items for checkout
     * 
     * Returns: Complete cart with all items and totals
     */
    getCart: async (): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.get(
            "/api/v1/cart"
        );
        return response.data;
    },

    /**
     * POST /api/v1/cart/items
     * Adds a new item to the cart or updates quantity if item already exists
     * 
     * Used in:
     * - Product page - "Add to Cart" button
     * - Customizer page - "Add to Cart" with customization
     * - Quick add buttons throughout the site
     * 
     * @param request - Item details including product, variant, customization, and quantity
     * @returns Updated cart with the new item
     */
    addToCart: async (request: AddToCartRequest): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.post(
            "/api/v1/cart/items",
            request
        );
        return response.data;
    },

    /**
     * PUT /api/v1/cart/items/{id}
     * Updates the quantity of an existing cart item
     * 
     * Used in:
     * - Cart page - Quantity increment/decrement buttons
     * - Cart page - Manual quantity input
     * 
     * @param itemId - UUID of the cart item to update
     * @param request - New quantity
     * @returns Updated cart with modified item
     */
    updateCartItem: async (itemId: UUID, request: UpdateCartItemRequest): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.put(
            `/api/v1/cart/items/${itemId}`,
            request
        );
        return response.data;
    },

    /**
     * DELETE /api/v1/cart/items/{id}
     * Removes a specific item from the cart
     * 
     * Used in:
     * - Cart page - "Remove" button on cart items
     * 
     * @param itemId - UUID of the cart item to remove
     * @returns Updated cart without the removed item
     */
    removeCartItem: async (itemId: UUID): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.delete(
            `/api/v1/cart/items/${itemId}`
        );
        return response.data;
    },

    /**
     * DELETE /api/v1/cart
     * Clears all items from the cart
     * 
     * Used in:
     * - Cart page - "Clear Cart" button
     * - After successful order - Clear cart post-checkout
     * 
     * @returns Empty cart
     */
    clearCart: async (): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.delete(
            "/api/v1/cart"
        );
        return response.data;
    },

    /**
     * GET /api/v1/cart/summary
     * Gets a lightweight summary of cart for quick display
     * 
     * Used in:
     * - Header navigation - Show cart count and total
     * - Mini cart dropdown - Quick preview
     * - Mobile menu - Cart badge
     * 
     * @returns Cart summary with item count and totals
     */
    getCartSummary: async (): Promise<CartSummaryResponse> => {
        const response: AxiosResponse<CartSummaryResponse> = await apiClient.get(
            "/api/v1/cart/summary"
        );
        return response.data;
    },


    /**
     * POST /api/v1/cart/sync
     * Syncs local cart to backend on login/checkout
     * 
     * Used in:
     * - Login flow - Sync guest's local cart to backend
     * - Checkout flow - Sync cart before checkout
     * 
     * Accepts local cart items (including unsaved customizations)
     * Backend will save customizations and merge items into user cart
     * 
     * @param items - Array of local cart items
     * @returns Synced cart with all items
     */
    syncLocalCart: async (items: SyncCartRequest[]): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.post(
            "/api/v1/cart/sync",
            { items }
        );
        return response.data;
    },
};
