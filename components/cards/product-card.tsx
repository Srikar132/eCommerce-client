"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { ProductResponse } from '@/types';

type UUID = string;

type Props = {
    product: ProductResponse;
    onMouseEnter?: () => void;
    viewMode?: 'grid' | 'list';
    onAddToWishlist?: (id: UUID) => void;
    onQuickView?: (product: ProductResponse) => void;
    onAddToCart?: (id: UUID) => void;
};

const ProductCardComponent = ({
    product,
    onMouseEnter,
    viewMode = 'grid',
    onAddToWishlist,
    onQuickView,
    onAddToCart
}: Props) => {

    const formattedPrice = (product.basePrice / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl 
        || product.images[0]?.imageUrl 
        || '/placeholder-product.jpg';

    const badge = product.isCustomizable ? 'Customizable' : undefined;

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToWishlist?.(product.id);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView?.(product);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product.id);
    };

    if (viewMode === 'list') {
        return (
            <Link
                onMouseEnter={onMouseEnter}
                href={`/product/${product.slug}`}
                className="group"
            >
                <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white relative">
                    <div className="relative w-32 h-32 shrink-0">
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                        />
                        {badge && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs rounded">
                                {badge}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{product.brandName}</p>
                        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">{formattedPrice}</p>
                    </div>

                    {/* CTAs for list view */}
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleWishlistClick}
                            className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                            aria-label="Add to wishlist"
                        >
                            <Heart size={18} />
                        </button>
                        <button
                            onClick={handleQuickView}
                            className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                            aria-label="Quick view"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                            aria-label="Add to cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link onMouseEnter={onMouseEnter} href={`/products/${product.slug}`} className="product-card group">
            <div className="relative aspect-[2.6/3] bg-gray-100 overflow-hidden">
                <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                    priority={false}
                />

                {badge && (
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-2xl    ">
                        {badge}
                    </div>
                )}

                {/* Hover CTAs */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleWishlistClick}
                        className="p-2 rounded-full bg-white text-gray-600 hover:text-red-500 shadow-md transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={18} />
                    </button>
                    <button
                        onClick={handleQuickView}
                        className="p-2 rounded-full bg-white text-gray-600 hover:text-gray-900 shadow-md transition-colors"
                        aria-label="Quick view"
                    >
                        <Eye size={18} />
                    </button>
                </div>

                {/* Add to Cart CTA */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    {product.brandName}
                </p>

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