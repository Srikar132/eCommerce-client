"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import SortDropdown from "../sort-dropdown";
import ProductGrid from "../product-grid";
import FilterSidebar from "../filter-sidebar";
import NoResults from "./no-results";
import { SearchInput } from "../search-input";
import { useInfiniteProducts, useFlatProducts, useProductCount, useProductFacets } from "@/lib/tanstack/queries";
import { formatFiltersForSidebar, countActiveFilters } from "@/utils/filter-utils";
import ErrorCard from "../cards/error-card";

interface ProductsClientProps {
  initialFilters: Record<string, any>;
  initialPage: number;
  initialSize: number;
  initialSort: string;
}

const ProductsClient = ({ initialFilters, initialPage, initialSize, initialSort }: ProductsClientProps) => {
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // Build query params from server-provided data (no parsing needed!)
    const queryParams = {
      filters: initialFilters,
      page: initialPage,
      size: initialSize,
      sort: initialSort,
    };

    // Fetch products with infinite scroll
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        refetch
    } = useInfiniteProducts(queryParams);

    // Extract derived data
    const products = useFlatProducts(data);
    const totalProducts = useProductCount(data);
    const facets = useProductFacets(data);

    // Format filters for sidebar - clean conversion
    const currentFilters = useMemo(
        () => formatFiltersForSidebar(initialFilters),
        [initialFilters]
    );

    // Count active filters for badge
    const activeFilterCount = useMemo(
        () => countActiveFilters(initialFilters),
        [initialFilters]
    );


    if (error) {
        return <ErrorCard
            title="Failed to load products"
            message="There was an error fetching the products. Please try again."
            onRetry={() => refetch()}
        />;
    }

    // if products are empty and not loading
    if (!isLoading && products.length === 0) {
        return <NoResults
            searchQuery={queryParams.filters.searchQuery as string}
        />;
    }

    return (
        <section className="category-section">
            {/* Loading indicator for filter changes */}
            {isLoading && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-background shadow-lg rounded-full p-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                </div>
            )}

            {/* Mobile Search Bar - Only on small screens */}
            <div className="lg:hidden sticky top-0 z-30 bg-background border-b px-4 py-3 shadow-sm">
                <SearchInput 
                    placeholder="Search products..."
                    showSuggestions={true}
                    className="w-full"
                />
            </div>

            {/* Mobile Filter Header - Only on small screens */}
            <div className="sticky top-18 z-20 bg-white grid grid-cols-2 border-b lg:hidden py-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsFilterSidebarOpen(true)}
                    suppressHydrationWarning
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter</span>

                    {activeFilterCount > 0 && (
                        <span className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                <SortDropdown />
            </div>


            {/* Desktop Layout with Filters and Sort */}
            <div className="flex gap-6 lg:gap-8">
                {/* Left Filter Panel - Desktop Only */}
                <FilterSidebar
                    isOpen={isFilterSidebarOpen}
                    onClose={() => setIsFilterSidebarOpen(false)}
                    currentFilters={currentFilters}
                    facets={facets}
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Desktop Header */}
                    <header className="hidden lg:flex z-10 bg-background sticky top-0 items-center justify-between mb-6  border-b px-4 py-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                {/* Convert to showing some out of total */}
                                Showing {products.length} of {totalProducts} {totalProducts === 1 ? "product" : "products"}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <SortDropdown />
                        </div>
                    </header>

                    {/* Product Grid/List */}
                    <ProductGrid
                        results={{
                            items: products,
                            total: totalProducts,
                            page: data?.pages?.length || 1,
                            size: queryParams.size,
                        }}
                        isLoading={isLoading}
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            </div>
        </section>
    );
};


export default ProductsClient;