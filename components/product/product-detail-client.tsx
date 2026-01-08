"use client";

import { useState, useEffect, useMemo } from "react";
import { useProduct, useProductVariants } from "@/lib/tanstack/queries/product.queries";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductInfo from "@/components/product/product-info";
import ColorSelector from "@/components/product/color-selector";
import SizeSelector from "@/components/product/size-selector";
import ProductActions from "@/components/product/product-actions";
import ProductFeatures from "@/components/product/product-features";
import ProductAccordion from "@/components/product/product-accordian";
import ProductDetailLoading from "@/components/product/product-detail-loading";
import ProductNotFound from "@/components/product/product-not-found";
import type { ProductVariant as APIProductVariant } from "@/types";

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const { data: product, isLoading: isLoadingProduct } = useProduct(slug);
    const { data: apiVariants, isLoading: isLoadingVariants } = useProductVariants(slug);

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");

    // Only memoize expensive computations - grouping variants is worth it
    const colorGroups = useMemo(() => {
        if (!apiVariants || !product) return [];
        
        const groups = new Map<string, APIProductVariant[]>();
        
        apiVariants.forEach(variant => {
            if (!groups.has(variant.color)) {
                groups.set(variant.color, []);
            }
            groups.get(variant.color)!.push(variant);
        });

        return Array.from(groups.entries()).map(([color, variants]) => ({
            color,
            colorHex: variants[0].colorHex || '#000000',
            sizes: variants.map(v => ({
                size: v.size,
                variantId: v.id,
                inStock: v.stockQuantity > 0,
                additionalPrice: v.additionalPrice
            }))
        }));
    }, [apiVariants, product]);

    // Set initial color with useEffect instead of conditional setState
    useEffect(() => {
        if (colorGroups.length > 0 && !selectedColor) {
            setSelectedColor(colorGroups[0].color);
        }
    }, [colorGroups, selectedColor]);

    // Simple derivations don't need useMemo
    const selectedVariant = apiVariants?.find(v => 
        v.color === selectedColor && v.size === selectedSize
    );

    const finalPrice = product 
        ? product.basePrice + (selectedVariant?.additionalPrice || 0)
        : 0;

    const availableSizes = colorGroups.find(g => g.color === selectedColor)?.sizes || [];

    const features = product ? [
        ...(product.material ? [{ id: 'material', text: product.material }] : []),
        ...(product.careInstructions ? [{ id: 'care', text: product.careInstructions }] : [])
    ] : [];

    const galleryImages = !product?.images || product.images.length === 0
        ? [{
            id: 'default',
            url: '/placeholder-product.jpg',
            alt: product?.name || 'Product image'
        }]
        : product.images.map(img => ({
            id: img.id,
            url: img.imageUrl,
            alt: img.altText || product.name
        }));

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        if (!selectedVariant) {
            alert("Invalid selection");
            return;
        }

        console.log("Added to cart:", {
            productId: product?.id,
            productName: product?.name,
            variantId: selectedVariant.id,
            color: selectedVariant.color,
            size: selectedVariant.size,
            basePrice: product?.basePrice,
            additionalPrice: selectedVariant.additionalPrice,
            finalPrice: finalPrice,
            sku: selectedVariant.sku
        });
        
        alert(`Added to cart!\n${product?.name}\nColor: ${selectedVariant.color}\nSize: ${selectedVariant.size}\nPrice: ₹${finalPrice.toFixed(2)}`);
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setSelectedSize("");
    };

    if (isLoadingProduct || isLoadingVariants) {
        return <ProductDetailLoading />;
    }

    if (!product || !colorGroups.length) {
        return (
            <ProductNotFound 
                productSlug={slug}
                message="The product you're looking for doesn't exist or is currently unavailable."
            />
        );
    }

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    <div className="order-1 w-full">
                        <ProductImageGallery images={galleryImages} />
                    </div>

                    <div className="order-2 w-full space-y-6">
                        <div className="border-b border-gray-100 pb-6">
                            <ProductInfo
                                brand={product.brandName}
                                name={product.name}
                                price={finalPrice}
                                currency="INR"
                            />
                            {selectedVariant && selectedVariant.additionalPrice > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Base price: ₹{product.basePrice.toFixed(2)} + ₹{selectedVariant.additionalPrice.toFixed(2)} for {selectedColor}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <ColorSelector
                                colors={colorGroups}
                                selectedColor={selectedColor}
                                onColorChange={handleColorChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <SizeSelector
                                sizes={availableSizes}
                                selectedSize={selectedSize}
                                onSizeChange={setSelectedSize}
                            />
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 pb-4 px-4 sm:pb-0 sm:px-0 sm:static sm:border-0 sm:pt-0 z-10">
                            <ProductActions
                                onAddToCart={handleAddToCart}
                                disabled={!selectedSize || !selectedVariant}
                                isCustomizable={product.isCustomizable}
                                productSlug={product.slug}
                            />
                        </div>

                        {features.length > 0 && (
                            <div className="space-y-4">
                                <ProductFeatures features={features} />
                            </div>
                        )}

                        <div className="space-y-4">
                            <ProductAccordion
                                description={product.description || 'No description available'}
                                washCare={product.careInstructions || 'Standard care instructions apply'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}