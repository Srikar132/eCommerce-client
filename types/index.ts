
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
export interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories?: Category[]; // Recursive structure for nested categories
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
export interface CategoryTreeNode extends Category {
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
