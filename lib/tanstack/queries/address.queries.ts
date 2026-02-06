// ============================================================================
// ADDRESS QUERY HOOKS
// ============================================================================

import {
    addAddress,
    deleteAddress,
    getAddressById,
    getUserAddresses,
    setDefaultAddress,
    updateAddress,
    type AddressType,
} from "@/lib/actions/address-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

interface AddAddressInput {
    addressType?: AddressType;
    streetAddress?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
}

/**
 * Get all user addresses
 */
export const useUserAddresses = () => {
    return useQuery({
        queryKey: queryKeys.addresses.list(),
        queryFn: async () => {
            const result = await getUserAddresses();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.addresses;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

/**
 * Get a specific address by ID
 */
export const useAddressById = (addressId: string) => {
    return useQuery({
        queryKey: queryKeys.addresses.detail(addressId),
        queryFn: async () => {
            const result = await getAddressById(addressId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.address;
        },
        enabled: !!addressId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Add a new address
 */
export const useAddAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddAddressInput) => addAddress(data),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate addresses list to refetch
                queryClient.invalidateQueries({
                    queryKey: queryKeys.addresses.list(),
                });
            }
        },
    });
};

/**
 * Update an existing address
 */
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ addressId, data }: { addressId: string; data: AddAddressInput }) =>
            updateAddress(addressId, data),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate addresses to refetch
                queryClient.invalidateQueries({
                    queryKey: queryKeys.addresses.list(),
                });
            }
        },
    });
};

/**
 * Delete an address
 */
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressId: string) => deleteAddress(addressId),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate addresses list to refetch
                queryClient.invalidateQueries({
                    queryKey: queryKeys.addresses.list(),
                });
            }
        },
    });
};

/**
 * Set an address as default
 */
export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressId: string) => setDefaultAddress(addressId),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate addresses list to refetch
                queryClient.invalidateQueries({
                    queryKey: queryKeys.addresses.list(),
                });
            }
        },
    });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get the default address from the list
 */
export const useDefaultAddress = () => {
    const { data: addresses } = useUserAddresses();
    return addresses?.find((addr) => addr.isDefault) ?? null;
};

/**
 * Get total address count
 */
export const useAddressCount = () => {
    const { data: addresses } = useUserAddresses();
    return addresses?.length ?? 0;
};

/**
 * Check if user has any addresses
 */
export const useHasAddresses = () => {
    const count = useAddressCount();
    return count > 0;
};
