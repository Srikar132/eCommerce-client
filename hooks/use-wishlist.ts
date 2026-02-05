"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
} from "@/lib/actions/wishlist-actions";
import { WishlistResponse } from "@/types/wishlist";
import { Product } from "@/types/product";

/**
 * Custom hook for wishlist management with authentication and optimistic updates
 */
export function useWishlist() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const userId = session?.user?.id;

    // Query: Get wishlist data
    const { data: wishlist, isLoading } = useQuery<WishlistResponse>({
        queryKey: ["wishlist", userId],
        queryFn: () => (userId ? getWishlist(userId) : Promise.resolve({ items: [], totalItems: 0 })),
        enabled: status === "authenticated" && !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Mutation: Add item to wishlist
    const addItem = useMutation({
        mutationFn: async (productId: string) => {
            // Check authentication
            if (!userId) {
                const redirectUrl = `${pathname}`;
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                throw new Error("Please log in to add items to wishlist");
            }

            return addToWishlist(userId, productId);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["wishlist", userId], data);
            toast.success("Added to wishlist");
        },
        onError: (error: Error) => {
            if (!error.message.includes("log in")) {
                toast.error(error.message || "Failed to add to wishlist");
            }
        },
    });

    // Mutation: Remove item from wishlist
    const removeItem = useMutation({
        mutationFn: async (productId: string) => {
            if (!userId) throw new Error("Authentication required");
            return removeFromWishlist(userId, productId);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["wishlist", userId], data);
            toast.success("Removed from wishlist");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove from wishlist");
        },
    });

    // Mutation: Toggle wishlist (add/remove)
    const toggleItem = useMutation({
        mutationFn: async (productId: string) => {
            // Check authentication
            if (!userId) {
                const redirectUrl = `${pathname}`;
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                throw new Error("Please log in to manage wishlist");
            }

            return toggleWishlist(userId, productId);
        },
        onSuccess: (response) => {
            // Refetch wishlist to get updated data
            queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
            toast.success(response.message);
        },
        onError: (error: Error) => {
            if (!error.message.includes("log in")) {
                toast.error(error.message || "Failed to update wishlist");
            }
        },
    });

    // Mutation: Clear wishlist
    const clearWishlistMutation = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error("Authentication required");
            return clearWishlist(userId);
        },
        onSuccess: () => {
            queryClient.setQueryData(["wishlist", userId], {
                items: [],
                totalItems: 0,
            });
            toast.success("Wishlist cleared");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear wishlist");
        },
    });

    // Helper: Check if product is in wishlist
    const isInWishlist = (productId: string): boolean => {
        if (!wishlist?.items) return false;
        return wishlist.items.some((item: Product) => item.id === productId);
    };

    return {
        // Data
        wishlist: wishlist || null,
        items: wishlist?.items || [],
        totalItems: wishlist?.totalItems || 0,
        
        // Loading states
        isLoading,
        isAddingItem: addItem.isPending,
        isRemovingItem: removeItem.isPending,
        isTogglingItem: toggleItem.isPending,
        isClearingWishlist: clearWishlistMutation.isPending,
        
        // Actions
        addItem: addItem.mutate,
        removeItem: removeItem.mutate,
        toggleItem: toggleItem.mutate,
        clearWishlist: clearWishlistMutation.mutate,
        
        // Helpers
        isInWishlist,
        
        // Authentication
        isAuthenticated: status === "authenticated",
    };
}
