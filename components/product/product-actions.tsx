// src/components/product/ProductActions.tsx
"use client";

import React, { useSyncExternalStore } from "react";
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

// Built-in React way to check if component is mounted (hydrated)
const useHydrated = () => {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
};

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
    const hydrated = useHydrated();


    return (
        <div className="flex gap-3">
            {/* ADD TO CART / GO TO CART BUTTON */}
            <Button
                onClick={isInCart ? () => router.push("/cart") : onAddToCart}
                disabled={disabled || isAddingToCart}
                size="lg"
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {isAddingToCart ? (
                    <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Adding...
                    </>
                ) : isInCart ? (
                    <>
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        View Cart
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add to Cart
                    </>
                )}
            </Button>

            {/* WISHLIST BUTTON */}
            <Button
                onClick={onToggleWishlist}
                disabled={isTogglingWishlist}
                variant={hydrated && isInWishlist ? "default" : "outline"}
                size="lg"
                className={`h-12 sm:h-14 flex-1 px-4 sm:px-6 border-2 transition-all duration-300 group ${
                    hydrated && isInWishlist 
                        ? "shadow-lg hover:shadow-xl" 
                        : "hover:bg-primary/5 hover:border-primary"
                }`}
            >
                {isTogglingWishlist ? (
                    <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="ml-2 text-sm sm:text-base font-semibold">Updating...</span>
                    </>
                ) : (
                    <>
                        <Heart 
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                                hydrated && isInWishlist 
                                    ? "fill-current" 
                                    : "group-hover:fill-primary group-hover:text-primary"
                            }`} 
                        />
                        <span className="ml-2 text-sm sm:text-base font-semibold">
                            {hydrated && isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                        </span>
                    </>
                )}
            </Button>
        </div>
    );
}