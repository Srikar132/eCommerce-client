// components/cart/order-summary.tsx
import React from 'react';
import { formatPrice } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
    total: number;
    deliveryCost: number;
    onCheckout: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    total,
    deliveryCost,
    onCheckout,
}) => (
    <div className="bg-gray-50 p-6 sm:p-8 border rounded-sm w-full">
        <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-baseline mb-2 sm:mb-3">
                <span className="text-sm sm:text-base font-medium">Total:</span>
                <span className="text-2xl sm:text-3xl font-bold">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed text-left sm:text-right">
                Excluding Standard Delivery<br />
                (Normally {formatPrice(deliveryCost)})
            </p>
        </div>
        <Button
            onClick={onCheckout}
            className="w-full bg-black hover:bg-gray-900 text-white h-11 sm:h-12 font-medium tracking-widest text-xs sm:text-sm"
        >
            CHECKOUT
        </Button>
    </div>
);