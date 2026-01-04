"use client";

import { Button } from '@/components/ui/button';
import ProductCardComponent from './cards/product-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { ProductResponse } from '@/types';
import Link from 'next/link';

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

    if (isLoading && !results.items.length) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg aspect-[2.6/3]"></div>
                        <div className="mt-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
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
                        className="min-w-[200px]"
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