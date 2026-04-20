"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";
import { FormInput, FormTextarea, FormSelect, PriceInput } from "./form-fields";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { generateSKU } from "@/lib/utils";

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
        <Card className="border-0 shadow-lg admin-card">
            <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <FormInput
                            control={form.control}
                            name="sku"
                            label="Product SKU"
                            placeholder="Auto-generating..."
                            disabled={disabled}
                            required
                        />
                        <Button 
                            type="button" 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => form.setValue("sku", generateSKU("PRD"))}
                            disabled={disabled}
                        >
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            Regenerate Unique SKU
                        </Button>
                    </div>

                    <PriceInput
                        control={form.control}
                        name="basePrice"
                        label="Base Price (INR)"
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
