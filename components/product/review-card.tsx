import { useState } from "react";
import { Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Review } from "@/types/product";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasLongComment = review.comment && review.comment.length > 300;

    return (
        <div className="py-8 first:pt-0 border-b border-foreground/5 group">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                {/* User & Rating Info */}
                <div className="w-full md:w-64 shrink-0 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-foreground/5 flex items-center justify-center font-black text-sm text-foreground">
                            {review.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground">
                                {review.name || 'Anonymous'}
                            </span>
                            <span className="text-[10px] font-medium tracking-wide text-muted-foreground mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-3 w-3",
                                    star <= review.rating
                                        ? "fill-foreground text-foreground"
                                        : "text-foreground/10"
                                )}
                            />
                        ))}
                    </div>

                    {review.isVerifiedPurchase && (
                        <div className="flex items-center gap-1.5 text-[#5FB281] text-[10px] font-bold uppercase tracking-widest">
                            <Check size={12} strokeWidth={3} />
                            Verified purchase
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {review.title && (
                        <h4 className="text-xl font-bold tracking-tight text-foreground">
                            {review.title}
                        </h4>
                    )}
                    
                    {review.comment && (
                        <div className="relative">
                            <p className={cn(
                                "text-muted-foreground leading-relaxed text-base",
                                !isExpanded && hasLongComment && "line-clamp-4"
                            )}>
                                {review.comment}
                            </p>
                            {hasLongComment && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-foreground hover:underline underline-offset-4 mt-4 transition-all"
                                >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
