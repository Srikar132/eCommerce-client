// src/components/product/ColorSelector.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorOption {
    color: string;
    colorHex: string;
}

interface ColorSelectorProps {
    colors: ColorOption[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}

export default function ColorSelector({
    colors,
    selectedColor,
    onColorChange,
}: ColorSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-foreground">
                    Color:
                </Label>
                <span className="text-sm text-muted-foreground capitalize">
                    {selectedColor}
                </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {colors.map((colorOption) => {
                    const isSelected = selectedColor === colorOption.color;
                    const isLight = isLightColor(colorOption.colorHex);

                    return (
                        <button
                            key={colorOption.color}
                            type="button"
                            onClick={() => onColorChange(colorOption.color)}
                            className={cn(
                                "relative w-10 h-8 sm:w-12 sm:h-7 cursor-pointer transition-all duration-200",
                                "border-2",
                                isSelected
                                    ? "border-foreground scale-110"
                                    : "border-border hover:border-foreground/40 hover:scale-105"
                            )}
                            title={colorOption.color}
                            aria-label={`Select color ${colorOption.color}`}
                        >
                            <span
                                className="absolute inset-0.5"
                                style={{ backgroundColor: colorOption.colorHex }}
                            />

                            {/* Check mark for selected */}
                            {isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <Check
                                        className={cn(
                                            "w-3.5 h-3.5 sm:w-4 sm:h-4",
                                            isLight ? "text-foreground" : "text-white"
                                        )}
                                        strokeWidth={2.5}
                                    />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Determine if a hex color is light (for check icon contrast) */
function isLightColor(hex: string): boolean {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // Perceived luminance
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}