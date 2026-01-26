import { useState, useEffect, useMemo } from "react";
import type { ProductVariant, ProductResponse } from "@/types";

export interface ColorGroup {
    color: string;
    colorHex: string;
    sizes: SizeOption[];
}

export interface SizeOption {
    size: string;
    variantId: string;
    inStock: boolean;
    stockQuantity: number;
    additionalPrice: number;
    sku: string;
    isActive: boolean;
}

export interface VariantSelectionState {
    selectedColor: string;
    selectedSize: string;
    selectedVariant: ProductVariant | undefined;
    colorGroups: ColorGroup[];
    availableSizes: SizeOption[];
    finalPrice: number;
    galleryImages: { id: string; url: string | null; alt: string }[];
}

export interface VariantSelectionActions {
    setColor: (color: string) => void;
    setSize: (size: string) => void;
    reset: () => void;
}

interface UseVariantSelectionProps {
    product: ProductResponse | undefined;
    variants: ProductVariant[];
}

export function useVariantSelection({ 
    product, 
    variants 
}: UseVariantSelectionProps): VariantSelectionState & VariantSelectionActions {
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");

    // Group variants by color with memoization
    const colorGroups = useMemo(() => {
        if (!variants.length || !product) return [];
        
        const groups = new Map<string, ProductVariant[]>();
        
        // Only include active variants
        const activeVariants = variants.filter(v => v.isActive);
        
        activeVariants.forEach(variant => {
            if (!groups.has(variant.color)) {
                groups.set(variant.color, []);
            }
            groups.get(variant.color)!.push(variant);
        });

        return Array.from(groups.entries()).map(([color, variantList]) => ({
            color,
            colorHex: variantList[0].colorHex || '#000000',
            sizes: variantList.map(v => ({
                size: v.size,
                variantId: v.id,
                inStock: v.stockQuantity > 0,
                stockQuantity: v.stockQuantity,
                additionalPrice: v.additionalPrice,
                sku: v.sku,
                isActive: v.isActive
            }))
        }));
    }, [variants, product]);

    // Auto-select first available color
    useEffect(() => {
        if (colorGroups.length > 0 && !selectedColor) {
            setSelectedColor(colorGroups[0].color);
        }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    }, [colorGroups, selectedColor]);

    // Find selected variant
    const selectedVariant = useMemo(() => 
        variants.find(v => 
            v.color === selectedColor && v.size === selectedSize
        ), 
        [variants, selectedColor, selectedSize]
    );

    // Get available sizes for selected color
    const availableSizes = useMemo(() => 
        colorGroups.find(g => g.color === selectedColor)?.sizes || [],
        [colorGroups, selectedColor]
    );

    // Calculate final price
    const finalPrice = useMemo(() => {
        if (!product) return 0;
        return product.basePrice + (selectedVariant?.additionalPrice || 0);
    }, [product, selectedVariant]);

    // Get images for selected color
    const galleryImages = useMemo(() => {
        if (!variants.length || !selectedColor || !product) {
            return [{
                id: 'default',
                url: null,
                alt: product?.name || 'Product image'
            }];
        }

        // Get all variants for the selected color
        const colorVariants = variants.filter(v => v.color === selectedColor);
        
        // Find variant with images
        const variantWithImages = colorVariants.find(v => v.images && v.images.length > 0);
        
        if (variantWithImages?.images && variantWithImages.images.length > 0) {
            return variantWithImages.images.map(img => ({
                id: img.id,
                url: img.imageUrl,
                alt: img.altText || `${product.name} - ${selectedColor}`
            }));
        }

        return [{
            id: 'default',
            url: null,
            alt: product.name
        }];
    }, [variants, selectedColor, product]);

    // Actions
    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setSelectedSize(""); // Reset size when color changes
    };

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
    };

    const reset = () => {
        setSelectedColor("");
        setSelectedSize("");
    };

    return {
        // State
        selectedColor,
        selectedSize,
        selectedVariant,
        colorGroups,
        availableSizes,
        finalPrice,
        galleryImages,
        
        // Actions
        setColor: handleColorChange,
        setSize: handleSizeChange,
        reset
    };
}