"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { localCartManager } from "@/lib/utils/local-cart";
import { useSyncLocalCart } from "@/lib/tanstack/queries/cart.queries";
import { toast } from "sonner";

/**
 * Handles automatic cart sync when user logs in
 * Place this inside AuthProvider or as a sibling provider
 */
export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const syncCartMutation = useSyncLocalCart();
  const hasSyncedRef = useRef(false);
  const isSyncingRef = useRef(false); // Prevent concurrent syncs

  useEffect(() => {
    const syncLocalCartToBackend = async () => {
      // Only sync once per session and prevent concurrent syncs
      if (!isAuthenticated || !user || hasSyncedRef.current || isSyncingRef.current) {
        return;
      }

      const localCart = localCartManager.getCart();
      
      // No items to sync
      if (localCart.items.length === 0) {
        hasSyncedRef.current = true;
        return;
      }

      isSyncingRef.current = true; // Lock sync
      console.log("[CartSync] Syncing", localCart.items.length, "items to backend");

      const itemsToSync = localCart.items.map((item) => ({
        productId: item.productId,
        productVariantId: item.variantId,
        customizationId: item.customizationId || null,
        quantity: item.quantity,
        customizationSummary: item.customizationSummary,
        customizationData: item.customizationData,
      }));

      try {
        await syncCartMutation.mutateAsync(itemsToSync);
        
        // Clear local cart after successful sync
        localCartManager.clear();
        hasSyncedRef.current = true;
        
        toast.success("Your cart has been synced!");
      } catch (error) {
        console.error("[CartSync] Failed:", error);
        toast.error("Failed to sync cart. Items saved locally.");
      } finally {
        isSyncingRef.current = false; // Unlock sync
      }
    };

    syncLocalCartToBackend();
  }, [isAuthenticated, user]);

  // Reset sync flag on logout
  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
      isSyncingRef.current = false; // Also reset sync lock
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
