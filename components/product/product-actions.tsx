// src/components/product/ProductActions.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductActionsProps {
    onAddToCart: () => void;
    disabled?: boolean;
}

export default function ProductActions({ onAddToCart, disabled }: ProductActionsProps) {
    return (
        <div className="pdp-product-actions">
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