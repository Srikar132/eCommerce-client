// src/components/product/ColorSelector.tsx
"use client";

import React from "react";

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
        <div className="pdp-color-selector">
            <div className="pdp-selector-label">
                <span className="pdp-label-text">Color:</span>
                <span className="pdp-label-value">{selectedColor}</span>
            </div>

            <div className="pdp-color-options">
                {colors.map((colorGroup) => (
                    <button
                        key={colorGroup.color}
                        onClick={() => onColorChange(colorGroup.color)}
                        className={`pdp-color-swatch ${
                            selectedColor === colorGroup.color ? "pdp-color-swatch-active" : ""
                        }`}
                        style={{ backgroundColor: colorGroup.colorHex }}
                        aria-label={`Select ${colorGroup.color} color`}
                        title={colorGroup.color}
                    >
                        {selectedColor === colorGroup.color && (
                            <span className="pdp-color-checkmark">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}