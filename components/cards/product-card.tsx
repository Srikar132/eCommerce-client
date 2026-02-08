"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';
import { PLACEHOLDER_IMAGE } from '@/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';


type Props = {
    product: Product;
    onToggleWishlist?: (productId: string) => void;
    isInWishlist?: boolean;
    isTogglingWishlist?: boolean;
};


const ProductCardComponent = ({
    product,
    onToggleWishlist,
    isInWishlist = false,
    isTogglingWishlist = false,
}: Props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const images = product.images && product.images.length > 0 
        ? product.images 
        : [{ imageUrl: PLACEHOLDER_IMAGE, altText: product.name }];

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleWishlist) {
            onToggleWishlist(product.id);
        }
    };

    return (
        <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300 bg-card rounded-lg">
            {/* Image Container with Carousel */}
            <div className="relative aspect-3/4 overflow-hidden bg-muted">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={images[currentImageIndex].imageUrl}
                        alt={images[currentImageIndex].altText || product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={false}
                    />
                </Link>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    disabled={isTogglingWishlist}
                    className={cn(
                        "absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200",
                        "lg:opacity-0 lg:group-hover:opacity-100",
                        isInWishlist && "opacity-100"
                    )}
                >
                    <Heart 
                        className={cn(
                            "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all",
                            isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700"
                        )} 
                    />
                </button>

                {/* Image Navigation Dots (only if multiple images) */}
                {images.length > 1 && (
                    <div 
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onMouseEnter={(e) => e.stopPropagation()}
                    >
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                }}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-200",
                                    currentImageIndex === index 
                                        ? "bg-white w-6" 
                                        : "bg-white/50 hover:bg-white/75"
                                )}
                                aria-label={`View image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Quick Add to Cart (hover overlay) */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Link href={`/products/${product.slug}`}>
                        <Button
                            variant="default"
                            className="w-full rounded-none h-12 text-sm font-medium uppercase tracking-wide flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Quick View
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Product Details */}
            <Link href={`/products/${product.slug}`}>
                <CardContent className="p-2.5 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2">
                    {/* Product Name */}
                    <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 min-h-8 sm:min-h-10 leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <p className="text-sm sm:text-base font-semibold text-foreground">
                            {formatCurrency(product.basePrice)}
                        </p>
                    </div>

                    {/* Additional Info */}
                    {product.material && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Material: {product.material}
                        </p>
                    )}
                </CardContent>
            </Link>
        </Card>
    );
};

export default ProductCardComponent;