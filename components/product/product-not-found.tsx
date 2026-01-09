import Image from 'next/image';
import Link from 'next/link';
import { handleSearchAction } from '@/lib/actions/search-actions';
import { Home, Search, ShoppingBag } from 'lucide-react';

interface ProductNotFoundProps {
  productSlug?: string;
  message?: string;
  imageSrc?: string;
  suggestions?: Array<{
    name: string;
    href: string;
  }>;
}

export function ProductNotFound({
  productSlug,
  message = "The product you're looking for doesn't exist or has been removed.",
  imageSrc = '/images/product-not-found.png',
}: ProductNotFoundProps) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Product Slug Display (if provided) */}
        {productSlug && (
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Product: <span className="font-medium text-gray-900">{productSlug}</span>
            </p>
          </div>
        )}

        {/* 404 Icon/Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-56 h-52">
            <Image
              src={imageSrc}
              alt="Product not found"
              fill
              className="object-contain opacity-80"
              priority
            />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white  hover:bg-gray-800 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 border-2 border-gray-300  hover:bg-gray-50 transition-colors font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or explore by category</span>
          </div>
        </div>


        {/* Help Text */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Need help? <Link href="/contact" className="text-gray-900 font-medium hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductNotFound;
