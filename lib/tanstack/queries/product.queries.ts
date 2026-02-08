// ============================================================================
// QUERY HOOKS
// ============================================================================

import { addReviewToProduct, getAllProducts, getReviewsByProductId } from "@/lib/actions/product-actions";
import { PagedResponse } from "@/types";
import { AddReviewRequest, Product, ProductParams, Review } from "@/types/product";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

/**
 * Infinite scroll product list with filters, pagination, and sorting
 */
export const useInfiniteProducts = (params: ProductParams, initialData?: PagedResponse<Product>) => {
  const { category, size, searchQuery, page = 0, limit = 20, sortBy = 'CREATED_AT_DESC' } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ category, size, searchQuery, page, limit, sortBy }),
    queryFn: ({ pageParam = page }) =>
      getAllProducts({ category, size, searchQuery, page: pageParam, limit, sortBy }),
    initialPageParam: page,
    getNextPageParam: (lastPage: PagedResponse<Product>) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...(initialData && {
      initialData: {
        pages: [initialData],
        pageParams: [page],
      },
    }),
  });
};




/**
 * Get product reviews with infinite scroll
 */
export const useInfiniteProductReviews = (productId: string, params?: { size?: number}) => {
  const { size = 10 } = params || {};

  return useInfiniteQuery({
    queryKey: queryKeys.products.reviews(productId, { page: 0, size }),
    queryFn: ({ pageParam = 0 }) => getReviewsByProductId(productId, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PagedResponse<Review>) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};


export const useAddProductReview = (userId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddReviewRequest) => addReviewToProduct(userId , productId , data),
    onSuccess: () => {
      // Invalidate product reviews to refetch
      queryClient.invalidateQueries({
        queryKey: ['products', 'reviews', productId],
      });
    },
  });
};

//============================================================================
// // HELPER HOOKS
//============================================================================

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
