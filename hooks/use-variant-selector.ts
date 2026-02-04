import { useState, useEffect, useMemo } from "react";
import { Product , ProductVariant } from "@/types/product";

// Simple types
export interface ColorOption {
    color: string;
    colorHex: string;
}

export interface SizeOption {
    size: string;
    variantId: string;
    inStock: boolean;
    stockQuantity: number;
    additionalPrice: number;
}

interface UseVariantSelectionProps {
    product: Product | undefined;
    variants: ProductVariant[];
}

export function useVariantSelection({ product, variants }: UseVariantSelectionProps) {
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");

    // Get unique colors
    const colors = useMemo<ColorOption[]>(() => {
        const colorMap = new Map<string, ColorOption>();

        variants.forEach(variant => {
            if (!variant.isActive) return;

            if (!colorMap.has(variant.color)) {
                colorMap.set(variant.color, {
                    color: variant.color,
                    colorHex: variant.colorHex || '#000000',
                });
            }
        });

        return Array.from(colorMap.values());
    }, [variants]);

    // Get sizes for selected color
    const sizes = useMemo<SizeOption[]>(() => {
        if (!selectedColor) return [];

        return variants
            .filter(v => v.color === selectedColor && v.isActive)
            .map(v => ({
                size: v.size,
                variantId: v.id,
                inStock: v.stockQuantity > 0,
                stockQuantity: v.stockQuantity,
                additionalPrice: v.additionalPrice
            }));
    }, [variants, selectedColor]);

    // Find selected variant
    const selectedVariant = useMemo(() => {
        if (!selectedColor || !selectedSize) return undefined;

        return variants.find(
            v => v.color === selectedColor && 
                 v.size === selectedSize && 
                 v.isActive
        );
    }, [variants, selectedColor, selectedSize]);

    // Calculate final price
    const finalPrice = useMemo(() => {
        if (!product) return 0;
        const additionalPrice = selectedVariant?.additionalPrice || 0;
        return product.basePrice + additionalPrice;
    }, [product, selectedVariant]);

    // Auto-select first color
    useEffect(() => {
        if (!selectedColor && colors.length > 0) {
            setSelectedColor(colors[0].color);
        }
    }, [colors, selectedColor]);

    // Handle color change (resets size)
    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setSelectedSize("");
    };

    return {
        // Selection state
        selectedColor,
        selectedSize,
        selectedVariant,
        
        // Available options
        colors,
        sizes,
        
        // Computed values
        finalPrice,
        inStock: selectedVariant ? selectedVariant.stockQuantity > 0 : false,
        
        // Actions
        setColor: handleColorChange,
        setSize: setSelectedSize,
        reset: () => {
            setSelectedColor("");
            setSelectedSize("");
        }
    };
}