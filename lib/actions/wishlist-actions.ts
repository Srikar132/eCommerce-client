"use server";

import { db } from "@/drizzle/db";
import { wishlists, products, productImages, categories } from "@/drizzle/schema";
import { eq, and, desc, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { WishlistResponse, CheckWishlistResponse, WishlistCountResponse, WishlistItem } from "@/types/wishlist";
import { auth } from "@/auth";

/**
 * GET WISHLIST
 * Retrieves all wishlist items for the authenticated user
 */
export async function getWishlist(): Promise<WishlistResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

        // Get all wishlist items for user with product details
        const wishlistItems = await db
            .select({
                wishlistId: wishlists.id,
                addedAt: wishlists.createdAt,
                product: products,
                category: categories,
            })
            .from(wishlists)
            .innerJoin(products, eq(products.id, wishlists.productId))
            .leftJoin(categories, eq(categories.id, products.categoryId))
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(products.isActive, true),
                    eq(products.isDraft, false)
                )
            )
            .orderBy(desc(wishlists.createdAt));

        // Get product IDs to fetch primary images
        const productIds = wishlistItems
            .filter(item => item.product !== null)
            .map(item => item.product!.id);
        
        // Fetch primary images for all products
        const images = productIds.length > 0
            ? await db
                .select()
                .from(productImages)
                .where(
                    and(
                        eq(productImages.isPrimary, true),
                        inArray(productImages.productId, productIds)
                    )
                )
            : [];

        // Create a map of product ID to primary image
        const primaryImageMap = images.reduce((acc, img) => {
            acc[img.productId] = {
                url: img.imageUrl,
                alt: img.altText,
            };
            return acc;
        }, {} as Record<string, { url: string; alt: string | null }>);

        // Map to WishlistItem format
        const items: WishlistItem[] = wishlistItems
            .filter(item => item.product !== null) // Only include items with valid products
            .map(item => {
                const product = item.product!;
                const primaryImage = primaryImageMap[product.id];
                
                return {
                    // Wishlist-specific
                    wishlistId: item.wishlistId,
                    addedAt: item.addedAt.toISOString(),

                    // Product info
                    productId: product.id,
                    productName: product.name,
                    productSlug: product.slug,
                    productDescription: product.description || undefined,

                    basePrice: parseFloat(product.basePrice),
                    sku: product.sku,

                    // Images
                    primaryImageUrl: primaryImage?.url || undefined,
                    primaryImageAlt: primaryImage?.alt || undefined,

                    // Additional details
                    material: product.material || undefined,
                    careInstructions: product.careInstructions || undefined,

                    // Category
                    categoryName: item.category?.name || undefined,

                    // Status
                    inStock: true, // We'd need to check variants for real stock status
                    isActive: product.isActive,
                };
            });

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
export async function addToWishlist(productId: string): Promise<WishlistResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

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
        return await getWishlist();
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to add to wishlist");
    }
}

/**
 * REMOVE FROM WISHLIST
 * Removes a product from the user's wishlist
 */
export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

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
        return await getWishlist();
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw new Error((error as Error)?.message || "Failed to remove from wishlist");
    }
}

/**
 * CHECK IF PRODUCT IS IN WISHLIST
 * Returns whether a specific product is in the user's wishlist
 */
export async function checkWishlist(productId: string): Promise<CheckWishlistResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { inWishlist: false };
        }

        const userId = session.user.id;

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
export async function getWishlistCount(): Promise<WishlistCountResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { count: 0 };
        }

        const userId = session.user.id;

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
export async function clearWishlist(): Promise<{ message: string }> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

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
export async function toggleWishlist(productId: string): Promise<{ inWishlist: boolean; message: string }> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

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