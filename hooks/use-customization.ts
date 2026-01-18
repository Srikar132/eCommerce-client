"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  useSaveCustomization,
  useDeleteCustomization,
  useProductCustomizations,
} from "@/lib/tanstack/queries/customization.queries";
import { CustomizationRequest, UUID } from "@/types";

/**
 * CLEAN CUSTOMIZATION MANAGER
 * 
 * Purpose:
 * 1. Authenticated users can save customizations to backend
 * 2. Load existing customizations for a product+design combination
 * 3. Track current working customization state
 * 4. No draft concept - everything happens in real-time
 */

interface CurrentCustomizationState {
  id: string | null;
  designId: UUID;
  variantId: UUID;
  threadColorHex: string;
  userMessage?: string;
  previewImageUrl?: string;
}

export const useCustomizationManager = (productId?: UUID, designId?: UUID) => {
  const { user, isAuthenticated } = useAuthStore();
  
  // Backend queries - fetch existing customizations for this product+design
  const productCustomizationsQuery = useProductCustomizations(productId!, {
    enabled: isAuthenticated && !!productId
  });
  
  const saveMutation = useSaveCustomization();
  const deleteMutation = useDeleteCustomization();
  
  // Track current working customization
  const [currentState, setCurrentState] = useState<CurrentCustomizationState | null>(null);

  /**
   * Get existing customizations for the current design
   */
  const getExistingCustomizationsForDesign = useCallback(() => {
    if (!designId || !productCustomizationsQuery.data) return [];
    
    return productCustomizationsQuery.data.filter(
      (customization: any) => customization.design.id === designId
    );
  }, [designId, productCustomizationsQuery.data]);

  /**
   * Check if current state matches an existing saved customization
   */
  const findMatchingCustomization = useCallback(() => {
    if (!currentState || !designId) return null;
    
    const existingCustomizations = getExistingCustomizationsForDesign();
    
    return existingCustomizations.find((customization: any) => 
      customization.design.id === currentState.designId &&
      customization.variant.id === currentState.variantId &&
      customization.threadColorHex === currentState.threadColorHex &&
      (customization.userMessage || '') === (currentState.userMessage || '')
    );
  }, [currentState, designId, getExistingCustomizationsForDesign]);

  /**
   * Initialize new customization state
   */
  const initializeNew = useCallback((data: {
    designId: UUID;
    variantId: UUID;
    threadColorHex: string;
    userMessage?: string;
  }) => {
    setCurrentState({
      id: null,
      designId: data.designId,
      variantId: data.variantId,
      threadColorHex: data.threadColorHex,
      userMessage: data.userMessage,
      previewImageUrl: undefined,
    });
  }, []);

  /**
   * Update current customization state
   */
  const updateCurrentState = useCallback((updates: Partial<Omit<CurrentCustomizationState, 'id'>>) => {
    setCurrentState(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  /**
   * Load existing customization
   */
  const loadCustomization = useCallback((customization: any) => {
    setCurrentState({
      id: customization.id,
      designId: customization.design.id,
      variantId: customization.variant.id,
      threadColorHex: customization.threadColorHex,
      userMessage: customization.userMessage || '',
      previewImageUrl: customization.previewImageUrl,
    });
  }, []);

  /**
   * Clear current customization
   */
  const clear = useCallback(() => {
    setCurrentState(null);
  }, []);

  /**
   * Save customization to backend (AUTHENTICATED USERS ONLY)
   */
  const save = useCallback(
    async (data: {
      productId: UUID;
      variantId: UUID;
      designId: UUID;
      threadColorHex: string;
      userMessage?: string;
      previewImageUrl: string;
    }) => {
      if (!isAuthenticated) {
        throw new Error('Must be logged in to save customizations');
      }

      try {
        console.log('[Customization] Saving to backend...');
        
        const request: CustomizationRequest = {
          id: currentState?.id, // Include if updating existing
          productId: data.productId,
          variantId: data.variantId,
          designId: data.designId,
          threadColorHex: data.threadColorHex,
          userMessage: data.userMessage,
          previewImageUrl: data.previewImageUrl,
        };

        const result = await saveMutation.mutateAsync(request);
        
        // Update current state with saved ID
        setCurrentState(prev => prev ? { ...prev, id: result.id } : null);
        
        console.log('[Customization] Saved successfully:', result);
        
        return result;
      } catch (error) {
        console.error("[Customization] Failed to save:", error);
        throw error;
      }
    },
    [isAuthenticated, saveMutation, currentState]
  );

  /**
   * Create temporary customization for guest add-to-cart
   */
  const createTempForCart = useCallback(
    async (data: {
      productId: UUID;
      variantId: UUID;
      designId: UUID;
      threadColorHex: string;
      userMessage?: string;
      previewImageUrl: string;
    }) => {
      if (isAuthenticated) {
        throw new Error('Use save() for authenticated users');
      }

      // For guests, return data without ID
      return {
        ...data,
        id: null,
      };
    },
    [isAuthenticated]
  );

  /**
   * Delete a customization
   */
  const deleteCustomization = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        throw new Error('Must be logged in to delete customizations');
      }

      try {
        await deleteMutation.mutateAsync(id);
        
        // Clear current state if deleting current customization
        if (currentState?.id === id) {
          setCurrentState(null);
        }
      } catch (error) {
        console.error("[Customization] Failed to delete:", error);
        throw error;
      }
    },
    [isAuthenticated, deleteMutation, currentState]
  );

  return {
    // Current state
    currentState,
    
    // Existing customizations for this design
    existingCustomizations: getExistingCustomizationsForDesign(),
    matchingCustomization: findMatchingCustomization(),
    
    // User info
    isAuthenticated,
    userId: user?.id,

    // Loading states
    isLoadingCustomizations: productCustomizationsQuery.isLoading,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    initializeNew,
    updateCurrentState,
    loadCustomization,
    clear,
    save,
    createTempForCart,
    delete: deleteCustomization,
    refresh: () => productCustomizationsQuery.refetch(),
  };
};