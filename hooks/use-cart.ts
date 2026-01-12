"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  useCart,
  useCartSummary,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useMergeGuestCart,
  useCartItemCount,
  useCartTotal,
  useIsCartEmpty,
  useIsInCart,
  useCartItemQuantity,
} from "@/lib/tanstack/queries/cart.queries";
import { AddToCartRequest, UUID } from "@/types";
import { toast } from "sonner";

/**
 * useCartManager Hook
 * 
 * Centralized hook for managing shopping cart operations.
 * Automatically handles both authenticated users and guest sessions.
 * Merges guest cart on login.
 * 
 * Features:
 * - Add items to cart (with variant & customization support)
 * - Update item quantities
 * - Remove items
 * - Clear entire cart
 * - Auto-merge guest cart on login
 * - Cart summary for header/badges
 * - Helper functions (isEmpty, isInCart, etc.)
 * 
 * @example
 * ```tsx
 * const cart = useCartManager();
 * 
 * // Add to cart
 * cart.addItem({
 *   productId: 'uuid',
 *   productVariantId: 'uuid',
 *   quantity: 1
 * });
 * 
 * // Update quantity
 * cart.updateQuantity('item-id', 3);
 * 
 * // Check if item is in cart
 * const inCart = cart.isInCart(productId, variantId);
 * ```
 */
export const useCartManager = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Queries
  const cartQuery = useCart();
  const summaryQuery = useCartSummary();

  // Mutations
  const addToCartMutation = useAddToCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const mergeCartMutation = useMergeGuestCart();

  // Helper hooks
  const itemCount = useCartItemCount();
  const total = useCartTotal();
  const isEmpty = useIsCartEmpty();

  /**
   * Auto-merge guest cart when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if there was a guest session before login
      const hadGuestSession = typeof window !== "undefined" && 
        localStorage.getItem("had-guest-cart") === "true";

      if (hadGuestSession) {
        // Merge guest cart into user cart
        mergeCartMutation.mutate(undefined, {
          onSuccess: () => {
            // Clear the flag
            localStorage.removeItem("had-guest-cart");
            console.log("Guest cart merged successfully");
          },
        });
      }
    }
  }, [isAuthenticated, user]);

  /**
   * Track guest cart existence
   */
  useEffect(() => {
    if (!isAuthenticated && cartQuery.data && cartQuery.data?.items?.length > 0) {
      localStorage.setItem("had-guest-cart", "true");
    }
  }, [isAuthenticated, cartQuery.data]);

  /**
   * Add item to cart
   */
  const addItem = useCallback(
    async (request: AddToCartRequest) => {
      try {
        await addToCartMutation.mutateAsync(request);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        throw error;
      }
    },
    [addToCartMutation]
  );

  /**
   * Add item to cart with customization
   */
  const addCustomizedItem = useCallback(
    async (
      productId: UUID,
      variantId: UUID,
      customizationId: UUID,
      quantity: number = 1,
      customizationSummary?: string
    ) => {
      return addItem({
        productId,
        productVariantId: variantId,
        customizationId,
        quantity,
        customizationSummary,
      });
    },
    [addItem]
  );

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback(
    async (itemId: UUID, quantity: number) => {
      if (quantity < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      if (quantity > 100) {
        toast.error("Quantity cannot exceed 100");
        return;
      }

      try {
        await updateItemMutation.mutateAsync({ itemId, quantity });
      } catch (error) {
        console.error("Failed to update cart item:", error);
        throw error;
      }
    },
    [updateItemMutation]
  );

  /**
   * Increment item quantity
   */
  const incrementQuantity = useCallback(
    async (itemId: UUID) => {
      const item = cartQuery.data?.items.find((i) => i.id === itemId);
      if (item) {
        await updateQuantity(itemId, item.quantity + 1);
      }
    },
    [cartQuery.data, updateQuantity]
  );

  /**
   * Decrement item quantity
   */
  const decrementQuantity = useCallback(
    async (itemId: UUID) => {
      const item = cartQuery.data?.items.find((i) => i.id === itemId);
      if (item) {
        if (item.quantity === 1) {
          // Remove item if quantity would become 0
          await removeItemMutation.mutateAsync(itemId);
        } else {
          await updateQuantity(itemId, item.quantity - 1);
        }
      }
    },
    [cartQuery.data, updateQuantity, removeItemMutation]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (itemId: UUID) => {
      try {
        await removeItemMutation.mutateAsync(itemId);
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
        throw error;
      }
    },
    [removeItemMutation]
  );

  /**
   * Clear entire cart
   */
  const clear = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }, [clearCartMutation]);

  /**
   * Refresh cart data
   */
  const refresh = useCallback(() => {
    cartQuery.refetch();
    summaryQuery.refetch();
  }, [cartQuery, summaryQuery]);

  /**
   * Check if specific product/variant is in cart
   */
  const isInCart = useCallback(
    (productId: UUID, variantId?: UUID) => {
      return useIsInCart(productId, variantId);
    },
    [cartQuery.data]
  );

  /**
   * Get quantity of specific product/variant in cart
   */
  const getItemQuantity = useCallback(
    (productId: UUID, variantId?: UUID) => {
      return useCartItemQuantity(productId, variantId);
    },
    [cartQuery.data]
  );

  return {
    // Data
    cart: cartQuery.data,
    summary: summaryQuery.data,
    items: cartQuery.data?.items ?? [],
    itemCount,
    total,
    isEmpty,
    isAuthenticated,

    // Loading states
    isLoading: cartQuery.isLoading,
    isSummaryLoading: summaryQuery.isLoading,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isMerging: mergeCartMutation.isPending,

    // Actions
    addItem,
    addCustomizedItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clear,
    refresh,

    // Helper functions
    isInCart,
    getItemQuantity,

    // Raw queries (for advanced use)
    queries: {
      cart: cartQuery,
      summary: summaryQuery,
    },

    // Mutations (for advanced use)
    mutations: {
      addToCart: addToCartMutation,
      updateItem: updateItemMutation,
      removeItem: removeItemMutation,
      clearCart: clearCartMutation,
      mergeCart: mergeCartMutation,
    },
  };
};

/**
 * useCartItemById Hook
 * 
 * Get a specific cart item by its ID
 * 
 * @example
 * ```tsx
 * const item = useCartItemById('item-uuid');
 * ```
 */
export const useCartItemById = (itemId: UUID) => {
  const { cart } = useCartManager();
  return cart?.items.find((item) => item.id === itemId);
};

/**
 * useCartItemsByProduct Hook
 * 
 * Get all cart items for a specific product
 * 
 * @example
 * ```tsx
 * const items = useCartItemsByProduct(productId);
 * ```
 */
export const useCartItemsByProduct = (productId: UUID) => {
  const { cart } = useCartManager();
  return cart?.items.filter((item) => item.product.id === productId) ?? [];
};

/**
 * useCartSubtotal Hook
 * 
 * Get cart subtotal (before tax and discounts)
 * 
 * @example
 * ```tsx
 * const subtotal = useCartSubtotal();
 * ```
 */
export const useCartSubtotal = () => {
  const { cart } = useCartManager();
  return cart?.subtotal ?? 0;
};

/**
 * useHasCustomizedItems Hook
 * 
 * Check if cart contains any customized items
 * 
 * @example
 * ```tsx
 * const hasCustomized = useHasCustomizedItems();
 * ```
 */
export const useHasCustomizedItems = () => {
  const { cart } = useCartManager();
  return cart?.items.some((item) => item.customization !== null) ?? false;
};
