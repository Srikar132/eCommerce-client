import { MetadataRoute } from "next";
import { db } from "@/drizzle/db";
import { products, categories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const SITE_URL = "https://nalaarmoire.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${SITE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Fetch all active products for dynamic product pages
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const allProducts = await db
            .select({
                slug: products.slug,
                updatedAt: products.updatedAt,
            })
            .from(products)
            .where(eq(products.isActive, true));

        productPages = allProducts.map((product) => ({
            url: `${SITE_URL}/products/${product.slug}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Error fetching products for sitemap:", error);
    }

    // Fetch all active categories for filtering URLs
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const allCategories = await db
            .select({
                name: categories.name,
            })
            .from(categories)
            .where(eq(categories.isActive, true));

        categoryPages = allCategories.map((category) => ({
            url: `${SITE_URL}/products?category=${encodeURIComponent(category.name)}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Error fetching categories for sitemap:", error);
    }

    return [...staticPages, ...productPages, ...categoryPages];
}
