"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useAddProductReview } from "@/lib/tanstack/queries/product.queries";
import { reviewFormSchema } from "@/lib/validations";


type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface AddReviewFormProps {
    productId: string;

    onClose?: () => void;
}

export function AddReviewForm({ productId, onClose }: AddReviewFormProps) {
    const { data: session } = useSession();
    const userId = session?.user.id;
    const addReviewMutation = useAddProductReview(userId!, productId);
    const [hoveredRating, setHoveredRating] = useState(0);

    // Initialize form with React Hook Form
    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: {
            rating: 0,
            title: "",
            comment: "",
        },
    });

    const watchRating = form.watch("rating");
    const watchTitle = form.watch("title");
    const watchComment = form.watch("comment");

    const onSubmit = async (data: ReviewFormValues) => {
        try {
            await addReviewMutation.mutateAsync({
                rating: data.rating,
                ...(data.title?.trim() && { title: data.title.trim() }),
                comment: data.comment.trim(),
            });

            toast.success("Review submitted successfully!");
            form.reset();
            onClose?.();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to submit review";
            toast.error(errorMessage);
        }
    };


    return (
        <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl">Write a Review</CardTitle>
                        <CardDescription>Share your experience with this product</CardDescription>
                    </div>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Rating Field */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => field.onChange(star)}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "h-8 w-8 transition-colors",
                                                            star <= (hoveredRating || field.value)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted-foreground hover:text-yellow-400/50"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                            {field.value > 0 && (
                                                <span className="text-sm font-medium text-muted-foreground ml-2">
                                                    {field.value} {field.value === 1 ? 'star' : 'stars'}
                                                </span>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Title Field */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Review Title (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Summarize your experience"
                                            {...field}
                                            maxLength={100}
                                            disabled={addReviewMutation.isPending}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {watchTitle?.length || 0}/100 characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Comment Field */}
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Review</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share your thoughts about this product. What did you like or dislike? How would you recommend it to others?"
                                            {...field}
                                            rows={6}
                                            maxLength={1000}
                                            disabled={addReviewMutation.isPending}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {watchComment?.length || 0}/1000 characters (minimum 10 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={addReviewMutation.isPending || !form.formState.isValid}
                                className="flex-1 h-11"
                                size="lg"
                            >
                                {addReviewMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Star className="h-4 w-4 mr-2" />
                                        Submit Review
                                    </>
                                )}
                            </Button>
                            {onClose && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={addReviewMutation.isPending}
                                    className="h-11"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
