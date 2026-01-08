"use client";

import React, {useState} from "react";
import {SizeGuideModal} from "@/components/product/size-guide-modal";

interface SizeOption {
    size: string;
    variantId: string;
    inStock: boolean;
    additionalPrice: number;
}

interface SizeSelectorProps {
    sizes: SizeOption[];
    selectedSize: string;
    onSizeChange: (size: string) => void;
}

export default function SizeSelector({
    sizes,
    selectedSize,
    onSizeChange,
}: SizeSelectorProps) {
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    return (
        <div className="pdp-size-selector">
            <div className="pdp-selector-header">
                <div className="pdp-selector-label">
                    <span className="pdp-label-text">Size:</span>
                    <span className="pdp-label-value">{selectedSize || "Select"}</span>
                </div>
                <button
                    onClick={() => setShowSizeGuide(true)}
                    className="pdp-size-guide">
                    Size guide
                </button>
            </div>

            <div className="pdp-size-options">
                {sizes.map((sizeOption) => (
                    <button
                        key={sizeOption.variantId}
                        onClick={() => sizeOption.inStock && onSizeChange(sizeOption.size)}
                        disabled={!sizeOption.inStock}
                        className={`pdp-size-button ${
                            selectedSize === sizeOption.size ? "pdp-size-button-active" : ""
                        } ${!sizeOption.inStock ? "pdp-size-button-disabled" : ""}`}
                        title={sizeOption.additionalPrice > 0 ? `+₹${sizeOption.additionalPrice.toFixed(2)}` : undefined}
                    >
                        {sizeOption.size}
                        {sizeOption.additionalPrice > 0 && (
                            <span className="text-xs ml-1">+₹{sizeOption.additionalPrice}</span>
                        )}
                    </button>
                ))}
            </div>

            <SizeGuideModal open={showSizeGuide} onOpenChange={setShowSizeGuide} />
        </div>
    );
}