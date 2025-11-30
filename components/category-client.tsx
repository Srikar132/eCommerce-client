"use client";

import { Category, Facets, ProductCard } from "@/lib/types";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProductsByCategory } from "@/lib/api";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import FilterSidebar from "./filter-sidebar";
import SortDropdown from "./sort-dropdown";
import ErrorCard from "./error-card";
import { Results } from "./product-results";

type Props = {
  slug: string;
  initialCategory: Category | null;
  initialProducts: ProductCard[];
  initialTotal: number;
  initialPage: number;
  initialSize: number;
  initialFacets?: Facets;
};

const CategoryClient = ({
  slug,
  initialProducts,
  initialTotal,
  initialPage,
  initialSize,
  initialFacets,
  initialCategory
}: Props) => {
  const searchParams = useSearchParams();
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Memoize search params object
  const searchParamsObj = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    console.log(searchParams)
    searchParams.forEach((value, key) => {
      const existing = params[key];
      if (existing) {
        params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        params[key] = value;
      }
    });
    return params;
  }, [searchParams]);

  // Extract current values
  const currentSort = searchParams.get("sort") || "relevance";
  const currentSize = Number(searchParamsObj.size ?? initialSize ?? 24);

  // Get active filters (exclude pagination and sorting)
  const activeFilters = useMemo(() => {
    const filters: Record<string, string | string[]> = {};
    const excludeKeys = ["page", "size", "sort"];

    Object.entries(searchParamsObj).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        filters[key] = value;
      }
    });

    return filters;
  }, [searchParamsObj]);

  // Query key for cache management
  const queryKey = useMemo(
    () => ["category", slug, searchParams.toString()],
    [slug, searchParams]
  );

  // Infinite query setup
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchProductsByCategory({
        category: slug,
        page: pageParam,
        size: currentSize,
        sort: currentSort,
        filters: searchParamsObj,
      });
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      const { page = 1, size = 24, total = 0 } = lastPage;
      const maxPage = Math.ceil(total / size);
      return page < maxPage ? page + 1 : undefined;
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
    staleTime: 60_000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Use infinite scroll hook
  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: "400px"
  });

  // Flatten products from all pages
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const totalProducts = data?.pages[0]?.total || 0;
  const activeFilterCount = Object.keys(activeFilters).length;


  if(isError) {
    return <ErrorCard/>
  }



  return (
    <section className="category-section">
      <header className="category-header">
        <h1>{initialCategory?.name}</h1>
        {initialCategory?.description && (
          <p>{initialCategory.description}</p>
        )}
      </header>

      {/* Mobile Filter Header - Only on small screens */}
      <div className="filter-header lg:hidden!">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {totalProducts} {totalProducts === 1 ? "product" : "products"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsFilterSidebarOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
                        {activeFilterCount > 0 && (
              <span className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <SortDropdown currentSort={currentSort} />
        </div>
      </div>

      {/* Desktop Layout - Two columns */}
      <div className="flex gap-6 lg:gap-8">
        {/* Left Filter Panel - Desktop Only */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          currentFilters={activeFilters}
          facets={data?.pages[0]?.facets || initialFacets}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex z-50 bg-white sticky top-0 items-center justify-between mb-6  border-b px-4 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <SortDropdown currentSort={currentSort} />
            </div>
          </header>

          {/* Product Grid/List */}
          <Results
            results={{
              items: allProducts,
              total: totalProducts,
              page: data?.pages?.length || 1,
              size: currentSize,
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

export default CategoryClient;