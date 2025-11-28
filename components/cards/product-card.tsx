"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type UUID = string;

type ProductCard = {
    id: UUID;
    name: string;
    slug: string;
    brand?: string;
    price: number; // cents
    imageUrl: string;
    badge?: string;
};

type Props = {
    product: ProductCard;
    onMouseEnter?: () => void;
};

const ProductCardComponent = ({ product, onMouseEnter }: Props) => {
    const [imageLoading, setImageLoading] = useState(true);

    const formattedPrice = (product.price / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return (
        <Link onMouseEnter={onMouseEnter} href={`/product/${product.slug}`} className="product-card group">
            <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                )}

                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    onLoad={() => setImageLoading(false)}
                    priority={false}
                />

                {product.badge && (
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
                        {product.badge}
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-1">
                {product.brand && (
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {product.brand}
                    </p>
                )}

                <h3 className="text-sm font-normal text-gray-900 group-hover:underline">
                    {product.name}
                </h3>

                <p className="text-sm font-medium text-gray-900">
                    {formattedPrice}
                </p>
            </div>
        </Link>
    );
};

export default ProductCardComponent;