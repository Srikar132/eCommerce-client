import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ProductVariant } from "@/types";
import { getAvailableColorsForSize } from "@/utils/variant-utils";

interface VariantAvailabilityInfoProps {
    variants: ProductVariant[];
    selectedColor: string;
    selectedSize: string;
}

export default function VariantAvailabilityInfo({
    variants,
    selectedColor,
    selectedSize
}: VariantAvailabilityInfoProps) {
    // If size is selected but out of stock, show available colors for that size
    if (selectedSize && selectedColor) {
        const selectedVariant = variants.find(
            v => v.color === selectedColor && v.size === selectedSize
        );

        if (selectedVariant && selectedVariant.stockQuantity === 0) {
            const availableColors = getAvailableColorsForSize(variants, selectedSize);
            
            if (availableColors.length > 0) {
                return (
                    <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-sm text-blue-800">
                            This size is currently available in:{" "}
                            <span className="font-medium">
                                {availableColors.join(", ")}
                            </span>
                        </AlertDescription>
                    </Alert>
                );
            } else {
                return (
                    <Alert className="border-amber-200 bg-amber-50">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-sm text-amber-800">
                            This size is currently out of stock in all colors.
                        </AlertDescription>
                    </Alert>
                );
            }
        }
    }

    return null;
}