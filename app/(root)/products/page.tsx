import ProductsClient from "@/components/products-page/products-client";
import { ProductParams } from "@/types/product";
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

import BreadcrumbNavigation from "@/components/breadcrumb-navigation";

export default async function ProductsPage({ searchParams }: Props) {
  const {
    page = 0,
    limit = 20,
    category,
    searchQuery,
    sortBy = 'CREATED_AT_DESC',
    sizes,
    colors,
    minPrice,
    maxPrice
  } = await searchParams;

  return (
    <div className="mx-auto lg:px-8 py-10 space-y-10">
      <div className="px-2 lg:px-0">
        <BreadcrumbNavigation />
      </div>
      <ProductsClient
        page={Number(page)}
        limit={Number(limit)}
        category={category}
        sortBy={sortBy}
        searchQuery={searchQuery}
        sizes={sizes}
        colors={colors}
        minPrice={minPrice ? Number(minPrice) : undefined}
        maxPrice={maxPrice ? Number(maxPrice) : undefined}
      />
    </div>
  );
}