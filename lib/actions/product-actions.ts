"use server";

import { PagedResponse } from "@/types";
import {
    Product,
    ProductParams,
    ProductImage,
    ProductVariant,
    Review,
    AddReviewRequest,
    AddReviewResponse,
} from "@/types/product";
import { db } from "@/drizzle/db";
import {
    products,
    productImages,
    categories,
    productVariants,
    reviews,
    orders,
    orderItems,
    users,
    cartItems,
} from "@/drizzle/schema";
import { eq, and, or, ilike, sql, desc, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { productFormSchema, ProductFormData } from "@/lib/validations";
// FIX: import the shared enum types from the single source of truth.
// Previously these were re-derived from Drizzle's pgEnum which TypeScript
// treats as a structurally different type to the ones in ProductVariant,
// causing the red line under size/color in parseVariant.
import { ProductSize, ProductColor } from "@/lib/constants/enums";

/**
 * Generate a unique SKU for a product variant.
 * Format: {PRODUCT_SKU}-{SIZE}-{COLOR_CODE}-{RANDOM}
 */
function generateVariantSku(productSku: string, size: string, color: string): string {
    const colorCode =
        color.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3) || "XXX";
    const sizeCode = size.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${productSku}-${sizeCode}-${colorCode}-${randomSuffix}`;
}

/* ========================================================================== */
/* ADMIN: PRODUCT MANAGEMENT ACTIONS                                          */
/* ========================================================================== */

// ============================================================================
// CREATE PRODUCT
// ============================================================================
export async function createProduct(formData: ProductFormData) {
    try {
        const validatedData = productFormSchema.parse(formData);

        const slug = validatedData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const productSku = validatedData.sku ?? "";

        if (productSku) {
            const existingSku = await db
                .select({ sku: products.sku })
                .from(products)
                .where(eq(products.sku, productSku))
                .limit(1);

            if (existingSku.length > 0) throw new Error("SKU already exists");
        }

        const existingSlug = await db
            .select({ slug: products.slug })
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        if (existingSlug.length > 0) throw new Error("A product with this name already exists");

        let newProductId: string | null = null;
        try {
            const [newProduct] = await db
                .insert(products)
                .values({
                    name:             validatedData.name,
                    slug,
                    description:      validatedData.description      ?? null,
                    basePrice:        validatedData.basePrice.toString(),
                    sku:              productSku,
                    material:         validatedData.material         ?? null,
                    careInstructions: validatedData.careInstructions ?? null,
                    categoryId:       validatedData.categoryId,
                    isActive:         validatedData.isActive,
                    isDraft:          validatedData.isDraft,
                })
                .returning();

            newProductId = newProduct.id;

            if (validatedData.images.length > 0) {
                await db.insert(productImages).values(
                    validatedData.images.map((image, index) => ({
                        productId:    newProductId!,
                        imageUrl:     image.imageUrl,
                        altText:      image.altText || validatedData.name,
                        isPrimary:    image.isPrimary || index === 0,
                        displayOrder: image.displayOrder ?? index,
                    }))
                );
            }

            if (validatedData.variants.length > 0) {
                await db.insert(productVariants).values(
                    validatedData.variants.map((variant) => ({
                        productId:     newProductId!,
                        size:          variant.size  as ProductSize,
                        color:         variant.color as ProductColor,
                        colorHex:      variant.colorHex || "#000000",
                        stockQuantity: variant.stockQuantity,
                        priceModifier: variant.priceModifier.toString(),
                        sku:           generateVariantSku(productSku, variant.size, variant.color),
                        isActive:      true,
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
        return { success: false, error: parseProductError(error) };
    }
}

// ============================================================================
// ERROR PARSER
// ============================================================================
function parseProductError(error: unknown): string {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("unique constraint") || message.includes("duplicate key")) {
            if (message.includes("sku"))  return "A product with this SKU already exists. Please use a different SKU.";
            if (message.includes("slug")) return "A product with this name already exists. Please use a different name.";
            return "This item already exists. Please check for duplicates.";
        }
        if (message.includes("foreign key") || message.includes("violates foreign key")) {
            return "Invalid category selected. Please choose a valid category.";
        }
        if (message.includes("validation") || message.includes("invalid")) return error.message;
        if (
            message.includes("sku already exists") ||
            message.includes("product with this name already exists")
        ) return error.message;
        if (message.includes("failed query") || message.includes("database")) {
            return "Unable to save product. Please try again later.";
        }
        return error.message;
    }
    return "Failed to create product. Please try again.";
}

// ============================================================================
// UPDATE PRODUCT  (smart upsert — never blindly deletes variants)
// ============================================================================
export async function updateProduct(productId: string, formData: ProductFormData) {
    try {
        const validatedData = productFormSchema.parse(formData);

        const slug = validatedData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const productSku = validatedData.sku ?? "";

        if (productSku) {
            const existingSku = await db
                .select({ id: products.id })
                .from(products)
                .where(and(eq(products.sku, productSku), sql`${products.id} != ${productId}`))
                .limit(1);

            if (existingSku.length > 0) throw new Error("SKU already exists");
        }

        // ── 1. Update the product row ────────────────────────────────────────
        await db
            .update(products)
            .set({
                name:             validatedData.name,
                slug,
                description:      validatedData.description      ?? null,
                basePrice:        validatedData.basePrice.toString(),
                sku:              productSku,
                material:         validatedData.material         ?? null,
                careInstructions: validatedData.careInstructions ?? null,
                categoryId:       validatedData.categoryId,
                isActive:         validatedData.isActive,
                isDraft:          validatedData.isDraft,
                updatedAt:        new Date(),
            })
            .where(eq(products.id, productId));

        // ── 2. Images — safe delete-then-reinsert (nothing FK-references them) ──
        await db.delete(productImages).where(eq(productImages.productId, productId));

        if (validatedData.images.length > 0) {
            await db.insert(productImages).values(
                validatedData.images.map((image, index) => ({
                    productId,
                    imageUrl:     image.imageUrl,
                    altText:      image.altText || validatedData.name,
                    isPrimary:    image.isPrimary || index === 0,
                    displayOrder: image.displayOrder ?? index,
                }))
            );
        }

        // ── 3. Variants — smart upsert (never blindly delete) ────────────────
        const existingVariants = await db
            .select({
                id:    productVariants.id,
                size:  productVariants.size,
                color: productVariants.color,
            })
            .from(productVariants)
            .where(eq(productVariants.productId, productId));

        const existingVariantMap = new Map<string, string>(
            existingVariants.map((v) => [`${v.size}||${v.color}`, v.id])
        );

        const wantedVariantIds = new Set<string>();

        for (const variant of validatedData.variants) {
            const key        = `${variant.size}||${variant.color}`;
            const existingId = existingVariantMap.get(key);

            if (existingId) {
                wantedVariantIds.add(existingId);
                await db
                    .update(productVariants)
                    .set({
                        colorHex:      variant.colorHex || "#000000",
                        stockQuantity: variant.stockQuantity,
                        priceModifier: variant.priceModifier.toString(),
                        isActive:      true,
                    })
                    .where(eq(productVariants.id, existingId));
            } else {
                const [inserted] = await db
                    .insert(productVariants)
                    .values({
                        productId,
                        size:          variant.size  as ProductSize,
                        color:         variant.color as ProductColor,
                        colorHex:      variant.colorHex || "#000000",
                        stockQuantity: variant.stockQuantity,
                        priceModifier: variant.priceModifier.toString(),
                        sku:           generateVariantSku(productSku, variant.size, variant.color),
                        isActive:      true,
                    })
                    .returning({ id: productVariants.id });

                wantedVariantIds.add(inserted.id);
            }
        }

        const unwantedIds = existingVariants
            .map((v) => v.id)
            .filter((id) => !wantedVariantIds.has(id));

        if (unwantedIds.length > 0) {
            const [referencedInCart, referencedInOrders] = await Promise.all([
                db
                    .select({ variantId: cartItems.productVariantId })
                    .from(cartItems)
                    .where(inArray(cartItems.productVariantId, unwantedIds)),
                db
                    .select({ variantId: orderItems.productVariantId })
                    .from(orderItems)
                    .where(inArray(orderItems.productVariantId, unwantedIds)),
            ]);

            const referencedIds = new Set<string>(
                [
                    ...referencedInCart.map((r) => r.variantId),
                    ...referencedInOrders.map((r) => r.variantId),
                ].filter(Boolean) as string[]
            );

            const safeToDelete   = unwantedIds.filter((id) => !referencedIds.has(id));
            const mustDeactivate = unwantedIds.filter((id) =>  referencedIds.has(id));

            if (safeToDelete.length > 0) {
                await db.delete(productVariants).where(inArray(productVariants.id, safeToDelete));
            }
            if (mustDeactivate.length > 0) {
                await db
                    .update(productVariants)
                    .set({ isActive: false })
                    .where(inArray(productVariants.id, mustDeactivate));
            }
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${productId}/edit`);
        return { success: true };
    } catch (error) {
        console.error("Update product error:", error);
        return { success: false, error: parseProductError(error) };
    }
}

// ============================================================================
// DELETE PRODUCT
// ============================================================================
export async function deleteProduct(productId: string) {
    try {
        const product = await db
            .select({ id: products.id, name: products.name })
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (product.length === 0) throw new Error("Product not found");

        const productWithOrders = await db
            .select({ orderId: orderItems.orderId })
            .from(orderItems)
            .innerJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
            .where(eq(productVariants.productId, productId))
            .limit(1);

        if (productWithOrders.length > 0) {
            await db
                .update(products)
                .set({ isActive: false, isDraft: true, updatedAt: new Date() })
                .where(eq(products.id, productId));

            await db
                .update(productVariants)
                .set({ isActive: false })
                .where(eq(productVariants.productId, productId));

            revalidatePath("/admin/products");
            return {
                success: true,
                message: `Product "${product[0].name}" has been archived (has order history)`,
                archived: true,
            };
        }

        const imagesToDelete = await db
            .select({ imageUrl: productImages.imageUrl })
            .from(productImages)
            .where(eq(productImages.productId, productId));

        await db.delete(products).where(eq(products.id, productId));

        if (imagesToDelete.length > 0) {
            const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
            Promise.all(
                imagesToDelete.map(async (img) => {
                    try {
                        const publicId = extractPublicId(img.imageUrl);
                        if (publicId) await deleteImage(publicId);
                    } catch (err) {
                        console.error("Cloudinary delete failed:", img.imageUrl, err);
                    }
                })
            ).catch((err) => console.error("Cloudinary cleanup error:", err));
        }

        revalidatePath("/admin/products");
        return { success: true, message: `Product "${product[0].name}" deleted successfully` };
    } catch (error) {
        console.error("Delete product error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete product",
        };
    }
}

// ============================================================================
// BULK DELETE PRODUCTS
// ============================================================================
export async function bulkDeleteProducts(productIds: string[]) {
    try {
        if (productIds.length === 0) throw new Error("No products selected");

        const productsWithOrders = await db
            .selectDistinct({ productId: productVariants.productId })
            .from(orderItems)
            .innerJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
            .where(inArray(productVariants.productId, productIds));

        const productIdsWithOrders = productsWithOrders.map((p) => p.productId);
        const productIdsToDelete   = productIds.filter((id) => !productIdsWithOrders.includes(id));

        let archivedCount = 0;
        let deletedCount  = 0;

        if (productIdsWithOrders.length > 0) {
            await db
                .update(products)
                .set({ isActive: false, isDraft: true, updatedAt: new Date() })
                .where(inArray(products.id, productIdsWithOrders));

            await db
                .update(productVariants)
                .set({ isActive: false })
                .where(inArray(productVariants.productId, productIdsWithOrders));

            archivedCount = productIdsWithOrders.length;
        }

        if (productIdsToDelete.length > 0) {
            const imagesToDelete = await db
                .select({ imageUrl: productImages.imageUrl })
                .from(productImages)
                .where(inArray(productImages.productId, productIdsToDelete));

            await db.delete(products).where(inArray(products.id, productIdsToDelete));
            deletedCount = productIdsToDelete.length;

            if (imagesToDelete.length > 0) {
                const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
                Promise.all(
                    imagesToDelete.map(async (img) => {
                        try {
                            const publicId = extractPublicId(img.imageUrl);
                            if (publicId) await deleteImage(publicId);
                        } catch (err) {
                            console.error("Cloudinary delete failed:", img.imageUrl, err);
                        }
                    })
                ).catch((err) => console.error("Cloudinary bulk cleanup error:", err));
            }
        }

        revalidatePath("/admin/products");

        const messages: string[] = [];
        if (deletedCount  > 0) messages.push(`${deletedCount} deleted`);
        if (archivedCount > 0) messages.push(`${archivedCount} archived (have orders)`);

        return { success: true, message: `Products: ${messages.join(", ")}`, deletedCount, archivedCount };
    } catch (error) {
        console.error("Bulk delete error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete products",
        };
    }
}

/* ========================================================================== */
/* ADMIN: PRODUCT EDITING AND CATEGORY DATA                                   */
/* ========================================================================== */

export async function getProductById(productId: string) {
    try {
        const product = await db
            .select({
                id: products.id, name: products.name, slug: products.slug,
                description: products.description, basePrice: products.basePrice,
                sku: products.sku, material: products.material,
                careInstructions: products.careInstructions, categoryId: products.categoryId,
                isActive: products.isActive, isDraft: products.isDraft,
                createdAt: products.createdAt, updatedAt: products.updatedAt,
            })
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (product.length === 0) throw new Error("Product not found");

        const images = await db
            .select({
                id: productImages.id, imageUrl: productImages.imageUrl,
                altText: productImages.altText, isPrimary: productImages.isPrimary,
                displayOrder: productImages.displayOrder,
            })
            .from(productImages)
            .where(eq(productImages.productId, productId))
            .orderBy(productImages.displayOrder);

        const variants = await db
            .select({
                id: productVariants.id, size: productVariants.size,
                color: productVariants.color, colorHex: productVariants.colorHex,
                stockQuantity: productVariants.stockQuantity,
                priceModifier: productVariants.priceModifier,
                sku: productVariants.sku, isActive: productVariants.isActive,
            })
            .from(productVariants)
            .where(eq(productVariants.productId, productId));

        return {
            success: true,
            data: {
                ...product[0],
                basePrice: parseFloat(product[0].basePrice),
                images,
                variants: variants.map((v) => ({
                    ...v,
                    priceModifier: parseFloat(v.priceModifier),
                })),
            },
        };
    } catch (error) {
        console.error("Get product error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get product",
        };
    }
}

export async function getAllCategories() {
    try {
        const results = await db
            .select()
            .from(categories)
            .orderBy(asc(categories.displayOrder), asc(categories.name));
        return results;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

/* ========================================================================== */
/* STOREFRONT: PRODUCT BROWSING DATA                                          */
/* ========================================================================== */

// ============================================================================
// MAPPERS
// FIX: size and color cast to ProductSize/ProductColor (imported from shared
// enums) — these are the exact same types used in the ProductVariant interface,
// so TypeScript is happy. Previously re-derived from Drizzle's pgEnum which
// TypeScript treated as a structurally incompatible type.
// ============================================================================

function parseVariant(variant: typeof productVariants.$inferSelect): ProductVariant {
    return {
        id:            variant.id,
        productId:     variant.productId,
        size:          variant.size  as ProductSize,
        color:         variant.color as ProductColor,
        colorHex:      variant.colorHex ?? undefined,
        stockQuantity: variant.stockQuantity,
        priceModifier: parseFloat(variant.priceModifier),
        sku:           variant.sku,
        isActive:      variant.isActive,
    };
}

function parseImage(img: typeof productImages.$inferSelect): ProductImage {
    return {
        id:           img.id,
        imageUrl:     img.imageUrl,
        altText:      img.altText ?? undefined,
        isPrimary:    img.isPrimary,
        displayOrder: img.displayOrder,
    };
}

export async function getAllProducts(params: ProductParams): Promise<PagedResponse<Product>> {
    const {
        category, sizes, colors, minPrice, maxPrice,
        searchQuery, page = 0, limit = 20, sortBy = "CREATED_AT_DESC",
    } = params;

    try {
        const conditions: ReturnType<typeof eq>[] = [];

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

        if (minPrice !== undefined) {
            conditions.push(sql`${products.basePrice} >= ${minPrice}` as unknown as ReturnType<typeof eq>);
        }
        if (maxPrice !== undefined) {
            conditions.push(sql`${products.basePrice} <= ${maxPrice}` as unknown as ReturnType<typeof eq>);
        }

        if (sizes || colors) {
            const variantConditions: ReturnType<typeof eq>[] = [];
            if (sizes) {
                const sizeList = sizes.split(",").map((s) => s.trim()) as ProductSize[];
                variantConditions.push(inArray(productVariants.size, sizeList) as unknown as ReturnType<typeof eq>);
            }
            if (colors) {
                const colorList = colors.split(",").map((c) => c.trim()) as ProductColor[];
                variantConditions.push(inArray(productVariants.color, colorList) as unknown as ReturnType<typeof eq>);
            }

            const productsWithVariants = await db
                .selectDistinct({ productId: productVariants.productId })
                .from(productVariants)
                .where(and(...variantConditions, eq(productVariants.isActive, true)));

            if (productsWithVariants.length > 0) {
                conditions.push(
                    inArray(products.id, productsWithVariants.map((p) => p.productId)) as unknown as ReturnType<typeof eq>
                );
            } else {
                return { data: [], page, size: limit, totalElements: 0, totalPages: 0 };
            }
        }

        if (searchQuery) {
            conditions.push(
                or(
                    ilike(products.name, `%${searchQuery}%`),
                    sql`${products.description} ilike ${"%" + searchQuery + "%"}`,
                    ilike(products.sku, `%${searchQuery}%`)
                ) as unknown as ReturnType<typeof eq>
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [countResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(whereClause);

        const totalItems = countResult?.count ?? 0;
        const totalPages = Math.ceil(totalItems / limit);

        const orderByClause =
            sortBy === "NAME_ASC"       ? asc(products.name)       :
            sortBy === "NAME_DESC"      ? desc(products.name)      :
            sortBy === "PRICE_ASC"      ? asc(products.basePrice)  :
            sortBy === "PRICE_DESC"     ? desc(products.basePrice) :
            sortBy === "CREATED_AT_ASC" ? asc(products.createdAt)  :
                                          desc(products.createdAt);

        const productResults = await db
            .select({
                product:  products,
                category: { id: categories.id, name: categories.name, slug: categories.slug },
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(limit)
            .offset(page * limit);

        const productIds = productResults.map((p) => p.product.id);

        const [imagesResults, variantsResults] = await Promise.all([
            productIds.length > 0
                ? db.select().from(productImages)
                      .where(inArray(productImages.productId, productIds))
                      .orderBy(desc(productImages.isPrimary), productImages.displayOrder)
                : Promise.resolve([]),
            productIds.length > 0
                ? db.select().from(productVariants)
                      .where(inArray(productVariants.productId, productIds))
                : Promise.resolve([]),
        ]);

        const imagesByProduct = imagesResults.reduce<Record<string, ProductImage[]>>((acc, img) => {
            (acc[img.productId] ??= []).push(parseImage(img));
            return acc;
        }, {});

        const variantsByProduct = variantsResults.reduce<Record<string, ProductVariant[]>>((acc, v) => {
            (acc[v.productId] ??= []).push(parseVariant(v));
            return acc;
        }, {});

        const data: Product[] = productResults.map(({ product, category }) => ({
            id: product.id, categoryId: product.categoryId ?? "",
            name: product.name, slug: product.slug,
            description:      product.description      ?? undefined,
            basePrice:        parseFloat(product.basePrice),
            sku:              product.sku,
            material:         product.material         ?? undefined,
            careInstructions: product.careInstructions ?? undefined,
            isActive:  product.isActive, isDraft: product.isDraft,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images:   imagesByProduct[product.id]   ?? [],
            variants: variantsByProduct[product.id] ?? [],
            category: category
                ? { id: category.id, name: category.name, slug: category.slug }
                : undefined,
        }));

        return { data, page, size: limit, totalElements: totalItems, totalPages };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const productResults = await db
            .select({
                product:  products,
                category: { id: categories.id, name: categories.name, slug: categories.slug },
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(eq(products.slug, slug))
            .limit(1);

        if (productResults.length === 0) return null;

        const { product, category } = productResults[0];

        const [imagesResults, variantsResults] = await Promise.all([
            db.select().from(productImages)
                .where(eq(productImages.productId, product.id))
                .orderBy(desc(productImages.isPrimary), productImages.displayOrder),
            db.select().from(productVariants)
                .where(and(eq(productVariants.productId, product.id), eq(productVariants.isActive, true)))
                .orderBy(productVariants.size, productVariants.color),
        ]);

        return {
            id: product.id, categoryId: product.categoryId ?? "",
            name: product.name, slug: product.slug,
            description:      product.description      ?? undefined,
            basePrice:        parseFloat(product.basePrice),
            sku:              product.sku,
            material:         product.material         ?? undefined,
            careInstructions: product.careInstructions ?? undefined,
            isActive:  product.isActive, isDraft: product.isDraft,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images:   imagesResults.map(parseImage),
            variants: variantsResults.map(parseVariant),
            category: category
                ? { id: category.id, name: category.name, slug: category.slug }
                : undefined,
        };
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        throw new Error("Failed to fetch product");
    }
}

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
    try {
        const variantsResults = await db
            .select()
            .from(productVariants)
            .where(eq(productVariants.productId, productId))
            .orderBy(productVariants.size, productVariants.color);

        return variantsResults.map(parseVariant);
    } catch (error) {
        console.error("Error fetching product variants:", error);
        throw new Error("Failed to fetch product variants");
    }
}

export async function getReviewsByProductId(
    productId: string,
    page = 0,
    size = 10
): Promise<PagedResponse<Review>> {
    try {
        const [countResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(reviews)
            .where(eq(reviews.productId, productId));

        const totalItems = countResult?.count ?? 0;
        const totalPages = Math.ceil(totalItems / size);

        const reviewRows = await db
            .select({
                id: reviews.id, userId: reviews.userId, name: users.name,
                productId: reviews.productId, orderItemId: reviews.orderItemId,
                rating: reviews.rating, title: reviews.title, comment: reviews.comment,
                isVerifiedPurchase: reviews.isVerifiedPurchase, createdAt: reviews.createdAt,
            })
            .from(reviews)
            .leftJoin(users, eq(users.id, reviews.userId))
            .where(eq(reviews.productId, productId))
            .orderBy(desc(reviews.createdAt))
            .limit(size)
            .offset(page * size);

        const data: Review[] = reviewRows.map((r) => ({
            id: r.id, userId: r.userId, name: r.name ?? "", productId: r.productId,
            orderItemId: r.orderItemId ?? undefined, rating: r.rating,
            title: r.title ?? "", comment: r.comment ?? "",
            isVerifiedPurchase: !!r.isVerifiedPurchase,
            createdAt: r.createdAt.toISOString(),
        }));

        return { data, page, size, totalElements: totalItems, totalPages };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { data: [], page: 0, size, totalElements: 0, totalPages: 0 };
    }
}

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
                eq(orders.status, "DELIVERED")
            ))
            .limit(1);

        return purchased.length > 0;
    } catch (error) {
        console.error("Error checking purchase for review:", error);
        return false;
    }
}

export async function addReviewToProduct(
    userId: string,
    productId: string,
    request: AddReviewRequest
): Promise<AddReviewResponse> {
    try {
        const isEligible = await canUserReviewProduct(userId, productId);

        const existing = await db
            .select()
            .from(reviews)
            .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
            .limit(1);

        if (existing.length > 0) throw new Error("User has already reviewed this product");

        let orderItemId: string | undefined;
        if (isEligible) {
            const items = await db
                .select({ orderItemId: orderItems.id })
                .from(orderItems)
                .leftJoin(orders, eq(orders.id, orderItems.orderId))
                .leftJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
                .where(and(
                    eq(orders.userId, userId),
                    eq(productVariants.productId, productId),
                    eq(orders.status, "DELIVERED")
                ))
                .limit(1);

            if (items.length > 0) orderItemId = items[0].orderItemId;
        }

        const insertResult = await db
            .insert(reviews)
            .values({
                userId, productId,
                orderItemId:        orderItemId ?? null,
                rating:             request.rating,
                title:              request.title ?? null,
                comment:            request.comment,
                isVerifiedPurchase: !!isEligible,
            })
            .returning();

        const row = Array.isArray(insertResult) ? insertResult[0] : insertResult;

        return {
            message: "Review added",
            review: {
                id: row.id, userId: row.userId, name: "", productId: row.productId,
                orderItemId: row.orderItemId ?? undefined, rating: row.rating,
                title: row.title ?? "", comment: row.comment ?? "",
                isVerifiedPurchase: !!row.isVerifiedPurchase,
                createdAt: row.createdAt.toISOString(),
            },
        };
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error((error as Error)?.message ?? "Failed to add review");
    }
}

export async function getActiveCategories() {
    try {
        const results = await db
            .select()
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(asc(categories.displayOrder), asc(categories.name));
        return results;
    } catch (error) {
        console.error("Error fetching active categories:", error);
        return [];
    }
}

export async function updateCategory(
    id: string,
    data: Partial<{
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        isActive: boolean;
        displayOrder: number;
    }>
) {
    try {
        if (data.imageUrl) {
            const [existing] = await db
                .select({ imageUrl: categories.imageUrl })
                .from(categories)
                .where(eq(categories.id, id))
                .limit(1);

            if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
                const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
                const publicId = extractPublicId(existing.imageUrl);
                if (publicId) {
                    deleteImage(publicId).catch((err) =>
                        console.error("Cloudinary category image delete failed:", err)
                    );
                }
            }
        }

        await db.update(categories).set(data).where(eq(categories.id, id));

        revalidatePath("/admin/products");
        revalidatePath("/");
        return { success: true, message: "Category updated successfully" };
    } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, message: "Failed to update category" };
    }
}