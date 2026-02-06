/**
 * Query Keys Factory
 * 
 * Centralized query key management for TanStack Query.
 * This ensures consistency across the application and provides type safety.
 * 
 * Benefits:
 * - Single source of truth for all query keys
 * - Type-safe query key generation
 * - Easy to refactor and maintain
 * - Prevents key mismatches between prefetch and client queries
 */

import { ProductParams } from "@/types/product";

export interface ProductFilters {
  category?: string | string[];
  brand?: string | string[];
  productSize?: string | string[];
  color?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  customizable?: boolean;
  searchQuery?: string;
}

export interface CategoryFilters {
  slug?: string;
  recursive?: boolean;
  minimal?: boolean;
  includeProductCount?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Query Keys Factory Object
 * 
 * Usage:
 * - queryKeys.products.list({ filters, page, size, sort })
 * - queryKeys.categories.root()
 * - queryKeys.categories.children(slug)
 */
export const queryKeys = {
  /**
   * Product-related query keys
   */
  products: {
    /**
     * Base key for all product queries
     */
    all: () => ['products'] as const,
    
    /**
     * Product list with filters and pagination
     * @param filters - Product filters
     * @param page - Page number (0-based)
     * @param size - Page size
     * @param sort - Sort order
     */
    list: (params: ProductParams) => ['products', params] as const,
    
    /**
     * Single product by ID or slug
     * @param identifier - Product ID or slug
     */
    detail: (identifier: string | number) => ['products', 'detail', identifier] as const,
    
    /**
     * Related products
     * @param productId - Product ID
     */
    related: (productId: string | number) => ['products', 'related', productId] as const,


    /**
     * Product Variants
     * @param slug - Product slug
     */
    variants: (slug: string) => ['products', 'variants', slug] as const,

    /**
     * Product Reviews
     * @param slug - Product slug , { page, size, sort }
     */
    reviews: (slug: string, params: { page?: number; size?: number; sort?: string }) => ['products', 'reviews', slug, params] as const,

    /**
     *  Compatible Designs
     * @param slug - Product slug
     */
    designs: (slug: string, params: { page?: number; size?: number }) => ['products', 'designs', slug, params] as const,

  },

  /**
   * Category-related query keys
   */
  categories: {
    /**
     * Base key for all category queries
     */
    all: () => ['categories'] as const,
    
    /**
     * Root categories (minimal data)
     */
    root: () => ['categories', { minimal: true }] as const,
    
    /**
     * Category list with filters
     * @param filters - Category filters
     */
    list: (filters?: CategoryFilters) => 
      filters ? ['categories', filters] as const : ['categories'] as const,
    
    /**
     * Category children by slug
     * @param slug - Category slug
     */
    children: (slug: string) => ['category-children', slug] as const,
    
    /**
     * Single category by ID or slug
     * @param identifier - Category ID or slug
     */
    detail: (identifier: string | number) => ['categories', 'detail', identifier] as const,
  },

  /**
   * Cart-related query keys
   */
  cart: {
    /**
     * Base key for all cart queries
     */
    all: () => ['cart'] as const,
    
    /**
     * User's cart with all details
     */
    details: () => ['cart', 'details'] as const,
    
    /**
     * User's cart (or guest cart) - alias for details
     */
    current: () => ['cart', 'current'] as const,
    
    /**
     * Cart summary (lightweight)
     */
    summary: () => ['cart', 'summary'] as const,
    
    /**
     * Cart item count
     */
    count: () => ['cart', 'count'] as const,
  },

  /**
   * User/Account-related query keys
   */
  user: {
    /**
     * Base key for all user queries
     */
    all: () => ['user'] as const,
    
    /**
     * Current user profile
     */
    profile: () => ['user', 'profile'] as const,
    
    /**
     * User orders
     */
    orders: (params?: { page?: number; size?: number }) => 
      params ? ['user', 'orders', params] as const : ['user', 'orders'] as const,
    
    /**
     * User addresses (all addresses)
     */
    addresses: () => ['user', 'addresses'] as const,
    
    /**
     * Single user address by ID
     * @param id - Address ID
     */
    address: (id: string) => ['user', 'addresses', id] as const,
    
    /**
     * User payment methods
     */
    paymentMethods: () => ['user', 'payment-methods'] as const,
  },




  /**
   * Brand-related query keys
   */
  brands: {
    /**
     * Base key for all brand queries
     */
    all: () => ['brands'] as const,
    
    /**
     * Brand list
     */
    list: () => ['brands', 'list'] as const,
    
    /**
     * Single brand
     * @param identifier - Brand ID or slug
     */
    detail: (identifier: string | number) => ['brands', 'detail', identifier] as const,
  },

  /**
   * Customization-related query keys
   */
  customization: {
    /**
     * Base key for all customization queries
     */
    all: () => ['customization'] as const,
    
    /**
     * Single customization by ID
     * @param customizationId - Customization ID
     */
    detail: (customizationId: string) => ['customization', 'detail', customizationId] as const,
    
    /**
     * User's all customizations (paginated)
     * @param params - Pagination params
     */
    myDesigns: (params: { page?: number; size?: number }) => 
      ['customization', 'my-designs', params] as const,
    
    /**
     * User's customizations for a specific product
     * @param productId - Product ID
     */
    byProduct: (productId: string) => ['customization', 'product', productId] as const,
    
    /**
     * Guest customizations for a specific product
     * @param productId - Product ID
     * @param sessionId - Guest session ID
     */
    guestByProduct: (productId: string, sessionId: string) => 
      ['customization', 'guest', productId, sessionId] as const,
    
    /**
     * Latest customization for a product
  T   * @param productId - Product ID
     */
    latest: (productId: string) => ['customization', 'latest', productId] as const,
  },


  orders : {
    my : (page : number, size : number) => ['orders','my', { page, size }] as const
  },

  /**
   * Wishlist-related query keys
   */
  wishlist: {
    /**
     * Base key for all wishlist queries
     */
    all: () => ['wishlist'] as const,
    
    /**
     * User's wishlist with all details
     */
    details: () => ['wishlist', 'details'] as const,
    
    /**
     * Check if product is in wishlist
     * @param productId - Product ID
     */
    check: (productId: string | undefined) => 
      productId ? ['wishlist', 'check', productId] as const : ['wishlist', 'check'] as const,
    
    /**
     * Wishlist item count
     */
    count: () => ['wishlist', 'count'] as const,
  },

  /**
   * Account-related query keys
   */
  account: {
    /**
     * Base key for all account queries
     */
    all: () => ['account'] as const,
    
    /**
     * Account details (name, email, phone)
     */
    details: () => ['account', 'details'] as const,
    
    /**
     * User statistics (orders, wishlist, addresses, cart)
     */
    stats: () => ['account', 'stats'] as const,
  },

  /**
   * Address-related query keys
   */
  addresses: {
    /**
     * Base key for all address queries
     */
    all: () => ['addresses'] as const,
    
    /**
     * All user addresses
     */
    list: () => ['addresses', 'list'] as const,
    
    /**
     * Single address by ID
     * @param addressId - Address ID
     */
    detail: (addressId: string) => ['addresses', 'detail', addressId] as const,
    
    /**
     * Default address
     */
    default: () => ['addresses', 'default'] as const,
  },
} as const;

/**
 * Type helper to extract query key type
 */
export type QueryKey = ReturnType<typeof queryKeys[keyof typeof queryKeys][keyof typeof queryKeys[keyof typeof queryKeys]]>;
