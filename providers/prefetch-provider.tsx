import { ReactNode } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { categoryApi } from "@/lib/api/category";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";
import { Category } from "@/types";

interface PrefetchProviderProps {
  children: ReactNode;
}

/**
 * PrefetchProvider - Handles server-side data prefetching for categories,
 * 
 * Prefetches:
 * 1. All root categories (minimal data)
 * 2. Children for ALL root categories (for mega menu)
 * 
 */
export async function PrefetchProvider({ children }: PrefetchProviderProps) {
  const queryClient = getQueryClient();

  try {
    // Step 1: Prefetch root categories
    await queryClient.prefetchQuery({
      queryKey: ["categories", { minimal: true }],
      queryFn: async () => {
        console.log("[PrefetchProvider] Fetching root categories");
        return categoryApi.getCategories({
          filters: { minimal: true },
        });
      },
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    // Step 2: Get the root categories from cache
    const rootCategories = queryClient.getQueryData([
      "categories",
      { minimal: true },
    ]) as Category[];

    // Step 3: Prefetch children for ALL root categories
    if (rootCategories?.length) {
      console.log(
        `[PrefetchProvider] Prefetching children for ${rootCategories.length} categories`
      );

      // Prefetch all category children in parallel
      await Promise.all(
        rootCategories.map((category) =>
          queryClient.prefetchQuery({
            queryKey: ["category-children", category.slug],
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
        `[PrefetchProvider] Successfully prefetched children for all categories`
      );
    }
  } catch (error) {
    // Fallback safety: set fallback data if prefetch fails
    console.error("[PrefetchProvider] Error prefetching categories:", error);
    queryClient.setQueryData(
      ["categories", { minimal: true }],
      FALLBACK_CATEGORIES
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
