"use client";

import { useState } from "react";
import { useAddProductReview } from "@/lib/tanstack/queries/product.queries";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface AddReviewFormProps {
    productSlug: string;
    onClose?: () => void;
}

export function AddReviewForm({ productSlug, onClose }: AddReviewFormProps) {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const addReviewMutation = useAddProductReview(productSlug);
    
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        try {
            await addReviewMutation.mutateAsync({
                rating,
                ...(title.trim() && { title: title.trim() }),
                comment: comment.trim(),
            });

            toast.success("Review submitted successfully!");
            
            // Reset form
            setRating(0);
            setTitle("");
            setComment("");
            
            // Close form if callback provided
            onClose?.();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to submit review";
            toast.error(errorMessage);
        }
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        // Get current page URL for redirect after login
        const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
        
        return (
            <Card className="border-2">
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            Please log in to write a review
                        </p>
                        <Link href={`/login?redirect=${encodeURIComponent(currentUrl)}`}>
                            <Button>Log In</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Write a Review</CardTitle>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="text-sm text-muted-foreground ml-2">
                                    {rating} {rating === 1 ? 'star' : 'stars'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="review-title">Review Title (Optional)</Label>
                        <Input
                            id="review-title"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            disabled={addReviewMutation.isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                            {title.length}/100 characters
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="review-comment">Your Review *</Label>
                        <Textarea
                            id="review-comment"
                            placeholder="Share your thoughts about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            maxLength={1000}
                            disabled={addReviewMutation.isPending}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {comment.length}/1000 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={addReviewMutation.isPending || rating === 0 || !comment.trim()}
                            className="flex-1"
                        >
                            {addReviewMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                        {onClose && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={addReviewMutation.isPending}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
