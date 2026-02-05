
// Product Params
export type ProductParams = {
    category?: string;        // Single category slug ?category=womens
    size?: string;            // Single size value ?size=M
    searchQuery?: string;     // Full-text search query
    page?: number;            // 0-based page number
    limit?: number;           // Page size (items per page)
    sortBy?: "PRICE_ASC" | "PRICE_DESC" | "CREATED_AT_ASC" | "CREATED_AT_DESC" | "BEST_SELLING" | "RELEVANCE"
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

// Review Type
export interface Review {
    id: string;
    userId: string;
    name: string;
    productId: string;
    orderItemId?: string;
    rating: number;
    title?: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
}




/**
 * Rating distribution breakdown (1-5 stars)
 */
export interface RatingDistribution {
    1: number; // Count of 1-star reviews
    2: number; // Count of 2-star reviews
    3: number; // Count of 3-star reviews
    4: number; // Count of 4-star reviews
    5: number; // Count of 5-star reviews
}

/**
 * Request payload for adding a product review
 */
export interface AddReviewRequest {
    rating: number;              // 1-5 stars
    title?: string;              // Review title/headline (optional)
    comment: string;             // Review text content
}

/**
 * Response after successfully adding a review
 */
export interface AddReviewResponse {
    message: string;
    review: Review;
}

// product Response
export interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    sku: string;
    images: ProductImage[];
    variants: ProductVariant[];
    reviews: ProductReview[];
}
