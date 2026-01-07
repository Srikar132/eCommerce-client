// components/cart/saved-for-later-card.tsx
import React from 'react';
import { cartProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from "next/image";

interface SavedForLaterCardProps {
    item: cartProduct;
    onMoveToBag: (id: string) => void;
    onRemove: (id: string) => void;
}

export const SavedForLaterCard: React.FC<SavedForLaterCardProps> = ({
    item,
    onMoveToBag,
    onRemove,
}) => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4 sm:py-6 border-b">
        <div className="flex-shrink-0 mx-auto sm:mx-0">
            <Image
                src={item.image}
                alt={item.name}
                width={150}
                height={150}
                className="w-28 h-36 sm:w-32 sm:h-40 object-cover "
            />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mb-2">
                <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium mb-2 leading-snug">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 sm:min-w-[120px]">
                    <p className="text-sm sm:text-base font-bold mb-1">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500">{item.id}</p>
                </div>
            </div>

            <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6">
                <button
                    onClick={() => onMoveToBag(item.id)}
                    className="text-xs sm:text-sm font-medium underline hover:no-underline"
                >
                    Move to Bag
                </button>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-xs sm:text-sm font-medium underline hover:no-underline"
                >
                    Remove
                </button>
            </div>
        </div>
    </div>
);