"use client";

import SortDropdown from "../sort-dropdown";
import ProductGrid from "../product-grid";
import NoResults from "./no-results";
import { SearchInput } from "../search-input";
import { useInfiniteProducts, useFlatProducts, useProductCount } from "@/lib/tanstack/queries";
import ErrorCard from "../cards/error-card";
import { ProductParams } from "@/types/product";



const ProductsClient = (params: ProductParams) => {


    // Fetch products with infinite scroll
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        refetch
    } = useInfiniteProducts(params);

    // Extract derived data
    const products = useFlatProducts(data);
    const totalProducts = useProductCount(data);


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
            searchQuery={params.searchQuery as string}
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
                    className="w-full"
                />
            </div>

            {/* Mobile Filter Header - Only on small screens */}
            <div className="sticky top-18 z-20 flex items-center justify-end border-b lg:hidden py-2 ">
                <SortDropdown />
            </div>


            {/* Desktop Layout with Filters and Sort */}
            <div className="flex gap-6 lg:gap-8">

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
                            limit: params.limit ?? 20,
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