// src/components/product/ColorSelector.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorOption {
    color: string;
    colorHex: string;
}

interface ColorSelectorProps {
    colors: ColorOption[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}

export default function ColorSelector({
    colors,
    selectedColor,
    onColorChange,
}: ColorSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                    Select Color
                </Label>
                <Badge variant="outline" className="capitalize">
                    {selectedColor}
                </Badge>
            </div>

            <RadioGroup 
                value={selectedColor} 
                onValueChange={onColorChange}
                className="flex flex-wrap gap-3"
            >
                {colors.map((colorOption) => (
                    <div key={colorOption.color} className="relative">
                        <RadioGroupItem
                            value={colorOption.color}
                            id={`color-${colorOption.color}`}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`color-${colorOption.color}`}
                            className={cn(
                                "group relative flex size-12 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
                                "ring-2 ring-offset-2 ring-offset-background",
                                "hover:scale-105 hover:shadow-md",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                selectedColor === colorOption.color
                                    ? "ring-primary shadow-lg scale-110"
                                    : "ring-border hover:ring-primary/50"
                            )}
                        >
                            {/* Color circle with border for better visibility */}
                            <span 
                                className="absolute inset-1 rounded-full border-2 border-background shadow-inner"
                                style={{ backgroundColor: colorOption.colorHex }}
                            />
                            
                            {/* Check icon for selected state */}
                            {selectedColor === colorOption.color && (
                                <span className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="bg-background/90 rounded-full p-0.5 shadow-sm">
                                        <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                                    </span>
                                </span>
                            )}
                            
                            {/* Hover tooltip */}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none capitalize">
                                {colorOption.color}
                            </span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}