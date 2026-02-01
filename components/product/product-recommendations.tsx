import { fetchRecommendations } from "@/lib/api/server-fetch";
import ProductCard from "@/components/cards/product-card";
import type { ProductResponse } from "@/types";
import { cacheLife } from "next/cache";

interface ProductRecommendationsProps {
  excludeProductSlug?: string;
  category?: string;
  limit?: number;
  title?: string;
}

/**
 * Server Component - Product Recommendations Grid
 * Displays personalized product recommendations based on user context
 */
export default async function ProductRecommendations({
  excludeProductSlug,
  category,
  limit = 6,
  title = "You May Also Like",
}: ProductRecommendationsProps) {
    "use cache";
    cacheLife({
        stale: 3600, // 1 hour until considered stale
        revalidate: 7200, // 2 hours until revalidated
        expire: 86400, // 1 day until expired
    });

  const recommendations = await fetchRecommendations({
    excludeProductSlug,
    category,
    limit,
  });

  // Don't render if no recommendations
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 lg:mt-16">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-serif font-light tracking-wide text-foreground">
          {title}
        </h2>
        <div className="mt-2 h-px w-20 bg-linear-to-r from-primary/60 to-transparent" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {recommendations.map((product: ProductResponse) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
