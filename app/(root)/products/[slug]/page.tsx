import ProductDetailClient from "@/components/product/product-detail-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { getProductBySlug, getProductVariants } from "@/lib/actions/product-actions";
import { Product, ProductVariant } from "@/types/product";
import { cacheLife } from "next/cache";
import ProductReviewsSection from "@/components/product/product-reviews-section";
import { ReviewsSkeleton } from "@/components/product/reviews-skeleton";


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
                title: 'Product Not Found | THE NALA ARMOIRE',
            };
        }

        return {
            title: `${product.name} | THE NALA ARMOIRE`,
            description: product.description?.slice(0, 160),
            openGraph: {
                title: product.name,
                description: product.description,
                images: [product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description,
                images: [product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found | THE NALA ARMOIRE',
        };
    }
}



async function ProductDetailPage({ params }: ProductPageProps) {

    try {
        const { slug } = await params;
        
        // Fetch product data using cached function
        const product = await getCachedProduct(slug);

        if (!product) {
            notFound();
        }

        // Fetch variants using cached function
        const variants = await getCachedProductVariants(product.id);

        return (
            <div className="min-h-screen bg-background overflow-x-hidden">

                {/* BREADCRUMB  */}
                

                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <ProductDetailClient product={product} variants={variants} />

                    {/* Reviews Section - Server Component with its own prefetching */}
                    <Suspense fallback={<ReviewsSkeleton />}>
                        <div className="mt-12">
                            <ProductReviewsSection productId={product.id} />
                        </div>
                    </Suspense>

                    {/* Product Recommendations - Server Component */}
                    {/* <Suspense fallback={<RecommendationsSkeleton />}>
                        <ProductRecommendations 
                            excludeProductSlug={slug}
                            limit={6}
                            title="You May Also Like"
                        />
                    </Suspense> */}
                </div>
            </div>
        );
    } catch (error) {
        notFound();
    }
}



export default function ProductDetailPageWrapper({ params }: ProductPageProps) {
    return (
        <Suspense fallback={<PageLoadingSkeleton />}>
            <ProductDetailPage params={params} />
        </Suspense>
    );
}