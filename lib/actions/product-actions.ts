"use server";

import { PagedResponse } from "@/types";
import { Product, ProductParams, ProductImage, ProductVariant } from "@/types/product";
import { db } from "@/drizzle/db";
import { products, productImages, categories, productVariants } from "@/drizzle/schema";
import { eq, and, or, ilike, sql, desc, asc } from "drizzle-orm";


// GET ALL PRODUCTS WITH PAGINATION
export async function getAllProducts(params: ProductParams): Promise<PagedResponse<Product>> {
    const { category, size, searchQuery, page = 0, limit = 20, sortBy = "CREATED_AT_DESC" } = params;



    try {
        // Build WHERE conditions
        const conditions = [];

        // Always filter active products only
        conditions.push(eq(products.isActive, true));
        conditions.push(eq(products.isDraft, false));

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

        // Get images for all products
        const productIds = productResults.map(p => p.id);
        const imagesResults = productIds.length > 0
            ? await db
                .select()
                .from(productImages)
                .where(sql`${productImages.productId} = ANY(ARRAY[${sql.join(productIds.map(id => sql`${id}`), sql`, `)}])`)
                .orderBy(desc(productImages.isPrimary), productImages.displayOrder)
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

        // Map products with images
        const data: Product[] = productResults.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            basePrice: parseFloat(product.basePrice),
            sku: product.sku,
            material: product.material || undefined,
            careInstructions: product.careInstructions || undefined,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images: imagesByProduct[product.id] || [],
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
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            basePrice: parseFloat(product.basePrice),
            sku: product.sku,
            material: product.material || undefined,
            careInstructions: product.careInstructions || undefined,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            images,
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