// src/components/product/ProductActions.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
    onAddToCart: () => void;
    disabled?: boolean;
    isCustomizable?: boolean;
    productSlug?: string;
}

export default function ProductActions({ 
    onAddToCart, 
    disabled, 
    isCustomizable = false,
    productSlug 
}: ProductActionsProps) {
    const router = useRouter();

    const handleCustomize = () => {
        if (productSlug) {
            router.push(`/customization?product=${productSlug}`);
        }
    };

    return (
        <div className="pdp-product-actions">
            {/* CUSTOMIZATION BUTTON */}
            {isCustomizable && (
                <button
                    onClick={handleCustomize}
                    className="pdp-customize-btn group"
                >
                    <Sparkles className="w-5 h-5" />
                    <span>Go to Customization</span>
                    <span className="pdp-customize-arrows">
                        <span>›</span>
                        <span>›</span>
                        <span>›</span>
                    </span>
                </button>
            )}
            
            {/* ADD TO CART BUTTON */}
            <button
                onClick={onAddToCart}
                disabled={disabled}
                className="pdp-add-to-cart-btn"
            >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to cart
            </button>
        </div>
    );
}