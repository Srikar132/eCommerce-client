"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';
import { PLACEHOLDER_IMAGE } from '@/constants';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


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
    const router = useRouter();

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

    // Get unique colors from variants
    const uniqueColors = useMemo(() => {
        if (!product.variants?.length) return [];
        const seen = new Set<string>();
        return product.variants.filter(v => {
            if (!v.colorHex || seen.has(v.colorHex)) return false;
            seen.add(v.colorHex);
            return true;
        }).slice(0, 1).map(v => ({ color: v.color, hex: v.colorHex! }));
    }, [product.variants]);

    return (
        <div className="group flex flex-col overflow-hidden">
            {/* Image Container */}
            <div
                className="relative cursor-pointer aspect-3/4 overflow-hidden bg-muted"
                onMouseLeave={() => setCurrentImageIndex(0)}
            >
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

                {/* Invisible hover zones to switch images (desktop) */}
                {images.length > 1 && (
                    <div className="absolute inset-0 z-5 hidden sm:flex">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className="flex-1 h-full cursor-pointer"
                                onMouseEnter={() => setCurrentImageIndex(index)}
                                onClick={() => router.push(`/products/${product.slug}`)}
                            />
                        ))}
                    </div>
                )}

                {/* View / Quick Look Button — eye icon on mobile, full button on hover for desktop */}
                <Link
                    href={`/products/${product.slug}`}
                    className="absolute bottom-2 right-2 z-10 p-1.5 sm:hidden flex items-center text-foreground/80 hover:text-foreground transition-all duration-200"
                >
                    <Eye className="w-3.5 h-3.5" />
                </Link>

                {/* Quick View hover overlay (desktop) */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
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

                {/* Image Navigation Dots (only if multiple images) */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                                        ? "bg-white w-5"
                                        : "bg-white/50 hover:bg-white/75"
                                )}
                                aria-label={`View image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="pt-2.5 sm:pt-3 space-y-1.5">
                {/* Name + Wishlist row */}
                <div className="flex items-start gap-2">
                    <Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <button
                        onClick={handleWishlistClick}
                        disabled={isTogglingWishlist}
                        className="shrink-0 mt-0.5 p-0.5"
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all",
                                isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"
                            )}
                            strokeWidth={1.5}
                        />
                    </button>
                </div>

                {/* Price */}
                <Link href={`/products/${product.slug}`}>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <p className="text-sm sm:text-base font-semibold text-foreground">
                            {formatCurrency(product.basePrice)}
                        </p>
                    </div>
                </Link>

                {/* Color swatch */}
                {uniqueColors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                        <span
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border"
                            style={{ backgroundColor: uniqueColors[0].hex }}
                            title={uniqueColors[0].color}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCardComponent;