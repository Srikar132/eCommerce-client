"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductResponse } from '@/types';
import { formatCurrency } from '@/lib/utils';


type Props = {
    product: ProductResponse;
    onMouseEnter?: () => void;
    onAddToWishlist?: () => void;
    isWishlisted?: boolean;
};

const PLACEHOLDER_IMAGE = '/images/error.png';

const ProductCardComponent = ({
    product,
    onAddToWishlist,
    isWishlisted = false,
}: Props) => {


    const badge = product.isCustomizable ? 'Customizable' : undefined;

    // Memoize event handlers to prevent recreating on each render
    const handleWishlistClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToWishlist?.();
    }, [onAddToWishlist]);



    return (
        <Link 
            href={`/products/${product.slug}`} 
            className="block"
        >
            <Card className="overflow-hidden  border-0  transition-all duration-300 bg-white group">
                {/* Image Container with rounded outline */}
                <div className="relative aspect-[2.9/3] overflow-hidden m-2 bg-gray-100">
                    <Image
                        src={product.imageUrl || PLACEHOLDER_IMAGE}
                        alt={"/images/loo.png"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                        priority={false}
                    />


                    {badge && (
                        <Badge className="absolute top-3 left-3 bg-white text-black hover:bg-white border-0 shadow-md uppercase tracking-wide text-xs">
                            {badge}
                        </Badge>
                    )}


                    {/* Hover CTAs */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            onClick={handleWishlistClick}
                            size="icon"
                            variant="secondary"
                            className={`rounded-full h-10 w-10 bg-white hover:bg-white shadow-md transition-colors ${
                                isWishlisted 
                                    ? 'text-red-500 hover:text-red-600' 
                                    : 'hover:text-red-500'
                            }`}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
                        </Button>
                       =
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                        <Button
                            className="w-full rounded-none bg-black text-white py-6 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={16} />
                            Add to Cart
                        </Button>
                    </div>
                </div>

                <CardContent className="p-4 space-y-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {product.brandName}
                    </p>

                    <h3 className="text-sm font-normal text-gray-900 group-hover:underline line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-sm font-medium text-gray-900 pt-1">
                        {formatCurrency(product.basePrice)}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCardComponent;