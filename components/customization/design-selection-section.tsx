import { designsApi } from "@/lib/api/design";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DesignSelectionClient from "./design-selection-client";

interface DesignSelectionSectionProps {
  slug: string;
  variantId: string;
  searchQuery?: string;
  selectedCategory?: string;
}

export default async function DesignSelectionSection({
  slug,
  variantId,
  searchQuery = '',
  selectedCategory = 'all'
}: DesignSelectionSectionProps) {
  const queryClient = getQueryClient();

  // Prefetch designs and categories on server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['designs', {
        filters: {
          categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
          q: searchQuery || undefined,
        },
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      }],
      queryFn: () => designsApi.getDesigns({
        filters: {
          categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
          q: searchQuery || undefined,
        },
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['design-categories'],
      queryFn: () => designsApi.getAllDesignCategories(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DesignSelectionClient
        slug={slug}
        variantId={variantId}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </HydrationBoundary>
  );
}
