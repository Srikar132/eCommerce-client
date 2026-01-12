import ColorSelector from "@/components/product/color-selector";
import SizeSelector from "@/components/product/size-selector";
import { Separator } from "@/components/ui/separator";
import { ColorGroup, SizeOption } from "@/hooks/use-variant-selector";

interface VariantSelectorProps {
    colorGroups: ColorGroup[];
    availableSizes: SizeOption[];
    selectedColor: string;
    selectedSize: string;
    onColorChange: (color: string) => void;
    onSizeChange: (size: string) => void;
    className?: string;
}

export default function VariantSelector({
    colorGroups,
    availableSizes,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
    className = ""
}: VariantSelectorProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Color Selection */}
            <div className="py-4">
                <ColorSelector
                    colors={colorGroups}
                    selectedColor={selectedColor}
                    onColorChange={onColorChange}
                />
            </div>

            <Separator className="bg-border/40" />

            {/* Size Selection */}
            <div className="py-4">
                <SizeSelector
                    sizes={availableSizes}
                    selectedSize={selectedSize}
                    onSizeChange={onSizeChange}
                />
            </div>

          
        </div>
    );
}