"use client";

import React, {useState} from "react";
import {SizeGuideModal} from "@/components/product/size-guide-modal";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-foreground">
                        Size
                    </Label>
                    {selectedSize && (
                        <span className="text-sm text-muted-foreground">
                            {selectedSize}
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-primary hover:text-primary/90 h-auto p-0 font-normal"
                >
                    <Ruler className="w-4 h-4 mr-1" />
                    Size guide
                </Button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {sizes.map((sizeOption) => (
                    <Button
                        key={sizeOption.variantId}
                        variant={selectedSize === sizeOption.size ? "default" : "outline"}
                        onClick={() => sizeOption.inStock && onSizeChange(sizeOption.size)}
                        disabled={!sizeOption.inStock}
                        className={`
                            h-12 text-sm font-medium transition-all duration-200
                            ${selectedSize === sizeOption.size 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                : "bg-background hover:bg-accent hover:text-accent-foreground"
                            }
                            ${!sizeOption.inStock 
                                ? "opacity-40 cursor-not-allowed line-through" 
                                : "hover:scale-105"
                            }
                        `}
                        title={sizeOption.additionalPrice > 0 ? `+₹${sizeOption.additionalPrice.toFixed(2)}` : undefined}
                    >
                        <span className="flex flex-col items-center">
                            <span>{sizeOption.size}</span>
                            {sizeOption.additionalPrice > 0 && (
                                <span className="text-[10px] opacity-80">
                                    +₹{sizeOption.additionalPrice}
                                </span>
                            )}
                        </span>
                    </Button>
                ))}
            </div>

            <SizeGuideModal open={showSizeGuide} onOpenChange={setShowSizeGuide} />
        </div>
    );
}