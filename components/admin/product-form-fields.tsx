/**
 * ProductFormFields - Reusable form field components for the ProductForm
 * 
 * This file contains utility components and types for rendering form fields
 * in a consistent and maintainable way.
 */

import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { ProductFormData } from "@/lib/validations";

export type FieldKind = "input" | "textarea" | "price";

// Only for simple string/number fields, not complex nested fields
export type SimpleFieldName = "name" | "description" | "sku" | "material" | "careInstructions" | "basePrice";

export type FieldConfig = {
    name: SimpleFieldName;
    label: string;
    placeholder?: string;
    description?: string;
    kind: FieldKind;
    inputType?: "text" | "number";
    step?: string;
    className?: string;
};

interface FormFieldRendererProps {
    control: Control<ProductFormData>;
    config: FieldConfig;
    disabled?: boolean;
}

export function FormFieldRenderer({ control, config, disabled = false }: FormFieldRendererProps) {
    return (
        <FormField
            control={control}
            name={config.name}
            render={({ field }) => {
                // Ensure we have proper string/number values for simple inputs
                const value = typeof field.value === 'string' || typeof field.value === 'number'
                    ? field.value
                    : field.value || '';

                return (
                    <FormItem>
                        <FormLabel>{config.label}</FormLabel>
                        <FormControl>
                            {config.kind === "textarea" ? (
                                <Textarea
                                    placeholder={config.placeholder}
                                    className={config.className}
                                    disabled={disabled}
                                    {...field}
                                    value={value as string}
                                />
                            ) : config.kind === "price" ? (
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type={config.inputType || "number"}
                                        step={config.step}
                                        placeholder={config.placeholder}
                                        className="pl-10"
                                        disabled={disabled}
                                        {...field}
                                        value={value}
                                    />
                                </div>
                            ) : (
                                <Input
                                    type={config.inputType || "text"}
                                    placeholder={config.placeholder}
                                    disabled={disabled}
                                    {...field}
                                    value={value as string}
                                />
                            )}
                        </FormControl>
                        {config.description && (
                            <FormDescription>{config.description}</FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}

// Field configurations
export const basicFieldGroups: FieldConfig[][] = [
    [
        {
            name: "name",
            label: "Product Name *",
            placeholder: "Enter product name",
            kind: "input",
        },
        {
            name: "sku",
            label: "SKU *",
            placeholder: "e.g., SHIRT-001",
            description: "Unique identifier for this product",
            kind: "input",
        },
    ],
    [
        {
            name: "material",
            label: "Material",
            placeholder: "e.g., 100% Cotton",
            kind: "input",
        },
        {
            name: "basePrice",
            label: "Base Price * ($)",
            placeholder: "29.99",
            kind: "price",
            inputType: "number",
            step: "0.01",
        },
    ],
];

export const textAreaFields: FieldConfig[] = [
    {
        name: "description",
        label: "Description",
        placeholder: "Describe your product...",
        kind: "textarea",
        className: "min-h-25",
    },
    {
        name: "careInstructions",
        label: "Care Instructions",
        placeholder: "e.g., Machine wash cold, tumble dry low",
        kind: "textarea",
    },
];

// Common options for dropdowns
export const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40", "42"];

export const commonColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Green", hex: "#10B981" },
    { name: "Yellow", hex: "#F59E0B" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Gray", hex: "#6B7280" },
    { name: "Navy", hex: "#1E3A8A" },
];