/**
 * Cart Queries Layer
 * 
 * Reusable hooks for cart-related data fetching and mutations.
 * Automatically handles both authenticated users and guest sessions.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { queryKeys } from "../query-keys";
import { toast } from "sonner";
import type {
  Cart,
  AddToCartRequest,
  UUID,
} from "@/types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get the current cart (authenticated user or guest)
 * 
 * Used in:
 * - Cart page - Display cart contents
 * - Checkout page - Load items for checkout
 * 
 * @param enabled - Whether the query should execute (default: true)
 * 
 * @example
 * ```tsx
 * const { data: cart, isLoading } = useCart(isAuthenticated);
 * ```
 */
export const useCart = (enabled: boolean = true) => {
  return useQuery<Cart>({
    queryKey: queryKeys.cart.current(),
    queryFn: () => cartApi.getCart(),
    enabled, // Only fetch when enabled (i.e., user is authenticated)
    staleTime: 1000 * 30, // 30 seconds (cart changes frequently)
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
};


// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Add item to cart
 * 
 * Automatically invalidates cart queries and shows toast notification
 * 
 * @example
 * ```tsx
 * const addToCart = useAddToCart();
 * 
 * addToCart.mutate({
 *   productId: 'uuid',
 *   productVariantId: 'uuid',
 *   quantity: 1,
 *   customizationId: 'custom-123' // Optional
 * });
 * ```
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, AddToCartRequest>({
    mutationFn: (data: AddToCartRequest) => cartApi.addToCart(data),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all() });
    },
    onSuccess: (cart, variables) => {


      // Update cache with new cart data
      queryClient.setQueryData(queryKeys.cart.current(), cart);
      
      // Update summary cache
      queryClient.setQueryData(queryKeys.cart.summary(), {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        taxAmount: cart.taxAmount,
        total: cart.total,
      });

      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error("Failed to add to cart", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });
};

/**
 * Update cart item quantity
 * 
 * @example
 * ```tsx
 * const updateCartItem = useUpdateCartItem();
 * 
 * updateCartItem.mutate({
 *   itemId: 'uuid',
 *   quantity: 3
 * });
 * ```
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { itemId: UUID; quantity: number }>({
    mutationFn: ({ itemId, quantity }) =>
      cartApi.updateCartItem(itemId, { quantity }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all() });
    },
    onSuccess: (cart) => {
      // Update cache
      queryClient.setQueryData(queryKeys.cart.current(), cart);
      
      // Update summary
      queryClient.setQueryData(queryKeys.cart.summary(), {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        taxAmount: cart.taxAmount,
        total: cart.total,
      });

    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error("Failed to update cart", {
        description: error?.response?.data?.message || "Please try again.",
      });
      
      // Refetch to get correct state
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
  });
};

/**
 * Remove item from cart
 * 
 * @example
 * ```tsx
 * const removeItem = useRemoveCartItem();
 * 
 * removeItem.mutate('item-uuid');
 * ```
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, UUID>({
    mutationFn: (itemId: UUID) => cartApi.removeCartItem(itemId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all() });
    },
    onSuccess: (cart) => {

      // Update cache
      queryClient.setQueryData(queryKeys.cart.current(), cart);
      
      // Update summary
      queryClient.setQueryData(queryKeys.cart.summary(), {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        taxAmount: cart.taxAmount,
        total: cart.total,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    onError: (error: any) => {
      toast.error("Failed to remove item", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });
};

/**
 * Clear entire cart
 * 
 * @example
 * ```tsx
 * const clearCart = useClearCart();
 * 
 * clearCart.mutate();
 * ```
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, void>({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: (cart) => {

      // Update cache with empty cart
      queryClient.setQueryData(queryKeys.cart.current(), cart);
      
      // Update summary
      queryClient.setQueryData(queryKeys.cart.summary(), {
        totalItems: 0,
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    onError: (error: any) => {
      toast.error("Failed to clear cart", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });
};


/**
 * Sync local cart to backend (for guests logging in)
 * 
 * This syncs localStorage cart items to the backend
 * Backend will save any unsaved customizations and merge items
 * 
 * @example
 * ```tsx
 * const syncCart = useSyncLocalCart();
 * 
 * await syncCart.mutateAsync(localCartItems);
 * ```
 */
export const useSyncLocalCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, any[]>({
    mutationFn: (items) => cartApi.syncLocalCart(items),
    onSuccess: (cart) => {
      // Update cache
      queryClient.setQueryData(queryKeys.cart.current(), cart);
      
      queryClient.setQueryData(queryKeys.cart.summary(), {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        taxAmount: cart.taxAmount,
        total: cart.total,
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
      
      console.log("[Cart] Local cart synced successfully");
    },
    onError: (error: any) => {
      console.error("[Cart] Failed to sync local cart:", error);
      toast.error("Failed to sync cart", {
        description: "Your cart items may not have been saved. Please try again.",
      });
    },
  });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get total item count from cart
 * 
 * @example
 * ```tsx
 * const itemCount = useCartItemCount();
 * // Returns: number
 * ```
 */
export const useCartItemCount = () => {
  const { data: cart } = useCart();
  return cart?.totalItems ?? 0;
};

/**
 * Get cart total price
 * 
 * @example
 * ```tsx
 * const total = useCartTotal();
 * // Returns: number
 * ```
 */
export const useCartTotal = () => {
  const { data: cart } = useCart();
  return cart?.total ?? 0;
};

/**
 * Check if cart is empty
 * 
 * @example
 * ```tsx
 * const isEmpty = useIsCartEmpty();
 * ```
 */
export const useIsCartEmpty = () => {
  const { data: cart } = useCart();
  return !cart || cart?.items?.length === 0;
};

/**
 * Check if a specific product/variant is in cart
 * 
 * @example
 * ```tsx
 * const isInCart = useIsInCart(productId, variantId);
 * ```
 */
export const useIsInCart = (productId?: UUID, variantId?: UUID) => {
  const { data: cart } = useCart();
  
  if (!cart || !productId) return false;
  
  return cart.items.some(item => {
    const productMatch = item.product.id === productId;
    const variantMatch = !variantId || item.variant?.id === variantId;
    return productMatch && variantMatch;
  });
};

/**
 * Get quantity of a specific item in cart
 * 
 * @example
 * ```tsx
 * const quantity = useCartItemQuantity(productId, variantId);
 * ```
 */
export const useCartItemQuantity = (productId?: UUID, variantId?: UUID) => {
  const { data: cart } = useCart();
  
  if (!cart || !productId) return 0;
  
  const item = cart.items.find(item => {
    const productMatch = item.product.id === productId;
    const variantMatch = !variantId || item.variant?.id === variantId;
    return productMatch && variantMatch;
  });
  
  return item?.quantity ?? 0;
};
