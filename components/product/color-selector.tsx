// src/components/product/ColorSelector.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ColorGroup {
    color: string;
    colorHex: string;
    sizes: {
        size: string;
        variantId: string;
        inStock: boolean;
        additionalPrice: number;
    }[];
}

interface ColorSelectorProps {
    colors: ColorGroup[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}

export default function ColorSelector({
    colors,
    selectedColor,
    onColorChange,
}: ColorSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-foreground">
                    Color
                </Label>
                <span className="text-sm text-muted-foreground capitalize">
                    {selectedColor}
                </span>
            </div>

            <div className="flex flex-wrap gap-3">
                {colors.map((colorGroup) => (
                    <button
                        key={colorGroup.color}
                        onClick={() => onColorChange(colorGroup.color)}
                        className={`
                            relative w-10 h-10 rounded-full border-2 transition-all duration-200 
                            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                            ${selectedColor === colorGroup.color 
                                ? "border-primary shadow-lg scale-110" 
                                : "border-border hover:border-primary/50"
                            }
                        `}
                        style={{ backgroundColor: colorGroup.colorHex }}
                        aria-label={`Select ${colorGroup.color} color`}
                        title={colorGroup.color}
                    >
                        {selectedColor === colorGroup.color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}