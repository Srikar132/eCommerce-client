import type { ProductVariant } from "@/types";
import type { ColorGroup, SizeOption } from "@/hooks/use-variant-selector";

/**
 * Check if a variant is in stock
 */
export function isVariantInStock(variant: ProductVariant): boolean {
    return variant.isActive && variant.stockQuantity > 0;
}

/**
 * Check if stock is low (less than threshold)
 */
export function isLowStock(stockQuantity: number, threshold: number = 10): boolean {
    return stockQuantity > 0 && stockQuantity < threshold;
}

/**
 * Get all unique colors from variants
 */
export function getUniqueColors(variants: ProductVariant[]): string[] {
    return [...new Set(variants.map(v => v.color))];
}

/**
 * Get all unique sizes from variants
 */
export function getUniqueSizes(variants: ProductVariant[]): string[] {
    return [...new Set(variants.map(v => v.size))];
}

/**
 * Find variants by color
 */
export function getVariantsByColor(
    variants: ProductVariant[], 
    color: string
): ProductVariant[] {
    return variants.filter(v => v.color === color);
}

/**
 * Find variant by color and size
 */
export function findVariant(
    variants: ProductVariant[],
    color: string,
    size: string
): ProductVariant | undefined {
    return variants.find(v => v.color === color && v.size === size);
}

/**
 * Get available colors for a specific size
 */
export function getAvailableColorsForSize(
    variants: ProductVariant[],
    size: string
): string[] {
    return variants
        .filter(v => v.size === size && isVariantInStock(v))
        .map(v => v.color);
}

/**
 * Get available sizes for a specific color
 */
export function getAvailableSizesForColor(
    variants: ProductVariant[],
    color: string
): string[] {
    return variants
        .filter(v => v.color === color && isVariantInStock(v))
        .map(v => v.size);
}

/**
 * Check if a specific color-size combination is available
 */
export function isVariantAvailable(
    variants: ProductVariant[],
    color: string,
    size: string
): boolean {
    const variant = findVariant(variants, color, size);
    return variant ? isVariantInStock(variant) : false;
}

/**
 * Calculate total available stock for a product
 */
export function getTotalStock(variants: ProductVariant[]): number {
    return variants.reduce((total, variant) => {
        if (variant.isActive) {
            return total + variant.stockQuantity;
        }
        return total;
    }, 0);
}

/**
 * Get the price range for all variants
 */
export function getVariantPriceRange(
    variants: ProductVariant[],
    basePrice: number
): { min: number; max: number } {
    if (variants.length === 0) {
        return { min: basePrice, max: basePrice };
    }

    const prices = variants.map(v => basePrice + v.additionalPrice);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}

/**
 * Sort sizes in standard order (XS, S, M, L, XL, XXL, etc.)
 */
export function sortSizes(sizes: string[]): string[] {
    const sizeOrder: { [key: string]: number } = {
        'XXS': 1,
        'XS': 2,
        'S': 3,
        'M': 4,
        'L': 5,
        'XL': 6,
        'XXL': 7,
        'XXXL': 8
    };

    return [...sizes].sort((a, b) => {
        const orderA = sizeOrder[a.toUpperCase()] || 999;
        const orderB = sizeOrder[b.toUpperCase()] || 999;
        return orderA - orderB;
    });
}

/**
 * Get stock status message
 */
export function getStockStatusMessage(stockQuantity: number): {
    message: string;
    type: 'in-stock' | 'low-stock' | 'out-of-stock';
} {
    if (stockQuantity === 0) {
        return { message: 'Out of Stock', type: 'out-of-stock' };
    }
    
    if (isLowStock(stockQuantity)) {
        return { 
            message: `Only ${stockQuantity} left in stock!`, 
            type: 'low-stock' 
        };
    }
    
    return { message: 'In Stock', type: 'in-stock' };
}