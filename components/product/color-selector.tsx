// src/components/product/ColorSelector.tsx
"use client";

import React from "react";
import { ProductVariant } from "@/lib/types";

interface ColorSelectorProps {
    variants: ProductVariant[];
    selectedVariantId: string;
    onColorChange: (variantId: string) => void;
}

export default function ColorSelector({
                                          variants,
                                          selectedVariantId,
                                          onColorChange,
                                      }: ColorSelectorProps) {
    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    return (
        <div className="pdp-color-selector">
            <div className="pdp-selector-label">
                <span className="pdp-label-text">Color:</span>
                <span className="pdp-label-value">{selectedVariant?.color}</span>
            </div>

            <div className="pdp-color-options">
                {variants.map((variant) => (
                    <button
                        key={variant.id}
                        onClick={() => onColorChange(variant.id)}
                        className={`pdp-color-swatch ${
                            selectedVariantId === variant.id ? "pdp-color-swatch-active" : ""
                        }`}
                        style={{ backgroundColor: variant.colorCode }}
                        aria-label={`Select ${variant.color} color`}
                    >
                        {selectedVariantId === variant.id && (
                            <span className="pdp-color-checkmark">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}