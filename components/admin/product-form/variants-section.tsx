"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Layers, IndianRupee, Palette } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";
import { commonSizes } from "@/components/admin/product-form-fields";
import { cn } from "@/lib/utils";

// Extended color palette
const colorPalette = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#EF4444" },
    { name: "Crimson", hex: "#DC143C" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Navy", hex: "#1E3A8A" },
    { name: "Sky Blue", hex: "#0EA5E9" },
    { name: "Green", hex: "#10B981" },
    { name: "Forest", hex: "#166534" },
    { name: "Lime", hex: "#84CC16" },
    { name: "Yellow", hex: "#F59E0B" },
    { name: "Gold", hex: "#CA8A04" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Violet", hex: "#7C3AED" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Rose", hex: "#F43F5E" },
    { name: "Gray", hex: "#6B7280" },
    { name: "Silver", hex: "#9CA3AF" },
    { name: "Brown", hex: "#92400E" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Orange", hex: "#F97316" },
    { name: "Coral", hex: "#FF7F50" },
    { name: "Teal", hex: "#14B8A6" },
    { name: "Cyan", hex: "#06B6D4" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Maroon", hex: "#800000" },
];

interface ColorPickerProps {
    value: string;
    colorHex: string;
    onChange: (colorName: string, hex: string) => void;
    disabled?: boolean;
}

function ColorPicker({ value, colorHex, onChange, disabled }: ColorPickerProps) {
    const [customHex, setCustomHex] = useState(colorHex || "#000000");
    const [isOpen, setIsOpen] = useState(false);

    const handleColorSelect = (color: { name: string; hex: string }) => {
        onChange(color.name, color.hex);
        setCustomHex(color.hex);
        setIsOpen(false);
    };

    const handleCustomHexChange = (hex: string) => {
        setCustomHex(hex);
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            onChange("Custom", hex);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "h-9 w-full justify-start gap-2 font-normal",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    {colorHex ? (
                        <div
                            className="h-4 w-4 rounded-full border border-border shrink-0"
                            style={{ backgroundColor: colorHex }}
                        />
                    ) : (
                        <Palette className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{value || "Select color"}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-1.5">
                        {colorPalette.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                className={cn(
                                    "h-7 w-7 rounded-md border-2 transition-all hover:scale-110",
                                    colorHex === color.hex
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-transparent hover:border-muted-foreground/30"
                                )}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => handleColorSelect(color)}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <div className="border-t pt-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Custom Color
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={customHex}
                                onChange={(e) => handleCustomHexChange(e.target.value)}
                                className="h-9 w-12 p-1 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={customHex}
                                onChange={(e) => handleCustomHexChange(e.target.value)}
                                placeholder="#000000"
                                className="h-9 flex-1 font-mono text-sm"
                                maxLength={7}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

interface VariantItemProps {
    index: number;
    form: UseFormReturn<ProductFormData>;
    disabled: boolean;
    canDelete: boolean;
    onDelete: () => void;
}

function VariantItem({ index, form, disabled, canDelete, onDelete }: VariantItemProps) {
    return (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Variant {index + 1}</span>
                {canDelete && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={onDelete}
                        disabled={disabled}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Size */}
                <FormField
                    control={form.control}
                    name={`variants.${index}.size`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Size</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {commonSizes.map((size) => (
                                        <SelectItem key={size} value={size}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Color */}
                <FormField
                    control={form.control}
                    name={`variants.${index}.color`}
                    render={({ field }) => {
                        const colorHex = form.watch(`variants.${index}.colorHex`) || "";
                        return (
                            <FormItem>
                                <FormLabel className="text-xs">Color</FormLabel>
                                <FormControl>
                                    <ColorPicker
                                        value={field.value}
                                        colorHex={colorHex}
                                        onChange={(colorName, hex) => {
                                            field.onChange(colorName);
                                            form.setValue(`variants.${index}.colorHex`, hex);
                                        }}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                {/* Stock */}
                <FormField
                    control={form.control}
                    name={`variants.${index}.stockQuantity`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Stock</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    className="h-9"
                                    placeholder="0"
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Additional Price */}
                <FormField
                    control={form.control}
                    name={`variants.${index}.additionalPrice`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Extra Price</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        className="h-9 pl-7"
                                        placeholder="0"
                                        disabled={disabled}
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}

interface VariantsSectionProps {
    form: UseFormReturn<ProductFormData>;
    variantFields: UseFieldArrayReturn<ProductFormData, "variants">;
    disabled: boolean;
    onDeleteVariant: (index: number) => void;
}

const DEFAULT_VARIANT = {
    size: "",
    color: "",
    colorHex: "",
    stockQuantity: 0,
    additionalPrice: 0,
};

export function VariantsSection({
    form,
    variantFields,
    disabled,
    onDeleteVariant,
}: VariantsSectionProps) {
    const { fields, append } = variantFields;

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Variants
                        <Badge variant="secondary" className="ml-2">
                            {fields.length}
                        </Badge>
                    </CardTitle>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append(DEFAULT_VARIANT)}
                        disabled={disabled}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Variant
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <VariantItem
                        key={field.id}
                        index={index}
                        form={form}
                        disabled={disabled}
                        canDelete={fields.length > 1}
                        onDelete={() => onDeleteVariant(index)}
                    />
                ))}

                {fields.length === 0 && (
                    <EmptyVariantsState onAdd={() => append(DEFAULT_VARIANT)} disabled={disabled} />
                )}
            </CardContent>
        </Card>
    );
}

interface EmptyVariantsStateProps {
    onAdd: () => void;
    disabled: boolean;
}

function EmptyVariantsState({ onAdd, disabled }: EmptyVariantsStateProps) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No variants added yet</p>
            <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onAdd}
                disabled={disabled}
            >
                Add your first variant
            </Button>
        </div>
    );
}
