// src/components/product/ProductActions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
    onAddToCart: () => void;
    disabled?: boolean;
    isCustomizable?: boolean;
    productSlug?: string;
    selectedVariantId?: string;
    isInCart?: boolean;
    category?: string;
}

export default function ProductActions({
    onAddToCart,
    disabled,
    isCustomizable = false,
    productSlug,
    selectedVariantId,
    isInCart,
    category
}: ProductActionsProps) {
    const router = useRouter();

    const handleCustomize = () => {
        if (!selectedVariantId) {
            alert("Please select a color and size first");
            return;
        }
        if (productSlug && selectedVariantId) {
            router.push(`/customization/${productSlug}?variantId=${selectedVariantId}&category=${category}`);
        }
    };

    return (
        <div className="space-y-4 pt-4">
            {/* CUSTOMIZATION BUTTON */}
            {isCustomizable && (
                <button
                    onClick={handleCustomize}
                    className="w-full py-5 bg-primary hover:bg-opacity-90 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary/25"
                >
                    <span className="material-icons-outlined">auto_awesome</span>
                    Personalize with Embroidery
                </button>
            )}

            {/* ADD TO CART / GO TO CART BUTTON */}
            <button
                onClick={isInCart ? () => router.push("/cart") : onAddToCart}
                disabled={!isInCart && disabled}
                className="w-full py-5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-icons-outlined">shopping_bag</span>
                {isInCart ? 'View Cart' : 'Buy Plain Base'}
            </button>
        </div>
    );
}