// components/cart/product-card.tsx
import React from 'react';
import { cartProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from "next/image";

interface ProductCardProps {
    product: cartProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="flex-shrink-0 w-[140px] sm:w-[165px] cursor-pointer group">
        <div className="mb-2 sm:mb-3 overflow-hidden bg-gray-50">
            <Image
                src={product.image}
                alt={product.name}
                width={230}
                height={230}
                className="w-full h-[180px] sm:h-[220px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <h4 className="text-xs sm:text-sm tracking-wide font-medium mb-1 sm:mb-2 line-clamp-1 leading-relaxed">{product.name}</h4>
        <p className="text-xs sm:text-sm font-semibold">{formatPrice(product.price)}</p>
    </div>
);