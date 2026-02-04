import { Suspense } from "react";
import ProductsClient from "@/components/products-page/products-client";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { ProductParams } from "@/types/product";



export const metadata = {
  title: 'All Products --- Explore and Customize Your Favorites',
  description: 'Browse our collection of products and customize them to your liking. Find the perfect items that suit your style and needs.',
};

type Props = {
  searchParams: Promise<ProductParams>;
}

async function ProductsContent({ searchParams }: Props) {
  const { page = 0, limit = 20, category , searchQuery , sortBy = 'CREATED_AT_DESC', size } = await searchParams;

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ProductsClient
        page={page}
        limit={limit}
        category={category}
        sortBy={sortBy}
        searchQuery={searchQuery}
        size={size}
      />
    </div>
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