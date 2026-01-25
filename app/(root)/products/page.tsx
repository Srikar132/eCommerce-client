import { Suspense } from "react";
import ProductsClient from "@/components/products-page/products-client";
import { productApi } from "@/lib/api/product";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tanstack/query-keys";
import { parseSearchParams } from "@/utils/filter-utils";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";



export const metadata = {
  title: 'All Products --- Explore and Customize Your Favorites',
  description: 'Browse our collection of products and customize them to your liking. Find the perfect items that suit your style and needs.',
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function ProductsContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryClient = getQueryClient();

  // Parse all search params into structured format (only once on server)
  const { filters, page, size, sort } = parseSearchParams(resolvedParams);

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.products.list({ filters, page, size, sort }),
    queryFn: ({ pageParam = page }) =>
      productApi.getProducts({
        filters,
        page: pageParam,
        size,
        sort,
      }),
    initialPageParam: page,
    getNextPageParam: (lastPage: { products: { last: boolean; page: number } }) =>
      lastPage.products.last ? undefined : lastPage.products.page + 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto p-4 py-6">
        <ProductsClient 
          initialFilters={filters}
          initialPage={page}
          initialSize={size}
          initialSort={sort}
        />
      </div>
    </HydrationBoundary>
  );
}

const ProductsPage = async ({ searchParams }: Props) => {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
};


export default ProductsPage;