// Product queries
export {
  useInfiniteProducts,
  useProducts,
  useProduct,
  useProductReviews,
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

// Cart queries
export {
  useCart,
  useCartSummary,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useSyncLocalCart,
} from './cart.queries';

// Order queries
export {
  useInfiniteOrders,
  useMyRecentOrders
} from './orders.queries';

// Wishlist queries
export {
  useWishlist,
  useCheckWishlist,
  useWishlistCount,
  useAddToWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
  useToggleWishlist,
} from './wishlist.queries';