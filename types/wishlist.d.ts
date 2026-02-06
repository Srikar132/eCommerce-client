/**
 * Wishlist Item - Product data with wishlist-specific fields
 */
export interface WishlistItem {
  // Wishlist-specific fields
  wishlistId: string;
  addedAt: string;

  // Product fields
  productId: string;
  productName: string;
  productSlug: string;
  productDescription?: string;

  basePrice: number;
  sku: string;

  // Primary image
  primaryImageUrl?: string;
  primaryImageAlt?: string;

  // Additional info
  material?: string;
  careInstructions?: string;

  // Optional category info
  categoryName?: string;

  // Stock status
  inStock: boolean;
  isActive: boolean;
}

/**
 * Wishlist response with items
 */
export interface WishlistResponse {
  items: WishlistItem[];
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
