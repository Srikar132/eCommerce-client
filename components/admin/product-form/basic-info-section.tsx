"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";
import { FormInput, FormTextarea, FormSelect, PriceInput } from "./form-fields";

interface BasicInfoSectionProps {
    form: UseFormReturn<ProductFormData>;
    categories: { id: string; name: string }[];
    disabled: boolean;
}

export function BasicInfoSection({ form, categories, disabled }: BasicInfoSectionProps) {
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormInput
                    control={form.control}
                    name="name"
                    label="Product Name"
                    placeholder="e.g., Cotton Summer Dress"
                    disabled={disabled}
                    required
                />

                <FormTextarea
                    control={form.control}
                    name="description"
                    label="Description"
                    placeholder="Describe your product..."
                    disabled={disabled}
                    minHeight="min-h-25"
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="sku"
                        label="SKU"
                        placeholder="e.g., DRESS-001"
                        disabled={disabled}
                        required
                    />

                    <PriceInput
                        control={form.control}
                        name="basePrice"
                        label="Price"
                        disabled={disabled}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="material"
                        label="Material"
                        placeholder="e.g., 100% Cotton"
                        disabled={disabled}
                    />

                    <FormSelect
                        control={form.control}
                        name="categoryId"
                        label="Category"
                        placeholder="Select category"
                        options={categoryOptions}
                        disabled={disabled}
                        required
                    />
                </div>

                <FormTextarea
                    control={form.control}
                    name="careInstructions"
                    label="Care Instructions"
                    placeholder="e.g., Machine wash cold, tumble dry low..."
                    disabled={disabled}
                    minHeight="min-h-20"
                />
            </CardContent>
        </Card>
    );
}
