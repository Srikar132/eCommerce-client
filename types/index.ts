
// ================================================
// COMMON TYPES USED ACROSS THE APPLICATION
// ================================================

export type UUID = string;
export type ISODateString = string;


export interface PagedResponse<T> {
    content: T[];

    page: number;
    size: number;

    totalElements: number;
    totalPages: number;

    first: boolean;
    last: boolean;

    hasNext: boolean;
    hasPrevious: boolean;
}



// ================================================
// TYPES FOR USER AUTHENTICATION AND MANAGEMENT
// ================================================

export interface User {
    id: string;
    email: string;
    username: string;
    phone?: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    phone?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

// ================================================
// TYPES FOR PRODUCT CATALOG AND MANAGEMENT
// ================================================

export interface Category {
    id: UUID;
    name: string;
    slug: string;

    parent?: Category | null; // self-referencing

    description?: string;
    imageUrl?: string;

    isActive: boolean;
    displayOrder: number;

    createdAt: ISODateString;
}


export interface Brand {
    id: UUID;
    name: string;
    slug: string;

    description?: string;
    logoUrl?: string;

    isActive: boolean;
    createdAt: ISODateString;
}

export interface ProductImage {
    id: UUID;

    imageUrl: string;
    altText?: string;

    displayOrder: number;
    isPrimary: boolean;
}

export interface ProductVariant {
    id: UUID;

    size: string;        // S, M, L, XL
    color: string;
    colorHex?: string;   // #FFFFFF

    stockQuantity: number;
    additionalPrice: number;

    sku: string;
    isActive: boolean;
}

export interface Review {
    id: UUID;

    user: User;
    rating: number; // 1–5

    title?: string;
    comment?: string;

    isVerifiedPurchase: boolean;
    createdAt: ISODateString;
}



export interface Product {
    id: UUID;

    brand: Brand;
    category: Category;

    name: string;
    slug: string;
    description?: string;

    basePrice: number;
    sku: string;

    isCustomizable: boolean;
    material?: string;
    careInstructions?: string;

    isActive: boolean;

    createdAt: ISODateString;
    updatedAt?: ISODateString;

    images: ProductImage[];
    variants: ProductVariant[];
    reviews: Review[];
}

export type ProductResponse =
    Omit<
        Product,
        | 'brand'
        | 'category'
        | 'variants'
        | 'reviews'
    > & {
        brandId: UUID;
        brandName: string;

        categoryId: UUID;
        categoryName: string;

        averageRating?: number;
        reviewCount?: number;
    };




export type ProductListResponse = PagedResponse<ProductResponse>;
export type ProductListRequestParams = {
    category?: string[];  // slugs
    brand?: string[];     // slugs
    minPrice?: number;
    maxPrice?: number;
    size?: string[];      // S, M, L, XL
    color?: string[];     // color names
    customizable?: boolean;
    sort?: 'price:asc' | 'price:desc' | 'rating:asc' | 'rating:desc' | 'newest' | 'popularity' | 'relevance' | 'createdAt:asc' | 'createdAt:desc';
    page?: number;
    limit?: number;
};
export type FetchProductList = {
    filters: Record<string, string | string[]>;
    page?: number;
    limit?: number;
    sort?: ProductListRequestParams['sort'];
};