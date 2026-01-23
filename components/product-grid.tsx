"use client";

import { Button } from '@/components/ui/button';
import ProductCardComponent from './cards/product-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { ProductResponse } from '@/types';
import Link from 'next/link';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import { useCartManager, createItemIdentifier } from '@/hooks/use-cart';
import { useAuthStore } from '@/lib/store/auth-store';
import { useCheckWishlist, useToggleWishlist } from '@/lib/tanstack/queries/wishlist.queries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
    results: {
        items: ProductResponse[];  // Changed type
        total: number;
        page: number;
        size: number;
        query?: string;
    };
    isLoading?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isFetchingNextPage?: boolean;
}

export default function ProductGrid({ 
    results, 
    isLoading, 
    onLoadMore, 
    hasMore, 
    isFetchingNextPage 
}: SearchResultsProps) {
    // Use infinite scroll hook for automatic loading
    const sentinelRef = useInfiniteScroll({
        hasNextPage: hasMore || false,
        isFetchingNextPage: isFetchingNextPage || false,
        fetchNextPage: onLoadMore || (() => { }),
        rootMargin: "400px"
    });

    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const toggleWishlist = useToggleWishlist();

    /**
     * Handle toggling product in/out of wishlist
     * Requires authentication and checks current wishlist status
     */
    const handleToggleWishlist = (productId: string, isCurrentlyWishlisted: boolean) => {
        if (!isAuthenticated) {
            toast.error("Login Required", {
                description: "Please log in to add items to your wishlist",
                action: {
                    label: "Log In",
                    onClick: () => router.push(`/login?redirect=/products`),
                },
            });
            return;
        }

        // Toggle wishlist using mutation
        toggleWishlist.mutate({
            productId,
            isCurrentlyInWishlist: isCurrentlyWishlisted,
        });
    };

    if (isLoading && !results.items.length) {
        return <ProductGridSkeleton count={8} />;
    }

    if (!results.items.length && !isLoading) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                    {results.query 
                        ? `No products found for "${results.query}". Try different keywords or filters.`
                        : 'No products match your current filters. Try adjusting your selection.'
                    }
                </p>
                <Link href="/products">
                    <Button variant="outline">
                        Browse All Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {results.items.map((product) => (
                    <ProductCardWithWishlist 
                        key={product.id}
                        product={product}
                        onToggleWishlist={handleToggleWishlist}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onLoadMore}
                        disabled={isFetchingNextPage}
                        className="min-w-50"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load More Products"}
                    </Button>
                </div>
            )}

            {/* End of Results Message */}
            {!hasMore && results.items.length > 0 && (
                <div className="text-center mt-12 text-sm text-muted-foreground">
                    You have viewed all {results.total} products
                </div>
            )}

            {/* Intersection Observer Sentinel for Auto-Load */}
            <div ref={sentinelRef} className="h-px" />
        </div>
    );
}

/**
 * Wrapper component that checks wishlist status for each product
 */
function ProductCardWithWishlist({ 
    product, 
    onToggleWishlist,
    isAuthenticated 
}: { 
    product: ProductResponse;
    onToggleWishlist: (productId: string, isWishlisted: boolean) => void;
    isAuthenticated: boolean;
}) {
    // Check if this product is in the wishlist
    const { data: wishlistCheck } = useCheckWishlist(product.id, isAuthenticated);
    const isWishlisted = wishlistCheck?.inWishlist ?? false;

    return (
        <ProductCardComponent
            product={product}
            onAddToWishlist={() => onToggleWishlist(product.id, isWishlisted)}
            isWishlisted={isWishlisted}
        />
    );
}