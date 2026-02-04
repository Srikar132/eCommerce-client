
// Product Params
export type ProductParams = {
    category?: string;        // Single category slug ?category=womens
    size?: string;            // Single size value ?size=M
    searchQuery?: string;     // Full-text search query
    page?: number;            // 0-based page number
    limit?: number;           // Page size (items per page)
    sortBy? : "PRICE_ASC" | "PRICE_DESC" | "CREATED_AT_ASC" | "CREATED_AT_DESC" | "BEST_SELLING" | "RELEVANCE"
};



// Product Image
export interface ProductImage {
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
    displayOrder: number;
}

// Product Types
export interface Product {
    id: string;

    name: string;
    slug: string;
    description?: string;

    basePrice: number;
    sku: string;

    material?: string;
    careInstructions?: string;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;

    images: ProductImage[];
}



export interface ProductVariant {
    id: string;
    productId: string;  // May be null in some responses

    size: string;        // S, M, L, XL
    color: string;
    colorHex?: string;   // #FFFFFF

    stockQuantity: number;
    additionalPrice: number;

    sku: string;
    isActive: boolean;
}