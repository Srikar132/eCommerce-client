
// ================================================
// COMMON TYPES USED ACROSS THE APPLICATION
// ================================================

import { unique } from "next/dist/build/utils";
import { nullable } from "zod/v3";

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

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    phone?: string;
    emailVerified: boolean;
    addresses: Address[];
    createdAt: string;
}

export interface UpdateProfileRequest {
    username?: string;
    phone?: string;
}

export interface Address {
    id: UUID;
    addressType: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
}

export interface AddAddressRequest {
    addressType: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export type UpdateAddressRequest = AddAddressRequest;

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

export type ImageRole = 'PREVIEW_BASE' | 'PREVIEW_CUSTOMIZED' | 'GALLERY';

export interface ProductImage {
    id: UUID;

    imageUrl: string;
    altText?: string;

    displayOrder: number;
    isPrimary: boolean;
    imageRole?: ImageRole;  // Role of the image (PREVIEW_BASE, PREVIEW_CUSTOMIZED, GALLERY)
}

export interface ProductVariant {
    id: UUID;
    productId?: UUID | null;  // May be null in some responses

    size: string;        // S, M, L, XL
    color: string;
    colorHex?: string;   // #FFFFFF

    stockQuantity: number;
    additionalPrice: number;

    sku: string;
    isActive: boolean;
    
    // Images now belong to variants
    images?: ProductImage[];
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
        
        // Variants now include their specific images
        variants?: ProductVariant[];
    };





export interface ProductSearchResponse {
    products: PagedResponse<ProductResponse>;
    facets: ProductFacets;
}


export type ProductListRequestParams = {
    category?: string[];      // Array of category slugs
    brand?: string[];         // Array of brand slugs
    minPrice?: number;        // Minimum price filter
    maxPrice?: number;        // Maximum price filter
    productSize?: string[];   // Product sizes: ["S", "M", "L", "XL"]
    color?: string[];         // Array of color names
    customizable?: boolean;   // Filter for customizable products
    searchQuery?: string;    // Full-text search query
    sort?: string;           // Sort format: "field,direction" e.g., "createdAt,desc"
    page?: number;           // 0-based page number
    size?: number;           // Page size (items per page)
};

export type FetchProductList = {
    filters: Record<string, string | string[] | boolean | number>;
    page?: number;
    size?: number;
    sort?: string;
};


// ================================================
// TYPES FOR FACETS
// ================================================
export interface FacetItem {
    value: string;        // slug or raw value (e.g. "t-shirts", "M", "black")
    label: string;        // display label (e.g. "T-Shirts", "Medium")
    count: number;        // number of matching products
    selected?: boolean;   // whether user selected this filter
    colorHex?: string;    // only for color facet
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface ProductFacets {
    categories: FacetItem[];
    brands: FacetItem[];
    sizes: FacetItem[];
    colors: FacetItem[];
    priceRange: PriceRange;
    totalProducts?: number;
}


//category.ts
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  subCategories?: CategoryResponse[]; // Recursive structure for nested categories
  productCount?: number; // Optional, included when includeProductCount=true
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  parentId?: string | null;
  level?: number; // Category hierarchy level
  createdAt: string;
  updatedAt?: string;
}

/**
 * Category Tree Node
 * Used for building category navigation trees
 */
export interface CategoryTreeNode extends CategoryResponse {
  children: CategoryTreeNode[];
  parent?: CategoryTreeNode;
  path: string[]; // Array of slugs from root to current node
}

/**
 * Category Navigation Item
 * Simplified structure for rendering navigation
 */
export interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
  href: string; // Full URL path
  subItems?: CategoryNavItem[];
  productCount?: number;
}

/**
 * Mega Menu Section
 * Represents a column in the mega menu dropdown
 */
export interface MegaMenuSection {
  title: string;
  slug: string;
  items: {
    name: string;
    slug: string;
    href: string;
    productCount?: number;
  }[];
}

/**
 * Category Breadcrumb Item
 */
export interface CategoryBreadcrumb {
  name: string;
  slug: string;
  href: string;
}


// ================================================
// ADDITIONAL PRODUCT TYPES
// ================================================

/**
 * Full product details with all related information
 * Used when fetching a single product by slug
 */
export type ProductDetail = ProductResponse

/**
 * Response containing paginated product reviews
 */
export interface ProductReviewsResponse {
    reviews: PagedResponse<Review>;
    averageRating: number;
    ratingDistribution: RatingDistribution;
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
    title: string;               // Review title/headline
    comment: string;             // Review text content
    wouldRecommend: boolean;     // Whether user would recommend the product
}

/**
 * Response after successfully adding a review
 */
export interface AddReviewResponse {
    message: string;
    review: Review;
}




/**
 * Design information for customizable products
 */
export interface Design {
    id: UUID;
    name: string;
    slug: string;
    
    description?: string;
    imageUrl: string;                       // Main design image
    thumbnailUrl?: string;
    
    category: DesignCategory;              // Design category name (e.g., "Animals", "Nature")
    categoryId?: UUID;             // Design category ID
    categoryName?: string;         // Design category name
    categorySlug?: string;         // Design category slug
    
    tags: string[];                // Array of tags for filtering
    
    isActive: boolean;
    isPremium: boolean;            // Whether this is a premium design
    downloadCount?: number;        // Number of times design has been downloaded
    
    createdAt: ISODateString;
    updatedAt?: ISODateString;
}


/**
 * Design category for filtering designs
 */
export interface DesignCategory {
    id: UUID;
    name: string;
    slug: string;
    description?: string;
    designCount: number;
    isActive: boolean;
}


// ============================
// CUSTOMIZATION TYPES
// ============================

export interface Customization {
    customizationId: string;
    userId?: UUID | null;
    sessionId?: string | null;
    productId: UUID;
    variantId: UUID;
    designId: UUID;
    threadColorHex: string;
    previewImageUrl: string;
    isCompleted: boolean;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

// Request type for saving customization
export interface CustomizationRequest {
    customizationId?: string | null; // Null/empty for new, provided for updates
    sessionId?: string | null; // For guest users
    productId: UUID;
    variantId: UUID;
    designId: UUID;
    threadColorHex: string; // Format: #RRGGBB
    previewImageUrl: string; // S3/CloudFront URL of generated preview
}

// Response type when saving customization
export interface SaveCustomizationResponse {
    customizationId: string;
    previewImageUrl: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
    isUpdate: boolean;
}


// ============================
// CART TYPES
// ============================

/**
 * Summary types for cart items
 */
export interface ProductSummary {
    id: UUID;
    name: string;
    slug: string;
    sku: string;
    imageUrl?: string;
}

export interface VariantSummary {
    id: UUID;
    size: string;
    color: string;
    sku: string;
}

export interface CustomizationSummary {
    id: UUID;
    customizationId: string;
    variantId: UUID;
    designId: UUID;
    threadColorHex: string;
    previewImageUrl: string;
}

/**
 * Individual cart item with product, variant, and customization details
 */
export interface CartItem {
    id: UUID;
    product: ProductSummary;
    variant?: VariantSummary | null;
    customization?: CustomizationSummary | null;
    quantity: number;
    unitPrice: number;
    customizationPrice?: number;
    itemTotal: number;
    customizationSummary?: string | null;
    addedAt: ISODateString;
}

/**
 * Complete cart response with items and totals
 */
export interface Cart {
    id: UUID;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    discountAmount?: number;
    taxAmount?: number;
    total: number;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Cart summary for quick display (header, etc.)
 */
export interface CartSummary {
    totalItems: number;
    subtotal: number;
    discountAmount?: number;
    taxAmount?: number;
    total: number;
    couponCode?: string | null;
}

/**
 * Request to add item to cart
 */
export interface AddToCartRequest {
    productId: UUID;
    productVariantId?: UUID | null;
    customizationId?: UUID | null;
    quantity: number;
    customizationSummary?: string | null;
}

/**
 * Request to update cart item quantity
 */
export interface UpdateCartItemRequest {
    quantity: number;
}