"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

type UUID = string;

type ProductCard = {
    id: UUID;
    name: string;
    slug: string;
    brand?: string;
    price: number;
    imageUrl: string;
    badge?: string;
};

type Props = {
    product: ProductCard;
    onMouseEnter?: () => void;
    viewMode?: 'grid' | 'list';
    onAddToWishlist?: (id: UUID) => void;
    onQuickView?: (product: ProductCard) => void;
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
    const [imageLoading, setImageLoading] = useState(true);

    const formattedPrice = (product.price / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

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

    if(viewMode === 'list') {
        return (
            <Link 
                onMouseEnter={onMouseEnter} 
                href={`/product/${product.slug}`} 
                className="group"
            >
                <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white relative">
                    <div className="relative w-32 h-32 shrink-0">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                        />
                        {product.badge && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs rounded">
                                {product.badge}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
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
        <Link onMouseEnter={onMouseEnter} href={`/product/${product.slug}`} className="product-card group">
            <div className="relative aspect-[2.6/3] bg-gray-100 overflow-hidden">
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
                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                    priority={false}
                />

                {product.badge && (
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
                        {product.badge}
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