// components/cart/recently-viewed.tsx
import React from 'react';
import { cartProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils/utils';

interface RecentlyViewedProps {
    products: cartProduct[];
    cartItemIds: string[];
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products, cartItemIds }) => (
    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base font-medium tracking-wide">Recently Viewed</h2>
            <button className="text-xs sm:text-sm font-medium underline hover:no-underline">Clear All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {products.map((product, index) => {
                const isInBag = cartItemIds.includes(product.id);
                return (
                    <div key={product.id} className="text-center cursor-pointer group">
                        <div className="relative mb-2 sm:mb-3">
                            {isInBag && (
                                <div className="absolute top-0 left-0 bg-black text-white text-[10px] sm:text-[11px] px-2 sm:px-3 py-1 sm:py-1.5 font-medium tracking-wider">
                                    IN BAG
                                </div>
                            )}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[120px] sm:h-[140px] lg:h-[160px] object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                            />
                        </div>
                        <p className="text-xs sm:text-sm font-bold mb-1">{formatPrice(product.price)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{index === 0 ? 'Today' : 'Yesterday'}</p>
                    </div>
                );
            })}
        </div>
    </div>
);