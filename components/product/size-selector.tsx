"use client";

import React, {useState} from "react";
import {SizeGuideModal} from "@/components/product/size-guide-modal";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

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
                <div className="flex items-center gap-3">
                    <Label className="text-base font-semibold text-foreground">
                        Select Size
                    </Label>
                    {selectedSize && (
                        <Badge variant="outline">
                            {selectedSize}
                        </Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-primary hover:text-primary/80"
                >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                </Button>
            </div>

            <RadioGroup 
                value={selectedSize} 
                onValueChange={onSizeChange}
                className="grid grid-cols-4 sm:grid-cols-5 gap-3"
            >
                {sizes.map((sizeOption) => (
                    <div key={sizeOption.variantId} className="relative">
                        <RadioGroupItem
                            value={sizeOption.size}
                            id={`size-${sizeOption.variantId}`}
                            disabled={!sizeOption.inStock}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`size-${sizeOption.variantId}`}
                            className={cn(
                                "flex h-14 cursor-pointer flex-col items-center justify-center rounded-lg border-2 transition-all duration-300",
                                "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                selectedSize === sizeOption.size
                                    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105 font-semibold"
                                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/30 hover:scale-105 font-medium",
                                !sizeOption.inStock && "cursor-not-allowed border-dashed opacity-40 hover:scale-100 hover:bg-card hover:border-border"
                            )}
                            title={
                                !sizeOption.inStock 
                                    ? 'Out of stock' 
                                    : sizeOption.additionalPrice > 0 
                                        ? `+₹${sizeOption.additionalPrice.toFixed(2)}` 
                                        : undefined
                            }
                        >
                            <span className="flex flex-col items-center justify-center gap-0.5">
                                <span className={cn("text-base", !sizeOption.inStock && "line-through")}>
                                    {sizeOption.size}
                                </span>
                                {sizeOption.inStock && sizeOption.additionalPrice > 0 && (
                                    <span className={cn(
                                        "text-[10px] font-normal",
                                        selectedSize === sizeOption.size 
                                            ? "text-primary-foreground/80" 
                                            : "text-muted-foreground"
                                    )}>
                                        +₹{sizeOption.additionalPrice}
                                    </span>
                                )}
                                {!sizeOption.inStock && (
                                    <span className="text-[9px] font-normal text-muted-foreground/60 uppercase tracking-wide">
                                        Sold Out
                                    </span>
                                )}
                            </span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <SizeGuideModal open={showSizeGuide} onOpenChange={setShowSizeGuide} />
        </div>
    );
}