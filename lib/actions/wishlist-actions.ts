"use server";

import { db } from "@/drizzle/db";
import { wishlists, products, productImages } from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { WishlistResponse, CheckWishlistResponse, WishlistCountResponse } from "@/types/wishlist";
import { Product } from "@/types/product";

/**
 * GET WISHLIST
 * Retrieves all wishlist items for the authenticated user
 */
export async function getWishlist(userId: string): Promise<WishlistResponse> {
    try {
        // Get all wishlist items for user
        const wishlistItems = await db
            .select({
                id: wishlists.id,
                productId: wishlists.productId,
                createdAt: wishlists.createdAt,
                product: products,
            })
            .from(wishlists)
            .leftJoin(products, eq(products.id, wishlists.productId))
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(products.isActive, true),
                    eq(products.isDraft, false)
                )
            )
            .orderBy(desc(wishlists.createdAt));

        // Get product IDs to fetch images
        const productIds = wishlistItems.map(item => item.productId);
        
        // Fetch images for all products
        const images = productIds.length > 0
            ? await db
                .select()
                .from(productImages)
                .where(
                    and(
                        eq(productImages.productId, productIds[0]),
                        // Use OR for multiple product IDs
                        ...productIds.slice(1).map(id => eq(productImages.productId, id))
                    )
                )
                .orderBy(desc(productImages.isPrimary), productImages.displayOrder)
            : [];

        // Group images by product ID
        const imagesByProduct = images.reduce((acc, img) => {
            if (!acc[img.productId]) {
                acc[img.productId] = [];
            }
            acc[img.productId].push({
                id: img.id,
                imageUrl: img.imageUrl,
                altText: img.altText || undefined,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            });
            return acc;
        }, {} as Record<string, Product['images']>);

        // Map to Product format
        const items: Product[] = wishlistItems
            .filter(item => item.product) // Only include items with valid products
            .map(item => ({
                id: item.product!.id,
                name: item.product!.name,
                slug: item.product!.slug,
                description: item.product!.description || undefined,
                basePrice: parseFloat(item.product!.basePrice),
                sku: item.product!.sku,
                material: item.product!.material || undefined,
                careInstructions: item.product!.careInstructions || undefined,
                isActive: item.product!.isActive,
                createdAt: item.product!.createdAt.toISOString(),
                updatedAt: item.product!.updatedAt.toISOString(),
                images: imagesByProduct[item.productId] || [],
            }));

        return {
            items,
            totalItems: items.length,
        };
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to fetch wishlist");
    }
}

/**
 * ADD TO WISHLIST
 * Adds a product to the user's wishlist
 */
export async function addToWishlist(userId: string, productId: string): Promise<WishlistResponse> {
    try {
        // Check if product exists and is active
        const product = await db
            .select()
            .from(products)
            .where(
                and(
                    eq(products.id, productId),
                    eq(products.isActive, true),
                    eq(products.isDraft, false)
                )
            )
            .limit(1);

        if (product.length === 0) {
            throw new Error("Product not found or inactive");
        }

        // Check if already in wishlist
        const existing = await db
            .select()
            .from(wishlists)
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(wishlists.productId, productId)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            // Add to wishlist
            await db.insert(wishlists).values({
                userId,
                productId,
            });
        }

        // Revalidate paths
        revalidatePath("/wishlist");
        revalidatePath("/products");
        revalidatePath(`/products/${product[0].slug}`);

        // Return updated wishlist
        return await getWishlist(userId);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to add to wishlist");
    }
}

/**
 * REMOVE FROM WISHLIST
 * Removes a product from the user's wishlist
 */
export async function removeFromWishlist(userId: string, productId: string): Promise<WishlistResponse> {
    try {
        // Delete from wishlist
        await db
            .delete(wishlists)
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(wishlists.productId, productId)
                )
            );

        // Revalidate paths
        revalidatePath("/wishlist");
        revalidatePath("/products");

        // Return updated wishlist
        return await getWishlist(userId);
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to remove from wishlist");
    }
}

/**
 * CHECK IF PRODUCT IS IN WISHLIST
 * Returns whether a specific product is in the user's wishlist
 */
export async function checkWishlist(userId: string, productId: string): Promise<CheckWishlistResponse> {
    try {
        const wishlistItem = await db
            .select()
            .from(wishlists)
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(wishlists.productId, productId)
                )
            )
            .limit(1);

        return { inWishlist: wishlistItem.length > 0 };
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return { inWishlist: false };
    }
}

/**
 * GET WISHLIST COUNT
 * Returns the total count of items in the user's wishlist
 */
export async function getWishlistCount(userId: string): Promise<WishlistCountResponse> {
    try {
        const result = await db
            .select({
                count: wishlists.id,
            })
            .from(wishlists)
            .where(eq(wishlists.userId, userId));

        return { count: result.length };
    } catch (error) {
        console.error("Error getting wishlist count:", error);
        return { count: 0 };
    }
}

/**
 * CLEAR WISHLIST
 * Removes all items from the user's wishlist
 */
export async function clearWishlist(userId: string): Promise<{ message: string }> {
    try {
        // Delete all wishlist items for user
        await db
            .delete(wishlists)
            .where(eq(wishlists.userId, userId));

        // Revalidate paths
        revalidatePath("/wishlist");
        revalidatePath("/products");

        return { message: "Wishlist cleared successfully" };
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to clear wishlist");
    }
}

/**
 * TOGGLE WISHLIST
 * Adds or removes a product from wishlist based on current state
 * Useful for toggle buttons
 */
export async function toggleWishlist(userId: string, productId: string): Promise<{ inWishlist: boolean; message: string }> {
    try {
        // Check current state
        const existing = await db
            .select()
            .from(wishlists)
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(wishlists.productId, productId)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            // Remove from wishlist
            await db
                .delete(wishlists)
                .where(
                    and(
                        eq(wishlists.userId, userId),
                        eq(wishlists.productId, productId)
                    )
                );

            revalidatePath("/wishlist");
            revalidatePath("/products");

            return { 
                inWishlist: false, 
                message: "Removed from wishlist" 
            };
        } else {
            // Add to wishlist
            await db.insert(wishlists).values({
                userId,
                productId,
            });

            revalidatePath("/wishlist");
            revalidatePath("/products");

            return { 
                inWishlist: true, 
                message: "Added to wishlist" 
            };
        }
    } catch (error) {
        console.error("Error toggling wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to update wishlist");
    }
} 