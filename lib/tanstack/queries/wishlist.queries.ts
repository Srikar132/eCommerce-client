/**
 * Wishlist Queries Layer
 * 
 * Reusable hooks for wishlist-related data fetching and mutations.
 * All operations require authentication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/lib/api/wishlist";
import { queryKeys } from "../query-keys";
import { toast } from "sonner";
import type {
  WishlistResponse,
  WishlistItem,
  AddToWishlistRequest,
  CheckWishlistResponse,
  WishlistCountResponse,
  MessageResponse,
} from "@/lib/api/wishlist";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get the current user's wishlist
 * 
 * Used in:
 * - Wishlist page - Display all wishlist items
 * - Header - Show wishlist count
 * 
 * @param enabled - Whether the query should execute (e.g., only when authenticated)
 * 
 * @example
 * ```tsx
 * const { data: wishlist, isLoading } = useWishlist(isAuthenticated);
 * ```
 */
export const useWishlist = (enabled: boolean = true) => {
  return useQuery<WishlistResponse>({
    queryKey: queryKeys.wishlist.all(),
    queryFn: () => wishlistApi.getWishlist(),
    enabled,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Check if a specific product is in wishlist
 * 
 * Used in:
 * - Product page - Show filled/unfilled heart
 * - Product cards - Display wishlist status
 * 
 * @param productId - Product ID to check
 * @param enabled - Whether the query should execute
 * 
 * @example
 * ```tsx
 * const { data } = useCheckWishlist(productId, isAuthenticated);
 * const isWishlisted = data?.inWishlist ?? false;
 * ```
 */
export const useCheckWishlist = (
  productId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery<CheckWishlistResponse>({
    queryKey: queryKeys.wishlist.check(productId),
    queryFn: () => wishlistApi.checkWishlist(productId!),
    enabled: enabled && !!productId,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5,
  });
};

/**
 * Get wishlist item count
 * 
 * Used in:
 * - Header - Display count badge
 * - Mobile menu - Show wishlist count
 * 
 * @param enabled - Whether the query should execute
 * 
 * @example
 * ```tsx
 * const { data } = useWishlistCount(isAuthenticated);
 * const count = data?.count ?? 0;
 * ```
 */
export const useWishlistCount = (enabled: boolean = true) => {
  return useQuery<WishlistCountResponse>({
    queryKey: queryKeys.wishlist.count(),
    queryFn: () => wishlistApi.getWishlistCount(),
    enabled,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Add product to wishlist
 * 
 * Automatically invalidates wishlist queries and shows toast notification
 * 
 * @example
 * ```tsx
 * const addToWishlist = useAddToWishlist();
 * 
 * addToWishlist.mutate({
 *   productId: 'uuid'
 * }, {
 *   onSuccess: () => console.log('Added!'),
 *   onError: (error) => console.error(error)
 * });
 * ```
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<WishlistResponse, Error, AddToWishlistRequest>({
    mutationFn: (data: AddToWishlistRequest) =>
      wishlistApi.addToWishlist(data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all() });
      
      // Optimistically update the check query
      if (variables.productId) {
        queryClient.setQueryData(
          queryKeys.wishlist.check(variables.productId),
          { inWishlist: true }
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist queries
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.count() });
      
      // Update the specific check query
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.wishlist.check(variables.productId),
        });
      }

      toast.success("Added to Wishlist", {
        description: "Product has been added to your wishlist",
      });
    },
    onError: (error, variables) => {
      // Revert optimistic update
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.wishlist.check(variables.productId),
        });
      }
      
      toast.error("Failed to add to wishlist", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};

/**
 * Remove product from wishlist
 * 
 * Automatically invalidates wishlist queries and shows toast notification
 * 
 * @example
 * ```tsx
 * const removeFromWishlist = useRemoveFromWishlist();
 * 
 * removeFromWishlist.mutate(productId);
 * ```
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<WishlistResponse, Error, string, { previousWishlist?: WishlistResponse }>({
    mutationFn: (productId: string) =>
      wishlistApi.removeFromWishlist(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all() });
      
      // Optimistically update the check query
      queryClient.setQueryData(queryKeys.wishlist.check(productId), {
        inWishlist: false,
      });

      // Optimistically remove from wishlist
      const previousWishlist = queryClient.getQueryData<WishlistResponse>(
        queryKeys.wishlist.all()
      );

      if (previousWishlist) {
        queryClient.setQueryData<WishlistResponse>(
          queryKeys.wishlist.all(),
          {
            ...previousWishlist,
            items: previousWishlist.items.filter(
              (item) => item.productId !== productId
            ),
            totalItems: previousWishlist.totalItems - 1,
          }
        );
      }

      return { previousWishlist };
    },
    onSuccess: (data, productId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.count() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlist.check(productId),
      });

      toast.success("Removed from Wishlist", {
        description: "Product has been removed from your wishlist",
      });
    },
    onError: (error, productId, context) => {
      // Revert optimistic updates
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          queryKeys.wishlist.all(),
          context.previousWishlist
        );
      }
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlist.check(productId),
      });

      toast.error("Failed to remove from wishlist", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};

/**
 * Clear entire wishlist
 * 
 * Automatically invalidates wishlist queries and shows toast notification
 * 
 * @example
 * ```tsx
 * const clearWishlist = useClearWishlist();
 * 
 * clearWishlist.mutate();
 * ```
 */
export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, void, { previousWishlist?: WishlistResponse }>({
    mutationFn: () => wishlistApi.clearWishlist(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all() });

      // Optimistically clear
      const previousWishlist = queryClient.getQueryData<WishlistResponse>(
        queryKeys.wishlist.all()
      );

      queryClient.setQueryData<WishlistResponse>(queryKeys.wishlist.all(), {
        items: [],
        totalItems: 0,
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      // Invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.count() });

      toast.success("Wishlist Cleared", {
        description: "All items have been removed from your wishlist",
      });
    },
    onError: (error, _, context) => {
      // Revert optimistic update
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          queryKeys.wishlist.all(),
          context.previousWishlist
        );
      }

      toast.error("Failed to clear wishlist", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};

/**
 * Toggle product in/out of wishlist
 * 
 * Convenience hook that automatically adds or removes based on current state
 * 
 * @example
 * ```tsx
 * const toggleWishlist = useToggleWishlist();
 * 
 * toggleWishlist.mutate({
 *   productId: 'uuid',
 *   isCurrentlyInWishlist: false
 * });
 * ```
 */
export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return {
    mutate: ({
      productId,
      isCurrentlyInWishlist,
    }: {
      productId: string;
      isCurrentlyInWishlist: boolean;
    }) => {
      if (isCurrentlyInWishlist) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate({ productId });
      }
    },
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};
