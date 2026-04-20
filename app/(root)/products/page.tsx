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

export default async function ProductsPage({ searchParams }: Props) {
  const { page = 0, limit = 20, category, searchQuery, sortBy = 'CREATED_AT_DESC', size } = await searchParams;

  return (
    <div className="mx-auto px-0 lg:px-8 py-0 lg:py-6">
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