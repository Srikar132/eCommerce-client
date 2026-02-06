/**
 * Utility functions for product variants
 */

export type StockStatusType = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface StockStatusResult {
    message: string;
    type: StockStatusType;
}

/**
 * Get stock status message and type based on quantity
 * @param stockQuantity - The current stock quantity
 * @returns Object with message and type
 */
export function getStockStatusMessage(stockQuantity: number): StockStatusResult {
    if (stockQuantity === 0) {
        return {
            message: 'Out of Stock',
            type: 'out-of-stock'
        };
    } else if (stockQuantity <= 5) {
        return {
            message: `Only ${stockQuantity} left`,
            type: 'low-stock'
        };
    } else {
        return {
            message: 'In Stock',
            type: 'in-stock'
        };
    }
}

/**
 * Check if a variant is available for purchase
 * @param stockQuantity - The current stock quantity
 * @returns Boolean indicating if variant is available
 */
export function isVariantAvailable(stockQuantity: number): boolean {
    return stockQuantity > 0;
}

/**
 * Format variant name from options
 * @param options - Object with variant option key-value pairs
 * @returns Formatted variant name string
 * @example formatVariantName({ size: 'M', color: 'Blue' }) => "M / Blue"
 */
export function formatVariantName(options: Record<string, string>): string {
    return Object.values(options).filter(Boolean).join(' / ');
}

/**
 * Parse variant SKU to extract variant options
 * @param sku - Product SKU string
 * @returns Object with parsed variant options
 * @example parseSKU('TSHIRT-M-BLU') => { size: 'M', color: 'BLU' }
 */
export function parseSKU(sku: string): Record<string, string> {
    const parts = sku.split('-');
    // Basic parsing - adjust based on your SKU structure
    return {
        code: parts[0] || '',
        variant1: parts[1] || '',
        variant2: parts[2] || ''
    };
}

/**
 * Get available colors for a specific size
 * @param variants - Array of product variants
 * @param size - The size to check
 * @returns Array of available color names
 */
export function getAvailableColorsForSize(
    variants: Array<{ color: string; size: string; stockQuantity: number }>,
    size: string
): string[] {
    return variants
        .filter(variant => variant.size === size && variant.stockQuantity > 0)
        .map(variant => variant.color)
        .filter((color, index, self) => self.indexOf(color) === index); // Remove duplicates
}

/**
 * Get available sizes for a specific color
 * @param variants - Array of product variants
 * @param color - The color to check
 * @returns Array of available size names
 */
export function getAvailableSizesForColor(
    variants: Array<{ color: string; size: string; stockQuantity: number }>,
    color: string
): string[] {
    return variants
        .filter(variant => variant.color === color && variant.stockQuantity > 0)
        .map(variant => variant.size)
        .filter((size, index, self) => self.indexOf(size) === index); // Remove duplicates
}
