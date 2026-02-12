"use server";

import { PagedResponse } from "@/types";
import { Product, ProductParams, ProductImage, ProductVariant, Review, AddReviewRequest, AddReviewResponse } from "@/types/product";
import { db } from "@/drizzle/db";
import { products, productImages, categories, productVariants, reviews, orders, orderItems, users } from "@/drizzle/schema";
import { eq, and, or, ilike, sql, desc, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { productFormSchema, ProductFormData } from "@/lib/validations";

/* ========================================================================== */
/* ADMIN: PRODUCT MANAGEMENT ACTIONS                                          */
/* ========================================================================== */

// CREATE PRODUCT
export async function createProduct(formData: ProductFormData) {
    try {
        // Validate input
        const validatedData = productFormSchema.parse(formData);

        // Generate slug from name
        const slug = validatedData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Check if SKU already exists
        const existingSku = await db
            .select({ sku: products.sku })
            .from(products)
            .where(eq(products.sku, validatedData.sku))
            .limit(1);

        if (existingSku.length > 0) {
            throw new Error("SKU already exists");
        }

        // Check if slug already exists
        const existingSlug = await db
            .select({ slug: products.slug })
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        if (existingSlug.length > 0) {
            throw new Error("A product with this name already exists");
        }

        // Check for duplicate variant SKUs
        if (validatedData.variants.length > 0) {
            const variantSkus = validatedData.variants.map(v => v.sku);
            const existingVariantSkus = await db
                .select({ sku: productVariants.sku })
                .from(productVariants)
                .where(inArray(productVariants.sku, variantSkus));

            if (existingVariantSkus.length > 0) {
                throw new Error(`Variant SKU already exists: ${existingVariantSkus[0].sku}`);
            }
        }

        // Neon HTTP driver does not support transactions. Use sequential writes with cleanup.
        let newProductId: string | null = null;
        try {
            const [newProduct] = await db
                .insert(products)
                .values({
                    name: validatedData.name,
                    slug,
                    description: validatedData.description,
                    basePrice: validatedData.basePrice.toString(),
                    sku: validatedData.sku,
                    material: validatedData.material,
                    careInstructions: validatedData.careInstructions,
                    categoryId: validatedData.categoryId,
                    isActive: validatedData.isActive,
                    isDraft: validatedData.isDraft,
                })
                .returning();

            newProductId = newProduct.id;

            if (validatedData.images.length > 0) {
                await db.insert(productImages).values(
                    validatedData.images.map((image, index) => ({
                        productId: newProductId!,
                        imageUrl: image.imageUrl,
                        altText: image.altText || validatedData.name,
                        isPrimary: image.isPrimary || index === 0,
                        displayOrder: image.displayOrder || index,
                    }))
                );
            }

            if (validatedData.variants.length > 0) {
                await db.insert(productVariants).values(
                    validatedData.variants.map((variant) => ({
                        productId: newProductId!,
                        size: variant.size,
                        color: variant.color,
                        colorHex: variant.colorHex,
                        stockQuantity: variant.stockQuantity,
                        additionalPrice: variant.additionalPrice.toString(),
                        sku: variant.sku,
                        isActive: true,
                    }))
                );
            }

            revalidatePath("/admin/products");
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
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create product"
        };
    }
}

// UPDATE PRODUCT
export async function updateProduct(productId: string, formData: ProductFormData) {
    try {
        const validatedData = productFormSchema.parse(formData);

        // Generate slug from name
        const slug = validatedData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Check if SKU already exists (excluding current product)
        const existingSku = await db
            .select({ id: products.id })
            .from(products)
            .where(and(
                eq(products.sku, validatedData.sku),
                sql`${products.id} != ${productId}`
            ))
            .limit(1);

        if (existingSku.length > 0) {
            throw new Error("SKU already exists");
        }

        if (validatedData.variants.length > 0) {
            const variantSkus = validatedData.variants.map(v => v.sku);
            const existingVariantSkus = await db
                .select({ sku: productVariants.sku, productId: productVariants.productId })
                .from(productVariants)
                .where(inArray(productVariants.sku, variantSkus));

            const conflictingVariant = existingVariantSkus.find(v => v.productId !== productId);
            if (conflictingVariant) {
                throw new Error(`Variant SKU already exists: ${conflictingVariant.sku}`);
            }
        }

        // Neon HTTP driver does not support transactions. Use sequential writes.
        await db
            .update(products)
            .set({
                name: validatedData.name,
                slug,
                description: validatedData.description,
                basePrice: validatedData.basePrice.toString(),
                sku: validatedData.sku,
                material: validatedData.material,
                careInstructions: validatedData.careInstructions,
                categoryId: validatedData.categoryId,
                isActive: validatedData.isActive,
                isDraft: validatedData.isDraft,
                updatedAt: new Date(),
            })
            .where(eq(products.id, productId));

        await db.delete(productImages).where(eq(productImages.productId, productId));
        await db.delete(productVariants).where(eq(productVariants.productId, productId));

        if (validatedData.images.length > 0) {
            await db.insert(productImages).values(
                validatedData.images.map((image, index) => ({
                    productId,
                    imageUrl: image.imageUrl,
                    altText: image.altText || validatedData.name,
                    isPrimary: image.isPrimary || index === 0,
                    displayOrder: image.displayOrder || index,
                }))
            );
        }

        if (validatedData.variants.length > 0) {
            await db.insert(productVariants).values(
                validatedData.variants.map((variant) => ({
                    productId,
                    size: variant.size,
                    color: variant.color,
                    colorHex: variant.colorHex,
                    stockQuantity: variant.stockQuantity,
                    additionalPrice: variant.additionalPrice.toString(),
                    sku: variant.sku,
                    isActive: true,
                }))
            );
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${productId}/edit`);
        return { success: true };
    } catch (error) {
        console.error("Update product error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update product"
        };
    }
}

// DELETE PRODUCT
export async function deleteProduct(productId: string) {
    try {
        // Check if product exists
        const product = await db
            .select({ id: products.id, name: products.name })
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (product.length === 0) {
            throw new Error("Product not found");
        }

        // Delete product (cascading will handle related data)
        await db.delete(products).where(eq(products.id, productId));

        revalidatePath("/admin/products");
        return { success: true, message: `Product "${product[0].name}" deleted successfully` };
    } catch (error) {
        console.error("Delete product error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete product"
        };
    }
}

// BULK DELETE PRODUCTS
export async function bulkDeleteProducts(productIds: string[]) {
    try {
        if (productIds.length === 0) {
            throw new Error("No products selected");
        }

        await db
            .delete(products)
            .where(inArray(products.id, productIds));

        revalidatePath("/admin/products");
        return {
            success: true,
            message: `${productIds.length} product(s) deleted successfully`
        };
    } catch (error) {
        console.error("Bulk delete error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete products"
        };
    }
}

/* ========================================================================== */
/* ADMIN: PRODUCT EDITING AND CATEGORY DATA                                   */
/* ========================================================================== */

// GET PRODUCT BY ID (for editing)
export async function getProductById(productId: string) {
    try {
        const product = await db
            .select({
                id: products.id,
                name: products.name,
                slug: products.slug,
                description: products.description,
                basePrice: products.basePrice,
                sku: products.sku,
                material: products.material,
                careInstructions: products.careInstructions,
                categoryId: products.categoryId,
                isActive: products.isActive,
                isDraft: products.isDraft,
                createdAt: products.createdAt,
                updatedAt: products.updatedAt,
            })
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (product.length === 0) {
            throw new Error("Product not found");
        }

        // Get images
        const images = await db
            .select({
                id: productImages.id,
                imageUrl: productImages.imageUrl,
                altText: productImages.altText,
                isPrimary: productImages.isPrimary,
                displayOrder: productImages.displayOrder,
            })
            .from(productImages)
            .where(eq(productImages.productId, productId))
            .orderBy(productImages.displayOrder);

        // Get variants
        const variants = await db
            .select({
                id: productVariants.id,
                size: productVariants.size,
                color: productVariants.color,
                colorHex: productVariants.colorHex,
                stockQuantity: productVariants.stockQuantity,
                additionalPrice: productVariants.additionalPrice,
                sku: productVariants.sku,
                isActive: productVariants.isActive,
            })
            .from(productVariants)
            .where(eq(productVariants.productId, productId));

        return {
            success: true,
            data: {
                ...product[0],
                basePrice: parseFloat(product[0].basePrice),
                images: images,
                variants: variants.map(v => ({
                    ...v,
                    stockQuantity: v.stockQuantity,
                    additionalPrice: parseFloat(v.additionalPrice),
                })),
            }
        };
    } catch (error) {
        console.error("Get product error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get product"
        };
    }
}

// GET ALL CATEGORIES (for dropdown)
export async function getAllCategories() {
    try {
        const result = await db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
            })
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(categories.displayOrder, categories.name);

        return { success: true, data: result };
    } catch (error) {
        console.error("Get categories error:", error);
        return {
            success: false,
            error: "Failed to get categories",
            data: []
        };
    }
}

/* ========================================================================== */
/* STOREFRONT: PRODUCT BROWSING DATA                                          */
/* ========================================================================== */

// GET ALL PRODUCTS WITH PAGINATION
export async function getAllProducts(params: ProductParams): Promise<PagedResponse<Product>> {
    const { category, size, searchQuery, page = 0, limit = 20, sortBy = "CREATED_AT_DESC" } = params;



    try {
        // Build WHERE conditions
        const conditions = [];

        // For admin panel, show all products (don't filter by isActive/isDraft)
        // conditions.push(eq(products.isActive, true));
        // conditions.push(eq(products.isDraft, false));

        // Filter by category slug (single value)
        if (category) {
            const categoryRecord = await db
                .select({ id: categories.id })
                .from(categories)
                .where(eq(categories.slug, category))
                .limit(1);

            if (categoryRecord.length > 0) {
                conditions.push(eq(products.categoryId, categoryRecord[0].id));
            } else {
                // If category doesn't match, return empty result
                return {
                    data: [],
                    page,
                    size: limit,
                    totalElements: 0,
                    totalPages: 0,
                };
            }
        }

        // Filter by size (check if product has variants with matching size)
        if (size) {
            const productsWithSize = await db
                .selectDistinct({ productId: productVariants.productId })
                .from(productVariants)
                .where(
                    and(
                        eq(productVariants.size, size),
                        eq(productVariants.isActive, true)
                    )
                );

            if (productsWithSize.length > 0) {
                const productIds = productsWithSize.map(p => p.productId);
                conditions.push(sql`${products.id} = ANY(ARRAY[${sql.join(productIds.map(id => sql`${id}`), sql`, `)}])`);
            } else {
                // If no products have this size, return empty result
                return {
                    data: [],
                    page,
                    size: limit,
                    totalElements: 0,
                    totalPages: 0,
                };
            }
        }

        // Search query (search in name, description, sku)
        if (searchQuery) {
            conditions.push(
                or(
                    ilike(products.name, `%${searchQuery}%`),
                    ilike(products.description, `%${searchQuery}%`),
                    ilike(products.sku, `%${searchQuery}%`)
                )
            );
        }

        // Combine all conditions
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const [countResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(whereClause);

        const totalItems = countResult?.count || 0;
        const totalPages = Math.ceil(totalItems / limit);

        // Determine sorting order
        let orderByClause;
        switch (sortBy) {
            case "NAME_ASC":
                orderByClause = asc(products.name);
                break;
            case "NAME_DESC":
                orderByClause = desc(products.name);
                break;
            case "PRICE_ASC":
                orderByClause = asc(products.basePrice);
                break;
            case "PRICE_DESC":
                orderByClause = desc(products.basePrice);
                break;
            case "CREATED_AT_ASC":
                orderByClause = asc(products.createdAt);
                break;
            case "CREATED_AT_DESC":
                orderByClause = desc(products.createdAt);
                break;
            case "BEST_SELLING":
                // For now, sort by created date desc (newest first)
                // TODO: Implement actual best selling logic based on order items count
                orderByClause = desc(products.createdAt);
                break;
            default:
                orderByClause = desc(products.createdAt);
        }

        // Get paginated products
        const productResults = await db
            .select()
            .from(products)
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(limit)
            .offset(page * limit);

        // Get images and variants for all products
        const productIds = productResults.map(p => p.id);
        const imagesResults = productIds.length > 0
            ? await db
                .select()
                .from(productImages)
                .where(inArray(productImages.productId, productIds))
                .orderBy(desc(productImages.isPrimary), productImages.displayOrder)
            : [];

        const variantsResults = productIds.length > 0
            ? await db
                .select()
                .from(productVariants)
                .where(inArray(productVariants.productId, productIds))
            : [];

        // Group images by product ID
        const imagesByProduct = imagesResults.reduce((acc, img) => {
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

        // Group variants by product ID
        const variantsByProduct = variantsResults.reduce((acc, variant) => {
            if (!acc[variant.productId]) {
                acc[variant.productId] = [];
            }
            acc[variant.productId].push({
                id: variant.id,
                productId: variant.productId,
                size: variant.size,
                color: variant.color,
                colorHex: variant.colorHex || undefined,
                stockQuantity: variant.stockQuantity,
                additionalPrice: parseFloat(variant.additionalPrice),
                sku: variant.sku,
                isActive: variant.isActive,
            });
            return acc;
        }, {} as Record<string, ProductVariant[]>);

        // Map products with images and variants
        const data: Product[] = productResults.map(product => ({
            id: product.id,
            categoryId: product.categoryId || "",
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            basePrice: parseFloat(product.basePrice),
            sku: product.sku,
            material: product.material || undefined,
            careInstructions: product.careInstructions || undefined,
            isActive: product.isActive,
            isDraft: product.isDraft,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images: imagesByProduct[product.id] || [],
            variants: variantsByProduct[product.id] || [],
        }));

        return {
            data,
            page,
            size: limit,
            totalElements: totalItems,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}



// GET PRODUCT BY SLUG with images
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const productResults = await db
            .select()
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        if (productResults.length === 0) return null;

        const product = productResults[0];

        const imagesResults = await db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, product.id))
            .orderBy(desc(productImages.isPrimary), productImages.displayOrder);

        const images: ProductImage[] = imagesResults.map(img => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText || undefined,
            isPrimary: img.isPrimary,
            displayOrder: img.displayOrder,
        }));

        return {
            id: product.id,
            categoryId: product.categoryId || "",
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            basePrice: parseFloat(product.basePrice),
            sku: product.sku,
            material: product.material || undefined,
            careInstructions: product.careInstructions || undefined,
            isActive: product.isActive,
            isDraft: product.isDraft,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images,
            variants: [], // Include empty variants array for compatibility
        };
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        throw new Error("Failed to fetch product");
    }
}


// GET PRODUCT VARIANTS
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
    try {
        const variantsResults = await db
            .select()
            .from(productVariants)
            .where(eq(productVariants.productId, productId))
            .orderBy(productVariants.size, productVariants.color);

        return variantsResults.map(variant => ({
            id: variant.id,
            productId: variant.productId,
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex || undefined,
            stockQuantity: variant.stockQuantity,
            additionalPrice: parseFloat(variant.additionalPrice),
            sku: variant.sku,
            isActive: variant.isActive,
        }));
    } catch (error) {
        console.error("Error fetching product variants:", error);
        throw new Error("Failed to fetch product variants");
    }
}

/* ========================================================================== */
/* STOREFRONT: PRODUCT REVIEWS                                                */
/* ========================================================================== */

// GET PRODUCT REVIEWS BY PRODUCT ID WITH PAGINATION
export async function getReviewsByProductId(productId: string, page = 0, size = 10): Promise<PagedResponse<Review>> {
    try {
        // total count
        const [countResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(reviews)
            .where(eq(reviews.productId, productId));

        const totalItems = countResult?.count || 0;
        const totalPages = Math.ceil(totalItems / size);

        // fetch paginated reviews with author name
        const reviewRows = await db
            .select({
                id: reviews.id,
                userId: reviews.userId,
                name: users.name,
                productId: reviews.productId,
                orderItemId: reviews.orderItemId,
                rating: reviews.rating,
                title: reviews.title,
                comment: reviews.comment,
                isVerifiedPurchase: reviews.isVerifiedPurchase,
                createdAt: reviews.createdAt,
            })
            .from(reviews)
            .leftJoin(users, eq(users.id, reviews.userId))
            .where(eq(reviews.productId, productId))
            .orderBy(desc(reviews.createdAt))
            .limit(size)
            .offset(page * size);

        const data: Review[] = reviewRows.map(r => ({
            id: r.id,
            userId: r.userId,
            name: r.name || "",
            productId: r.productId,
            orderItemId: r.orderItemId || undefined,
            rating: r.rating,
            title: r.title || "",
            comment: r.comment || "",
            isVerifiedPurchase: !!r.isVerifiedPurchase,
            createdAt: r.createdAt.toISOString(),
        }));

        return {
            data,
            page,
            size,
            totalElements: totalItems,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        // Return empty result instead of throwing to prevent page crash
        return {
            data: [],
            page: 0,
            size,
            totalElements: 0,
            totalPages: 0,
        };
    }
}


// CAN THIS USER REVIEW? (checks if user has purchased the product before)

export async function canUserReviewProduct(userId: string, productId: string): Promise<boolean> {
    try {
        const purchased = await db
            .selectDistinct({ orderItemId: orderItems.id })
            .from(orderItems)
            .leftJoin(orders, eq(orders.id, orderItems.orderId))
            .leftJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
            .where(and(
                eq(orders.userId, userId),
                eq(productVariants.productId, productId),
                // consider delivered orders only
                eq(orders.status, 'DELIVERED')
            ))
            .limit(1);

        return purchased.length > 0;

    } catch (error) {
        console.error("Error checking purchase for review:", error);
        return false;
    }
}


// ADD REVIEW TO PRODUCT
export async function addReviewToProduct(userId: string, productId: string, request: AddReviewRequest): Promise<AddReviewResponse> {
    try {
        // only users who purchased can add verified reviews; still allow adding if not purchased but mark unverified
        const isEligible = await canUserReviewProduct(userId, productId);

        // prevent duplicate review by same user for same product
        const existing = await db
            .select()
            .from(reviews)
            .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
            .limit(1);

        if (existing.length > 0) {
            throw new Error("User has already reviewed this product");
        }

        // if eligible, find one order item id to link
        let orderItemId: string | undefined = undefined;
        if (isEligible) {
            const items = await db
                .select({ orderItemId: orderItems.id })
                .from(orderItems)
                .leftJoin(orders, eq(orders.id, orderItems.orderId))
                .leftJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
                .where(and(eq(orders.userId, userId), eq(productVariants.productId, productId), eq(orders.status, 'DELIVERED')))
                .limit(1);

            if (items.length > 0) {
                orderItemId = items[0].orderItemId;
            }
        }

        const insertResult = await db
            .insert(reviews)
            .values({
                userId,
                productId,
                orderItemId: orderItemId || null,
                rating: request.rating,
                title: request.title || null,
                comment: request.comment,
                isVerifiedPurchase: !!isEligible,
            })
            .returning();

        const row = Array.isArray(insertResult) ? insertResult[0] : insertResult;

        const created: Review = {
            id: row.id,
            userId: row.userId,
            name: "",
            productId: row.productId,
            orderItemId: row.orderItemId || undefined,
            rating: row.rating,
            title: row.title || "",
            comment: row.comment || "",
            isVerifiedPurchase: !!row.isVerifiedPurchase,
            createdAt: row.createdAt.toISOString(),
        };

        return {
            message: "Review added",
            review: created,
        };
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error((error as Error)?.message || "Failed to add review");
    }
}







