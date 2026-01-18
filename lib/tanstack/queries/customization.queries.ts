/**
 * Customization Queries Layer
 * 
 * Reusable hooks for customization-related data fetching.
 * Handles both authenticated users and guest sessions.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customizationApi } from "@/lib/api/customization";
import { queryKeys } from "../query-keys";
import { toast } from "sonner";
import type {
  Customization,
  CustomizationRequest,
  SaveCustomizationResponse,
  PagedResponse,
  UUID,
} from "@/types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get a single customization by ID
 * 
 * @example
 * ```tsx
 * const { data: customization } = useCustomization('custom-123');
 * ```
 */
export const useCustomization = (customizationId: string) => {
  return useQuery({
    queryKey: queryKeys.customization.detail(customizationId),
    queryFn: () => customizationApi.getCustomizationById(customizationId),
    enabled: !!customizationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get all customizations for a specific product (authenticated user)
 * 
 * Used in:
 * - Customizer page - "Load Previous Design" dropdown
 * - Product page - Show user's existing designs
 * 
 * @example
 * ```tsx
 * const { data: customizations } = useProductCustomizations(productId);
 * ```
 */
export const useProductCustomizations = (productId: UUID , options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.customization.byProduct(productId),
    queryFn: () => customizationApi.getProductCustomizations(productId),
    enabled: !!productId && options?.enabled,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};



/**
 * Get guest customizations for a specific product
 * 
 * Used in: Customizer page - Load designs for guest users
 * 
 * @example
 * ```tsx
 * const { data: customizations } = useGuestCustomizations(productId, sessionId);
 * ```
 */
export const useGuestCustomizations = (
  productId: UUID,
  sessionId: string
) => {
  return useQuery({
    queryKey: queryKeys.customization.guestByProduct(productId, sessionId),
    queryFn: () => customizationApi.getGuestCustomizations(productId, sessionId),
    enabled: !!productId && !!sessionId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Get all customizations for the current user (paginated)
 * 
 * Used in: "My Designs" page
 * 
 * @example
 * ```tsx
 * const { data: designs } = useMyDesigns({ page: 0, size: 12 });
 * ```
 */
export const useMyDesigns = (params: { page?: number; size?: number } = {}) => {
  const { page = 0, size = 12 } = params;

  return useQuery<PagedResponse<Customization>>({
    queryKey: queryKeys.customization.myDesigns({ page, size }),
    queryFn: () => customizationApi.getMyDesigns(page, size),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Save or update a customization
 * 
 * Automatically invalidates related queries on success
 * 
 * @example
 * ```tsx
 * const saveCustomization = useSaveCustomization();
 * 
 * saveCustomization.mutate({
 *   productId: 'uuid',
 *   variantId: 'uuid',
 *   designId: 'uuid',
 *   threadColorHex: '#FF0000',
 *   previewImageUrl: 'https://...'
 * });
 * ```
 */
export const useSaveCustomization = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveCustomizationResponse, Error, CustomizationRequest>({
    mutationFn: (data: CustomizationRequest) => 
      customizationApi.saveCustomization(data),
    onSuccess: (response, variables) => {
      // Show success message
      toast.success(
        response.isUpdate ? "Design updated!" : "Design saved!",
        {
          description: response.isUpdate 
            ? "Your customization has been updated." 
            : "Your customization has been saved.",
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.customization.all(),
      });

      // Invalidate specific product customizations
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.customization.byProduct(variables.productId),
        });
      }

      // Invalidate my designs list
      queryClient.invalidateQueries({
        queryKey: ['customization', 'my-designs'],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to save design", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });
};

/**
 * Delete a customization
 * 
 * @example
 * ```tsx
 * const deleteCustomization = useDeleteCustomization();
 * 
 * deleteCustomization.mutate('custom-123');
 * ```
 */
export const useDeleteCustomization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (customizationId: string) =>
      customizationApi.deleteCustomization(customizationId),
    onSuccess: (_, customizationId) => {
      toast.success("Design deleted", {
        description: "Your customization has been removed.",
      });

      // Invalidate all customization queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.customization.all(),
      });

      // Remove specific customization from cache
      queryClient.removeQueries({
        queryKey: queryKeys.customization.detail(customizationId),
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete design", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Check if a customization is being saved/updated
 * 
 * @example
 * ```tsx
 * const mutation = useSaveCustomization();
 * const isSaving = mutation.isPending;
 * ```
 */
export const useIsCustomizationSaving = (mutation: ReturnType<typeof useSaveCustomization>) => {
  return mutation.isPending;
};

/**
 * Get customization save error
 * 
 * @example
 * ```tsx
 * const mutation = useSaveCustomization();
 * const error = useCustomizationSaveError(mutation);
 * ```
 */
export const useCustomizationSaveError = (mutation: ReturnType<typeof useSaveCustomization>) => {
  return mutation.error;
};
