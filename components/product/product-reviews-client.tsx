"use client";

import { useState, useEffect } from "react";
import { useProductReviews } from "@/lib/tanstack/queries/product.queries";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, PenSquare } from "lucide-react";
import { RatingDistribution } from "@/types";
import { AddReviewForm } from "./add-review-form";
import { ReviewCard } from "./review-card";
import { EmptyReviews } from "./empty-reviews";

interface ProductReviewsClientProps {
    productSlug: string;
}

export default function ProductReviewsClient({ productSlug }: ProductReviewsClientProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { 
        data,  
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
        isLoading 
    } = useProductReviews(productSlug, { size: 10 });
    
    const { ref, inView } = useInView();
    
    // Auto-fetch next page when scrolling
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten reviews from all pages
    const allReviews = data?.pages.flatMap(page => page.content) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            {/* Header with Write Review Button */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Customer Reviews
                </h2>
                
                <Button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    variant={showReviewForm ? "outline" : "default"}
                    className="gap-2"
                >
                    {showReviewForm ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PenSquare className="h-4 w-4" />
                            Write a Review
                        </>
                    )}
                </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="mb-8">
                    <AddReviewForm 
                        productSlug={productSlug}
                        onClose={() => setShowReviewForm(false)}
                    />
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {allReviews.length === 0 ? (
                    <EmptyReviews />
                ) : (
                    <>
                        {allReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}

                        {/* Load More Trigger */}
                        {hasNextPage && (
                            <div ref={ref} className="flex justify-center py-8">
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Loading more reviews...</span>
                                    </div>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => fetchNextPage()}
                                        className="gap-2"
                                    >
                                        Load More Reviews
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {!hasNextPage && allReviews.length > 5 && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                You've reached the end of reviews
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
