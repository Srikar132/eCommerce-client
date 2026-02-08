import { Badge } from "@/components/ui/badge";
import { ProductVariant } from "@/types/product";

interface PriceDisplayProps {
    basePrice: number;
    finalPrice: number;
    selectedVariant?: ProductVariant;
    selectedColor?: string;
    currency?: string;
    showBreakdown?: boolean;
}

export default function PriceDisplay({
    basePrice,
    finalPrice,
    selectedVariant,
    selectedColor,
    currency = "INR",
    showBreakdown = true
}: PriceDisplayProps) {
    const currencySymbol = currency === "INR" ? "₹" : "$";
    const hasAdditionalPrice = selectedVariant && selectedVariant.additionalPrice > 0;

    return (
        <div className="space-y-2">
            {/* Main Price */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">
                    {currencySymbol}{finalPrice.toFixed(2)}
                </span>
                
                {hasAdditionalPrice && showBreakdown && (
                    <span className="text-sm text-muted-foreground line-through">
                        {currencySymbol}{basePrice.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Price Breakdown Badge */}
            {hasAdditionalPrice && showBreakdown && selectedColor && (
                <Badge variant="secondary" className="text-xs font-normal">
                    Base: {currencySymbol}{basePrice.toFixed(2)} + {currencySymbol}
                    {selectedVariant.additionalPrice.toFixed(2)} for {selectedColor}
                </Badge>
            )}

        </div>
    );
}