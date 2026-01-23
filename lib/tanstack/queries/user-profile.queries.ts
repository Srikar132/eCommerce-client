import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userProfileApi, UpdateProfileRequest, AddAddressRequest } from "@/lib/api/user-profile";
import { Address, User } from "@/types";
import { toast } from "sonner";
import { queryKeys } from "@/lib/tanstack/query-keys";
import { getErrorMessage } from "@/lib/utils/error-handler";

// ================================================
// QUERIES
// ================================================

/**
 * Hook to fetch all user addresses
 * GET /api/v1/users/addresses
 */
export const useUserAddresses = () => {
    return useQuery<Address[], Error>({
        queryKey: queryKeys.user.addresses(),
        queryFn: userProfileApi.getUserAddresses,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// ================================================
// MUTATIONS
// ================================================

/**
 * Hook to update user profile
 * PUT /api/v1/users/profile
 */
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UpdateProfileRequest>({
        mutationFn: userProfileApi.updateUserProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully");
            
            // Invalidate user-related queries if needed
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

/**
 * Hook to add a new address
 * POST /api/v1/users/addresses
 */
export const useAddUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<Address, Error, AddAddressRequest>({
        mutationFn: userProfileApi.addUserAddress,
        onSuccess: (data) => {
            toast.success("Address added successfully");
            
            // Invalidate addresses query to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

/**
 * Hook to update an existing address with optimistic UI update
 * PUT /api/v1/users/addresses/{id}
 * Provides instant feedback before server confirmation
 */
export const useUpdateUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Address, 
        Error, 
        { id: string; data: AddAddressRequest },
        { previousAddresses?: Address[] }
    >({
        mutationFn: ({ id, data }) => userProfileApi.updateUserAddress(id, data),
        
        // Optimistic update - update UI immediately
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.user.addresses() });

            // Snapshot previous value
            const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.user.addresses());

            // Optimistically update
            if (previousAddresses) {
                queryClient.setQueryData<Address[]>(
                    queryKeys.user.addresses(),
                    previousAddresses.map(addr => {
                        if (addr.id === id) {
                            // Update the target address
                            return { ...addr, ...data, id };
                        } else if (data.isDefault) {
                            // If setting a new default, remove default from all others
                            return { ...addr, isDefault: false };
                        }
                        return addr;
                    })
                );
            }

            return { previousAddresses };
        },
        
        onError: (error, _, context) => {
            // Rollback on error
            if (context?.previousAddresses) {
                queryClient.setQueryData(queryKeys.user.addresses(), context.previousAddresses);
            }
            toast.error(getErrorMessage(error));
        },
        
        onSuccess: (data) => {
            toast.success("Address updated successfully");
        },
        
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
        },
    });
};

/**
 * Hook to delete address with optimistic UI update
 * DELETE /api/v1/users/addresses/{id}
 */
export const useDeleteUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void, 
        Error, 
        string,
        { previousAddresses?: Address[] }
    >({
        mutationFn: userProfileApi.deleteUserAddress,
        
        // Optimistic update
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.user.addresses() });

            const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.user.addresses());

            if (previousAddresses) {
                queryClient.setQueryData<Address[]>(
                    queryKeys.user.addresses(),
                    previousAddresses.filter(addr => addr.id !== deletedId)
                );
            }

            return { previousAddresses };
        },
        
        onError: (error, _, context) => {
            if (context?.previousAddresses) {
                queryClient.setQueryData(queryKeys.user.addresses(), context.previousAddresses);
            }
            toast.error(getErrorMessage(error));
        },
        
        onSuccess: () => {
            toast.success("Address deleted successfully");
        },
        
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
        },
    });
};
