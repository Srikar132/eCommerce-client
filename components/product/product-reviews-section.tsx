"use client";

import { useState, useEffect } from "react";
import { useProductReviews } from "@/lib/tanstack/queries/product.queries";
import { useAuth } from "@/hooks/use-auth";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronDown, PenSquare } from "lucide-react";
import { RatingDistribution } from "@/types";
import { AddReviewForm } from "./add-review-form";
import { RatingSummary } from "./rating-summary";
import { ReviewCard } from "./review-card";
import { EmptyReviews } from "./empty-reviews";
import { ReviewsSkeleton } from "./reviews-skeleton";
interface ProductReviewsSectionProps {
    productSlug: string;
    averageRating?: number;
    reviewCount?: number;
}

export default function ProductReviewsSection({ productSlug, averageRating = 0, reviewCount = 0 }: ProductReviewsSectionProps) {

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

    // Flatten reviews from all pages - data.pages contains PagedResponse<Review>
    const allReviews = data?.pages.flatMap(page => page.content) ?? [];
    
    // Calculate rating distribution from actual reviews
    const ratingDistribution: RatingDistribution = allReviews.reduce(
        (acc, review) => {
            acc[review.rating as keyof RatingDistribution]++;
            return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as RatingDistribution
    );

    if (isLoading) {
        return <ReviewsSkeleton />;
    }


    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Customer Reviews
                    </h2>
                    
                    {/* Write Review Button */}
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
                    <AddReviewForm 
                        productSlug={productSlug}
                        onClose={() => setShowReviewForm(false)}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Rating Summary */}
                    <div className="lg:col-span-1">
                        <Card className="border-2">
                            <CardContent className="pt-6">
                                <RatingSummary 
                                    averageRating={averageRating || 0}
                                    totalReviews={reviewCount}
                                    ratingDistribution={ratingDistribution}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Reviews List */}
                    <div className="lg:col-span-2">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
