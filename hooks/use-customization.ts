"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  useCustomization,
  useProductCustomizations,
  useGuestCustomizations,
  useMyDesigns,
  useSaveCustomization,
  useDeleteCustomization,
} from "@/lib/tanstack/queries/customization.queries";
import { CustomizationRequest, UUID } from "@/types";
import { toast } from "sonner";

/**
 * useCustomizationManager Hook
 * 
 * Centralized hook for managing product customizations.
 * Automatically handles both authenticated users and guest sessions.
 * 
 * Features:
 * - Load customization by ID
 * - Load all customizations for a product
 * - Load all user's designs (My Designs page)
 * - Save/update customizations
 * - Delete customizations
 * - Guest session management
 * 
 * @example
 * ```tsx
 * const customization = useCustomizationManager(productId);
 * 
 * // Save a customization
 * await customization.save({
 *   productId,
 *   variantId,
 *   designId,
 *   threadColorHex: '#FF0000',
 *   previewImageUrl: 'https://...'
 * });
 * 
 * // Load product customizations
 * const designs = customization.productCustomizations;
 * ```
 */
export const useCustomizationManager = (productId?: UUID) => {
  const { user, isAuthenticated } = useAuthStore();
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  // Initialize guest session ID
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      let sessionId = localStorage.getItem("guest-session-id");
      
      if (!sessionId) {
        sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guest-session-id", sessionId);
      }
      
      setGuestSessionId(sessionId);
    } else {
      setGuestSessionId(null);
    }
  }, [isAuthenticated]);

  // Queries
  const productCustomizationsQuery = useProductCustomizations(productId!);
  const guestCustomizationsQuery = useGuestCustomizations(
    productId!,
    guestSessionId!
  );

  // Mutations
  const saveMutation = useSaveCustomization();
  const deleteMutation = useDeleteCustomization();

  /**
   * Get customizations for the current product
   * Automatically uses authenticated or guest endpoint
   */
  const productCustomizations = isAuthenticated
    ? productCustomizationsQuery.data ?? []
    : guestCustomizationsQuery.data ?? [];

  const isLoadingProductCustomizations = isAuthenticated
    ? productCustomizationsQuery.isLoading
    : guestCustomizationsQuery.isLoading;

  /**
   * Save or update a customization
   */
  const save = useCallback(
    async (data: Omit<CustomizationRequest, "sessionId">) => {
      try {
        const request: CustomizationRequest = {
          ...data,
          sessionId: !isAuthenticated ? guestSessionId : undefined,
        };

        const result = await saveMutation.mutateAsync(request);
        return result;
      } catch (error) {
        console.error("Failed to save customization:", error);
        throw error;
      }
    },
    [isAuthenticated, guestSessionId, saveMutation]
  );

  /**
   * Delete a customization
   */
  const deleteCustomization = useCallback(
    async (customizationId: string) => {
      try {
        await deleteMutation.mutateAsync(customizationId);
      } catch (error) {
        console.error("Failed to delete customization:", error);
        throw error;
      }
    },
    [deleteMutation]
  );

  /**
   * Refresh product customizations
   */
  const refresh = useCallback(() => {
    if (isAuthenticated) {
      productCustomizationsQuery.refetch();
    } else {
      guestCustomizationsQuery.refetch();
    }
  }, [isAuthenticated, productCustomizationsQuery, guestCustomizationsQuery]);

  return {
    // Data
    productCustomizations,
    guestSessionId,
    isAuthenticated,
    userId: user?.id,

    // Loading states
    isLoadingProductCustomizations,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    save,
    delete: deleteCustomization,
    refresh,

    // Raw queries (for advanced use)
    queries: {
      productCustomizations: productCustomizationsQuery,
      guestCustomizations: guestCustomizationsQuery,
    },
  };
};

/**
 * useCustomizationDetail Hook
 * 
 * Hook for loading a single customization by ID
 * 
 * @example
 * ```tsx
 * const { customization, isLoading } = useCustomizationDetail('custom-123');
 * ```
 */
export const useCustomizationDetail = (customizationId?: string) => {
  const query = useCustomization(customizationId!);

  return {
    customization: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * useMyCustomizations Hook
 * 
 * Hook for loading all user's customizations (My Designs page)
 * 
 * @example
 * ```tsx
 * const { designs, isLoading, page, setPage } = useMyCustomizations();
 * ```
 */
export const useMyCustomizations = (initialPage = 0, initialSize = 12) => {
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);

  const query = useMyDesigns({ page, size });

  // Reset page when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setPage(0);
    }
  }, [isAuthenticated]);

  const designs = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 0;
  const totalElements = query.data?.totalElements ?? 0;

  const nextPage = useCallback(() => {
    if (query.data && !query.data.last) {
      setPage((prev) => prev + 1);
    }
  }, [query.data]);

  const previousPage = useCallback(() => {
    if (query.data && !query.data.first) {
      setPage((prev) => Math.max(0, prev - 1));
    }
  }, [query.data]);

  const goToPage = useCallback((pageNumber: number) => {
    setPage(pageNumber);
  }, []);

  return {
    // Data
    designs,
    totalPages,
    totalElements,
    hasNext: query.data?.hasNext ?? false,
    hasPrevious: query.data?.hasPrevious ?? false,
    
    // Pagination
    page,
    size,
    nextPage,
    previousPage,
    goToPage,
    setPage,

    // Loading states
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
};

/**
 * useGuestSessionId Hook
 * 
 * Hook to get or create a guest session ID
 * 
 * @example
 * ```tsx
 * const sessionId = useGuestSessionId();
 * ```
 */
export const useGuestSessionId = () => {
  const { isAuthenticated } = useAuthStore();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      let id = localStorage.getItem("guest-session-id");
      
      if (!id) {
        id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guest-session-id", id);
      }
      
      setSessionId(id);
    } else {
      setSessionId(null);
    }
  }, [isAuthenticated]);

  return sessionId;
};
