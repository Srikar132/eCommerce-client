"use client";

import { Button } from '@/components/ui/button';
import ProductCardComponent from './cards/product-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { ProductResponse } from '@/types';
import Link from 'next/link';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import { useCartManager, createItemIdentifier } from '@/hooks/use-cart';
import { useAuthStore } from '@/lib/store/auth-store';
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

    const cart = useCartManager();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    /**
     * Handle adding product to cart
     * Checks if item is already in cart before adding
     */
    const handleAddToCart = (product: ProductResponse) => {
        // Check if product has variants
        if (!product.variants || product.variants.length === 0) {
            toast.error("This product is currently unavailable");
            return;
        }

        const firstVariant = product.variants[0];

        // Check if already in cart
        const itemIdentifier = {
            productId: product.id,
            variantId: firstVariant.id,
            customizationId: null,
        };

        if (cart.isInCart(itemIdentifier)) {
            toast.info("Already in cart", {
                description: "This item is already in your cart",
                action: {
                    label: "View Cart",
                    onClick: () => router.push("/cart"),
                },
            });
            return;
        }

        // Add to cart
        cart.addItem({
            productId: product.id,
            productVariantId: firstVariant.id,
            productSlug: product.slug,
            customizationId: null,
            quantity: 1,
            customizationSummary: null
        });
    };

    /**
     * Handle adding product to wishlist
     * Requires authentication
     */
    const handleAddToWishlist = (productId: string) => {
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

        // TODO: Implement wishlist mutation when backend is ready
        toast.success("Added to wishlist!", {
            description: "Item saved to your wishlist",
            action: {
                label: "View Wishlist",
                onClick: () => router.push("/account/wishlist"),
            },
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
                    <ProductCardComponent
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                        onAddToWishlist={() => handleAddToWishlist(product.id)}
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