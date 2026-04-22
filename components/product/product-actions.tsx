// src/components/product/ProductActions.tsx
"use client";

import React, { useState } from "react";
import { ShoppingBag, Loader2, Minus, Plus } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import CustomButton2 from "@/components/ui/custom-button-2";

interface ProductActionsProps {
    onAddToCart: (quantity: number) => void;
    onBuyNow?: (quantity: number) => void;
    disabled?: boolean;
    isAddingToCart?: boolean;
}

export default function ProductActions({
    onAddToCart,
    onBuyNow,
    disabled,
    isAddingToCart,
}: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="w-full space-y-4">
            {/* ROW 1: Quantity + Add to Cart */}
            <div className="flex items-center gap-3 w-full">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between px-4 h-12 bg-background border border-border rounded-full min-w-[110px] shadow-sm">
                    <button
                        onClick={decrement}
                        disabled={disabled || quantity <= 1}
                        className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                    >
                        <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                        onClick={increment}
                        disabled={disabled}
                        className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <CustomButton2
                    bgColor="#EEEEEE"
                    fillColor="#000000"
                    textColor="#000000"
                    textHoverColor="#ffffff"
                    onClick={() => onAddToCart(quantity)}
                    disabled={disabled || isAddingToCart}
                    className="flex-1 h-12 border-transparent"
                >
                    {isAddingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <span className="flex items-center gap-2">
                            <ShoppingBag size={16} />
                            Add To Cart
                        </span>
                    )}
                </CustomButton2>
            </div>

            {/* ROW 2: Buy It Now Button */}
            {onBuyNow && (
                <CustomButton
                    bgColor="#000000"
                    circleColor="#ffffff"
                    textColor="#ffffff"
                    textHoverColor="#000000"
                    circleSize={48}
                    onClick={() => onBuyNow(quantity)}
                    disabled={disabled || isAddingToCart}
                    className="w-full justify-between h-14 shadow-lg"
                >
                    Buy It Now
                </CustomButton>
            )}
        </div>
    );
}