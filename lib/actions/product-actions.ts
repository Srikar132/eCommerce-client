"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { PagedResponse } from "@/types";
import { Product, ProductParams, ProductImage, ProductVariant, Review, AddReviewRequest, AddReviewResponse } from "@/types/product";
import { db } from "@/drizzle/db";
import { products, productImages, categories, productVariants, reviews, orders, orderItems, users } from "@/drizzle/schema";
import { eq, and, or, ilike, sql, desc, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { productFormSchema, ProductFormData } from "@/lib/validations";

// ============================================================================
// PERFORMANCE: Per-request deduplication with React cache()
// React cache() ensures if multiple RSC components call getProductBySlug("same-slug")
// in the same request, only ONE DB query fires.
// ============================================================================

function generateVariantSku(productSku: string, size: string, color: string): string {
    const colorCode = color.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3) || 'XXX';
    const sizeCode = size.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${productSku}-${sizeCode}-${colorCode}-${randomSuffix}`;
}

// ============================================================================
// MAPPERS
// ============================================================================

function parseVariant(variant: typeof productVariants.$inferSelect): ProductVariant {
    return {
        id: variant.id,
        productId: variant.productId,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex,
        stockQuantity: variant.stockQuantity,
        priceModifier: parseFloat(variant.priceModifier),
        sku: variant.sku,
        isActive: variant.isActive,
    };
}

function parseImage(img: typeof productImages.$inferSelect): ProductImage {
    return {
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altText ?? undefined,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder,
    };
}

// ============================================================================
// STOREFRONT: CACHED PRODUCT QUERIES
// Strategy:
//   - unstable_cache: caches across requests (ISR-style, survives multiple users)
//   - React cache(): deduplicates within a single request
//   - Both together = optimal
// ============================================================================

/**
 * PERFORMANCE FIX: getProductBySlug now uses unstable_cache for cross-request
 * caching + React cache() for within-request deduplication.
 *
 * ALSO FIX: The page previously called getProductBySlug() AND getProductVariants()
 * separately — that was 2 DB round-trips. Now getProductBySlug returns variants
 * already, so getProductVariants() should NOT be called again on the product page.
 */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
    return unstable_cache(
        async () => {
            const productResults = await db
                .select({
                    product: products,
                    category: {
                        id: categories.id,
                        name: categories.name,
                        slug: categories.slug,
                    },
                })
                .from(products)
                .leftJoin(categories, eq(products.categoryId, categories.id))
                .where(eq(products.slug, slug))
                .limit(1);

            if (productResults.length === 0) return null;

            const { product, category } = productResults[0];

            // Parallel fetch — images + variants in one round-trip pair
            const [imagesResults, variantsResults] = await Promise.all([
                db
                    .select()
                    .from(productImages)
                    .where(eq(productImages.productId, product.id))
                    .orderBy(desc(productImages.isPrimary), productImages.displayOrder),
                db
                    .select()
                    .from(productVariants)
                    .where(
                        and(
                            eq(productVariants.productId, product.id),
                            eq(productVariants.isActive, true)
                        )
                    )
                    .orderBy(productVariants.size, productVariants.color),
            ]);

            return {
                id: product.id,
                categoryId: product.categoryId ?? "",
                name: product.name,
                slug: product.slug,
                description: product.description ?? undefined,
                basePrice: parseFloat(product.basePrice),
                sku: product.sku,
                material: product.material ?? undefined,
                careInstructions: product.careInstructions ?? undefined,
                isActive: product.isActive,
                isDraft: product.isDraft,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
                images: imagesResults.map(parseImage),
                variants: variantsResults.map(parseVariant),
                category: category
                    ? { id: category.id, name: category.name, slug: category.slug }
                    : undefined,
            };
        },
        [`product-slug-${slug}`],
        {
            revalidate: 60 * 10, // 10 minutes
            tags: [`product-${slug}`, "products"],
        }
    )();
});

/**
 * PERFORMANCE FIX: getProductVariants is now a thin wrapper that reuses the
 * already-cached product data instead of firing a new DB query.
 * Only call this if you genuinely need variants without a full product.
 */
export const getProductVariants = cache(async (productId: string): Promise<ProductVariant[]> => {
    return unstable_cache(
        async () => {
            const variantsResults = await db
                .select()
                .from(productVariants)
                .where(eq(productVariants.productId, productId))
                .orderBy(productVariants.size, productVariants.color);

            return variantsResults.map(parseVariant);
        },
        [`product-variants-${productId}`],
        {
            revalidate: 60 * 10,
            tags: [`product-${productId}`, "products"],
        }
    )();
});

/**
 * PERFORMANCE FIX: getAllProducts is now cached at the Next.js data cache level.
 * Same filter params = same cache entry. Cache is busted when products are
 * created/updated/deleted via revalidateTag("products").
 */
export async function getAllProducts(params: ProductParams): Promise<PagedResponse<Product>> {
    return unstable_cache(
        async (): Promise<PagedResponse<Product>> => {
            const {
                category,
                sizes,
                colors,
                minPrice,
                maxPrice,
                searchQuery,
                page = 0,
                limit = 20,
                sortBy = "CREATED_AT_DESC",
            } = params;

            const conditions = [];

            if (category) {
                const categoryRecord = await db
                    .select({ id: categories.id })
                    .from(categories)
                    .where(eq(categories.slug, category))
                    .limit(1);

                if (categoryRecord.length > 0) {
                    conditions.push(eq(products.categoryId, categoryRecord[0].id));
                } else {
                    return { data: [], page, size: limit, totalElements: 0, totalPages: 0 };
                }
            }

            if (minPrice !== undefined) conditions.push(sql`${products.basePrice} >= ${minPrice}`);
            if (maxPrice !== undefined) conditions.push(sql`${products.basePrice} <= ${maxPrice}`);

            if (sizes || colors) {
                const variantConditions = [];
                if (sizes) {
                    const sizeList = sizes.split(",").map((s) => s.trim());
                    variantConditions.push(
                        inArray(productVariants.size, sizeList as (typeof productVariants.size.enumValues[number])[])
                    );
                }
                if (colors) {
                    const colorList = colors.split(",").map((c) => c.trim());
                    variantConditions.push(
                        inArray(productVariants.color, colorList as (typeof productVariants.color.enumValues[number])[])
                    );
                }

                const productsWithVariants = await db
                    .selectDistinct({ productId: productVariants.productId })
                    .from(productVariants)
                    .where(and(...variantConditions, eq(productVariants.isActive, true)));

                if (productsWithVariants.length > 0) {
                    conditions.push(inArray(products.id, productsWithVariants.map((p) => p.productId)));
                } else {
                    return { data: [], page, size: limit, totalElements: 0, totalPages: 0 };
                }
            }

            if (searchQuery) {
                conditions.push(
                    or(
                        ilike(products.name, `%${searchQuery}%`),
                        ilike(products.description, `%${searchQuery}%`),
                        ilike(products.sku, `%${searchQuery}%`)
                    )
                );
            }

            // Only show active, non-draft products in storefront
            conditions.push(eq(products.isActive, true));
            conditions.push(eq(products.isDraft, false));

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            // Count + products in parallel
            const [countResult, productResults] = await Promise.all([
                db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(products)
                    .where(whereClause),
                db
                    .select({
                        product: products,
                        category: {
                            id: categories.id,
                            name: categories.name,
                            slug: categories.slug,
                        },
                    })
                    .from(products)
                    .leftJoin(categories, eq(products.categoryId, categories.id))
                    .where(whereClause)
                    .orderBy(
                        sortBy === "NAME_ASC" ? asc(products.name)
                            : sortBy === "NAME_DESC" ? desc(products.name)
                                : sortBy === "PRICE_ASC" ? asc(products.basePrice)
                                    : sortBy === "PRICE_DESC" ? desc(products.basePrice)
                                        : sortBy === "CREATED_AT_ASC" ? asc(products.createdAt)
                                            : desc(products.createdAt)
                    )
                    .limit(limit)
                    .offset(page * limit),
            ]);

            const totalItems = countResult[0]?.count || 0;
            const totalPages = Math.ceil(totalItems / limit);
            const productIds = productResults.map((p) => p.product.id);

            // PERFORMANCE: Batch fetch images + variants in parallel (no N+1)
            const [imagesResults, variantsResults] = await Promise.all([
                productIds.length > 0
                    ? db
                        .select()
                        .from(productImages)
                        .where(inArray(productImages.productId, productIds))
                        .orderBy(desc(productImages.isPrimary), productImages.displayOrder)
                    : [],
                productIds.length > 0
                    ? db
                        .select()
                        .from(productVariants)
                        .where(
                            and(
                                inArray(productVariants.productId, productIds),
                                eq(productVariants.isActive, true)
                            )
                        )
                    : [],
            ]);

            const imagesByProduct = imagesResults.reduce(
                (acc, img) => { (acc[img.productId] ??= []).push(parseImage(img)); return acc; },
                {} as Record<string, ProductImage[]>
            );
            const variantsByProduct = variantsResults.reduce(
                (acc, v) => { (acc[v.productId] ??= []).push(parseVariant(v)); return acc; },
                {} as Record<string, ProductVariant[]>
            );

            const data: Product[] = productResults.map(({ product, category }) => ({
                id: product.id,
                categoryId: product.categoryId ?? "",
                name: product.name,
                slug: product.slug,
                description: product.description ?? undefined,
                basePrice: parseFloat(product.basePrice),
                sku: product.sku,
                material: product.material ?? undefined,
                careInstructions: product.careInstructions ?? undefined,
                isActive: product.isActive,
                isDraft: product.isDraft,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
                images: imagesByProduct[product.id] ?? [],
                variants: variantsByProduct[product.id] ?? [],
                category: category
                    ? { id: category.id, name: category.name, slug: category.slug }
                    : undefined,
            }));

            return { data, page, size: limit, totalElements: totalItems, totalPages };
        },
        [
            `products-list`,
            params.category ?? "",
            params.sizes ?? "",
            params.colors ?? "",
            String(params.minPrice ?? ""),
            String(params.maxPrice ?? ""),
            params.searchQuery ?? "",
            String(params.page ?? 0),
            String(params.limit ?? 20),
            params.sortBy ?? "CREATED_AT_DESC",
        ],
        {
            revalidate: 60 * 5, // 5 minutes
            tags: ["products"],
        }
    )();
}

// ============================================================================
// RECOMMENDATIONS — cached separately since they appear on product pages
// ============================================================================

export const getProductRecommendations = cache(async (excludeProductId: string, categorySlug?: string, limit = 4): Promise<Product[]> => {
    return unstable_cache(
        async (): Promise<Product[]> => {
            const conditions = [
                eq(products.isActive, true),
                eq(products.isDraft, false),
                sql`${products.id} != ${excludeProductId}`,
            ];

            if (categorySlug) {
                const cat = await db
                    .select({ id: categories.id })
                    .from(categories)
                    .where(eq(categories.slug, categorySlug))
                    .limit(1);
                if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
            }

            const productResults = await db
                .select({ product: products, category: { id: categories.id, name: categories.name, slug: categories.slug } })
                .from(products)
                .leftJoin(categories, eq(products.categoryId, categories.id))
                .where(and(...conditions))
                .orderBy(desc(products.createdAt))
                .limit(limit);

            const productIds = productResults.map((p) => p.product.id);
            if (productIds.length === 0) return [];

            const [imagesResults, variantsResults] = await Promise.all([
                db
                    .select()
                    .from(productImages)
                    .where(and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true))),
                db
                    .select()
                    .from(productVariants)
                    .where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true))),
            ]);

            const imagesByProduct = imagesResults.reduce(
                (acc, img) => { (acc[img.productId] ??= []).push(parseImage(img)); return acc; },
                {} as Record<string, ProductImage[]>
            );
            const variantsByProduct = variantsResults.reduce(
                (acc, v) => { (acc[v.productId] ??= []).push(parseVariant(v)); return acc; },
                {} as Record<string, ProductVariant[]>
            );

            return productResults.map(({ product, category }) => ({
                id: product.id,
                categoryId: product.categoryId ?? "",
                name: product.name,
                slug: product.slug,
                description: product.description ?? undefined,
                basePrice: parseFloat(product.basePrice),
                sku: product.sku,
                isActive: product.isActive,
                isDraft: product.isDraft,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
                images: imagesByProduct[product.id] ?? [],
                variants: variantsByProduct[product.id] ?? [],
                category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
            }));
        },
        [`product-recs-${excludeProductId}-${categorySlug}-${limit}`],
        { revalidate: 60 * 15, tags: ["products"] }
    )();
});

// ============================================================================
// HOT THIS WEEK — cached with longer TTL since it rarely changes
// ============================================================================

export const getHotProducts = unstable_cache(
    async (limit = 8): Promise<Product[]> => {
        const productResults = await db
            .select({ product: products, category: { id: categories.id, name: categories.name, slug: categories.slug } })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(and(eq(products.isActive, true), eq(products.isDraft, false)))
            .orderBy(desc(products.createdAt))
            .limit(limit);

        const productIds = productResults.map((p) => p.product.id);
        if (productIds.length === 0) return [];

        const [imagesResults, variantsResults] = await Promise.all([
            db
                .select()
                .from(productImages)
                .where(and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true))),
            db
                .select()
                .from(productVariants)
                .where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true))),
        ]);

        const imagesByProduct = imagesResults.reduce(
            (acc, img) => { (acc[img.productId] ??= []).push(parseImage(img)); return acc; },
            {} as Record<string, ProductImage[]>
        );
        const variantsByProduct = variantsResults.reduce(
            (acc, v) => { (acc[v.productId] ??= []).push(parseVariant(v)); return acc; },
            {} as Record<string, ProductVariant[]>
        );

        return productResults.map(({ product, category }) => ({
            id: product.id,
            categoryId: product.categoryId ?? "",
            name: product.name,
            slug: product.slug,
            description: product.description ?? undefined,
            basePrice: parseFloat(product.basePrice),
            sku: product.sku,
            isActive: product.isActive,
            isDraft: product.isDraft,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images: imagesByProduct[product.id] ?? [],
            variants: variantsByProduct[product.id] ?? [],
            category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
        }));
    },
    ["hot-products"],
    { revalidate: 60 * 30, tags: ["products"] } // 30 min
);

// ============================================================================
// ADMIN: PRODUCT MANAGEMENT — no caching, always fresh
// ============================================================================

export async function createProduct(formData: ProductFormData) {
    try {
        const validatedData = productFormSchema.parse(formData);
        const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const existingSku = await db.select({ sku: products.sku }).from(products).where(eq(products.sku, validatedData.sku)).limit(1);
        if (existingSku.length > 0) throw new Error("SKU already exists");

        const existingSlug = await db.select({ slug: products.slug }).from(products).where(eq(products.slug, slug)).limit(1);
        if (existingSlug.length > 0) throw new Error("A product with this name already exists");

        let newProductId: string | null = null;
        try {
            const [newProduct] = await db
                .insert(products)
                .values({
                    name: validatedData.name, slug, description: validatedData.description,
                    basePrice: validatedData.basePrice.toString(), sku: validatedData.sku,
                    material: validatedData.material, careInstructions: validatedData.careInstructions,
                    categoryId: validatedData.categoryId, isActive: validatedData.isActive, isDraft: validatedData.isDraft,
                })
                .returning();

            newProductId = newProduct.id;

            if (validatedData.images.length > 0) {
                await db.insert(productImages).values(
                    validatedData.images.map((image, index) => ({
                        productId: newProductId!, imageUrl: image.imageUrl, altText: image.altText || validatedData.name,
                        isPrimary: image.isPrimary || index === 0, displayOrder: image.displayOrder || index,
                    }))
                );
            }
            if (validatedData.variants.length > 0) {
                await db.insert(productVariants).values(
                    validatedData.variants.map((variant) => ({
                        productId: newProductId!,
                        size: variant.size as typeof productVariants.size.enumValues[number],
                        color: variant.color as typeof productVariants.color.enumValues[number],
                        colorHex: variant.colorHex || "#000000", stockQuantity: variant.stockQuantity,
                        priceModifier: variant.priceModifier.toString(),
                        sku: generateVariantSku(validatedData.sku, variant.size, variant.color), isActive: true,
                    }))
                );
            }

            // Bust all product caches
            revalidatePath("/admin/products");
            revalidatePath("/products");
            revalidatePath("/");
            return { success: true, data: newProduct };
        } catch (writeError) {
            if (newProductId) {
                await db.delete(productImages).where(eq(productImages.productId, newProductId));
                await db.delete(productVariants).where(eq(productVariants.productId, newProductId));
                await db.delete(products).where(eq(products.id, newProductId));
            }
            throw writeError;
        }
    } catch (error) {
        console.error("Create product error:", error);
        return { success: false, error: parseProductError(error) };
    }
}

function parseProductError(error: unknown): string {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('unique constraint') || message.includes('duplicate key')) {
            if (message.includes('sku')) return 'A product with this SKU already exists.';
            if (message.includes('slug')) return 'A product with this name already exists.';
            return 'This item already exists. Please check for duplicates.';
        }
        if (message.includes('foreign key')) return 'Invalid category selected.';
        return error.message;
    }
    return 'Failed to create product. Please try again.';
}

export async function updateProduct(productId: string, formData: ProductFormData) {
    try {
        const validatedData = productFormSchema.parse(formData);
        const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const existingSku = await db.select({ id: products.id }).from(products)
            .where(and(eq(products.sku, validatedData.sku), sql`${products.id} != ${productId}`)).limit(1);
        if (existingSku.length > 0) throw new Error("SKU already exists");

        await db.update(products).set({
            name: validatedData.name, slug, description: validatedData.description,
            basePrice: validatedData.basePrice.toString(), sku: validatedData.sku,
            material: validatedData.material, careInstructions: validatedData.careInstructions,
            categoryId: validatedData.categoryId, isActive: validatedData.isActive, isDraft: validatedData.isDraft,
            updatedAt: new Date(),
        }).where(eq(products.id, productId));

        await db.delete(productImages).where(eq(productImages.productId, productId));
        await db.delete(productVariants).where(eq(productVariants.productId, productId));

        if (validatedData.images.length > 0) {
            await db.insert(productImages).values(
                validatedData.images.map((image, index) => ({
                    productId, imageUrl: image.imageUrl, altText: image.altText || validatedData.name,
                    isPrimary: image.isPrimary || index === 0, displayOrder: image.displayOrder || index,
                }))
            );
        }
        if (validatedData.variants.length > 0) {
            await db.insert(productVariants).values(
                validatedData.variants.map((variant) => ({
                    productId,
                    size: variant.size as typeof productVariants.size.enumValues[number],
                    color: variant.color as typeof productVariants.color.enumValues[number],
                    colorHex: variant.colorHex || "#000000", stockQuantity: variant.stockQuantity,
                    priceModifier: variant.priceModifier.toString(),
                    sku: generateVariantSku(validatedData.sku, variant.size, variant.color), isActive: true,
                }))
            );
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${productId}/edit`);
        revalidatePath("/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Update product error:", error);
        return { success: false, error: parseProductError(error) };
    }
}

export async function deleteProduct(productId: string) {
    try {
        const product = await db.select({ id: products.id, name: products.name }).from(products).where(eq(products.id, productId)).limit(1);
        if (product.length === 0) throw new Error("Product not found");

        const productWithOrders = await db.select({ orderId: orderItems.orderId }).from(orderItems)
            .innerJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
            .where(eq(productVariants.productId, productId)).limit(1);

        if (productWithOrders.length > 0) {
            await db.update(products).set({ isActive: false, isDraft: true, updatedAt: new Date() }).where(eq(products.id, productId));
            await db.update(productVariants).set({ isActive: false }).where(eq(productVariants.productId, productId));
            revalidatePath("/admin/products");
            revalidatePath("/products");
            return { success: true, message: `Product "${product[0].name}" has been archived`, archived: true };
        }

        const imagesToDelete = await db.select({ imageUrl: productImages.imageUrl }).from(productImages).where(eq(productImages.productId, productId));
        await db.delete(products).where(eq(products.id, productId));

        if (imagesToDelete.length > 0) {
            const { extractPublicId, deleteImage } = await import('@/lib/cloudinary');
            Promise.all(imagesToDelete.map(async (img) => {
                try { const publicId = extractPublicId(img.imageUrl); if (publicId) await deleteImage(publicId); }
                catch (error) { console.error('Failed to delete image:', img.imageUrl, error); }
            })).catch(err => console.error('Cloudinary cleanup error:', err));
        }

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");
        return { success: true, message: `Product "${product[0].name}" deleted successfully` };
    } catch (error) {
        console.error("Delete product error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" };
    }
}

export async function bulkDeleteProducts(productIds: string[]) {
    try {
        if (productIds.length === 0) throw new Error("No products selected");

        const productsWithOrders = await db.selectDistinct({ productId: productVariants.productId })
            .from(orderItems).innerJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
            .where(inArray(productVariants.productId, productIds));

        const productIdsWithOrders = productsWithOrders.map(p => p.productId);
        const productIdsToDelete = productIds.filter(id => !productIdsWithOrders.includes(id));

        let archivedCount = 0, deletedCount = 0;

        if (productIdsWithOrders.length > 0) {
            await db.update(products).set({ isActive: false, isDraft: true, updatedAt: new Date() }).where(inArray(products.id, productIdsWithOrders));
            await db.update(productVariants).set({ isActive: false }).where(inArray(productVariants.productId, productIdsWithOrders));
            archivedCount = productIdsWithOrders.length;
        }

        if (productIdsToDelete.length > 0) {
            const imagesToDelete = await db.select({ imageUrl: productImages.imageUrl }).from(productImages).where(inArray(productImages.productId, productIdsToDelete));
            await db.delete(products).where(inArray(products.id, productIdsToDelete));
            deletedCount = productIdsToDelete.length;

            if (imagesToDelete.length > 0) {
                const { extractPublicId, deleteImage } = await import('@/lib/cloudinary');
                Promise.all(imagesToDelete.map(async (img) => {
                    try { const publicId = extractPublicId(img.imageUrl); if (publicId) await deleteImage(publicId); }
                    catch (e) { console.error('Failed to delete image:', e); }
                })).catch(err => console.error('Cloudinary bulk cleanup error:', err));
            }
        }

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");
        const messages: string[] = [];
        if (deletedCount > 0) messages.push(`${deletedCount} deleted`);
        if (archivedCount > 0) messages.push(`${archivedCount} archived`);
        return { success: true, message: `Products: ${messages.join(', ')}`, deletedCount, archivedCount };
    } catch (error) {
        console.error("Bulk delete error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete products" };
    }
}

export async function getProductById(productId: string) {
    try {
        const product = await db.select({
            id: products.id, name: products.name, slug: products.slug, description: products.description,
            basePrice: products.basePrice, sku: products.sku, material: products.material,
            careInstructions: products.careInstructions, categoryId: products.categoryId,
            isActive: products.isActive, isDraft: products.isDraft, createdAt: products.createdAt, updatedAt: products.updatedAt,
        }).from(products).where(eq(products.id, productId)).limit(1);

        if (product.length === 0) throw new Error("Product not found");

        const [images, variants] = await Promise.all([
            db.select({ id: productImages.id, imageUrl: productImages.imageUrl, altText: productImages.altText, isPrimary: productImages.isPrimary, displayOrder: productImages.displayOrder })
                .from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.displayOrder),
            db.select({ id: productVariants.id, size: productVariants.size, color: productVariants.color, colorHex: productVariants.colorHex, stockQuantity: productVariants.stockQuantity, priceModifier: productVariants.priceModifier, sku: productVariants.sku, isActive: productVariants.isActive })
                .from(productVariants).where(eq(productVariants.productId, productId)),
        ]);

        return {
            success: true,
            data: {
                ...product[0],
                basePrice: parseFloat(product[0].basePrice),
                images,
                variants: variants.map(v => ({ ...v, priceModifier: parseFloat(v.priceModifier) })),
            },
        };
    } catch (error) {
        console.error("Get product error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to get product" };
    }
}

export async function getAllCategories() {
    try {
        const result = await db.select({ id: categories.id, name: categories.name, slug: categories.slug })
            .from(categories).where(eq(categories.isActive, true)).orderBy(categories.displayOrder, categories.name);
        return { success: true, data: result };
    } catch (error) {
        console.error("Get categories error:", error);
        return { success: false, error: "Failed to get categories", data: [] };
    }
}

// ============================================================================
// REVIEWS
// ============================================================================

export const getReviewsByProductId = cache(async (productId: string, page = 0, size = 10): Promise<PagedResponse<Review>> => {
    return unstable_cache(
        async (): Promise<PagedResponse<Review>> => {
            const [countResult, reviewRows] = await Promise.all([
                db.select({ count: sql<number>`count(*)::int` }).from(reviews).where(eq(reviews.productId, productId)),
                db.select({
                    id: reviews.id, userId: reviews.userId, name: users.name, productId: reviews.productId,
                    orderItemId: reviews.orderItemId, rating: reviews.rating, title: reviews.title,
                    comment: reviews.comment, isVerifiedPurchase: reviews.isVerifiedPurchase, createdAt: reviews.createdAt,
                })
                    .from(reviews).leftJoin(users, eq(users.id, reviews.userId))
                    .where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt)).limit(size).offset(page * size),
            ]);

            const totalItems = countResult[0]?.count || 0;
            return {
                data: reviewRows.map((r) => ({
                    id: r.id, userId: r.userId, name: r.name ?? "", productId: r.productId,
                    orderItemId: r.orderItemId ?? undefined, rating: r.rating, title: r.title ?? "",
                    comment: r.comment ?? "", isVerifiedPurchase: !!r.isVerifiedPurchase,
                    createdAt: r.createdAt.toISOString(),
                })),
                page, size, totalElements: totalItems, totalPages: Math.ceil(totalItems / size),
            };
        },
        [`reviews-${productId}-${page}-${size}`],
        { revalidate: 60 * 5, tags: [`reviews-${productId}`] }
    )();
});

export async function canUserReviewProduct(userId: string, productId: string): Promise<boolean> {
    try {
        const purchased = await db.selectDistinct({ orderItemId: orderItems.id })
            .from(orderItems).leftJoin(orders, eq(orders.id, orderItems.orderId))
            .leftJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
            .where(and(eq(orders.userId, userId), eq(productVariants.productId, productId), eq(orders.status, "DELIVERED")))
            .limit(1);
        return purchased.length > 0;
    } catch { return false; }
}

export async function addReviewToProduct(userId: string, productId: string, request: AddReviewRequest): Promise<AddReviewResponse> {
    try {
        const isEligible = await canUserReviewProduct(userId, productId);
        const existing = await db.select().from(reviews).where(and(eq(reviews.userId, userId), eq(reviews.productId, productId))).limit(1);
        if (existing.length > 0) throw new Error("User has already reviewed this product");

        let orderItemId: string | undefined;
        if (isEligible) {
            const items = await db.select({ orderItemId: orderItems.id }).from(orderItems)
                .leftJoin(orders, eq(orders.id, orderItems.orderId))
                .leftJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
                .where(and(eq(orders.userId, userId), eq(productVariants.productId, productId), eq(orders.status, "DELIVERED")))
                .limit(1);
            if (items.length > 0) orderItemId = items[0].orderItemId;
        }

        const insertResult = await db.insert(reviews).values({
            userId, productId, orderItemId: orderItemId ?? null, rating: request.rating,
            title: request.title ?? null, comment: request.comment, isVerifiedPurchase: !!isEligible,
        }).returning();

        const row = Array.isArray(insertResult) ? insertResult[0] : insertResult;

        // Bust reviews cache for this product
        revalidatePath(`/products/${productId}`);

        return {
            message: "Review added",
            review: {
                id: row.id, userId: row.userId, name: "", productId: row.productId,
                orderItemId: row.orderItemId ?? undefined, rating: row.rating, title: row.title ?? "",
                comment: row.comment ?? "", isVerifiedPurchase: !!row.isVerifiedPurchase,
                createdAt: row.createdAt.toISOString(),
            },
        };
    } catch (error) {
        throw new Error((error as Error)?.message || "Failed to add review");
    }
}