"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, PenSquare } from "lucide-react";
import { AddReviewForm } from "./add-review-form";
import { ReviewCard } from "./review-card";
import { EmptyReviews } from "./empty-reviews";
import { useInfiniteProductReviews } from "@/lib/tanstack/queries/product.queries";
import { canUserReviewProduct } from "@/lib/actions/product-actions";

interface ProductReviewsClientProps {
    productId: string;
}

export default function ProductReviewsClient({ productId }: ProductReviewsClientProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [checkingEligibility, setCheckingEligibility] = useState(true);
    const { data: session, status } = useSession();

    const { 
        data,  
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
        error
    } = useInfiniteProductReviews(productId, { size: 10 });

    // Check if user can review this product
    useEffect(() => {
        async function checkReviewEligibility() {
            if (status === "authenticated" && session?.user?.id) {
                setCheckingEligibility(true);
                try {
                    const eligible = await canUserReviewProduct(session.user.id, productId);
                    setCanReview(eligible);
                } catch (error) {
                    console.error("Error checking review eligibility:", error);
                    setCanReview(false);
                } finally {
                    setCheckingEligibility(false);
                }
            } else {
                setCheckingEligibility(false);
                setCanReview(false);
            }
        }

        checkReviewEligibility();
    }, [status, session?.user?.id, productId]);

    // Flatten reviews from all pages
    const allReviews = data?.pages.flatMap(page => page.data) ?? [];


    if(error) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Error loading reviews</p>
            </div>
        )
    }

    return (
        <>
            {/* Header with Write Review Button */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Customer Reviews
                </h2>
                
                {/* Only show review button if user is eligible */}
                {canReview && !checkingEligibility && (
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
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="mb-8">
                    <AddReviewForm 
                        productId={productId}
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

                        {/* View More Button */}
                        {hasNextPage && (
                            <div className="flex justify-center py-8">
                                <Button 
                                    variant="outline" 
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="gap-2"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            View More Reviews
                                            <ChevronDown className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
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
