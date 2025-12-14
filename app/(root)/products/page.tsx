import { productApi } from "@/lib/api/product";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const revalidate = 60;

export const metadata = {
    title: 'Products',
    description: 'Browse our collection of products',
};

type props = {
    searchParams: Record<string, string | string[] | undefined>;
}

const ProductsPage = async ({ searchParams }: props) => {
  const resolvedParams = await searchParams;
  const queryClient = getQueryClient();

  const page =
    typeof resolvedParams.page === 'string'
      ? parseInt(resolvedParams.page)
      : 1;

  const size =
    typeof resolvedParams.size === 'string'
      ? parseInt(resolvedParams.size)
      : 20;

  const sort =
    typeof resolvedParams.sort === 'string'
      ? resolvedParams.sort
      : 'createdAt:desc';

  const { page: _p, size: _s, sort: _sort, ...otherFilters } = resolvedParams;

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', resolvedParams],
    queryFn: ({ pageParam = 1 }) =>
      productApi.getProducts({
        filters: otherFilters as Record<string, string | string[]>,
        page: pageParam,
        limit: size,
        sort: sort as any,
      }),
    initialPageParam: page,
    getNextPageParam: (lastPage: { last: any; page: number; }) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        The products page content goes here.
      </div>
    </HydrationBoundary>
  );
};


export default ProductsPage;