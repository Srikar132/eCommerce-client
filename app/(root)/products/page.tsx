import ProductsClient from "@/components/products-page/products-client";
import { productApi } from "@/lib/api/product";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const revalidate = 150;

export const metadata = {
  title: 'All Products --- Explore and Customize Your Favorites',
  description: 'Browse our collection of products and customize them to your liking. Find the perfect items that suit your style and needs.',
};

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
}


const ProductsPage = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const queryClient = getQueryClient();

  // Parse page (0-based)
  const page = typeof resolvedParams.page === 'string'
    ? Math.max(0, parseInt(resolvedParams.page) - 1)  // Convert 1-based URL to 0-based
    : 0;

  // Parse size
  const size = typeof resolvedParams.size === 'string'
    ? parseInt(resolvedParams.size)
    : 24;

  // Parse sort
  const sort = typeof resolvedParams.sort === 'string'
    ? resolvedParams.sort
    : 'createdAt,desc';

  // Build filters object
  const filters: Record<string, string | string[] | boolean | number> = {};

  if (resolvedParams.category) {
    filters.category = Array.isArray(resolvedParams.category)
      ? resolvedParams.category
      : [resolvedParams.category];
  }

  if (resolvedParams.brand) {
    filters.brand = Array.isArray(resolvedParams.brand)
      ? resolvedParams.brand
      : [resolvedParams.brand];
  }

  if (resolvedParams.productSize) {
    filters.productSize = Array.isArray(resolvedParams.productSize)
      ? resolvedParams.productSize
      : [resolvedParams.productSize];
  }

  if (resolvedParams.color) {
    filters.color = Array.isArray(resolvedParams.color)
      ? resolvedParams.color
      : [resolvedParams.color];
  }

  if (resolvedParams.minPrice) {
    filters.minPrice = Number(resolvedParams.minPrice);
  }

  if (resolvedParams.maxPrice) {
    filters.maxPrice = Number(resolvedParams.maxPrice);
  }

  if (resolvedParams.customizable === 'true') {
    filters.customizable = true;
  }

  if (resolvedParams.searchQuery) {
    filters.searchQuery = resolvedParams.searchQuery;
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', { filters, page, size, sort }],
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
        <ProductsClient />
      </div>
    </HydrationBoundary>
  );
};


export default ProductsPage;