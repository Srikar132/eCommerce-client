/**
 * Local Cart Manager - IMPROVED VERSION WITH SLUG SUPPORT
 * 
 * Key Changes:
 * 1. Store productSlug for fetching product data
 * 2. Proper item uniqueness using design + color for guests
 * 3. Better structure for merging on login
 * 4. More robust item matching logic
 */

import type { UUID } from "@/types";

export interface LocalCartItem {
  productId: UUID;
  productSlug: string;  // ADDED: For fetching product data
  variantId: UUID;
  quantity: number;
  customizationId?: UUID | null;
  customizationSummary: string | null;
  
  // For unsaved customizations (guests)
  customizationData?: {
    designId: UUID;
    threadColorHex: string;
    previewImageBase64: string;  // Base64 for guests
    designPositionJson: string;
  };
}

export interface LocalCart {
  items: LocalCartItem[];
  lastModified: string;
}

const CART_STORAGE_KEY = "guest_cart";

/**
 * Generate unique identifier for cart item
 */
const generateItemKey = (
  productId: UUID,
  variantId: UUID,
  customizationId?: UUID | null,
  designId?: UUID,
  threadColorHex?: string
): string => {
  if (customizationId) {
    return `${productId}_${variantId}_${customizationId}`;
  } else if (designId && threadColorHex) {
    return `${productId}_${variantId}_guest_${designId}_${threadColorHex}`;
  } else {
    return `${productId}_${variantId}_base`;
  }
};

/**
 * Check if two items are the same (including customization details)
 */
const isSameItem = (item1: LocalCartItem, item2: LocalCartItem): boolean => {
  if (item1.productId !== item2.productId || item1.variantId !== item2.variantId) {
    return false;
  }

  if (item1.customizationId && item2.customizationId) {
    return item1.customizationId === item2.customizationId;
  }

  if (!item1.customizationData && !item2.customizationData && 
      !item1.customizationId && !item2.customizationId) {
    return true;
  }

  if (item1.customizationData && item2.customizationData) {
    return (
      item1.customizationData.designId === item2.customizationData.designId &&
      item1.customizationData.threadColorHex === item2.customizationData.threadColorHex
    );
  }

  return false;
};

export const localCartManager = {
  getCart(): LocalCart {
    if (typeof window === "undefined") {
      return { items: [], lastModified: new Date().toISOString() };
    }

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        return { items: [], lastModified: new Date().toISOString() };
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error("[LocalCart] Failed to parse cart:", error);
      return { items: [], lastModified: new Date().toISOString() };
    }
  },

  saveCart(cart: LocalCart): void {
    if (typeof window === "undefined") return;

    try {
      cart.lastModified = new Date().toISOString();
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log("[LocalCart] Saved:", cart.items.length, "items");
    } catch (error) {
      console.error("[LocalCart] Failed to save cart:", error);
    }
  },

  addItem(item: LocalCartItem): void {
    const cart = this.getCart();

    console.log("[LocalCart] Adding item:", {
      productSlug: item.productSlug,
      designId: item.customizationData?.designId,
      threadColor: item.customizationData?.threadColorHex,
    });

    const existingIndex = cart.items.findIndex((i) => isSameItem(i, item));

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
      console.log("[LocalCart] Updated quantity:", cart.items[existingIndex].quantity);
    } else {
      cart.items.push(item);
      console.log("[LocalCart] Added new item");
    }

    this.saveCart(cart);
  },

  updateItem(
    productId: UUID,
    variantId: UUID,
    customizationId: UUID | null | undefined,
    quantity: number,
    designId?: UUID,
    threadColorHex?: string
  ): void {
    const cart = this.getCart();

    const index = cart.items.findIndex((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (customizationId) {
        return item.customizationId === customizationId;
      } else if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !item.customizationData && !item.customizationId;
      }
    });

    if (index >= 0) {
      if (quantity <= 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].quantity = quantity;
      }
      this.saveCart(cart);
    }
  },

  removeItem(
    productId: UUID,
    variantId: UUID,
    customizationId: UUID | null | undefined,
    designId?: UUID,
    threadColorHex?: string
  ): void {
    const cart = this.getCart();

    cart.items = cart.items.filter((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return true;
      }

      if (customizationId) {
        return item.customizationId !== customizationId;
      } else if (designId && threadColorHex) {
        return !(
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !!(item.customizationData || item.customizationId);
      }
    });

    this.saveCart(cart);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  getItemCount(): number {
    return this.getCart().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  isEmpty(): boolean {
    return this.getCart().items.length === 0;
  },

  hasItem(
    productId: UUID,
    variantId: UUID,
    customizationId?: UUID | null,
    designId?: UUID,
    threadColorHex?: string
  ): boolean {
    const cart = this.getCart();
    
    return cart.items.some((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (customizationId) {
        return item.customizationId === customizationId;
      }

      if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      }

      return !item.customizationData && !item.customizationId;
    });
  },

  getItemQuantity(
    productId: UUID,
    variantId: UUID,
    customizationId?: UUID | null,
    designId?: UUID,
    threadColorHex?: string
  ): number {
    const cart = this.getCart();
    
    const item = cart.items.find((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (customizationId) {
        return item.customizationId === customizationId;
      } else if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !item.customizationData && !item.customizationId;
      }
    });

    return item?.quantity ?? 0;
  },

  exportForSync(): LocalCartItem[] {
    return this.getCart().items;
  },
};