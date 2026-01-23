"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { localCartManager } from "@/lib/utils/local-cart";
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/lib/tanstack/queries/cart.queries";
import type { AddToCartRequest, UUID } from "@/types";
import { toast } from "sonner";

/**
 * Extended request for adding items to cart
 * Includes additional data needed for guest cart storage
 */
export interface AddToCartRequestExtended extends AddToCartRequest {
  // Product info
  productSlug: string;
  productName: string;
  
  // Variant info  
  variantSize: string;
  variantColor: string;
  variantImageUrl: string;
  
  // Pricing
  basePrice: number;
  variantPrice: number;
  
  // Customization (optional)
  customizationData?: {
    designId: UUID;
    designPrice: number;
    threadColorHex: string;
    additionalNotes?: string;
  };
}

/**
 * Unified cart interface that abstracts backend vs local cart
 */
export function useCartManager() {
  const { isAuthenticated } = useAuthStore();

  const backendCart = useCart(isAuthenticated);
  const addToCartMutation = useAddToCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const items = isAuthenticated 
    ? backendCart.data?.items ?? [] 
    : localCartManager.getCart().items;

  const itemCount = isAuthenticated
    ? backendCart.data?.totalItems ?? 0
    : localCartManager.getItemCount();

  const total = isAuthenticated 
    ? backendCart.data?.total ?? 0 
    : 0;

  const isEmpty = isAuthenticated
    ? (backendCart.data?.items.length ?? 0) === 0
    : localCartManager.isEmpty();

  const isLoading = isAuthenticated && backendCart.isLoading;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Add item to cart (handles both authenticated and guest users)
   */
  const addItem = useCallback(
    async (request: AddToCartRequestExtended) => {
      if (isAuthenticated) {
        await addToCartMutation.mutateAsync(request);
        toast.success("Added to cart!");
      } else {
        localCartManager.addItem({
          productId: request.productId,
          productSlug: request.productSlug,
          productName: request.productName,
          variantId: request.productVariantId!,
          variantSize: request.variantSize,
          variantColor: request.variantColor,
          variantImageUrl: request.variantImageUrl,
          basePrice: request.basePrice,
          variantPrice: request.variantPrice,
          quantity: request.quantity,
          customizationData: request.customizationData,
        });
        
        toast.success("Added to cart!", {
          description: `${request.quantity} item${request.quantity > 1 ? "s" : ""} added`,
          action: {
            label: "View Cart",
            onClick: () => (window.location.href = "/cart"),
          },
        });
      }
    },
    [isAuthenticated, addToCartMutation]
  );

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback(
    async (itemIdentifier: CartItemIdentifier, quantity: number) => {
      if (quantity < 1 || quantity > 100) {
        toast.error("Quantity must be between 1 and 100");
        return;
      }

      if (isAuthenticated) {
        await updateItemMutation.mutateAsync({ 
          itemId: itemIdentifier.itemId!, 
          quantity 
        });
        toast.success("Cart updated");
      } else {
        localCartManager.updateItem(
          itemIdentifier.productId,
          itemIdentifier.variantId,
          quantity,
          itemIdentifier.designId,
          itemIdentifier.threadColorHex
        );
        toast.success("Cart updated");
      }
    },
    [isAuthenticated, updateItemMutation]
  );

  /**
   * Increment item quantity
   */
  const incrementQuantity = useCallback(
    async (itemIdentifier: CartItemIdentifier) => {
      const currentQty = getItemQuantity(itemIdentifier);
      await updateQuantity(itemIdentifier, currentQty + 1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateQuantity]
  );

  /**
   * Decrement item quantity (removes if quantity becomes 0)
   */
  const decrementQuantity = useCallback(
    async (itemIdentifier: CartItemIdentifier) => {
      const currentQty = getItemQuantity(itemIdentifier);
      
      if (currentQty === 1) {
        await removeItem(itemIdentifier);
      } else {
        await updateQuantity(itemIdentifier, currentQty - 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateQuantity]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (itemIdentifier: CartItemIdentifier) => {
      if (isAuthenticated) {
        await removeItemMutation.mutateAsync(itemIdentifier.itemId!);
        toast.success("Item removed");
      } else {
        localCartManager.removeItem(
          itemIdentifier.productId,
          itemIdentifier.variantId,
          itemIdentifier.designId,
          itemIdentifier.threadColorHex
        );
        toast.success("Item removed");
      }
    },
    [isAuthenticated, removeItemMutation]
  );

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await clearCartMutation.mutateAsync();
    } else {
      localCartManager.clear();
    }
    toast.success("Cart cleared");
  }, [isAuthenticated, clearCartMutation]);

  /**
   * Refresh cart data
   */
  const refresh = useCallback(() => {
    if (isAuthenticated) {
      backendCart.refetch();
    }
  }, [isAuthenticated, backendCart]);

  /**
   * Check if item is in cart
   */
  const isInCart = useCallback(
    (itemIdentifier: CartItemIdentifier): boolean => {
      if (isAuthenticated) {
        return backendCart.data?.items.some(item => {
          const productMatch = item.product.id === itemIdentifier.productId;
          const variantMatch = item.variant?.id === itemIdentifier.variantId;
          
          // For customized items, match by properties (design, threadColor, message)
          // This allows detecting existing customizations even if they haven't been saved yet
          if (itemIdentifier.designId) {
            const customization = item.customization;
            if (!customization) return false;
            
            const designMatch = customization.designId === itemIdentifier.designId;
            const threadColorMatch = customization.threadColorHex === itemIdentifier.threadColorHex;

            
            return productMatch && variantMatch && designMatch && threadColorMatch;
          }
          
          // For non-customized items, just check product and variant
          const customizationMatch = !item.customization;
          
          return productMatch && variantMatch && customizationMatch;
        }) ?? false;
      } else {
        return localCartManager.hasItem(
          itemIdentifier.productId,
          itemIdentifier.variantId,
          itemIdentifier.designId,
          itemIdentifier.threadColorHex
        );
      }
    },
    [isAuthenticated, backendCart.data]
  );

  /**
   * Get quantity of specific item
   */
  const getItemQuantity = useCallback(
    (itemIdentifier: CartItemIdentifier): number => {
      if (isAuthenticated) {
        const item = backendCart.data?.items.find(item => {
          const productMatch = item.product.id === itemIdentifier.productId;
          const variantMatch = item.variant?.id === itemIdentifier.variantId;
          
          // For customized items, match by properties (design, threadColor)
          if (itemIdentifier.designId && itemIdentifier.threadColorHex) {
            const customization = item.customization;
            if (!customization) return false;
            
            const designMatch = customization.designId === itemIdentifier.designId;
            const threadColorMatch = customization.threadColorHex === itemIdentifier.threadColorHex;
            
            return productMatch && variantMatch && designMatch && threadColorMatch;
          }
          
          // For non-customized items, just check product and variant
          const customizationMatch = !item.customization;
          
          return productMatch && variantMatch && customizationMatch;
        });
        
        return item?.quantity ?? 0;
      } else {
        return localCartManager.getItemQuantity(
          itemIdentifier.productId,
          itemIdentifier.variantId,
          itemIdentifier.designId,
          itemIdentifier.threadColorHex
        );
      }
    },
    [isAuthenticated, backendCart.data]
  );

  return {
    // State
    items,
    itemCount,
    total,
    isEmpty,
    isAuthenticated,
    isLoading,

    // Mutation states
    isAdding: addToCartMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,

    // Actions
    addItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    refresh,

    // Queries
    isInCart,
    getItemQuantity,
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface CartItemIdentifier {
  itemId?: UUID;
  productId: UUID;
  variantId: UUID;
  designId?: UUID;
  threadColorHex?: string;
  additionalNotes?: string;
}

export function createItemIdentifier(item: Record<string, unknown>): CartItemIdentifier {
  const product = item.product as { id: UUID };
  const variant = item.variant as { id: UUID };
  const customization = item.customization as { designId?: UUID; threadColorHex?: string; additionalNotes?: string } | undefined;
  
  return {
    itemId: item.id as UUID,
    productId: product.id,
    variantId: variant.id,
    designId: customization?.designId,
    threadColorHex: customization?.threadColorHex,
    additionalNotes: customization?.additionalNotes,
  };
}