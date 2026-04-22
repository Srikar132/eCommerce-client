import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { Product, ProductVariant } from "@/types/product";

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
    priceModifier: number;
}

interface UseVariantSelectionProps {
    product: Product | undefined;
    variants: ProductVariant[];
}

// Use useLayoutEffect on client, no-op on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => { };

export function useVariantSelection({ product, variants }: UseVariantSelectionProps) {
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

    // Track previous colors to detect when they change
    const prevColorsRef = useRef(colors);

    // Initialize with first available color
    const [selectedColor, setSelectedColor] = useState<string>(() =>
        colors.length > 0 ? colors[0].color : ""
    );

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
                priceModifier: v.priceModifier
            }));
    }, [variants, selectedColor]);

    // Track previous sizes to detect when they change
    const prevSizesRef = useRef(sizes);

    // Initialize with first available size
    const [selectedSize, setSelectedSize] = useState<string>(() =>
        sizes.length > 0 ? sizes[0].size : ""
    );

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
        const priceModifier = selectedVariant?.priceModifier || 0;
        return product.basePrice + priceModifier;
    }, [product, selectedVariant]);

    // Auto-select first color when colors become available (synchronous update before paint)
    useIsomorphicLayoutEffect(() => {
        if (!selectedColor && colors.length > 0 && colors !== prevColorsRef.current) {
            setSelectedColor(colors[0].color);
        }
        prevColorsRef.current = colors;
    }, [colors, selectedColor]);

    // Auto-select first size when sizes become available or color changes
    useIsomorphicLayoutEffect(() => {
        if (sizes.length > 0 && !sizes.find(s => s.size === selectedSize) && sizes !== prevSizesRef.current) {
            setSelectedSize(sizes[0].size);
        }
        prevSizesRef.current = sizes;
    }, [sizes, selectedSize]);

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