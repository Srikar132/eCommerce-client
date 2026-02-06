import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Review } from "@/types/product";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasLongComment = review.comment && review.comment.length > 300;

    return (
        <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                    {review.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">
                                    {review.name || 'Anonymous'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "h-4 w-4",
                                        star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Title */}
                        {review.title && (
                            <h4 className="font-semibold text-base mb-2">
                                {review.title}
                            </h4>
                        )}
                    </div>

                    {/* Verified Purchase Badge */}
                    {review.isVerifiedPurchase && (
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap">
                            <ThumbsUp className="h-3 w-3" />
                            Verified
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Comment */}
                {review.comment && (
                    <div className="text-sm text-muted-foreground">
                        <p className={cn(
                            "whitespace-pre-line",
                            !isExpanded && hasLongComment && "line-clamp-4"
                        )}>
                            {review.comment}
                        </p>
                        {hasLongComment && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-primary hover:underline text-sm font-medium mt-2"
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
