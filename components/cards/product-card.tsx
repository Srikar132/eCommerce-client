"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductResponse } from '@/types';

type UUID = string;

type Props = {
    product: ProductResponse;
    onMouseEnter?: () => void;
    onAddToWishlist?: (id: UUID) => void;
    onQuickView?: (product: ProductResponse) => void;
    onAddToCart?: (id: UUID) => void;
};

const PLACEHOLDER_IMAGE = '/placeholder-product.jpg';
const IMAGE_ROTATION_INTERVAL = 800;

const ProductCardComponent = ({
    product,
    onMouseEnter,
    onAddToWishlist,
    onQuickView,
    onAddToCart
}: Props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Memoize images array to prevent recalculation
    const images = useMemo(() => {
        if (!product.variants?.length) {
            return [PLACEHOLDER_IMAGE];
        }

        const uniqueImages = new Set<string>();
        
        product.variants.forEach(variant => {
            if (!variant.images?.length) return;

            // Sort and add images in one pass
            const sortedImages = [...variant.images].sort((a, b) => 
                a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
            );
            
            sortedImages.forEach(img => uniqueImages.add(img.imageUrl));
        });
        
        return uniqueImages.size > 0 ? Array.from(uniqueImages) : [PLACEHOLDER_IMAGE];
    }, [product.variants]);

    const hasMultipleImages = images.length > 1;

    // Auto-rotate images on hover
    useEffect(() => {
        if (!isHovering || !hasMultipleImages) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, IMAGE_ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [isHovering, hasMultipleImages, images.length]);

    // Reset to first image when not hovering
    useEffect(() => {
        if (!isHovering) {
            setCurrentImageIndex(0);
        }
    }, [isHovering]);

    // Memoize formatted price
    const formattedPrice = useMemo(
        () => (product.basePrice / 100).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        }),
        [product.basePrice]
    );

    const badge = product.isCustomizable ? 'Customizable' : undefined;

    // Memoize event handlers to prevent recreating on each render
    const handleWishlistClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToWishlist?.(product.id);
    }, [onAddToWishlist, product.id]);

    const handleQuickView = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView?.(product);
    }, [onQuickView, product]);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product.id);
    }, [onAddToCart, product.id]);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        onMouseEnter?.();
    }, [onMouseEnter]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    return (
        <Link 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href={`/products/${product.slug}`} 
            className="block"
        >
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                {/* Image Container with rounded outline */}
                <div className="relative aspect-[2.9/3] overflow-hidden rounded-3xl m-2 shadow-2xl bg-gray-100">
                    <Image
                        src={images[currentImageIndex]}
                        alt={product.name}
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

                    {/* Image indicators - show only if multiple images */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex 
                                            ? 'w-6 bg-white' 
                                            : 'w-1.5 bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Hover CTAs */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            onClick={handleWishlistClick}
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-10 w-10 bg-white hover:bg-white hover:text-red-500 shadow-md transition-colors"
                            aria-label="Add to wishlist"
                        >
                            <Heart size={18} />
                        </Button>
                        <Button
                            onClick={handleQuickView}
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-10 w-10 bg-white hover:bg-white hover:text-gray-900 shadow-md transition-colors"
                            aria-label="Quick view"
                        >
                            <Eye size={18} />
                        </Button>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                            onClick={handleAddToCart}
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
                        {formattedPrice}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCardComponent;