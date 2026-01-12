import { 
    Cart, 
    CartSummary,
    AddToCartRequest, 
    UpdateCartItemRequest,
    UUID
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";

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
    getCartSummary: async (): Promise<CartSummary> => {
        const response: AxiosResponse<CartSummary> = await apiClient.get(
            "/api/v1/cart/summary"
        );
        return response.data;
    },

    /**
     * POST /api/v1/cart/merge
     * Merges guest cart into user cart after login
     * 
     * Used in:
     * - Login flow - Automatically merge guest cart after authentication
     * - Registration flow - Merge cart after new user signs up
     * 
     * This is called automatically after login to preserve items
     * added to cart before user authenticated
     * 
     * @returns Merged cart with items from both guest and user carts
     */
    mergeGuestCart: async (): Promise<Cart> => {
        const response: AxiosResponse<Cart> = await apiClient.post(
            "/api/v1/cart/merge"
        );
        return response.data;
    },
};
