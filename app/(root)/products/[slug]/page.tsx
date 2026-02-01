import { productApi } from "@/lib/api/product";
import ProductDetailClient from "@/components/product/product-detail-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductReviewsSection from "@/components/product/product-reviews-section";
import { Suspense } from "react";
import { ReviewsSkeleton } from "@/components/product/reviews-skeleton";
import { RecommendationsSkeleton } from "@/components/product/recommendations-skeleton";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductRecommendations from "@/components/product/product-recommendations";

export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await productApi.getProductBySlug(slug);

        return {
            title: `${product.name} | THE NALA ARMOIRE`,
            description: product.description?.slice(0, 160),
            openGraph: {
                title: product.name,
                description: product.description,
                images: [product.imageUrl],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description,
                images: [product.imageUrl],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found',
        };
    }
}



interface ProductPageProps {
    params: {
        slug: string;
    };
}

async function ProductDetailContent({ params }: ProductPageProps) {

    try {
        const { slug } = await params;

        const queryClient = getQueryClient();

        // Prefetch product data on server
        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: ['product', slug],
                queryFn: () => productApi.getProductBySlug(slug),
            }),
            queryClient.prefetchQuery({
                queryKey: ['product-variants', slug],
                queryFn: () => productApi.getProductVariants(slug),
            }),
        ]);

        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="min-h-screen bg-background overflow-x-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                        <ProductDetailClient slug={slug} />

                        {/* Reviews Section - Server Component with its own prefetching */}
                        <Suspense fallback={<ReviewsSkeleton />}>
                            <div className="mt-12">
                                <ProductReviewsSection productSlug={slug} />
                            </div>
                        </Suspense>

                        {/* Product Recommendations - Server Component */}
                        <Suspense fallback={<RecommendationsSkeleton />}>
                            <ProductRecommendations 
                                excludeProductSlug={slug}
                                limit={6}
                                title="You May Also Like"
                            />
                        </Suspense>
                    </div>
                </div>
            </HydrationBoundary>
        );
    } catch (error) {
        notFound();
    }

}

export default async function ProductDetailPage({ params }: ProductPageProps) {

    return (
        <Suspense fallback={<PageLoadingSkeleton />}>
            <ProductDetailContent params={params} />
        </Suspense>
    )
}