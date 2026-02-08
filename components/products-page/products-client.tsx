"use client";

import SortDropdown from "../sort-dropdown";
import ProductGrid from "../product-grid";
import NoResults from "./no-results";
import { SearchInput } from "../search-input";
import { useInfiniteProducts, useFlatProducts, useProductCount } from "@/lib/tanstack/queries";
import ErrorCard from "../cards/error-card";
import { ProductParams } from "@/types/product";
import {  Product } from "@/types/product";
import { PagedResponse } from "@/types";



interface ProductsClientProps extends ProductParams {
    initialData?: PagedResponse<Product>;
}

const ProductsClient = ({ initialData, ...params }: ProductsClientProps) => {


    // Fetch products with infinite scroll
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        refetch
    } = useInfiniteProducts(params, initialData);

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
            {/* Mobile Search Bar - Only on small screens */}
            <div className="lg:hidden sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-sm border-b px-2 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Search"
                        className="flex-1"
                    />
                    <SortDropdown />
                </div>
            </div>



            {/* Desktop Layout with Filters and Sort */}
            <div className="flex gap-6 lg:gap-8">

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Desktop Header */}
                    <header className="hidden lg:flex z-10 bg-background sticky top-16 sm:top-16 lg:top-18 items-center justify-between mb-6 border-b px-4 py-4">
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

                    {/* Product Grid/List with mobile spacing */}
                    <div className="mt-4 lg:mt-0">
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
            </div>
        </section>
    );
};


export default ProductsClient;