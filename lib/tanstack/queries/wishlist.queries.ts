// ============================================================================
// QUERY HOOKS
// ============================================================================

import {
    addToWishlist,
    clearWishlist,
    getWishlist,
    removeFromWishlist,
    toggleWishlist,
} from "@/lib/actions/wishlist-actions";
import { WishlistResponse } from "@/types/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "../query-keys";

/**
 * Get user's wishlist with all items
 */
export const useWishlist = ({enabled}: {enabled: boolean}) => {
    return useQuery<WishlistResponse>({
        queryKey: queryKeys.wishlist.all(),
        queryFn: () => getWishlist(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        enabled
    });
};

/**
 * Add item to wishlist
 */
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => addToWishlist(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.wishlist.all(), data);
            toast.success("Added to wishlist");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add to wishlist");
        },
    });
};

/**
 * Remove item from wishlist
 */
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => removeFromWishlist(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.wishlist.all(), data);
            toast.success("Removed from wishlist");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove from wishlist");
        },
    });
};

/**
 * Toggle wishlist (add/remove)
 */
export const useToggleWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => toggleWishlist(productId),
        onSuccess: (response) => {
            // Refetch wishlist to get updated data
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
            toast.success(response.message);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update wishlist");
        },
    });
};

/**
 * Clear all items from wishlist
 */
export const useClearWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => clearWishlist(),
        onSuccess: () => {
            // Invalidate to refetch wishlist
            queryClient.invalidateQueries({
                queryKey: queryKeys.wishlist.all(),
            });
            toast.success("Wishlist cleared");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear wishlist");
        },
    });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Check if a product is in the wishlist
 * @param productId - Product ID to check
 * @returns boolean indicating if the item is in wishlist
 */
export const useIsInWishlist = ({
    productId,
    enabled
}: {
    productId: string;
    enabled: boolean;
}): boolean => {
    const { data: wishlist } = useWishlist({enabled});

    if (!enabled) return false;

    if (!wishlist?.items) return false;

    return wishlist.items.some((item) => item.productId === productId);
};

/**
 * Get total number of items in wishlist
 * @returns Total item count
 */
export const useWishlistCount = ({enabled}: {enabled: boolean}): number => {
    const { data: wishlist } = useWishlist({enabled});
    return enabled ? wishlist?.totalItems || 0 : 0;
};