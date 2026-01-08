/**
 * Queries Index
 * 
 * Central export point for all TanStack Query hooks.
 * Import queries from this file in your components.
 * 
 * @example
 * ```tsx
 * import { useInfiniteProducts, useRootCategories } from '@/lib/tanstack/queries';
 * ```
 */

// Product queries
export {
  useInfiniteProducts,
  useProducts,
  useProduct,
  useProductVariants,
  useProductReviews,
  useCompatibleDesigns,
  useAddProductReview,
  useFlatProducts,
  useProductCount,
  useProductFacets,
} from './product.queries';

// Category queries
export {
  useRootCategories,
  useCategoryChildren,
  useCategories,
  useCategory,
  usePrefetchCategoryChildren,
} from './category.queries';
