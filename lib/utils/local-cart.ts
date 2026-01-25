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
  productSlug: string;
  productName: string;
  variantId: UUID;
  variantSize: string;
  variantColor: string;
  variantImageUrl: string;  // Store at cart-add time
  basePrice: number;
  variantPrice: number;
  quantity: number;
  
  // For customizations - inline data (no separate saving)
  customizationData?: {
    designId: UUID;
    designPrice: number;
    threadColorHex: string;
    additionalNotes?: string;
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
  designId?: UUID,
  threadColorHex?: string
): string => {
  if (designId && threadColorHex) {
    return `${productId}_${variantId}_custom_${designId}_${threadColorHex}`;
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

  // Both have no customization
  if (!item1.customizationData && !item2.customizationData) {
    return true;
  }

  // Both have customization - compare design and color
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
      // ✅ Use static date for SSR to avoid prerendering issues
      return { items: [], lastModified: "1970-01-01T00:00:00.000Z" };
    }

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        return { items: [], lastModified: new Date().toISOString() };
      }

      return JSON.parse(stored);
    } catch (error) {
      return { items: [], lastModified: new Date().toISOString() };
    }
  },

  saveCart(cart: LocalCart): void {
    if (typeof window === "undefined") return;

    try {
      cart.lastModified = new Date().toISOString();
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Silently fail
    }
  },

  addItem(item: LocalCartItem): void {
    const cart = this.getCart();

    const existingIndex = cart.items.findIndex((i) => isSameItem(i, item));

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    this.saveCart(cart);
  },

  updateItem(
    productId: UUID,
    variantId: UUID,
    quantity: number,
    designId?: UUID,
    threadColorHex?: string
  ): void {
    const cart = this.getCart();

    const index = cart.items.findIndex((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !item.customizationData;
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
    designId?: UUID,
    threadColorHex?: string
  ): void {
    const cart = this.getCart();

    cart.items = cart.items.filter((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return true;
      }

      if (designId && threadColorHex) {
        return !(
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !!item.customizationData;
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
    designId?: UUID,
    threadColorHex?: string
  ): boolean {
    const cart = this.getCart();
    
    return cart.items.some((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      }

      return !item.customizationData;
    });
  },

  getItemQuantity(
    productId: UUID,
    variantId: UUID,
    designId?: UUID,
    threadColorHex?: string
  ): number {
    const cart = this.getCart();
    
    const item = cart.items.find((item) => {
      if (item.productId !== productId || item.variantId !== variantId) {
        return false;
      }

      if (designId && threadColorHex) {
        return (
          item.customizationData?.designId === designId &&
          item.customizationData?.threadColorHex === threadColorHex
        );
      } else {
        return !item.customizationData;
      }
    });

    return item?.quantity ?? 0;
  },

  exportForSync(): LocalCartItem[] {
    return this.getCart().items;
  },
};