import ColorSelector from "@/components/product/color-selector";
import SizeSelector from "@/components/product/size-selector";
import { Separator } from "@/components/ui/separator";
import { ColorOption, SizeOption } from "@/hooks/use-variant-selector";

interface VariantSelectorProps {
    colors: ColorOption[];
    sizes: SizeOption[];
    selectedColor: string;
    selectedSize: string;
    onColorChange: (color: string) => void;
    onSizeChange: (size: string) => void;
    className?: string;
}

export default function VariantSelector({
    colors,
    sizes,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
    className = ""
}: VariantSelectorProps) {
    return (
        <div className={`border-2 border-border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
            {/* Color Selection */}
            <div className="p-6">
                <ColorSelector
                    colors={colors}
                    selectedColor={selectedColor}
                    onColorChange={onColorChange}
                />
            </div>

            <Separator className="bg-border/60" />

            {/* Size Selection */}
            <div className="p-6">
                <SizeSelector
                    sizes={sizes}
                    selectedSize={selectedSize}
                    onSizeChange={onSizeChange}
                />
            </div>
        </div>
    );
}