// src/app/products/[slug]/page.tsx
"use client";

import React, { useState } from "react";
import { MOCK_PRODUCT } from "@/constants";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductInfo from "@/components/product/product-info";
import ColorSelector from "@/components/product/color-selector";
import SizeSelector from "@/components/product/size-selector";
import ProductActions from "@/components/product/product-actions";
import ProductFeatures from "@/components/product/product-features";
import ProductAccordion from "@/components/product/product-accordian";

export default function ProductDetailPage() {
    const [selectedVariantId, setSelectedVariantId] = useState(
        MOCK_PRODUCT.selectedVariantId || MOCK_PRODUCT.variants[0].id
    );
    const [selectedSize, setSelectedSize] = useState<string>("");

    const selectedVariant = MOCK_PRODUCT.variants.find(
        (v) => v.id === selectedVariantId
    );

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        console.log("Added to cart:", {
            productId: MOCK_PRODUCT.id,
            variantId: selectedVariantId,
            size: selectedSize,
        });
        alert("Product added to cart!");
    };

    const handleColorChange = (variantId: string) => {
        setSelectedVariantId(variantId);
        setSelectedSize(""); // Reset size when color changes
    };

    return (
        <div className="pdp-container">
            <div className="pdp-layout">
                {/* Left Side - Image Gallery */}
                <div className="pdp-gallery-section">
                    <ProductImageGallery images={selectedVariant?.images || []} />
                </div>

                {/* Right Side - Product Details */}
                <div className="pdp-details-section">
                    <ProductInfo
                        brand={MOCK_PRODUCT.brand}
                        name={MOCK_PRODUCT.name}
                        price={MOCK_PRODUCT.price}
                        currency={MOCK_PRODUCT.currency}
                    />

                    <ColorSelector
                        variants={MOCK_PRODUCT.variants}
                        selectedVariantId={selectedVariantId}
                        onColorChange={handleColorChange}
                    />

                    <SizeSelector
                        sizes={selectedVariant?.sizes || []}
                        selectedSize={selectedSize}
                        onSizeChange={setSelectedSize}
                    />

                    <ProductActions
                        onAddToCart={handleAddToCart}
                        disabled={!selectedSize}
                    />

                    <ProductFeatures features={MOCK_PRODUCT.features} />

                    <ProductAccordion
                        description={MOCK_PRODUCT.description}
                        washCare={MOCK_PRODUCT.washCare}
                    />
                </div>
            </div>
        </div>
    );
}

// For SSG - This will be implemented later with real API
// export async function generateStaticParams() {
//   return [{ slug: 'dress-tied-at-the-waist' }];
// }