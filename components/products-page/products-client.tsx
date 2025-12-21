"use client";

import { productApi } from "@/lib/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import ErrorCard from "../cart/error-card";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import SortDropdown from "../sort-dropdown";
import ProductGrid from "../product-grid";
import FilterSidebar from "../filter-sidebar";


const ProductsClient = () => {
    const searchParams = useSearchParams();
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // Build filters from searchParams
    const queryParams = useMemo(() => {
        const filters: Record<string, string | string[] | boolean | number> = {};

        const getParam = (key: string) => {
            const values = searchParams.getAll(key);
            return values.length > 1 ? values : values[0];
        };

        const category = getParam('category');
        if (category) filters.category = category;

        const brand = getParam('brand');
        if (brand) filters.brand = brand;

        const productSize = getParam('productSize');
        if (productSize) filters.productSize = productSize;

        const color = getParam('color');
        if (color) filters.color = color;

        const minPrice = searchParams.get('minPrice');
        if (minPrice) filters.minPrice = Number(minPrice);

        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice) filters.maxPrice = Number(maxPrice);

        const customizable = searchParams.get('customizable');
        if (customizable === 'true') filters.customizable = true;

        const searchQuery = searchParams.get('searchQuery');
        if (searchQuery) filters.searchQuery = searchQuery;

        const page = searchParams.get('page');
        const pageNum = page ? Math.max(0, parseInt(page) - 1) : 0;

        const size = searchParams.get('size');
        const sizeNum = size ? parseInt(size) : 24;

        const sort = searchParams.get('sort') || 'createdAt,desc';

        return { filters, page: pageNum, size: sizeNum, sort };
    }, [searchParams]);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        refetch
    } = useInfiniteQuery({
        queryKey: ['products', queryParams],
        queryFn: ({ pageParam = queryParams.page }) =>
            productApi.getProducts({
                filters: queryParams.filters,
                page: pageParam,
                size: queryParams.size,
                sort: queryParams.sort,
            }),
        initialPageParam: queryParams.page,
        getNextPageParam: (lastPage : { products: { last: boolean; page: number } }) =>
            lastPage.products.last ? undefined : lastPage.products.page + 1,
    });

    const products = useMemo(
        () => data?.pages.flatMap((page) => page.products.content) ?? [],
        [data]
    );

    const totalProducts = data?.pages[0]?.products.totalElements ?? 0;

    // Convert filters to the format expected by FilterSidebar
    const currentFilters = useMemo(() => {
        const converted: Record<string, string | string[]> = {};
        
        Object.entries(queryParams.filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                converted[key] = value;
            } else if (typeof value === 'string') {
                converted[key] = value;
            } else if (typeof value === 'boolean' && value) {
                converted[key] = 'true';
            } else if (typeof value === 'number') {
                converted[key] = value.toString();
            }
        });
        
        return converted;
    }, [queryParams.filters]);

    if (error) {
        return <ErrorCard
            title="Failed to load products"
            message="There was an error fetching the products. Please try again."
            onRetry={() => refetch()}
        />;
    }

    return (
        <section className="category-section">
            <header>
                {/*  */}
            </header>

            {/* Mobile Filter Header - Only on small screens */}
            <div className="sticky top-0 bg-white grid grid-cols-2 border-b z-20 lg:hidden py-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsFilterSidebarOpen(true)}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter</span>

                    {Object.keys(queryParams.filters).length > 0 && (
                        <span className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {Object.values(queryParams.filters).reduce((count: number, value) => {
                                if (Array.isArray(value)) return count + value.length;
                                if (typeof value === 'string') return count + 1;
                                if (typeof value === 'boolean' && value) return count + 1;
                                return count;
                            }, 0)}
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
                    facets={data?.pages[0]?.facets}
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Desktop Header */}
                    <header className="hidden lg:flex z-50 bg-white sticky top-0 items-center justify-between mb-6  border-b px-4 py-4">
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