import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { designsApi } from '@/lib/api/design';
import type { Design, PagedResponse } from '@/types';
import { initial } from 'lodash';

/**
 * Infinite query hook for fetching designs with pagination
 * Automatically loads more designs as user scrolls
 * 
 * @param filters - Design filters (categorySlug, q, isPremium)
 * @param pageSize - Number of designs per page (default: 20)
 */
export function useInfiniteDesigns(
  filters?: {
    categorySlug?: string;
    q?: string;
    isPremium?: boolean;
  },
  pageSize: number = 20, options?: {
    initialData: Awaited<ReturnType<typeof designsApi.getDesigns>>
  }
) {
  return useInfiniteQuery({
    queryKey: ['designs', 'infinite', filters, pageSize],
    queryFn: ({ pageParam = 0 }) =>
      designsApi.getDesigns({
        filters,
        page: pageParam,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      }),
    getNextPageParam: (lastPage: PagedResponse<Design>) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialData: options?.initialData
      ? {
          pages: [options.initialData],
          pageParams: [0],
        }
      : undefined,
    initialPageParam: 0,
  });
}

/**
 * Query hook for fetching a single design by ID
 * 
 * @param id - Design UUID
 */
export function useDesign(id: string) {
  return useQuery({
    queryKey: ['design', id],
    queryFn: () => designsApi.getDesignById(id),
    enabled: !!id,
  });
}



/**
 * Query hook for fetching all design categories
 *
 * Ex : floral-patterns , vintage-patterns....
 */
export function useDesignCategories(options? : {
  initialData?: Awaited<ReturnType<typeof designsApi.getAllDesignCategories>>
}) {
  return useQuery({
    queryKey: ['design', 'categories'],
    queryFn: () => designsApi.getAllDesignCategories(),
    initialData: options?.initialData,
  });
}





// ============================================
// HELPER HOOKS
// ============================================

/**
 * Helper hook to flatten paginated infinite query data into a single array
 * Extracts all designs from all pages
 * 
 * @param data - Infinite query data
 */
export function useFlatDesigns(
  data: { pages: PagedResponse<Design>[] } | undefined
): Design[] {
  if (!data?.pages) return [];
  return data.pages.flatMap((page) => page.content);
}

/**
 * Helper hook to get total count from infinite query data
 * 
 * @param data - Infinite query data
 */
export function useDesignCount(
  data: { pages: PagedResponse<Design>[] } | undefined
): number {
  return data?.pages?.[0]?.totalElements ?? 0;
}
