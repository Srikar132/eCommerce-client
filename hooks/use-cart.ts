"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
    getOrCreateCart,
} from "@/lib/actions/cart-actions";
import { Cart } from "@/types/cart";

/**
 * Custom hook for cart management with authentication and optimistic updates
 */
export function useCart() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const userId = session?.user?.id;

    // Query: Get cart data
    const { data: cart, isLoading } = useQuery<Cart | null>({
        queryKey: ["cart", userId],
        queryFn: () => (userId ? getOrCreateCart(userId) : Promise.resolve(null)),
        enabled: status === "authenticated" && !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Mutation: Add item to cart
    const addItem = useMutation({
        mutationFn: async ({
            productId,
            productVariantId,
            quantity = 1,
        }: {
            productId: string;
            productVariantId: string;
            quantity?: number;
        }) => {
            // Check authentication
            if (!userId) {
                const redirectUrl = `${pathname}`;
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                throw new Error("Please log in to add items to cart");
            }

            return addItemToCart(userId, productId, productVariantId, quantity);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", userId], data);
            toast.success("Item added to cart");
        },
        onError: (error: Error) => {
            if (!error.message.includes("log in")) {
                toast.error(error.message || "Failed to add item to cart");
            }
        },
    });

    // Mutation: Remove item from cart
    const removeItem = useMutation({
        mutationFn: async (cartItemId: string) => {
            if (!userId) throw new Error("Authentication required");
            return removeItemFromCart(userId, cartItemId);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", userId], data);
            toast.success("Item removed from cart");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove item");
        },
    });

    // Mutation: Update item quantity
    const updateQuantity = useMutation({
        mutationFn: async ({
            cartItemId,
            quantity,
        }: {
            cartItemId: string;
            quantity: number;
        }) => {
            if (!userId) throw new Error("Authentication required");
            return updateCartItemQuantity(userId, cartItemId, quantity);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", userId], data);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update quantity");
        },
    });

    // Mutation: Clear cart
    const clearCartMutation = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error("Authentication required");
            return clearCart(userId);
        },
        onSuccess: () => {
            queryClient.setQueryData(["cart", userId], {
                id: cart?.id || "",
                items: [],
                totalItems: 0,
                subtotal: 0,
                discountAmount: 0,
                total: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            toast.success("Cart cleared");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear cart");
        },
    });

    // Helper: Check if product variant is in cart
    const isInCart = (productId: string, productVariantId: string): boolean => {
        if (!cart?.items) return false;
        
        return cart.items.some(
            (item) => 
                item.product.id === productId && 
                item.variant.id === productVariantId
        );
    };

    return {
        // Data
        cart: cart || null,
        items: cart?.items || [],
        totalItems: cart?.totalItems || 0,
        subtotal: cart?.subtotal || 0,
        total: cart?.total || 0,
        
        // Loading states
        isLoading,
        isAddingItem: addItem.isPending,
        isRemovingItem: removeItem.isPending,
        isUpdatingQuantity: updateQuantity.isPending,
        isClearingCart: clearCartMutation.isPending,
        
        // Actions
        addItem: addItem.mutate,
        removeItem: removeItem.mutate,
        updateQuantity: updateQuantity.mutate,
        clearCart: clearCartMutation.mutate,
        
        // Helpers
        isInCart,


        // Authentication
        isAuthenticated: status === "authenticated",
    };
}
