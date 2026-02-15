import ProductDetailClient from "@/components/product/product-detail-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { getProductBySlug, getProductVariants } from "@/lib/actions/product-actions";
import { Product, ProductVariant } from "@/types/product";
import { cacheLife } from "next/cache";
import ProductReviewsSection from "@/components/product/product-reviews-section";
import { ReviewsSkeleton } from "@/components/product/reviews-skeleton";
import { ProductSchema, BreadcrumbSchema } from "@/components/shared/structured-data";


interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}


// Cached function for fetching product data
async function getCachedProduct(slug: string): Promise<Product | null> {
    "use cache";
    cacheLife("minutes");

    return await getProductBySlug(slug);
}

// Cached function for fetching product variants
async function getCachedProductVariants(productId: string): Promise<ProductVariant[]> {
    "use cache";
    cacheLife("minutes");

    return await getProductVariants(productId);
}



export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    try {
        const { slug } = await params;
        const product = await getCachedProduct(slug);

        if (!product) {
            return {
                title: "Product Not Found",
            };
        }

        const productImage = product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;
        const description = product.description?.slice(0, 160) || `Shop ${product.name} at Nala Armoire. Premium customizable fashion, handcrafted with love.`;

        return {
            title: product.name,
            description,
            openGraph: {
                title: `${product.name} | Nala Armoire`,
                description,
                url: `https://nalaarmoire.com/products/${slug}`,
                images: [
                    {
                        url: productImage,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: `${product.name} | Nala Armoire`,
                description,
                images: [productImage],
            },
            alternates: {
                canonical: `https://nalaarmoire.com/products/${slug}`,
            },
        };
    } catch {
        return {
            title: "Product Not Found",
        };
    }
}



export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Fetch product data using cached function
    const product = await getCachedProduct(slug).catch(() => null);

    if (!product) {
        notFound();
    }

    // Fetch variants using cached function
    const variants = await getCachedProductVariants(product.id);

    // Prepare structured data
    const productUrl = `https://nalaarmoire.com/products/${product.slug}`;
    const productImage = product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;
    const productPrice = product.basePrice;

    const breadcrumbItems = [
        { name: "Home", url: "https://nalaarmoire.com" },
        { name: "Products", url: "https://nalaarmoire.com/products" },
        { name: product.name, url: productUrl },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data for SEO */}
            <ProductSchema
                name={product.name}
                description={product.description || "Premium customizable fashion from Nala Armoire"}
                image={productImage}
                price={productPrice}
                currency="INR"
                availability="InStock"
                sku={product.id}
                url={productUrl}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            {/* BREADCRUMB  */}


            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <ProductDetailClient product={product} variants={variants} />

                {/* Reviews Section - Server Component with its own prefetching */}
                <Suspense fallback={<ReviewsSkeleton />}>
                    <div className="sm:mt-10 lg:mt-12">
                        <ProductReviewsSection productId={product.id} />
                    </div>
                </Suspense>
            </div>
        </div>
    );
}