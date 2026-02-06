// ============================================================================
// ACCOUNT QUERY HOOKS
// ============================================================================

import { 
    getAccountDetails, 
    updateAccountDetails,
    getUserStats 
} from "@/lib/actions/account-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

/**
 * Get current user's account details
 */
export const useAccountDetails = () => {
    return useQuery({
        queryKey: queryKeys.account.details(),
        queryFn: async () => {
            const result = await getAccountDetails();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.user;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

/**
 * Update account details (name, email)
 */
export const useUpdateAccountDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name?: string; email?: string }) => 
            updateAccountDetails(data),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate account details to refetch
                queryClient.invalidateQueries({
                    queryKey: queryKeys.account.details(),
                });
            }
        },
    });
};

/**
 * Get user statistics (orders, wishlist, addresses, cart)
 */
export const useUserStats = () => {
    return useQuery({
        queryKey: queryKeys.account.stats(),
        queryFn: async () => {
            const result = await getUserStats();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.stats;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
    });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get account loading state
 */
export const useIsAccountLoading = () => {
    const { isLoading } = useAccountDetails();
    return isLoading;
};

/**
 * Get account error state
 */
export const useAccountError = () => {
    const { error } = useAccountDetails();
    return error;
};
