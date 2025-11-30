"use client";

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchInput } from '@/components/search-input';
import { SearchResults } from '@/components/search-results';
import FilterSidebar from '@/components/filter-sidebar';
import SortDropdown from '@/components/sort-dropdown';
import { fetchSearchResults } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

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

  // Memoize search params object (similar to category-client)
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
        q: query || '', // Pass empty string if no query to fetch all products
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
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            We couldn't fetch the search results. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="max-w-2xl">
          <SearchInput 
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search for products, brands, categories..."
          />
        </div>
      </div>


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

      <div className="flex gap-8">
        {/* Desktop Sidebar - Use existing FilterSidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-6">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              facets={facets}
              currentFilters={activeFilters}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Sort */}
          <div className="hidden lg:flex justify-end items-center mb-6">
            <SortDropdown 
              currentSort={searchParams.get('sort') || 'relevance'}
            />
          </div>

          {/* Search Results */}
          <SearchResults
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

      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white">
            <FilterSidebar
              isOpen={showMobileFilters}
              onClose={() => setShowMobileFilters(false)}
              facets={facets}
              currentFilters={activeFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
