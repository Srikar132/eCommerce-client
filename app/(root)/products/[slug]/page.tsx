"use client";

import { useState } from "react";
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
        <div className="min-h-screen bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Image Gallery - Mobile First */}
                    <div className="order-1 w-full">
                        <ProductImageGallery images={selectedVariant?.images || []} />
                    </div>

                    {/* Product Details - Mobile Optimized */}
                    <div className="order-2 w-full space-y-6">
                        {/* Product Info */}
                        <div className="border-b border-gray-100 pb-6">
                            <ProductInfo
                                brand={MOCK_PRODUCT.brand}
                                name={MOCK_PRODUCT.name}
                                price={MOCK_PRODUCT.price}
                                currency={MOCK_PRODUCT.currency}
                            />
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-4">
                            <ColorSelector
                                variants={MOCK_PRODUCT.variants}
                                selectedVariantId={selectedVariantId}
                                onColorChange={handleColorChange}
                            />
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <SizeSelector
                                sizes={selectedVariant?.sizes || []}
                                selectedSize={selectedSize}
                                onSizeChange={setSelectedSize}
                            />
                        </div>

                        {/* Action Buttons - Sticky on Mobile */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 pb-4 px-4 sm:pb-0 sm:px-0 sm:static sm:border-0 sm:pt-0 z-10">
                            <ProductActions
                                onAddToCart={handleAddToCart}
                                disabled={!selectedSize}
                            />
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <ProductFeatures features={MOCK_PRODUCT.features} />
                        </div>

                        {/* Accordion */}
                        <div className="space-y-4">
                            <ProductAccordion
                                description={MOCK_PRODUCT.description}
                                washCare={MOCK_PRODUCT.washCare}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// For SSG - This will be implemented later with real API
// export async function generateStaticParams() {
//   return [{ slug: 'dress-tied-at-the-waist' }];
// }