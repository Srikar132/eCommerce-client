import { ReactNode } from "react";
import { dehydrate, HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { categoryApi } from "@/lib/api/category";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";
import { Category } from "@/types";
import { queryKeys } from "@/lib/tanstack/query-keys";
import TanstackProvider from "./tanstack";

interface PrefetchProviderProps {
  children: ReactNode;
}

/**
 * PrefetchProvider - Handles server-side data prefetching for categories
 * Only prefetches data that isn't already in cache
 * 
 * Prefetches:
 * 1. All root categories (minimal data) - if not cached
 * 2. Children for ALL root categories (for mega menu) - if not cached
 */
export async function PrefetchProvider({ children }: PrefetchProviderProps) {
  const queryClient = getQueryClient();

  try {
    // Step 1: Check cache first, only prefetch root categories if not cached
    let rootCategories = queryClient.getQueryData(
      queryKeys.categories.root()
    ) as Category[];

    if (!rootCategories) {
      console.log("[PrefetchProvider] Root categories not in cache, fetching...");
      await queryClient.prefetchQuery({
        queryKey: queryKeys.categories.root(),
        queryFn: async () => {
          console.log("[PrefetchProvider] Fetching root categories");
          return categoryApi.getCategories({
            filters: { minimal: true },
          });
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });

      // Get the newly fetched data
      rootCategories = queryClient.getQueryData(
        queryKeys.categories.root()
      ) as Category[];
    } else {
      console.log("[PrefetchProvider] Root categories found in cache, skipping fetch");
    }

    // Step 2: Prefetch children for ALL root categories (only if not already cached)
    if (rootCategories?.length) {
      console.log(
        `[PrefetchProvider] Checking cache for ${rootCategories.length} category children`
      );

      // Filter out categories whose children are already cached
      const categoriesToFetch = rootCategories.filter((category) => {
        const cached = queryClient.getQueryData(
          queryKeys.categories.children(category.slug)
        );
        return !cached;
      });

      if (categoriesToFetch.length > 0) {
        console.log(
          `[PrefetchProvider] Prefetching children for ${categoriesToFetch.length} categories (${rootCategories.length - categoriesToFetch.length} already cached)`
        );

        // Prefetch only uncached category children in parallel
        await Promise.all(
          categoriesToFetch.map((category) =>
            queryClient.prefetchQuery({
              queryKey: queryKeys.categories.children(category.slug),
              queryFn: async () => {
                console.log(
                  `[PrefetchProvider] Fetching children for: ${category.slug}`
                );
                const data = await categoryApi.getCategories({
                  filters: {
                    slug: category.slug,
                    recursive: true,
                    minimal: true,
                    includeProductCount: true,
                  },
                });
                // API directly returns the subcategories array
                return data;
              },
              staleTime: 1000 * 60 * 60 * 24, // 24 hours
            })
          )
        );

        console.log(
          `[PrefetchProvider] Successfully prefetched children for ${categoriesToFetch.length} categories`
        );
      } else {
        console.log(
          "[PrefetchProvider] All category children already in cache, skipping fetch"
        );
      }
    }
  } catch (error) {
    // Fallback safety: set fallback data if prefetch fails
    console.error("[PrefetchProvider] Error prefetching categories:", error);
    queryClient.setQueryData(
      queryKeys.categories.root(),
      FALLBACK_CATEGORIES
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanstackProvider>
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>
    </TanstackProvider>
  );
}