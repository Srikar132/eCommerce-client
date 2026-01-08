/**
 * Category Queries Layer
 * 
 * Reusable hooks for category-related data fetching.
 * Handles category navigation, hierarchies, and filtering.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi, CategoryFilters } from "@/lib/api/category";
import { queryKeys } from "../query-keys";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get root categories (minimal data for navigation)
 * This is typically prefetched on the server
 * 
 * @example
 * ```tsx
 * const { data: categories } = useRootCategories();
 * ```
 */
export const useRootCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.root(),
    queryFn: async () => {
      return await categoryApi.getCategories({
        filters: { minimal: true },
      });
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - keep data fresh all day
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
    placeholderData: FALLBACK_CATEGORIES as any,
  });
};

/**
 * Get category children by slug (for mega menus)
 * This is typically prefetched on the server for all root categories
 * 
 * @example
 * ```tsx
 * const { data: subCategories } = useCategoryChildren('men-fashion');
 * ```
 */
export const useCategoryChildren = (categorySlug: string) => {
  return useQuery({
    queryKey: queryKeys.categories.children(categorySlug),
    queryFn: async () => {
      const data = await categoryApi.getCategories({
        filters: {
          slug: categorySlug,
          recursive: true,
          minimal: true,
          includeProductCount: true,
        },
      });
      return data;
    },
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - keep data fresh all day
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
    placeholderData: [], // Always have data, never show loading
  });
};

/**
 * Get categories with custom filters
 * 
 * @example
 * ```tsx
 * const { data: categories } = useCategories({
 *   recursive: true,
 *   includeProductCount: true
 * });
 * ```
 */
export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: async () => {
      return await categoryApi.getCategories({ filters });
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Get single category by slug
 * 
 * @example
 * ```tsx
 * const { data: category } = useCategory('men-fashion');
 * ```
 */
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: async () => {
      const categories = await categoryApi.getCategories({
        filters: { slug, includeChildren: true },
      });
      return categories[0]; // API returns array, get first item
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Prefetch category children for a specific slug
 * Useful for optimistic prefetching on hover
 * 
 * @example
 * ```tsx
 * const prefetchChildren = usePrefetchCategoryChildren();
 * 
 * <div onMouseEnter={() => prefetchChildren('men-fashion')}>
 *   Men's Fashion
 * </div>
 * ```
 */
export const usePrefetchCategoryChildren = () => {
  const queryClient = useQueryClient();

  return (categorySlug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.children(categorySlug),
      queryFn: async () => {
        const data = await categoryApi.getCategories({
          filters: {
            slug: categorySlug,
            recursive: true,
            minimal: true,
            includeProductCount: true,
          },
        });
        return data;
      },
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  };
};
