// src/components/product/ProductActions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart } from "lucide-react";

interface ProductActionsProps {
    onAddToCart: () => void;
    disabled?: boolean;
    isInCart?: boolean;
}

export default function ProductActions({
    onAddToCart,
    disabled,
    isInCart,
}: ProductActionsProps) {
    const router = useRouter();

    return (
        <div className="space-y-4 pt-4">
            {/* ADD TO CART / GO TO CART BUTTON */}
            <Button
                onClick={isInCart ? () => router.push("/cart") : onAddToCart}
                disabled={!isInCart && disabled}
                size="lg"
                className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {isInCart ? (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        View Cart
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        Buy Plain Base
                    </>
                )}
            </Button>
        </div>
    );
}