// ============================================================================
// QUERY HOOKS
// ============================================================================

import { getAllProducts } from "@/lib/actions/product-actions";
import { PagedResponse } from "@/types";
import { Product, ProductParams } from "@/types/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

/**
 * Infinite scroll product list with filters, pagination, and sorting
 */
export const useInfiniteProducts = (params: ProductParams) => {
  const { category, size, searchQuery, page = 0, limit = 20, sortBy = 'CREATED_AT_DESC' } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ category, size, searchQuery, page, limit, sortBy }),
    queryFn: ({ pageParam = page }) =>
      getAllProducts({ category, size, searchQuery, page: pageParam, limit, sortBy }),
    initialPageParam: page,
    getNextPageParam: (lastPage: PagedResponse<Product>) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// /**
//  * Single page product list (useful for server-side rendering or simple lists)
//  */
// export const useProducts = (params: FetchProductList) => {
//   return useQuery({
//     queryKey: queryKeys.products.list(params),
//     queryFn: () => productApi.getProducts(params),
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// };

// /**
//  * Get single product by slug or ID
//  * Includes ALL variants with images, stock info, prices, SKUs, etc.
//  * No need for separate variants API call!
//  * 
//  * @example
//  * ```tsx
//  * const { data: product, isLoading } = useProduct('navy-blue-tshirt');
//  * // product.variants contains all color/size combinations with full details
//  * ```
//  */
// export const useProduct = (
//   slugOrId: string,
//   options?: { enabled?: boolean; initialData?: Awaited<ReturnType<typeof productApi.getProductBySlug>> }
// ) => {
//   return useQuery({
//     queryKey: queryKeys.products.detail(slugOrId),
//     queryFn: () => productApi.getProductBySlug(slugOrId),
//     enabled: options?.enabled ?? true,
//     initialData: options?.initialData,
//     staleTime: 1000 * 60 * 10, // 10 minutes
//   });
// };

// /**
//  * Get product variants separately
//  * Use this when you only need variant data without full product details
//  * 
//  * @example
//  * ```tsx
//  * const { data: variants, isLoading } = useProductVariants('navy-blue-tshirt');
//  * ```
//  */
// export const useProductVariants = (
//   slug: string,
//   options?: { enabled?: boolean , initialData?: Awaited<ReturnType<typeof productApi.getProductVariants>> }
// ) => {
//   return useQuery({
//     queryKey: queryKeys.products.variants(slug),
//     queryFn: () => productApi.getProductVariants(slug),
//     enabled: options?.enabled ?? true,
//     initialData: options?.initialData,
//     staleTime: 1000 * 60 * 10, // 10 minutes
//   });
// };


// /**
//  * Get product reviews with infinite scroll
//  * 
//  * @example
//  * ```tsx
//  * const { data, fetchNextPage, hasNextPage } = useProductReviews('navy-blue-tshirt');
//  * ```
//  */
// export const useProductReviews = (slug: string, params?: { size?: number; sort?: string }) => {
//   const { size = 10, sort = 'createdAt,desc' } = params || {};

//   return useInfiniteQuery({
//     queryKey: queryKeys.products.reviews(slug, { page: 0, size, sort }),
//     queryFn: ({ pageParam = 0 }) => 
//       productApi.getProductReviews(slug, pageParam, size, sort),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => 
//       lastPage.last ? undefined : lastPage.page + 1,
//     enabled: !!slug,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// };

// // ============================================================================
// // MUTATION HOOKS
// // ============================================================================

// /**
//  * Add a review to a product
//  * 
//  * @example
//  * ```tsx
//  * const addReview = useAddProductReview('navy-blue-tshirt');
//  * 
//  * addReview.mutate({
//  *   rating: 5,
//  *   title: 'Great product!',
//  *   comment: 'I love it!'
//  * });
//  * ```
//  */
// export const useAddProductReview = (slug: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: AddReviewRequest) =>
//       productApi.addProductReview(slug, data),
//     onSuccess: () => {
//       // Invalidate product reviews to refetch
//       queryClient.invalidateQueries({
//         queryKey: ['products', 'reviews', slug],
//       });
      
//       // Also invalidate product detail to update rating
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.products.detail(slug),
//       });
//     },
//   });
// };

// // ============================================================================
// // HELPER HOOKS
// // ============================================================================

// /**
//  * Get flat array of products from infinite query result
//  * 
//  * @example
//  * ```tsx
//  * const query = useInfiniteProducts({ filters: {}, page: 0, size: 24 });
//  * const products = useFlatProducts(query.data);
//  * ```
//  */
export const useFlatProducts = (data: ReturnType<typeof useInfiniteProducts>['data']) => {
  return data?.pages.flatMap((page) => page.data) ?? [];
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
  return data?.pages[0]?.totalElements ?? 0;
};
