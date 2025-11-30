// components/cart/quantity-selector.tsx
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
                                                                      quantity,
                                                                      onIncrease,
                                                                      onDecrease
                                                                  }) => (
    <div className="inline-flex items-center border border-gray-300 rounded-sm w-full sm:w-auto">
        <Button
            variant="ghost"
            size="sm"
            onClick={onDecrease}
            className="h-9 w-9 sm:w-9 flex-1 sm:flex-none p-0 rounded-none hover:bg-gray-50"
        >
            <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="px-3 sm:px-4 text-sm min-w-[3rem] text-center font-medium">{quantity}</span>
        <Button
            variant="ghost"
            size="sm"
            onClick={onIncrease}
            className="h-9 w-9 sm:w-9 flex-1 sm:flex-none p-0 rounded-none hover:bg-gray-50"
        >
            <Plus className="h-3.5 w-3.5" />
        </Button>
    </div>
);