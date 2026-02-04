
// ================================================
// COMMON TYPES USED ACROSS THE APPLICATION
// ================================================


export type UUID = string;
export type ISODateString = string;


export interface PagedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}



// ================================================
// TYPES FOR USER AUTHENTICATION AND MANAGEMENT
// ================================================

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
    id: string;
    phone: string;
    countryCode: string;
    phoneVerified: boolean;
    phoneVerifiedAt?: string;
    email?: string;
    emailVerified: boolean;
    username?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    failedLoginAttempts: number;
    lockedUntil?: string;
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
}

export interface Review {
    id : string;
    userId : string;
    userName : string;
    productId : string;
    rating : number;
    title : string;
    comment : string;
    isVerifiedPurchase : boolean;
    createdAt : string;
}



export interface Product {
    id: UUID;

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
        
        // Variants now include their specific images
        
    };





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
 * DTO returned from /api/v1/products/{slug}/variants endpoint
 */
export type ProductVariantDTO = ProductVariant;

/**
 * Response containing paginated product reviews
 */
export type ProductReviewsResponse = PagedResponse<Review>;
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




/**
 * Design information for customizable products
 */
export interface Design {
    id: UUID;
    name: string;
    slug: string;
    
    description?: string;
    designImageUrl: string; // Actual design image URL
    thumbnailUrl: string; // Showcase thumbnail URL

    category: DesignCategory;
    
    tags: string[];
    
    isActive: boolean;

    designPrice: number;

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
    id: string;
    userId?: UUID | null;
    productId: UUID;
    variantId: UUID;
    designId: UUID;
    threadColorHex: string;
    additionalNotes?: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
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
    primaryImageUrl: string;  // The main image for this variant
}

export interface VariantSummary {
    id: UUID;
    size: string;
    color: string;
    sku: string;
}

export interface CustomizationSummary {
    id: UUID;
    variantId: UUID;
    designId: UUID;
    threadColorHex: string;
    additionalNotes?: string;
}

/**
 * Individual cart item with product, variant, and customization details
 */
export interface CartItem {
    id: UUID;
    product: ProductSummary;
    variant: VariantSummary;  // Make required, not optional
    customization?: CustomizationSummary | null;
    quantity: number;
    unitPrice: number;
    itemTotal: number;
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
    taxAmount: number;
    shippingCost: number;
    total: number;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

// ===================================

export interface OrderItem {
    id: UUID;
    productId: UUID;
    productName: string;
    productSlug: string;
    variantId: UUID;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    hasCustomization: boolean;
    customizationSnapshot?: string | null;  // JSON string
    productionStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    imageUrl?: string | null;
}


export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURNED = "RETURNED",
    REFUNDED = "REFUNDED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
};

export interface Order {
  id: UUID;

  orderNumber: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentMethod?: "card" | "upi" | "netbanking";

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;

  shippingAddress?: Address;
  billingAddress?: Address;

  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: ISODateString;
  deliveredAt?: ISODateString;


  cancelledAt?: ISODateString;
  cancellationReason?: string;
  returnRequestedAt?: ISODateString;
  returnReason?: string;

  notes?: string;

  createdAt: ISODateString;
  updatedAt: ISODateString;

  items: OrderItem[];
}

// ============================
// REQUEST TYPES
// ============================

/**
 * Request to add item to cart
 */
export interface AddToCartRequest {
    productId: UUID;
    productVariantId?: UUID | null;
    quantity: number;
    additionalNotes?: string;
    customizationData?: CustomizationData | null;
}

/**
 * Inline customization data for cart items
 */
export interface CustomizationData {
    designId: UUID;
    threadColorHex: string; // Format: #RRGGBB
    additionalNotes?: string;
}




