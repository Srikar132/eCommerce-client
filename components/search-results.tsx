"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductCardComponent from './cards/product-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

interface SearchResultsProps {
    results: {
        items: any[];
        total: number;
        page: number;
        size: number;
        query: string;
    };
    isLoading?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isFetchingNextPage?: boolean;
}

export function SearchResults({ results, isLoading, onLoadMore, hasMore, isFetchingNextPage }: SearchResultsProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Use infinite scroll hook for automatic loading
    const sentinelRef = useInfiniteScroll({
        hasNextPage: hasMore || false,
        isFetchingNextPage: isFetchingNextPage || false,
        fetchNextPage: onLoadMore || (() => {}),
        rootMargin: "400px"
    });

    if (isLoading && !results.items.length) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-64"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!results.items.length && !isLoading) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 mb-4">
                    No products found for "{results.query}". Try different keywords or check your spelling.
                </p>
                <Button variant="outline">
                    Clear Search
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Search Results
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {results.total.toLocaleString()} results for "{results.query}"
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Filter Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Results Grid/List */}
            <div className={
                viewMode === 'grid'
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                    : "space-y-4"
            }>
                {results.items.map((product) => (
                    <ProductCardComponent
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                    />
                ))}
            </div>

            {/* Load More Button (same as CategoryClient) */}
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

            {!hasMore && results.items.length > 0 && (
                <div className="text-center mt-12 text-sm text-muted-foreground">
                    You've viewed all products
                </div>
            )}

            {/* Intersection Observer Sentinel (same as CategoryClient) */}
            <div ref={sentinelRef} className="h-px" />
        </div>
    );
}
