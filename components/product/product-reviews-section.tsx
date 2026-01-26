import { productApi } from "@/lib/api/product";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDistribution } from "@/types";
import { RatingSummary } from "./rating-summary";
import ProductReviewsClient from "./product-reviews-client";
import { ca } from "zod/v4/locales";

interface ProductReviewsSectionProps {
    productSlug: string;
    averageRating?: number;
    reviewCount?: number;
}

export default async function ProductReviewsSection({ 
    productSlug, 
}: ProductReviewsSectionProps) {

    try {
        const queryClient = getQueryClient();
    
        // Prefetch first page of reviews on server
        await queryClient.prefetchInfiniteQuery({
            queryKey: ['product-reviews', productSlug, { size: 10 }],
            queryFn: ({ pageParam = 0 }) => 
                productApi.getProductReviews(productSlug, pageParam, 10),
            initialPageParam: 0,
        });
    
    
    
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
               <ProductReviewsClient productSlug={productSlug} />
            </HydrationBoundary>
        );

    } catch (error) {
        console.error("Error prefetching product reviews:", error);
        return <></>;
    }
}
