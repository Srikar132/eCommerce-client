"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/product";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName?: string;
    productSlug?: string;
}

export default function ProductImageGallery({ images, productName, productSlug }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleShare = useCallback(() => {
        if (!productSlug) return;

        const productUrl = `https://nalaarmoire.com/products/${productSlug}`;
        const message = productName
            ? `Check out ${productName} from Nala Armoire! ${productUrl}`
            : `Check out this product from Nala Armoire! ${productUrl}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.success("Opening WhatsApp...");
    }, [productName, productSlug]);

    const handlePrevious = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full">
                <div className="relative w-full aspect-[3/4]">
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                        <div className="text-muted-foreground text-center">
                            <p className="text-lg">No images available</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const hasMultipleImages = images.length > 1;

    return (
        <div className="w-full">
            {/* Desktop Layout: Thumbnails Left + Main Image Right */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">

                {/* Thumbnails - Left side on desktop, below on mobile */}
                {hasMultipleImages && (
                    <div className="order-2 lg:order-1 lg:w-20 xl:w-24 shrink-0">
                        {/* Vertical thumbnails for desktop */}
                        <div className="hidden lg:flex flex-col gap-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                            {images.filter(image => image.imageUrl).map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={cn(
                                        "relative aspect-square w-full overflow-hidden transition-all cursor-pointer border-2 rounded-md",
                                        selectedImageIndex === index
                                            ? "border-primary"
                                            : "border-transparent hover:border-primary/40"
                                    )}
                                >
                                    <Image
                                        src={image.imageUrl!}
                                        alt={image.altText || `Product Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Horizontal thumbnails for mobile/tablet */}
                        <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {images.filter(image => image.imageUrl).map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={cn(
                                        "relative aspect-square w-16 sm:w-20 shrink-0 overflow-hidden transition-all cursor-pointer border-2 rounded-md",
                                        selectedImageIndex === index
                                            ? "border-primary"
                                            : "border-transparent hover:border-primary/40"
                                    )}
                                >
                                    <Image
                                        src={image.imageUrl!}
                                        alt={image.altText || `Product Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Image Container */}
                <div className="order-1 lg:order-2 flex-1 relative">
                    <div className="relative w-full aspect-square sm:aspect-4/5 lg:aspect-3/4 overflow-hidden group rounded-md">
                        {!!images[selectedImageIndex]?.imageUrl ? (
                            <Image
                                src={images[selectedImageIndex].imageUrl}
                                alt={images[selectedImageIndex].altText || `Product Image ${selectedImageIndex + 1}`}
                                fill
                                className="object-cover"
                                priority={selectedImageIndex === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            />
                        ) : (
                            <Image
                                src="/images/image-not-found.webp"
                                alt="Image not found"
                                fill
                                className="object-cover"
                            />
                        )}

                        {/* Navigation Arrows - Only show if multiple images */}
                        {hasMultipleImages && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrevious}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>

                                {/* Image Counter */}
                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                                    {selectedImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}

                        {/* Share on WhatsApp Button */}
                        {productSlug && (
                            <button
                                onClick={handleShare}
                                className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 hover:bg-green-500 hover:text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                                aria-label="Share on WhatsApp"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}