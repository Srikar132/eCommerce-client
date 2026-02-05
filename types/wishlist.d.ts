import { Product } from "./product";


export interface WishlistResponse {
  items: Product[];
  totalItems: number;
}

/**
 * Request to add product to wishlist
 */
export interface AddToWishlistRequest {
  productId: string;
}

/**
 * Check wishlist response
 */
export interface CheckWishlistResponse {
  inWishlist: boolean;
}

/**
 * Wishlist count response
 */
export interface WishlistCountResponse {
  count: number;
}
