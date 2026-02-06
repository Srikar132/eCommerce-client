"use server";

import { db } from "@/drizzle/db";
import { 
    carts, 
    cartItems, 
    products, 
    productVariants, 
    productImages 
} from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { Cart, CartItem } from "@/types/cart";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * Helper function to map database cart to Cart type
 */
async function mapCartToResponse(cartId: string): Promise<Cart> {
    const cartData = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
    });

    if (!cartData) {
        throw new Error("Cart not found");
    }

    const items = await db
        .select({
            id: cartItems.id,
            quantity: cartItems.quantity,
            unitPrice: cartItems.unitPrice,
            itemTotal: cartItems.itemTotal,
            createdAt: cartItems.createdAt,
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            productSku: products.sku,
            variantId: productVariants.id,
            variantSize: productVariants.size,
            variantColor: productVariants.color,
            variantSku: productVariants.sku,
            imageUrl: productImages.imageUrl,
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .leftJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
        .leftJoin(
            productImages,
            and(
                eq(productImages.productId, products.id),
                eq(productImages.isPrimary, true)
            )
        )
        .where(eq(cartItems.cartId, cartId))
        .orderBy(desc(cartItems.createdAt));

    const mappedItems: CartItem[] = items.map((item) => ({
        id: item.id,
        product: {
            id: item.productId!,
            name: item.productName!,
            slug: item.productSlug!,
            sku: item.productSku!,
            primaryImageUrl: item.imageUrl || "/images/placeholder.jpg",
        },
        variant: {
            id: item.variantId!,
            size: item.variantSize!,
            color: item.variantColor!,
            sku: item.variantSku!,
        },
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        itemTotal: parseFloat(item.itemTotal),
        addedAt: item.createdAt.toISOString(),
    }));

    return {
        id: cartData.id,
        items: mappedItems,
        totalItems: mappedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(cartData.subtotal),
        discountAmount: parseFloat(cartData.discountAmount),
        total: parseFloat(cartData.total),
        createdAt: cartData.createdAt.toISOString(),
        updatedAt: cartData.updatedAt.toISOString(),
    };
}

/**
 * Helper function to recalculate cart totals
 */
async function recalculateCartTotals(cartId: string): Promise<void> {
    const items = await db.query.cartItems.findMany({
        where: eq(cartItems.cartId, cartId),
    });

    const subtotal = items.reduce(
        (sum, item) => sum + parseFloat(item.itemTotal),
        0
    );

    // For now, total = subtotal (can add tax, shipping later)
    await db
        .update(carts)
        .set({
            subtotal: subtotal.toFixed(2),
            total: subtotal.toFixed(2),
            updatedAt: new Date(),
        })
        .where(eq(carts.id, cartId));
}

// GET CART OR CREATE CART FOR A USER
export async function getOrCreateCart(): Promise<Cart> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

        // Try to find an active cart for the user
        let cart = await db.query.carts.findFirst({
            where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
        });

        // If no cart exists, create a new one
        if (!cart) {
            const [newCart] = await db
                .insert(carts)
                .values({
                    userId,
                    isActive: true,
                    subtotal: "0",
                    discountAmount: "0",
                    taxAmount: "0",
                    shippingCost: "0",
                    total: "0",
                })
                .returning();

            cart = newCart;
        }

        return await mapCartToResponse(cart.id);
    } catch (error) {
        console.error("Error getting or creating cart:", error);
        throw new Error("Failed to get or create cart");
    }
}

// ADD ITEM TO CART
export async function addItemToCart(
    productId: string,
    productVariantId: string,
    quantity: number = 1
): Promise<Cart> {
    try {
        // Get or create cart
        const cart = await getOrCreateCart();

        // Get product and variant details
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
        });

        const variant = await db.query.productVariants.findFirst({
            where: eq(productVariants.id, productVariantId),
        });

        if (!product || !variant) {
            throw new Error("Product or variant not found");
        }

        // Check stock availability
        if (variant.stockQuantity < quantity) {
            throw new Error(`Only ${variant.stockQuantity} items available in stock`);
        }

        // Check if item already exists in cart
        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, cart.id),
                eq(cartItems.productId, productId),
                eq(cartItems.productVariantId, productVariantId)
            ),
        });

        const unitPrice = parseFloat(product.basePrice) + parseFloat(variant.additionalPrice);

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            
            // Check stock for new quantity
            if (variant.stockQuantity < newQuantity) {
                throw new Error(`Only ${variant.stockQuantity} items available in stock`);
            }
            
            const newItemTotal = unitPrice * newQuantity;

            await db
                .update(cartItems)
                .set({
                    quantity: newQuantity,
                    itemTotal: newItemTotal.toFixed(2),
                    updatedAt: new Date(),
                })
                .where(eq(cartItems.id, existingItem.id));
        } else {
            // Add new item
            const itemTotal = unitPrice * quantity;

            await db.insert(cartItems).values({
                cartId: cart.id,
                productId,
                productVariantId,
                quantity,
                unitPrice: unitPrice.toFixed(2),
                itemTotal: itemTotal.toFixed(2),
            });
        }

        // Recalculate cart totals
        await recalculateCartTotals(cart.id);

        // Revalidate paths
        revalidatePath("/cart");
        revalidatePath("/products");

        return await mapCartToResponse(cart.id);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to add item to cart");
    }
}

// REMOVE ITEM FROM CART
export async function removeItemFromCart(
    cartItemId: string
): Promise<Cart> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

        // Get user's cart
        const cart = await db.query.carts.findFirst({
            where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        // Verify the item belongs to this cart
        const item = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.id, cartItemId),
                eq(cartItems.cartId, cart.id)
            ),
        });

        if (!item) {
            throw new Error("Cart item not found");
        }

        // Delete the item
        await db.delete(cartItems).where(eq(cartItems.id, cartItemId));

        // Recalculate cart totals
        await recalculateCartTotals(cart.id);

        // Revalidate paths
        revalidatePath("/cart");

        return await mapCartToResponse(cart.id);
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw new Error("Failed to remove item from cart");
    }
}

// UPDATE ITEM QUANTITY IN CART
export async function updateCartItemQuantity(
    cartItemId: string,
    quantity: number
): Promise<Cart> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

        if (quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }

        // Get user's cart
        const cart = await db.query.carts.findFirst({
            where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        // Get the cart item
        const item = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.id, cartItemId),
                eq(cartItems.cartId, cart.id)
            ),
        });

        if (!item) {
            throw new Error("Cart item not found");
        }

        // Get variant to check stock
        const variant = await db.query.productVariants.findFirst({
            where: eq(productVariants.id, item.productVariantId!),
        });

        if (variant && quantity > variant.stockQuantity) {
            throw new Error(`Only ${variant.stockQuantity} items available in stock`);
        }

        // Calculate new item total
        const unitPrice = parseFloat(item.unitPrice);
        const newItemTotal = unitPrice * quantity;

        // Update the item
        await db
            .update(cartItems)
            .set({
                quantity,
                itemTotal: newItemTotal.toFixed(2),
                updatedAt: new Date(),
            })
            .where(eq(cartItems.id, cartItemId));

        // Recalculate cart totals
        await recalculateCartTotals(cart.id);

        // Revalidate paths
        revalidatePath("/cart");

        return await mapCartToResponse(cart.id);
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update cart item quantity");
    }
}

// CLEAR CART
export async function clearCart(): Promise<void> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error("Unauthorized. Please log in.");
        }

        const userId = session.user.id;

        // Get user's cart
        const cart = await db.query.carts.findFirst({
            where: and(eq(carts.userId, userId), eq(carts.isActive, true)),
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        // Delete all items in the cart
        await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

        // Reset cart totals
        await db
            .update(carts)
            .set({
                subtotal: "0",
                discountAmount: "0",
                taxAmount: "0",
                shippingCost: "0",
                total: "0",
                updatedAt: new Date(),
            })
            .where(eq(carts.id, cart.id));

        // Revalidate paths
        revalidatePath("/cart");
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw new Error("Failed to clear cart");
    }
}


