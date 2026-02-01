"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import DesignCard from "@/components/cards/design-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import BottomActionBar from "@/components/customization/bottom-action-bar";
import { useInfiniteDesigns, useFlatDesigns, useDesignCount, useDesignCategories } from "@/lib/tanstack/queries/design.queries";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface DesignSelectionClientProps {
  slug: string;
  variantId: string;
  searchQuery: string;
  selectedCategory: string;
}

export default function DesignSelectionClient({
  slug,
  variantId,
  searchQuery,
  selectedCategory
}: DesignSelectionClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  // Fetch categories using prefetched data
  const { data: categories } = useDesignCategories();

  // Use React Query with prefetched data from server
  const {
    data: designsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDesigns(
    {
      categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
      q: searchQuery || undefined,
    },
    20
  );

  const designs = useFlatDesigns(designsData);
  const totalDesigns = useDesignCount(designsData);

  const sentinelRef = useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '400px'
  });

  // Helper function to build URL with query params
  const buildURL = useCallback((params: { search?: string; tab?: string }) => {
    const current = new URLSearchParams();
    
    // Always keep variantId
    current.set('variantId', variantId);
    
    // Update search param
    if (params.search !== undefined && params.search) {
      current.set('search', params.search);
    }
    
    // Update tab param
    if (params.tab !== undefined && params.tab && params.tab !== 'all') {
      current.set('tab', params.tab);
    }
    
    return `/customization/${slug}?${current.toString()}`;
  }, [slug, variantId]);

  // Handler for search form submission
  const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    
    startTransition(() => {
      router.push(buildURL({ search: searchValue, tab: selectedCategory }));
    });
  }, [router, buildURL, selectedCategory]);

  // Handler for category tab change
  const handleCategoryChange = useCallback((value: string) => {
    startTransition(() => {
      router.push(buildURL({ search: searchQuery, tab: value }));
    });
  }, [router, buildURL, searchQuery]);

  // Handler to clear all filters
  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      router.push(buildURL({ search: '', tab: 'all' }));
    });
  }, [router, buildURL]);

  // Memoized selection handler
  const handleDesignSelect = useCallback((designId: string) => {
    setSelectedDesignId(designId);
  }, []);

  // Handler for continue button
  const handleContinue = useCallback(() => {
    if (!selectedDesignId) {
      alert("Please select a design first");
      return;
    }

    router.push(`/customization-studio/${slug}/${selectedDesignId}?variantId=${variantId}`);
  }, [selectedDesignId, router, slug, variantId]);

  return (
    <>
      <div className="lg:col-span-7">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-serif font-light tracking-wide text-foreground mb-1">
            Choose Your Design
          </h2>
          <p className="text-xs lg:text-sm text-muted-foreground font-light">
            Select a design that speaks to your style
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <Input
              type="text"
              name="search"
              placeholder="Search designs (e.g. Minimalist, Floral...)"
              defaultValue={searchQuery}
              disabled={isPending}
              className="w-full bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 rounded-full py-4 pl-12 pr-28 focus:ring-primary focus:border-primary shadow-sm"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {isPending ? "..." : "Search"}
            </Button>
          </form>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange('all')}
              disabled={isPending}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50'
              }`}
            >
              All Designs
            </button>
            {categories?.length === 0 ? (
              <>
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </>
            ) : (
              categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  disabled={isPending}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50'
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>

        {designs.length === 0 ? (
          <div className="flex items-center justify-center p-16 border-2 border-dashed rounded-3xl border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800/50">
            <div className="text-center max-w-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                <span className="material-icons-outlined text-primary text-4xl">auto_awesome</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">No Designs Available</h4>
              <p className="text-sm mb-5 text-slate-500 dark:text-slate-400 leading-relaxed">
                {searchQuery
                  ? `No designs found matching "${searchQuery}". Try a different search term.`
                  : 'There are currently no designs available in this category.'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={isPending}
                  className="rounded-full border-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  isSelected={selectedDesignId === design.id}
                  onSelect={handleDesignSelect}
                />
              ))}
            </div>

            {hasNextPage && (
              <div ref={sentinelRef} className="flex items-center justify-center py-8">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading more designs...
                  </div>
                )}
              </div>
            )}

            {!hasNextPage && designs.length > 0 && (
              <div className="mt-12 text-center py-8 border-t border-stone-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 mb-2">You have viewed {totalDesigns} of {totalDesigns} designs</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        selectedDesignId={selectedDesignId}
        onContinue={handleContinue}
      />
    </>
  );
}
