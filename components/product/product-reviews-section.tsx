import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductReviewsClient from "./product-reviews-client";
import { getReviewsByProductId } from "@/lib/actions/product-actions";

interface ProductReviewsSectionProps {
    productId: string;
    averageRating?: number;
    reviewCount?: number;
}

export default async function ProductReviewsSection({ 
    productId, 
}: ProductReviewsSectionProps) {

    try {
        const queryClient = getQueryClient();
    
        // Prefetch first page of reviews on server
        await queryClient.prefetchInfiniteQuery({
            queryKey: ['product-reviews', productId, { size: 10 }],
            queryFn: ({ pageParam = 0 }) => 
                getReviewsByProductId(productId, pageParam, 10),
            initialPageParam: 0,
        });
    
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
               <ProductReviewsClient productId={productId} />
            </HydrationBoundary>
        );

    } catch (error) {
        console.error("Error prefetching product reviews:", error);
        return <></>;
    }
}
