// src/components/product/ProductActions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart, Heart, Loader2 } from "lucide-react";

interface ProductActionsProps {
    onAddToCart: () => void;
    onToggleWishlist: () => void;
    disabled?: boolean;
    isInCart?: boolean;
    isInWishlist?: boolean;
    isAddingToCart?: boolean;
    isTogglingWishlist?: boolean;
}

export default function ProductActions({
    onAddToCart,
    onToggleWishlist,
    disabled,
    isInCart,
    isInWishlist,
    isAddingToCart,
    isTogglingWishlist,
}: ProductActionsProps) {
    const router = useRouter();


    return (
        <div className="space-y-4 pt-4 flex gap-3">
            {/* ADD TO CART / GO TO CART BUTTON */}
            <Button
                onClick={isInCart ? () => router.push("/cart") : onAddToCart}
                disabled={disabled || isAddingToCart}
                size="lg"
                className="flex-1 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {isAddingToCart ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                    </>
                ) : isInCart ? (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        View Cart
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                    </>
                )}
            </Button>

            {/* WISHLIST BUTTON */}
            <Button
                onClick={onToggleWishlist}
                disabled={isTogglingWishlist}
                variant={isInWishlist ? "default" : "outline"}
                size="lg"
                className={`h-14 flex-1 px-6 border-2 transition-all duration-300 group ${
                    isInWishlist 
                        ? "shadow-lg hover:shadow-xl" 
                        : "hover:bg-primary/5 hover:border-primary"
                }`}
            >
                {isTogglingWishlist ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="ml-2 font-semibold">Updating...</span>
                    </>
                ) : (
                    <>
                        <Heart 
                            className={`w-5 h-5 transition-all duration-300 ${
                                isInWishlist 
                                    ? "fill-current" 
                                    : "group-hover:fill-primary group-hover:text-primary"
                            }`} 
                        />
                        <span className="ml-2 font-semibold">
                            {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                        </span>
                    </>
                )}
            </Button>
        </div>
    );
}