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
    list: (params: {
      filters: ProductFilters;
      page?: number;
      size?: number;
      sort?: string;
    }) => ['products', params] as const,
    
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
     * User's cart
     */
    current: () => ['cart', 'current'] as const,
    
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
     * User addresses
     */
    addresses: () => ['user', 'addresses'] as const,
    
    /**
     * User payment methods
     */
    paymentMethods: () => ['user', 'payment-methods'] as const,
  },

  /**
   * Checkout-related query keys
   */
  checkout: {
    /**
     * Base key for all checkout queries
     */
    all: () => ['checkout'] as const,
    
    /**
     * Checkout session
     */
    session: () => ['checkout', 'session'] as const,
    
    /**
     * Shipping options
     */
    shippingOptions: () => ['checkout', 'shipping-options'] as const,
  },

  /**
   * Search-related query keys
   */
  search: {
    /**
     * Base key for all search queries
     */
    all: () => ['search'] as const,
    
    /**
     * Search suggestions
     * @param query - Search query
     */
    suggestions: (query: string) => ['search', 'suggestions', query] as const,
    
    /**
     * Search results
     * @param query - Search query
     * @param filters - Additional filters
     */
    results: (query: string, filters?: Record<string, unknown>) => 
      filters ? ['search', 'results', query, filters] as const : ['search', 'results', query] as const,
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
     * Customization options for a product
     * @param productId - Product ID
     */
    options: (productId: string | number) => ['customization', 'options', productId] as const,
    
    /**
     * User's customizations
     */
    userCustomizations: () => ['customization', 'user'] as const,
  },
} as const;

/**
 * Type helper to extract query key type
 */
export type QueryKey = ReturnType<typeof queryKeys[keyof typeof queryKeys][keyof typeof queryKeys[keyof typeof queryKeys]]>;
