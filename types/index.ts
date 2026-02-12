// ================================================
// COMMON TYPES USED ACROSS THE APPLICATION
// ================================================

// Re-export types from other files
export type { Product, ProductImage, ProductVariant, ProductParams, Review, AddReviewRequest, AddReviewResponse, RatingDistribution, ProductResponse } from "./product.d.ts";
export type { Category } from "./categories";
export type { Order, OrderItem, OrderStatus } from "./orders";
export type { User } from "./auth.d.ts";
export type { CartItem, Cart } from "./cart.d.ts";

export interface PagedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
