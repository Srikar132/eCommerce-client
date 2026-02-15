import ProductsClient from "@/components/products-page/products-client";
import { ProductParams } from "@/types/product";
import { getAllProducts } from "@/lib/actions/product-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our collection of premium customizable fashion. Find ethnic wear, contemporary styles, and personalized clothing that suits your unique style.",
  openGraph: {
    title: "Shop All Products - Nala Armoire",
    description: "Browse our collection of premium customizable fashion at Nala Armoire.",
    url: "https://nalaarmoire.com/products",
    images: ["/images/og-image.jpg"],
  },
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