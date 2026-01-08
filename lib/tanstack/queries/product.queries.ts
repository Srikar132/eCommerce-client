/**
 * Product Queries Layer
 * 
 * Reusable hooks for product-related data fetching.
 * This layer sits between UI components and the API,
 * providing a clean, consistent interface with built-in
 * query keys, caching, and error handling.
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product";
import { queryKeys  } from "../query-keys";
import type { 
  FetchProductList, 
  ProductSearchResponse, 
  ProductDetail,
  AddReviewRequest,
  AddReviewResponse
} from "@/types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Infinite scroll product list with filters, pagination, and sorting
 */
export const useInfiniteProducts = (params: {
  filters: Record<string, string | string[] | boolean | number>;
  page?: number;
  size?: number;
  sort?: string;
}) => {
  const { filters, page = 0, size = 24, sort = 'createdAt,desc' } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ filters, page, size, sort }),
    queryFn: ({ pageParam = page }) =>
      productApi.getProducts({
        filters,
        page: pageParam,
        size,
        sort,
      }),
    initialPageParam: page,
    getNextPageParam: (lastPage: ProductSearchResponse) =>
      lastPage.products.last ? undefined : lastPage.products.page + 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Single page product list (useful for server-side rendering or simple lists)
 */
export const useProducts = (params: FetchProductList) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get single product by slug or ID
 * 
 * @example
 * ```tsx
 * const { data: product, isLoading } = useProduct('navy-blue-tshirt');
 * ```
 */
export const useProduct = (slugOrId: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(slugOrId),
    queryFn: () => productApi.getProductBySlug(slugOrId),
    enabled: !!slugOrId, // Only fetch if slug/id is provided
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Get product variants (colors, sizes, etc.)
 * 
 * @example
 * ```tsx
 * const { data: variants } = useProductVariants('navy-blue-tshirt');
 * ```
 */
export const useProductVariants = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.products.variants(slug),
    queryFn: () => productApi.getProductVariants(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Get product reviews
 * 
 * @example
 * ```tsx
 * const { data: reviews } = useProductReviews('navy-blue-tshirt');
 * ```
 */
export const useProductReviews = (slug: string, page = 0, size = 10, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: queryKeys.products.reviews(slug, { page, size, sort }),
    queryFn: () => productApi.getProductReviews(slug, page, size, sort),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get designs compatible with a product
 * 
 * @example
 * ```tsx
 * const { data: designs } = useCompatibleDesigns('navy-blue-tshirt');
 * ```
 */
export const useCompatibleDesigns = (slug: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: queryKeys.products.designs(slug, { page, size }),
    queryFn: () => productApi.getCompatibleDesigns(slug, page, size),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Add a review to a product
 * 
 * @example
 * ```tsx
 * const addReview = useAddProductReview('navy-blue-tshirt');
 * 
 * addReview.mutate({
 *   rating: 5,
 *   title: 'Great product!',
 *   comment: 'I love it!'
 * });
 * ```
 */
export const useAddProductReview = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddReviewRequest) =>
      productApi.addProductReview(slug, data),
    onSuccess: () => {
      // Invalidate product reviews to refetch
      queryClient.invalidateQueries({
        queryKey: ['products', 'reviews', slug],
      });
      
      // Also invalidate product detail to update rating
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(slug),
      });
    },
  });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get flat array of products from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteProducts({ filters: {}, page: 0, size: 24 });
 * const products = useFlatProducts(query.data);
 * ```
 */
export const useFlatProducts = (data: ReturnType<typeof useInfiniteProducts>['data']) => {
  return data?.pages.flatMap((page) => page.products.content) ?? [];
};

/**
 * Get total product count from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteProducts({ filters: {}, page: 0, size: 24 });
 * const total = useProductCount(query.data);
 * ```
 */
export const useProductCount = (data: ReturnType<typeof useInfiniteProducts>['data']) => {
  return data?.pages[0]?.products.totalElements ?? 0;
};

/**
 * Get facets (filters) from product search result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteProducts({ filters: {}, page: 0, size: 24 });
 * const facets = useProductFacets(query.data);
 * ```
 */
export const useProductFacets = (data: ReturnType<typeof useInfiniteProducts>['data']) => {
  return data?.pages[0]?.facets;
};
