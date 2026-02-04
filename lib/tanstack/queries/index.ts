// Product queries
export {
  useInfiniteProducts,
  useFlatProducts,
  useProductCount,
} from './product.queries';

// Cart queries
export {
  useCart,
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