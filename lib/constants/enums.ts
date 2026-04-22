export const PRODUCT_SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "FREE_SIZE",
] as const;
 
export const PRODUCT_COLORS = [
    "BLACK",
    "WHITE",
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "ORANGE",
    "PURPLE",
    "PINK",
    "BROWN",
    "GREY",
    "NAVY",
    "BEIGE",
    "MAROON",
    "OLIVE",
    "TEAL",
    "CREAM",
    "MULTICOLOR",
] as const;
 
// Derive union types from the tuples — use these anywhere you need the type
export type ProductSize  = typeof PRODUCT_SIZES[number];
export type ProductColor = typeof PRODUCT_COLORS[number];