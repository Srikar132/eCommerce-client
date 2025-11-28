"use client";
import { Category, Facets, ProductCard } from "@/lib/types";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryFromURL } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { fetchProductsByCategory } from "@/lib/api";
import ProductList from "./product-grid";
import Filters from "./filters";

type Props = {
    slug: string;
    initialCategory: Category | null;
    initialProducts: ProductCard[];
    initialTotal: number;
    initialPage: number;
    initialSize: number;
    initialFacets?: Facets;
    serverSearchParams: Record<string, string | string[] | undefined>;
};

const CategoryClient = (props: Props) => {
    const {
        slug,
        initialCategory,
        initialProducts,
        initialTotal,
        initialPage,
        initialSize,
        initialFacets,
        serverSearchParams
    } = props;

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();


    const urlQuery = buildQueryFromURL(serverSearchParams);

    const queryKey = useMemo(() => ['category', slug, JSON.stringify(urlQuery)], [slug, urlQuery]);


    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        status,
        refetch,
    } = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            // pageParam is number page
            const res = await fetchProductsByCategory({
                category: slug,
                page: pageParam,
                size: Number(urlQuery.size ?? initialSize ?? 24),
                sort: (urlQuery.sort as string) ?? 'relevance',
                filters: urlQuery,
            });
            return res; // { items, total, page, size, facets, nextPage? }
        },
        initialPageParam: initialPage,
        getNextPageParam: (lastPage, pages) => {
            const current = lastPage.page ?? 1;
            const size = lastPage.size ?? 24;
            const total = lastPage.total ?? 0;
            const maxPage = Math.ceil(total / size);
            return current < maxPage ? current + 1 : undefined;
        },
        initialData: {
            pages: [
                {
                    items: initialProducts,
                    total: initialTotal,
                    page: initialPage,
                    size: initialSize,
                    facets: initialFacets,
                },
            ],
            pageParams: [initialPage],
        },
        staleTime: 1000 * 60 * 1, // 1 minute
        refetchOnWindowFocus: false,
    });

    // const sentinelRef = useRef<HTMLDivElement | null>(null);
    // useEffect(() => {
    //     if (!sentinelRef.current) return;
    //     const io = new IntersectionObserver(
    //         (entries) => {
    //             entries.forEach((entry) => {
    //                 if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
    //                     fetchNextPage();
    //                 }
    //             });
    //         },
    //         { rootMargin: '400px' }
    //     );
    //     io.observe(sentinelRef.current);
    //     return () => io.disconnect();
    // }, [sentinelRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Handle filter changes by updating the URL (shallow navigation so server doesn't re-render page unless user wants)
    const onFilterChange = (newParams: Record<string, string | string[] | undefined>) => {
        // merge into current search params and navigate
        const url = new URL(window.location.href);
        // clear existing search params
        url.search = '';
        Object.entries(newParams).forEach(([k, v]) => {
            if (v === undefined || v === null) return;
            if (Array.isArray(v)) {
                v.forEach((val) => url.searchParams.append(k, String(val)));
            } else {
                url.searchParams.set(k, String(v));
            }
        });
        // push to router (App Router)
        router.push(url.pathname + url.search);
        // Optionally refetch after URL update - query will re-run due to queryKey change
    };

    return (
        <section className="category-section">
            {/* Header for filters  */}
            <header className="filter-header">
                {/* FILTER BUTTON */}
                {/* <Button className="filter-button">
                    <SlidersHorizontal />
                    <span className="ml-2">Filters</span>
                </Button> */}
                {/* <Filters
                    initialFacets={initialFacets}
                    currentQuery={urlQuery}
                    onChange={onFilterChange}
                /> */}
                {/* SORTING SBY DROPDOWN */}

            </header>

            {/* Product Grid */}
            <ProductList products={data?.pages.flatMap((page) => page.items) ?? []}  />
            {/* pagination */}
            {/* <div className="infinite-scroll-pagination">
                {hasNextPage ? (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                ) : (
                    <div className="text-sm text-gray-500">No more products</div>
                )}
            </div> */}

            {/* <div ref={sentinelRef} /> */}
        </section>
    );
};


export default CategoryClient;