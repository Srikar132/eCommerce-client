export interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    sku: string;
    primaryImageUrl: string;
}

export interface VariantSummary {
    id: string;
    size: string;
    color: string;
    sku: string;
}

export interface CartItem {
    id: string;
    product: ProductSummary;
    variant: VariantSummary;
    quantity: number;
    unitPrice: number;
    itemTotal: number;
    addedAt: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    discountAmount?: number;
    total: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// GUEST CART — localStorage / Zustand
// ============================================================================

/**
 * Stored in localStorage. Extends CartItem shape with the IDs needed
 * to call server actions during merge, plus a stable localId key.
 */
export interface GuestCartItem {
    localId: string;            // stable React key + remove/update handle
    productId: string;          // needed for server addItemToCart on merge
    productVariantId: string;   // needed for server addItemToCart on merge
    quantity: number;
    unitPrice: number;
    itemTotal: number;
    addedAt: string;
    product: ProductSummary;    // snapshot for display — no extra fetch needed
    variant: VariantSummary;    // snapshot for display
}

// ============================================================================
// UNIFIED CART — single shape for all UI consumers
// ============================================================================

export type UnifiedCartSource = "guest" | "auth";

export interface UnifiedCart {
    source: UnifiedCartSource;
    items: CartItem[];          // GuestCartItems are mapped to this shape
    totalItems: number;
    subtotal: number;
    discountAmount: number;
    total: number;
    isLoading: boolean;
    isFetching: boolean;
}