"use client";

import React, {useState} from "react";
import { ProductSize } from "@/lib/types";
import {SizeGuideModal} from "@/components/product/size-guide-modal";

interface SizeSelectorProps {
    sizes: ProductSize[];
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
                {sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => size.inStock && onSizeChange(size.value)}
                        disabled={!size.inStock}
                        className={`pdp-size-button ${
                            selectedSize === size.value ? "pdp-size-button-active" : ""
                        } ${!size.inStock ? "pdp-size-button-disabled" : ""}`}
                    >
                        {size.value}
                    </button>
                ))}
            </div>

            <SizeGuideModal open={showSizeGuide} onOpenChange={setShowSizeGuide} />
        </div>
    );
}