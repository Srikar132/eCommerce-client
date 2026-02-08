// ============================================================================
// QUERY HOOKS
// ============================================================================

import {
    addItemToCart,
    clearCart,
    getOrCreateCart,
    removeItemFromCart,
    updateCartItemQuantity,
} from "@/lib/actions/cart-actions";
import { Cart } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "../query-keys";


/**
 * Get user's cart with all items
 */
export const useCart = () => {
    return useQuery<Cart | null>({
        queryKey: queryKeys.cart.details(),
        queryFn: () => getOrCreateCart(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

/**
 * Add item to cart
 */
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    

    return useMutation({
        mutationFn: ({
            productId,
            productVariantId,
            quantity = 1,
        }: {
            productId: string;
            productVariantId: string;
            quantity?: number;
        }) => addItemToCart(productId, productVariantId, quantity),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.cart.details(), data);
            toast.success("Item added to cart");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add item to cart");
        },
    });
};

/**
 * Remove item from cart
 */
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cartItemId: string) => removeItemFromCart(cartItemId),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.cart.details(), data);
            toast.success("Item removed from cart");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove item");
        },
    });
};

/**
 * Update cart item quantity
 */
export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            cartItemId,
            quantity,
        }: {
            cartItemId: string;
            quantity: number;
        }) => updateCartItemQuantity(cartItemId, quantity),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.cart.details(), data);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update quantity");
        },
    });
};

/**
 * Clear all items from cart
 */
export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => clearCart(),
        onSuccess: () => {
            // Invalidate to refetch cart
            queryClient.invalidateQueries({
                queryKey: queryKeys.cart.details(),
            });
            toast.success("Cart cleared");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear cart");
        },
    });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Check if a product variant is in the cart
 * @param productId - Product ID to check
 * @param productVariantId - Product variant ID to check
 * @returns boolean indicating if the item is in cart
 */
export const useIsInCart = (productId: string, productVariantId: string): boolean => {
    const { data: cart } = useCart();

    if (!cart?.items) return false;

    return cart.items.some(
        (item) =>
            item.product.id === productId &&
            item.variant.id === productVariantId
    );
};

/**
 * Get total number of items in cart
 * @returns Total item count
 */
export const useCartCount = (): number => {
    const { data: cart } = useCart();
    return cart?.totalItems || 0;
};

/**
 * Get cart total amount
 * @returns Cart total
 */
export const useCartTotal = (): number => {
    const { data: cart } = useCart();
    return cart?.total || 0;
};

/**
 * Get cart subtotal amount
 * @returns Cart subtotal
 */
export const useCartSubtotal = (): number => {
    const { data: cart } = useCart();
    return cart?.subtotal || 0;
};
