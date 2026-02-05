
export interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    sku: string;
    primaryImageUrl: string;  // The main image for this variant
}

export interface VariantSummary {
    id: string;
    size: string;
    color: string;
    sku: string;
}


/**
 * Individual cart item with product, variant, and customization details
 */
export interface CartItem {
    id: string;
    product: ProductSummary;
    variant: VariantSummary;  // Make required, not optional
    quantity: number;
    unitPrice: number;
    itemTotal: number;
    addedAt: string; // ISO date string
}

/**
 * Complete cart response with items and totals
 */
export interface Cart {
    id: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    discountAmount?: number;
    total: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}