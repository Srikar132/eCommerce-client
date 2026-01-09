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
            router.push(`/customization/${productSlug}`);
        }
    };

    return (
        <div className="space-y-3">
            {/* CUSTOMIZATION BUTTON */}
            {isCustomizable && (
                <Button
                    onClick={handleCustomize}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-medium group relative overflow-hidden border-2 border-accent hover:bg-accent/10 transition-all duration-300"
                >
                    <Sparkles className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                    <span>Customize Your Design</span>
                    <span className="ml-auto flex gap-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <span>›</span>
                        <span>›</span>
                        <span>›</span>
                    </span>
                </Button>
            )}
            
            {/* ADD TO CART BUTTON */}
            <Button
                onClick={onAddToCart}
                disabled={disabled}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
            </Button>
        </div>
    );
}