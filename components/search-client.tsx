"use client";

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchInput } from '@/components/search-input';
import { Results } from '@/components/product-results';
import FilterSidebar from '@/components/filter-sidebar';
import SortDropdown from '@/components/sort-dropdown';
import { fetchSearchResults } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import ErrorCard from './error-card';

// Define the search result type
interface SearchResult {
  items: any[];
  total: number;
  page: number;
  size: number;
  query: string;
  facets?: any;
}

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get search query from URL
  const query = searchParams.get('q') || '';

  const searchParamsObj = useMemo(() => {
    const params: Record<string, string | string[]> = {};
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

  // Get filter parameters from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string | string[]> = {};
    const excludeKeys = ["q", "page", "size", "sort"];

    Object.entries(searchParamsObj).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        filters[key] = value;
      }
    });

    return filters;
  }, [searchParamsObj]);

  // Query key for cache management
  const queryKey = useMemo(
    () => ["searchResults", query, searchParams.toString()],
    [query, searchParams]
  );

  // Search results with infinite query - always enabled, fetch all products if no query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchSearchResults({
        q: query || '',
        page: pageParam as number,
        size: 24,
        filters: activeFilters,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResult) => {
      const nextPage = lastPage.page + 1;
      const maxPage = Math.ceil(lastPage.total / lastPage.size);
      return nextPage <= maxPage ? nextPage : undefined;
    },
  });

  // Flatten results from all pages
  const allResults = data?.pages.flatMap((page: SearchResult) => page.items) || [];
  const totalResults = data?.pages[0]?.total || 0;

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());

    // Preserve existing filters if any
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.set(key, value as string);
      }
    });

    router.push(`/search?${params.toString()}`);
  };




  // Get active filter count
  const activeFilterCount = Object.keys(activeFilters).length;

  // Show all products when no query, search results when there is a query
  const facets = data?.pages[0]?.facets;

  if (isError) {
    return <ErrorCard />
  }

  return (
    <section className="search-section ">
      {/* Search Header */}
      <header className="search-header lg:hidden">
        <div className="max-w-2xl">
          <SearchInput
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search for products, brands, categories..."
          />
        </div>
      </header>


      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <SortDropdown
            currentSort={searchParams.get('sort') || 'relevance'}
          />
        </div>
      </div>



      <div className="flex gap-6 lg:gap-8">

        <FilterSidebar
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          facets={facets}
          currentFilters={activeFilters}
        />


        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* Sticky Desktop Header - Outside container for proper sticking */}
          <header className="hidden lg:block sticky top-0 bg-white z-40 border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {totalResults} {totalResults === 1 ? "product" : "products"}
                    {query && ` for "${query}"`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <SortDropdown currentSort={searchParams.get('sort') || 'relevance'} />
                </div>
              </div>
            </div>
          </header>

          {/* Search Results */}
          <Results
            results={{
              items: allResults,
              total: totalResults,
              page: data?.pages?.length || 1,
              size: 24,
              query: query || 'all products',
            }}
            isLoading={isLoading}
            onLoadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>


    </section>
  );
}
