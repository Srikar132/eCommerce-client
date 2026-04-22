import { getAllProducts } from "@/lib/actions/product-actions";
import HotThisWeekClient from "../landing-page/hot-this-week-client";

interface ProductRecommendationsProps {
  excludeProductId?: string;
  categorySlug?: string;
  limit?: number;
  title?: string;
}

export default async function ProductRecommendations({
  excludeProductId,
  categorySlug,
  limit = 8,
  title = "You May Also Like"
}: ProductRecommendationsProps) {
  
  // Fetch products from the same category
  const { data: allProducts } = await getAllProducts({
    category: categorySlug,
    limit: limit + 1, // Fetch one extra in case we need to exclude the current product
  });

  // Filter out the current product
  const recommendedProducts = allProducts
    .filter((p) => p.id !== excludeProductId)
    .slice(0, limit);

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="py-20 md:py-32">
        <HotThisWeekClient 
          products={recommendedProducts} 
          title={title}
          showButton={false} 
        />
    </div>
  );
}
