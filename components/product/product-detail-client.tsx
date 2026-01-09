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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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

    // Get images for the selected color (prioritize variants with images)
    const selectedColorVariant = useMemo(() => {
        if (!apiVariants || !selectedColor) return undefined;
        
        // Get all variants for the selected color
        const colorVariants = apiVariants.filter(v => v.color === selectedColor);
        
        // First, try to find a variant with images
        const variantWithImages = colorVariants.find(v => v.images && v.images.length > 0);
        
        // If found, use it; otherwise, use the first variant of that color
        return variantWithImages || colorVariants[0];
    }, [apiVariants, selectedColor]);
    
    const finalPrice = product 
        ? product.basePrice + (selectedVariant?.additionalPrice || 0)
        : 0;

    const availableSizes = colorGroups.find(g => g.color === selectedColor)?.sizes || [];

    const features = product ? [
        ...(product.material ? [{ id: 'material', text: product.material }] : []),
        ...(product.careInstructions ? [{ id: 'care', text: product.careInstructions }] : [])
    ] : [];

    // Get images from the selected color variant, or use placeholder
    const galleryImages = selectedColorVariant?.images && selectedColorVariant.images.length > 0
        ? selectedColorVariant.images.map(img => ({
            id: img.id,
            url: img.imageUrl,
            alt: img.altText || `${product?.name} - ${selectedColor}`
        }))
        : [{
            id: 'default',
            url: '/placeholder-product.jpg',
            alt: product?.name || 'Product image'
        }];

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
        <div className="min-h-screen bg-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Image Gallery Section */}
                    <div className="order-1 w-full">
                        <div className="rounded-xl border border-border/30 overflow-hidden bg-card">
                            <ProductImageGallery images={galleryImages} />
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <ScrollArea className="order-2 w-full h-full">
                        <div className="space-y-4 pr-4">
                            {/* Product Info */}
                            <div className="pb-4">
                                <ProductInfo
                                    brand={product.brandName}
                                    name={product.name}
                                    price={finalPrice}
                                    currency="INR"
                                />
                                
                                {selectedVariant && selectedVariant.additionalPrice > 0 && (
                                    <div className="mt-3">
                                        <Badge variant="secondary" className="text-xs">
                                            Base: ₹{product.basePrice.toFixed(2)} + ₹{selectedVariant.additionalPrice.toFixed(2)} for {selectedColor}
                                        </Badge>
                                    </div>
                                )}
                                
                                {selectedVariant && selectedVariant.stockQuantity < 10 && selectedVariant.stockQuantity > 0 && (
                                    <div className="mt-2">
                                        <Badge variant="destructive" className="text-xs">
                                            Only {selectedVariant.stockQuantity} left in stock!
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Color Selector */}
                            <div className="py-4">
                                <ColorSelector
                                    colors={colorGroups}
                                    selectedColor={selectedColor}
                                    onColorChange={handleColorChange}
                                />
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Size Selector */}
                            <div className="py-4">
                                <SizeSelector
                                    sizes={availableSizes}
                                    selectedSize={selectedSize}
                                    onSizeChange={setSelectedSize}
                                />
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Product Actions - Sticky on Mobile */}
                            <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 -mx-4 sm:mx-0 sm:static sm:border-0 sm:p-0 sm:bg-transparent z-20">
                                <ProductActions
                                    onAddToCart={handleAddToCart}
                                    disabled={!selectedSize || !selectedVariant}
                                    isCustomizable={product.isCustomizable}
                                    productSlug={product.slug}
                                />
                            </div>

                            {/* Features Section */}
                            {features.length > 0 && (
                                <>
                                    <Separator className="bg-border/40" />
                                    <div className="py-4">
                                        <ProductFeatures features={features} />
                                    </div>
                                </>
                            )}

                            <Separator className="bg-border/40" />

                            {/* Accordion Section */}
                            <div className="py-4">
                                <ProductAccordion
                                    description={product.description || 'No description available'}
                                    washCare={product.careInstructions || 'Standard care instructions apply'}
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}