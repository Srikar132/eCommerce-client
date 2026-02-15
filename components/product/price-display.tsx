import { ProductVariant } from "@/types/product";

interface PriceDisplayProps {
    basePrice: number;
    finalPrice: number;
    selectedVariant?: ProductVariant;
    selectedColor?: string;
    currency?: string;
    showBreakdown?: boolean;
}

// Format price in Indian number system (e.g., 1,00,000)
const formatIndianPrice = (price: number): string => {
    return price.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    });
};

export default function PriceDisplay({
    finalPrice,
    selectedVariant,
    selectedColor,
    currency = "INR",
    showBreakdown = true
}: PriceDisplayProps) {
    const currencySymbol = currency === "INR" ? "₹" : "$";
    const hasAdditionalPrice = selectedVariant && selectedVariant.additionalPrice > 0;

    return (
        <div className="space-y-1">
            {/* Main Price */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    {currencySymbol}{formatIndianPrice(finalPrice)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                    (Incl. of all taxes)
                </span>
            </div>

            {/* Variant Price Note */}
            {hasAdditionalPrice && showBreakdown && selectedColor && (
                <p className="text-xs text-muted-foreground">
                    +{currencySymbol}{formatIndianPrice(selectedVariant.additionalPrice)} for {selectedColor} variant
                </p>
            )}
        </div>
    );
}