"use client";

import { 
    useWishlist, 
    useRemoveFromWishlist, 
    useClearWishlist 
} from "@/lib/tanstack/queries/wishlist.queries";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { LoginRequired } from "@/components/auth/login-required";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WishlistCard } from "@/components/cards/wishlist-card";
import { useSession } from "next-auth/react";

export function WishlistClient() {
    const {  status } = useSession();
    const { data: wishlist, isLoading } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const clearWishlistMutation = useClearWishlist();

    const items = wishlist?.items || [];
    const totalItems = wishlist?.totalItems || 0;
    const isAuthenticated = status === "authenticated";

    // Not authenticated - show login required
    if (!isAuthenticated) {
        return (
            <LoginRequired
                title="Your Wishlist Awaits"
                description="Please log in to view your saved items and manage your wishlist."
            />
        );
    }

    // Loading state
    if (isLoading) {
        return <PageLoadingSkeleton />;
    }

    // Empty wishlist state
    if (!items || items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl h-[85vh] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-semibold">Your wishlist is empty</h2>
                        <p className="text-sm text-muted-foreground">
                            Start adding items to your wishlist to save them for later
                        </p>
                    </div>
                    <Button asChild size="lg" className="mt-2">
                        <Link href="/products">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Start Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold mb-1">My Wishlist</h1>
                    <p className="text-sm text-muted-foreground">
                        {totalItems} {totalItems === 1 ? "item" : "items"} saved
                    </p>
                </div>

                {/* Clear Wishlist Button */}
                {totalItems > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="sm"
                                disabled={clearWishlistMutation.isPending}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove all {totalItems} items from your wishlist. 
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => clearWishlistMutation.mutate()}
                                    disabled={clearWishlistMutation.isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {clearWishlistMutation.isPending ? "Clearing..." : "Clear Wishlist"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {items.map((item) => (
                    <WishlistCard 
                        key={item.productId} 
                        item={item} 
                        onRemove={(productId) => removeFromWishlist.mutate(productId)}
                        isRemoving={removeFromWishlist.isPending}
                    />
                ))}
            </div>

            {/* Continue Shopping CTA */}
            <div className="mt-12 flex justify-center">
                <Button asChild variant="outline" size="lg">
                    <Link href="/products">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    );
}
