import { cacheLife } from 'next/cache';
import { fetchBestSellers } from '../../lib/api/server-fetch';
import BestSellerCard from '@/components/cards/best-seller-card';
import Link from 'next/link';




export default async function BestSellers() {
  'use cache';
  cacheLife({
    stale: 3600, // 1 hour until considered stale
    revalidate: 7200, // 2 hours until revalidated
    expire: 86400, // 1 day until expired
  });

  // Fetch best sellers from backend
  const products = await fetchBestSellers();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FCFCF4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 mb-1">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
              Shop best fashion essentials • 5 Styles
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm text-gray-700 hover:text-primary underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            View All Products
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 5).map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
