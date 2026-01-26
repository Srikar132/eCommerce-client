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
  const filters = {
    categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
    q: searchQuery || undefined,
  };
  const pageSize = 20;

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['designs', 'infinite', filters, pageSize],
      queryFn: ({ pageParam = 0 }) => designsApi.getDesigns({
        filters,
        page: pageParam,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      }),
      initialPageParam: 0,
    }),
    queryClient.prefetchQuery({
      queryKey: ['design', 'categories'],
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
