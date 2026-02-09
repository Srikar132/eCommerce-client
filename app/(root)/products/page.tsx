import ProductsClient from "@/components/products-page/products-client";
import { ProductParams } from "@/types/product";
import { getAllProducts } from "@/lib/actions/product-actions";

export const metadata = {
  title: 'All Products --- Explore and Customize Your Favorites',
  description: 'Browse our collection of products and customize them to your liking. Find the perfect items that suit your style and needs.',
};

type Props = {
  searchParams: Promise<ProductParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page = 0, limit = 20, category , searchQuery , sortBy = 'CREATED_AT_DESC', size } = await searchParams;

  // Fetch initial products data on the server
  const initialData = await getAllProducts({
    page,
    limit,
    category,
    searchQuery,
    sortBy,
    size
  });

  return (
    <div className="mx-auto px-0 lg:px-8 py-0 lg:py-6">
      <ProductsClient
        page={page}
        limit={limit}
        category={category}
        sortBy={sortBy}
        searchQuery={searchQuery}
        size={size}
        initialData={initialData}
      />
    </div>
  );
}