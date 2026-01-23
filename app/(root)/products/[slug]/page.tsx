import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product";
import { queryKeys } from "@/lib/tanstack/query-keys";
import ProductDetailClient from "@/components/product/product-detail-client";

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await  params;

    // Create a new QueryClient instance for this request
    const queryClient = new QueryClient();

    // Prefetch product data, variants, and reviews in parallel
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.products.detail(slug),
            queryFn: () => productApi.getProductBySlug(slug),
            staleTime: 1000 * 60 * 10, // 10 minutes
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.products.variants(slug),
            queryFn: () => productApi.getProductVariants(slug),
            staleTime: 1000 * 60 * 5, // 5 minutes
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductDetailClient slug={slug} />
        </HydrationBoundary>
    );
}

