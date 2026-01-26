import Image from "next/image";
import Link from "next/link";
import type { ProductResponse } from "@/types";

interface BestSellerCardProps {
  product: ProductResponse;
}

export default function BestSellerCard({ product }: BestSellerCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-white mb-3">
        <Image
          src={product?.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-normal text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
          {product?.name}
        </h3>
        <p className="text-sm font-medium text-gray-900">
          ${product?.basePrice?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
