
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
        | 'images'  // Images no longer at product level - moved to variants
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
    imageUrl: string;
    thumbnailUrl?: string;
    
    category: string;           // Design category (e.g., "animals", "nature")
    tags: string[];             // Array of tags for filtering
    
    colors: string[];           // Dominant colors in the design
    price: number;              // Additional price for using this design
    
    isActive: boolean;
    isPremium: boolean;         // Whether this is a premium design
    
    downloadUrl?: string;       // URL to download design file
    fileFormat?: string;        // e.g., "SVG", "PNG"
    
    popularity: number;         // Popularity score for sorting
    createdAt: ISODateString;
    updatedAt?: ISODateString;
}

/**
 * Response containing designs compatible with a product
 */
export interface DesignCompatibilityResponse {
    designs: PagedResponse<Design>;
    productSlug: string;
    totalCompatibleDesigns: number;
}

/**
 * Design category for filtering designs
 */
export interface DesignCategory {
    id: UUID;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    designCount: number;
    isActive: boolean;
}


// ================================================
// CART TYPES
// ================================================

/**
 * Shopping cart containing items
 */
export interface Cart {
    id: UUID;
    userId?: UUID;             // Null for guest carts
    sessionId?: string;        // Session ID for guest carts
    
    items: CartItem[];
    
    subtotal: number;          // Sum of all item prices
    tax: number;               // Calculated tax
    shippingCost: number;      // Shipping fee
    total: number;             // Final total amount
    
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Individual item in the shopping cart
 */
export interface CartItem {
    id: UUID;
    cartId: UUID;
    
    product: ProductResponse;
    variant: ProductVariant;
    
    quantity: number;
    unitPrice: number;         // Price per unit at time of adding
    totalPrice: number;        // quantity * unitPrice
    
    customizationId?: UUID;    // Reference to saved customization if any
    customization?: Customization;
    
    addedAt: ISODateString;
}

/**
 * Request to add item to cart
 */
export interface AddToCartRequest {
    productId: UUID;
    variantId: UUID;
    quantity: number;
    customizationId?: UUID | null;
}

/**
 * Request to update cart item quantity
 */
export interface UpdateCartItemRequest {
    quantity: number;
}

/**
 * Cart summary with totals
 */
export interface CartSummary {
    itemCount: number;
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    discount?: number;         // If coupon applied
}


// ================================================
// CUSTOMIZATION TYPES
// ================================================

/**
 * Saved product customization configuration
 */
export interface Customization {
    id: UUID;
    userId?: UUID;             // Null for guest customizations
    sessionId?: string;        // For guest users
    
    productId: UUID;
    product?: ProductResponse;
    
    configuration: CustomizationConfiguration;
    
    name?: string;             // User-given name for saved design
    previewImageUrl?: string;  // Generated preview image
    thumbnailUrl?: string;     // Thumbnail for gallery view
    
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Customization configuration with layers
 */
export interface CustomizationConfiguration {
    layers: CustomizationLayer[];
    canvasSize?: {
        width: number;
        height: number;
    };
}

/**
 * Single layer in customization (design, text, or image)
 */
export interface CustomizationLayer {
    id?: string;               // Layer identifier
    type: 'design' | 'text' | 'image';
    
    // For design layers
    designId?: UUID;
    
    // For text layers
    text?: string;
    font?: string;
    fontSize?: number;
    color?: string;
    
    // For image layers
    imageUrl?: string;
    
    // Common positioning properties
    position: {
        x: number;
        y: number;
    };
    size?: {
        width: number;
        height: number;
    };
    rotation?: number;         // Rotation angle in degrees
    opacity?: number;          // 0-1
    zIndex?: number;           // Layer order
}

/**
 * Request to save or validate customization
 */
export interface SaveCustomizationRequest {
    productId: UUID;
    configuration: CustomizationConfiguration;
    previewImageUrl?: string;
    thumbnailUrl?: string;
    name?: string;
}

/**
 * Response after saving customization
 */
export interface SaveCustomizationResponse {
    message: string;
    customization: Customization;
}

/**
 * Response for customization validation
 */
export interface ValidateCustomizationResponse {
    valid: boolean;
    errors?: string[];
    warnings?: string[];
}


// ================================================
// ADDRESS TYPES
// ================================================

/**
 * User address for shipping and billing
 */
export interface Address {
    id: UUID;
    userId: UUID;
    
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    
    isDefault: boolean;        // Default shipping/billing address
    
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Request to add or update address
 */
export interface AddressRequest {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
}


// ================================================
// USER PROFILE TYPES
// ================================================

/**
 * Extended user profile information
 */
export interface UserProfile extends User {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    
    // Preferences
    marketingEmailsEnabled?: boolean;
    smsNotificationsEnabled?: boolean;
    
    // Statistics
    totalOrders?: number;
    totalSpent?: number;
    
    addresses?: Address[];
}

/**
 * Request to update user profile
 */
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
}


// ================================================
// SEARCH TYPES
// ================================================

/**
 * Global search request parameters
 */
export interface SearchRequest {
    query: string;             // Search query
    type?: 'products' | 'designs' | 'all';
    page?: number;
    size?: number;
}

/**
 * Search results with multiple content types
 */
export interface SearchResponse {
    query: string;
    products?: ProductSearchResponse;
    designs?: PagedResponse<Design>;
    totalResults: number;
}
