"use client";

import { useState, useCallback } from "react";
import SortDropdown from "../sort-dropdown";
import NoResults from "./no-results";
import { SearchInput } from "../search-input";
import { useInfiniteProducts, useFlatProducts, useProductCount } from "@/lib/tanstack/queries";
import ErrorCard from "../cards/error-card";
import { Product, ProductParams } from "@/types/product";
import ProductCard from "../cards/product-card";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartContext } from "@/context/cart-context";
import { useProductOptions } from "@/context/product-options-context";
import { useRouter } from "next/navigation";
import { ProductFilters } from "../product/product-filters";
import { ProductsSkeleton } from "./products-skeleton";

const ProductsClient = (params: ProductParams) => {
    const [sortBy, setSortBy] = useState<ProductParams["sortBy"]>(params.sortBy || "CREATED_AT_DESC");
    const { isFetching: isCartFetching } = useCartContext();
    const { openOptions } = useProductOptions();
    const router = useRouter();

    const activeSizes = params.sizes ? params.sizes.split(",").filter(Boolean) : [];
    const activeColors = params.colors ? params.colors.split(",").filter(Boolean) : [];

    const {
        data,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        refetch
    } = useInfiniteProducts({ ...params, sortBy });

    const products = useFlatProducts(data);
    const totalProducts = useProductCount(data);

    const sentinelRef = useInfiniteScroll({
        hasNextPage: hasNextPage || false,
        isFetchingNextPage: isFetchingNextPage || false,
        fetchNextPage: fetchNextPage || (() => { }),
        rootMargin: "400px"
    });

    const handleQuickView = useCallback((slug: string) => {
        router.push(`/products/${slug}`);
    }, [router]);

    const handleAddToCart = useCallback((product: Product) => {
        openOptions(product);
    }, [openOptions]);

    if (error) {
        return <ErrorCard
            title="Failed to load products"
            message="There was an error fetching the products. Please try again."
            onRetry={() => refetch()}
        />;
    }

    if (!isLoading && products.length === 0 && !isFetching) {
        return <NoResults
            searchQuery={params.searchQuery as string}
        />;
    }

    const isFilterLoading = isFetching && !isFetchingNextPage && !isLoading;

    return (
        <section className="w-full">
            {/* Active Filters & Contextual Header */}
            <div className="px-2 lg:px-0 mb-8 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter capitalize">
                        {params.category ? `${params.category.replace("-", " ")} Collection` : "All Stitches"}
                    </h1>
                    <p className="text-sm text-muted-foreground tracking-tight max-w-lg">
                        {params.category
                            ? `Exploring our curated selection of ${params.category.replace("-", " ")} pieces, handcrafted for your unique sanctuary.`
                            : "Discover our entire collection of artisanal garments, where each piece tells a story of beauty and heritage."}
                    </p>
                </div>

                {/* Active Filter Chips */}
                {(params.category || activeSizes.length > 0 || activeColors.length > 0 || params.minPrice || params.maxPrice) && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                        {/* <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">Filters:</span> */}

                        {params.category && (
                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams(window.location.search);
                                    newParams.delete("category");
                                    const search = newParams.toString();
                                    router.push(search ? `/products?${search}` : "/products");
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent/80 transition-all group"
                            >
                                {params.category.replace("-", " ")}
                                <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                            </button>
                        )}

                        {/* Size Chips */}
                        {activeSizes.map((size) => (
                            <button
                                key={`size-${size}`}
                                onClick={() => {
                                    const newSizes = activeSizes.filter(s => s !== size);
                                    const newParams = new URLSearchParams(window.location.search);
                                    if (newSizes.length > 0) newParams.set("sizes", newSizes.join(","));
                                    else newParams.delete("sizes");
                                    const search = newParams.toString();
                                    router.push(search ? `/products?${search}` : "/products");
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all group"
                            >
                                Size: {size}
                                <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                            </button>
                        ))}

                        {/* Color Chips */}
                        {activeColors.map((color) => (
                            <button
                                key={`color-${color}`}
                                onClick={() => {
                                    const newColors = activeColors.filter(c => c !== color);
                                    const newParams = new URLSearchParams(window.location.search);
                                    if (newColors.length > 0) newParams.set("colors", newColors.join(","));
                                    else newParams.delete("colors");
                                    const search = newParams.toString();
                                    router.push(search ? `/products?${search}` : "/products");
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all group"
                            >
                                Color: {color}
                                <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                            </button>
                        ))}

                        {/* Price Chip */}
                        {(params.minPrice || params.maxPrice) && (
                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams(window.location.search);
                                    newParams.delete("minPrice");
                                    newParams.delete("maxPrice");
                                    const search = newParams.toString();
                                    router.push(search ? `/products?${search}` : "/products");
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all group"
                            >
                                Price: {params.minPrice ? `₹${params.minPrice}` : "₹0"} - {params.maxPrice ? `₹${params.maxPrice}` : "∞"}
                                <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                            </button>
                        )}

                        {/* Clear All */}
                        <button
                            onClick={() => router.push("/products")}
                            className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline underline-offset-4 ml-2"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Header - Improved Alignment */}
            <div className="lg:hidden px-2 py-6 space-y-6 bg-background">
                {/* <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Search your wardrobe..."
                        className="flex-1 rounded-full h-12 bg-muted/30 border-none"
                    />
                </div> */}
                <div className="flex items-start justify-between gap-4">
                    <ProductFilters
                        activeSizes={activeSizes}
                        activeColors={activeColors}
                        activeMinPrice={params.minPrice}
                        activeMaxPrice={params.maxPrice}
                    />
                    <SortDropdown
                        value={sortBy}
                        onChange={setSortBy}
                        isLoading={isFilterLoading}
                    />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="flex flex-col w-full">
                {/* Desktop Header - Content aligned with grid */}
                <header className="hidden lg:flex items-center justify-between py-6 mb-8 border-b border-border/60">
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <Skeleton className="h-4 w-40 rounded-full" />
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                                Showing {products.length} of {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
                            </span>
                        )}
                        <ProductFilters
                            activeSizes={activeSizes}
                            activeColors={activeColors}
                            activeMinPrice={params.minPrice}
                            activeMaxPrice={params.maxPrice}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <SortDropdown
                            value={sortBy}
                            onChange={setSortBy}
                            isLoading={isFilterLoading}
                        />
                    </div>
                </header>

                {/* Grid Layout */}
                <div className="relative">
                    {/* Loading Overlay */}
                    {isFilterLoading && (
                        <div className="absolute inset-x-0 top-20 z-20 flex justify-center pointer-events-none">
                            <div className="bg-background/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-border pointer-events-auto">
                                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            </div>
                        </div>
                    )}

                    {isLoading && !products.length ? (
                        <div className="px-6 lg:px-0">
                            <ProductsSkeleton />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Products Grid - Shared padding on mobile, flush on desktop container */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 px-2 lg:px-0">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCartClick={() => handleAddToCart(product)}
                                        onQuickViewClick={() => handleQuickView(product.slug)}
                                        isUpdating={isCartFetching}
                                    />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasNextPage && (
                                <div className="flex justify-center pt-12 pb-20">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="rounded-full px-12 py-6 h-auto text-sm font-bold uppercase tracking-widest border-2 hover:bg-foreground hover:text-background transition-all active:scale-95"
                                    >
                                        {isFetchingNextPage ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Discovering...
                                            </span>
                                        ) : "Load More Treasures"}
                                    </Button>
                                </div>
                            )}

                            {/* End of Results */}
                            {!hasNextPage && products.length > 0 && (
                                <div className="text-center py-20 border-t border-border/40 mt-20">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">
                                        You have viewed all {totalProducts} items
                                    </p>
                                </div>
                            )}

                            <div ref={sentinelRef} className="h-px" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsClient;