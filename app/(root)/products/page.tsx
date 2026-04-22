import ProductsClient from "@/components/products-page/products-client";
import { ProductParams } from "@/types/product";
import type { Metadata } from "next";

export async function generateMetadata({ 
  searchParams 
}: Props): Promise<Metadata> {
  const { category } = await searchParams;

  const categoryTitles: Record<string, { title: string, description: string }> = {
    'mens': {
      title: "Handcrafted Embroidered Clothing for Men",
      description: "Discover premium handcrafted embroidered clothing for men at Nala Armoire. Shop exquisite kurtas and ethnic wear featuring traditional embroidery."
    },
    'womens': {
      title: "Handcrafted Embroidered Clothing for Women",
      description: "Explore our collection of premium handcrafted embroidered clothing for women at Nala Armoire. From ethnic wear to contemporary styles."
    },
    'kid-boys': {
      title: "Handcrafted Embroidered Clothing for Boys",
      description: "Shop premium handcrafted embroidered clothing for boys at Nala Armoire. Perfect for family celebrations and ethnic wear."
    },
    'kid-girls': {
      title: "Handcrafted Embroidered Clothing for Girls",
      description: "Explore our collection of premium handcrafted embroidered clothing for girls at Nala Armoire. Festive lehengas and embroidered sets."
    }
  };

  const currentCategory = category ? categoryTitles[category] : null;

  if (currentCategory) {
    return {
      title: currentCategory.title,
      description: currentCategory.description,
      openGraph: {
        title: `${currentCategory.title} | Nala Armoire`,
        description: currentCategory.description,
        url: `https://nalaarmoire.com/products?category=${category}`,
        images: ["/images/og-image.jpg"],
      },
    };
  }

  return {
    title: "All Products | Handcrafted Embroidered Clothing",
    description: "Browse our collection of premium handcrafted embroidered clothing. Find ethnic wear, contemporary styles, and family ethnic wear for everyone.",
    openGraph: {
      title: "Shop All Products - Nala Armoire",
      description: "Browse our collection of premium handcrafted embroidered clothing at Nala Armoire.",
      url: "https://nalaarmoire.com/products",
      images: ["/images/og-image.jpg"],
    },
  };
}

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