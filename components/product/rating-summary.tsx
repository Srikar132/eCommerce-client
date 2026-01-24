import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { RatingDistribution } from "@/types";

interface RatingSummaryProps {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
}

export function RatingSummary({ averageRating, totalReviews, ratingDistribution }: RatingSummaryProps) {
    const distribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: ratingDistribution[star as keyof RatingDistribution] || 0,
        percentage: totalReviews > 0 ? (ratingDistribution[star as keyof RatingDistribution] || 0) / totalReviews * 100 : 0
    }));

    return (
        <div className="space-y-6">
            {/* Average Rating */}
            <div className="text-center">
                <div className="text-5xl font-bold text-foreground mb-2">
                    {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "h-5 w-5",
                                star <= Math.round(averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                    Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
            </div>

            <Separator />

            {/* Rating Distribution */}
            <div className="space-y-3">
                {distribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                            <span className="text-sm font-medium">{star}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
