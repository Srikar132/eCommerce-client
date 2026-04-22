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
import { FormInput, FormSelect, PriceInput } from "./form-fields";
// FIX: import PRODUCT_SIZES and PRODUCT_COLORS from validations (they are the DB enum values)
import { ProductFormData, PRODUCT_SIZES, PRODUCT_COLORS } from "@/lib/validations";
import { ProductSize, ProductColor } from "@/lib/constants/enums";
import { cn, generateSKU } from "@/lib/utils";

// ============================================================================
// FIX: Build color/size data from the DB enums so they always stay in sync.
// Previously these were imported from product-form-fields as free-text arrays;
// now they are derived from the single source of truth (the Drizzle enum via zod).
// ============================================================================

/** Hex values keyed by the DB enum color name */
const COLOR_HEX_MAP: Record<string, string> = {
    BLACK:      "#000000",
    WHITE:      "#FFFFFF",
    RED:        "#EF4444",
    BLUE:       "#3B82F6",
    GREEN:      "#22C55E",
    YELLOW:     "#EAB308",
    ORANGE:     "#F97316",
    PURPLE:     "#A855F7",
    PINK:       "#EC4899",
    BROWN:      "#92400E",
    GREY:       "#6B7280",
    NAVY:       "#1E3A5F",
    BEIGE:      "#D4C5A9",
    MAROON:     "#7F1D1D",
    OLIVE:      "#4D7C0F",
    TEAL:       "#0D9488",
    CREAM:      "#FFF8E7",
    MULTICOLOR: "#FF6B6B",
};

/** Display-friendly label for each color enum value */
const COLOR_LABEL_MAP: Record<string, string> = {
    BLACK:      "Black",
    WHITE:      "White",
    RED:        "Red",
    BLUE:       "Blue",
    GREEN:      "Green",
    YELLOW:     "Yellow",
    ORANGE:     "Orange",
    PURPLE:     "Purple",
    PINK:       "Pink",
    BROWN:      "Brown",
    GREY:       "Grey",
    NAVY:       "Navy",
    BEIGE:      "Beige",
    MAROON:     "Maroon",
    OLIVE:      "Olive",
    TEAL:       "Teal",
    CREAM:      "Cream",
    MULTICOLOR: "Multicolor",
};

interface ColorOption {
    value: string;   // DB enum value e.g. "BLACK"
    name: string;    // Display label e.g. "Black"
    hex: string;     // CSS hex e.g. "#000000"
}

/** Derived from the DB enum — single source of truth */
const commonColors: ColorOption[] = PRODUCT_COLORS.map((value) => ({
    value,
    name: COLOR_LABEL_MAP[value] ?? value,
    hex:  COLOR_HEX_MAP[value]   ?? "#CCCCCC",
}));

/** Sizes come directly from the DB enum */
const commonSizes: string[] = [...PRODUCT_SIZES];

// ============================================================================
// ColorPicker
// ============================================================================

interface ColorPickerProps {
    value: string;      // The enum value (e.g. "BLACK")
    colorHex: string;
    onChange: (colorValue: string, hex: string) => void;
    disabled?: boolean;
}

function ColorPicker({ value, colorHex, onChange, disabled }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleColorSelect = (color: ColorOption) => {
        onChange(color.value, color.hex);
        setIsOpen(false);
    };

    const selectedColor = commonColors.find((c) => c.value === value);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "h-10 w-full justify-start gap-2.5 font-medium border-border/50 hover:border-primary/30 transition-colors",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    {colorHex ? (
                        <div
                            className="h-4 w-4 rounded-full border border-border/50 shadow-sm shrink-0"
                            style={{ backgroundColor: colorHex }}
                        />
                    ) : (
                        <Palette className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{selectedColor?.name ?? "Select color"}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">Standard Colors</span>
                        <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 uppercase">
                            {commonColors.length} Colors
                        </Badge>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {commonColors.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                className={cn(
                                    "h-8 w-8 rounded-full border-2 transition-all hover:scale-110 shadow-sm",
                                    value === color.value
                                        ? "border-primary ring-2 ring-primary/20 scale-105"
                                        : "border-transparent hover:border-muted-foreground/30"
                                )}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => handleColorSelect(color)}
                                title={color.name}
                            />
                        ))}
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

                <FormField
                    control={form.control}
                    name={`variants.${index}.priceModifier`}
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
    size: PRODUCT_SIZES[0] as ProductSize,
    color: PRODUCT_COLORS[0] as ProductColor,
    colorHex: COLOR_HEX_MAP[PRODUCT_COLORS[0]] ?? "#000000",
    stockQuantity: 0,
    priceModifier: 0,
    isActive: true,
};

export function VariantsSection({
    form,
    variantFields,
    disabled,
    onDeleteVariant,
}: VariantsSectionProps) {
    const { fields, append } = variantFields;

    // Group variants by color enum value
    type GroupedVariant = {
        colorValue: string;
        colorName: string;
        colorHex: string;
        items: { field: (typeof fields)[number]; index: number }[];
    };

    const groupedVariants = fields.reduce<Record<string, GroupedVariant>>(
        (acc, field, index) => {
            const colorValue = form.watch(`variants.${index}.color`) ?? "";
            const colorHex   = form.watch(`variants.${index}.colorHex`) ?? "";

            const colorObj  = commonColors.find((c) => c.value === colorValue);
            const colorName = colorObj?.name ?? "No Color";

            if (!acc[colorValue]) {
                acc[colorValue] = { colorValue, colorName, colorHex, items: [] };
            }
            acc[colorValue].items.push({ field, index });
            return acc;
        },
        {}
    );

    const handleAddVariantForColor = (color: string, colorHex: string) => {
        append({
            ...DEFAULT_VARIANT,
            color: color as any,
            colorHex,
            sku: generateSKU("VAR"),
        });
    };

    const handleAddNewColor = () => {
        append({ ...DEFAULT_VARIANT, sku: generateSKU("VAR") });
    };

    return (
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2.5 font-semibold">
                            <Layers className="h-5 w-5 text-primary/80" />
                            Product Variants
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            Group variants by color and manage size-specific inventory
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddNewColor}
                        disabled={disabled}
                        className="shadow-sm h-9 px-4 rounded-full"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add New Color
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-8">
                {Object.values(groupedVariants).map((group) => (
                    <div
                        key={group.colorValue}
                        className="space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/40"
                    >
                        {/* Color group header */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                            <div className="flex items-center gap-3">
                                {group.colorHex ? (
                                    <div
                                        className="h-6 w-6 rounded-full border border-border shadow-sm"
                                        style={{ backgroundColor: group.colorHex }}
                                    />
                                ) : (
                                    <Palette className="h-5 w-5 text-muted-foreground" />
                                )}
                                <h3 className="font-bold text-lg">{group.colorName}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleAddVariantForColor(group.colorValue, group.colorHex)
                                }
                                disabled={disabled}
                                className="h-8 text-xs font-semibold"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Size
                            </Button>
                        </div>

                        {/* Variant rows */}
                        <div className="space-y-3">
                            {group.items.map(({ field, index }) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-3 rounded-xl bg-card border border-border/40 hover:shadow-md transition-shadow"
                                >
                                    {/* Size */}
                                    <FormSelect
                                        control={form.control}
                                        name={`variants.${index}.size`}
                                        label="Size"
                                        placeholder="Size"
                                        options={commonSizes.map(s => ({ value: s, label: s }))}
                                        disabled={disabled}
                                        labelClassName="text-[10px] uppercase font-bold text-muted-foreground"
                                    />

                                    {/* Color */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            Color
                                        </label>
                                        <ColorPicker
                                            value={form.watch(`variants.${index}.color`)}
                                            colorHex={form.watch(`variants.${index}.colorHex`) ?? ""}
                                            onChange={(colorName, hex) => {
                                                group.items.forEach((item) => {
                                                    form.setValue(`variants.${item.index}.color`, colorName as any);
                                                    form.setValue(`variants.${item.index}.colorHex`, hex);
                                                });
                                            }}
                                            disabled={disabled}
                                        />
                                    </div>

                                    {/* Stock */}
                                    <FormInput
                                        control={form.control}
                                        name={`variants.${index}.stockQuantity`}
                                        label="Stock"
                                        type="number"
                                        placeholder="0"
                                        disabled={disabled}
                                        labelClassName="text-[10px] uppercase font-bold text-muted-foreground"
                                    />

                                    {/* Price modifier */}
                                    <PriceInput
                                        control={form.control}
                                        name={`variants.${index}.priceModifier`}
                                        label="Extra Price"
                                        disabled={disabled}
                                        labelClassName="text-[10px] uppercase font-bold text-muted-foreground"
                                    />

                                    {/* Delete button */}
                                    <div className="flex items-end justify-center pb-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDeleteVariant(index)}
                                            disabled={disabled || fields.length === 1}
                                            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* SKU row */}
                                    <div className="md:col-span-5 flex items-center justify-between pt-1 text-[10px] text-muted-foreground font-mono">
                                        <div className="flex items-center gap-2">
                                            <span>
                                                SKU:{" "}
                                                {form.watch(`variants.${index}.sku`) ||
                                                    "Auto-generating..."}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="h-auto p-0 text-[10px]"
                                                onClick={() =>
                                                    form.setValue(
                                                        `variants.${index}.sku`,
                                                        generateSKU("VAR")
                                                    )
                                                }
                                            >
                                                Regenerate
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <EmptyVariantsState onAdd={handleAddNewColor} disabled={disabled} />
                )}
            </CardContent>
        </Card>
    );
}

// ============================================================================
// EmptyVariantsState
// ============================================================================

interface EmptyVariantsStateProps {
    onAdd: () => void;
    disabled: boolean;
}

function EmptyVariantsState({ onAdd, disabled }: EmptyVariantsStateProps) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No variants added yet</p>
            <Button type="button" variant="link" size="sm" onClick={onAdd} disabled={disabled}>
                Add your first variant
            </Button>
        </div>
    );
}