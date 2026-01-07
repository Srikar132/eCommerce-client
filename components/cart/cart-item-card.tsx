// components/cart/cart-item-card.tsx
import React from 'react';
import { CartItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { QuantitySelector } from '@/components/cart/quantity-selector';
import { SizeSelector } from '@/components/cart/size-selector';

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (id: string, quantity: number) => void;
    onSaveForLater: (id: string) => void;
    onRemove: (id: string) => void;
    onSizeChange: (id: string, size: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
    item,
    onQuantityChange,
    onSaveForLater,
    onRemove,
    onSizeChange,
}) => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4 sm:py-6 border-b">
        <div className="flex-shrink-0 mx-auto sm:mx-0">
            <img
                src={item.image}
                alt={item.name}
                className="w-28 h-36 sm:w-32 sm:h-40 object-cover bg-gray-100"
            />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mb-3">
                <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium mb-2 leading-snug">{item.name}</h3>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded">
                        {item.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 sm:min-w-[120px]">
                    <p className="text-sm sm:text-base font-bold mb-1">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500">{item.id}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8 mt-4 sm:mt-6">
                <div className="w-full sm:w-auto">
                    <label className="text-xs font-medium text-gray-900 block mb-2">Size</label>
                    <SizeSelector
                        selectedSize={item.size || ''}
                        onChange={(size) => onSizeChange(item.id, size)}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <label className="text-xs font-medium text-gray-900 block mb-2">Quantity</label>
                    <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
                        onDecrease={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    />
                </div>
            </div>

            <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6">
                <button
                    onClick={() => onSaveForLater(item.id)}
                    className="text-xs sm:text-sm font-medium underline hover:no-underline"
                >
                    Save For Later
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
