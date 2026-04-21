"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';
import { PLACEHOLDER_IMAGE } from '@/constants';
import { useMemo, useState } from 'react';
import CustomButton from '../ui/custom-button';
import CustomButton2 from '../ui/custom-button-2';

type Props = {
    product: Product;
    onAddToCartClick: () => void;
    onQuickViewClick: () => void;
    isUpdating?: boolean;
};

const ProductCard = ({
    product,
    onAddToCartClick,
    onQuickViewClick,
    isUpdating,
}: Props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images && product.images.length > 0
        ? product.images
        : [{ imageUrl: PLACEHOLDER_IMAGE, altText: product.name }];

    const uniqueColors = useMemo(() => {
        if (!product.variants?.length) return [];
        const seen = new Set<string>();
        return product.variants.filter(v => {
            if (!v.colorHex || seen.has(v.colorHex)) return false;
            seen.add(v.colorHex);
            return true;
        }).slice(0, 3).map(v => ({ color: v.color, hex: v.colorHex! }));
    }, [product.variants]);

    return (
        <div className="group flex flex-col w-full">
            {/* Image Container with Responsive Rounded Corners */}
            <div
                className="relative cursor-pointer aspect-[3/4] rounded-[24px] lg:rounded-[40px] overflow-hidden bg-[#F0F2F5] shadow-sm"
                onMouseLeave={() => setCurrentImageIndex(0)}
            >
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={images[currentImageIndex].imageUrl}
                        alt={images[currentImageIndex].altText || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        priority={false}
                    />
                </Link>


                {/* Quick Look / Search (Top Right) - Smaller on Mobile */}
                <div className="absolute top-4 lg:top-5 right-4 lg:right-5 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0">
                    <CustomButton2
                        className="w-10 h-10 lg:w-12 lg:h-12 !p-0 shadow-xl border-none bg-white"
                        fillColor="#000000"
                        textColor="#000000"
                        textHoverColor="#ffffff"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickViewClick();
                        }}
                    >
                        <Search className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={1.5} />
                    </CustomButton2>
                </div>

                {/* Add to Cart Overlay (Bottom Center) - Optimized for Mobile */}
                <div className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] lg:w-[85%] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0">
                    <CustomButton
                        bgColor="#ffffff"
                        circleColor="#000000"
                        textColor="#000000"
                        textHoverColor="#ffffff"
                        className="w-full justify-between shadow-xl h-10 lg:h-12"
                        circleSize={36}
                        disabled={isUpdating}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCartClick();
                        }}
                    >
                        <span className="text-xs lg:text-sm font-bold tracking-tight">
                            {isUpdating ? "..." : "Add to Bag"}
                        </span>
                    </CustomButton>
                </div>
            </div>

            {/* Product Details */}
            <div className="pt-4 space-y-1.5 px-1">
                <Link href={`/products/${product.slug}`} className="block group/link">
                    <h3 className="text-[15px] lg:text-[17px] font-bold text-black tracking-tight leading-tight group-hover/link:text-accent transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between">
                    <p className="text-base lg:text-lg font-bold text-black">
                        {formatCurrency(product.basePrice)}
                    </p>
                </div>

                {/* Color Swatches - Smaller on mobile */}
                {uniqueColors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                        {uniqueColors.map((c, i) => (
                            <span
                                key={i}
                                className="w-5 h-5 lg:w-6 lg:h-6 rounded-sm border border-black/5 cursor-pointer hover:ring-1 ring-black/20 transition-all"
                                style={{ backgroundColor: c.hex }}
                                title={c.color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;