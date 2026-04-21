"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import { AddReviewForm } from "./add-review-form";
import { useInfiniteProductReviews } from "@/lib/tanstack/queries/product.queries";
import { canUserReviewProduct } from "@/lib/actions/product-actions";
import CustomButton from "@/components/ui/custom-button";
import { ReviewCard } from "./review-card";

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

    if (error) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Error loading reviews</p>
            </div>
        )
    }

    return (
        <div className="py-12 border-t border-foreground/5">
            {/* Header with Write Review Button */}
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-12">
                {/* <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-none">
                    Reviews
                </h2> */}

                {/* Only show review button if user is eligible */}
                {canReview && !checkingEligibility && (
                    <CustomButton
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        bgColor="transparent"
                        circleColor="#000000"
                        textColor="#000000"
                        textHoverColor="#ffffff"
                        circleSize={48}
                        className="h-14 border-2 border-foreground/10"
                    >
                        {showReviewForm ? "Cancel" : "Write a review"}
                    </CustomButton>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="mb-20">
                    <AddReviewForm
                        productId={productId}
                        onClose={() => setShowReviewForm(false)}
                    />
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-0">
                {allReviews.length > 0 && (
                    <>
                        <div className="divide-y divide-foreground/5">
                            {allReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>

                        {/* View More Button */}
                        {hasNextPage && (
                            <div className="flex justify-center pt-16">
                                <CustomButton
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    bgColor="transparent"
                                    circleColor="#000000"
                                    textColor="#000000"
                                    textHoverColor="#ffffff"
                                    circleSize={48}
                                    className="h-14 border-2 border-foreground/10"
                                >
                                    {isFetchingNextPage ? "Loading..." : "View more reviews"}
                                </CustomButton>
                            </div>
                        )}

                        {!hasNextPage && allReviews.length > 5 && (
                            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-12">
                                You&apos;ve reached the end of reviews
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
