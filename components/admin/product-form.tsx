"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ImageIcon, Palette, Package, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProductForm } from "@/hooks/use-product-form";
import {
    FormFieldRenderer,
    basicFieldGroups,
    textAreaFields,
    commonSizes,
    commonColors,
    type FieldConfig
} from "@/components/admin/product-form-fields";
import { ProductFormData } from "@/lib/validations";

interface ProductFormProps {
    initialData?: Partial<ProductFormData> & { id?: string };
    isEditing?: boolean;
    productId?: string; // For fetching product data in edit mode
}

export function ProductForm({ initialData, isEditing = false, productId }: ProductFormProps) {
    // Use the custom hook for all form logic
    const {
        form,
        imageFields,
        variantFields,
        handleSubmit,
        categories,
        isLoadingProduct,
        isFormDisabled,
        productError,
        productData,
        refetchProduct,
    } = useProductForm({ isEditing, productId, initialData });

    // Loading state for fetching product data
    if (isEditing && isLoadingProduct) {
        return (
            <div className="admin-container">
                <div className="flex items-center justify-center min-h-100">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading product data...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state for fetching product data
    if (isEditing && productError) {
        return (
            <div className="admin-container">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Product</AlertTitle>
                    <AlertDescription className="space-y-3">
                        <p>
                            {productError instanceof Error ? productError.message : 'Failed to load product data'}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetchProduct()}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Product not found state
    if (isEditing && productData && !productData.success) {
        return (
            <div className="admin-container">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Product Not Found</AlertTitle>
                    <AlertDescription className="space-y-3">
                        <p>
                            The product you&apos;re trying to edit could not be found. It may have been deleted or the ID is invalid.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <a href="/admin/products">View All Products</a>
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const renderField = (config: FieldConfig) => (
        <FormFieldRenderer
            control={form.control as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            config={config}
            disabled={isFormDisabled}
        />
    );

    return (
        <div className="admin-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6"> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    {/* Header */}
                    <div className="admin-page-header">
                        <div>
                            <h1 className="admin-page-title">
                                {isEditing ? "Edit Product" : "Create New Product"}
                            </h1>
                            <p className="admin-page-description">
                                {isEditing
                                    ? "Update product information, images, and variants."
                                    : "Fill in the details below to create a new product."
                                }
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isFormDisabled} className="min-w-30 bg-blue-600 hover:bg-blue-700 text-white">
                                {isFormDisabled ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {isLoadingProduct ? "Loading..." : isEditing ? "Updating..." : "Creating..."}
                                    </div>
                                ) : (
                                    <>
                                        <Package className="h-4 w-4" />
                                        {isEditing ? "Update Product" : "Create Product"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Product Information
                                    </CardTitle>
                                    <CardDescription>
                                        Basic details about your product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {basicFieldGroups.map((group, groupIndex) => (
                                        <div key={`basic-group-${groupIndex}`} className="grid gap-4 sm:grid-cols-2">
                                            {group.map((config) => (
                                                <div key={config.name}>{renderField(config)}</div>
                                            ))}
                                        </div>
                                    ))}

                                    {textAreaFields.map((config) => (
                                        <div key={config.name}>{renderField(config)}</div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Product Images */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Product Images
                                    </CardTitle>
                                    <CardDescription>
                                        Add high-quality images of your product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {imageFields.fields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Image {index + 1}</h4>
                                                {imageFields.fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => imageFields.remove(index)}
                                                        disabled={isFormDisabled}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`images.${index}.imageUrl`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Image URL *</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://..." disabled={isFormDisabled} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`images.${index}.altText`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Alt Text</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Describe the image" disabled={isFormDisabled} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`images.${index}.isPrimary`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    disabled={isFormDisabled}
                                                                />
                                                            </FormControl>
                                                            <FormLabel>Primary Image</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`images.${index}.displayOrder`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                            <FormLabel className="whitespace-nowrap">Display Order:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    className="w-20"
                                                                    disabled={isFormDisabled}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => imageFields.append({
                                            imageUrl: "",
                                            altText: "",
                                            isPrimary: false,
                                            displayOrder: imageFields.fields.length
                                        })}
                                        disabled={isFormDisabled}
                                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Another Image
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Product Variants */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Product Variants
                                    </CardTitle>
                                    <CardDescription>
                                        Configure size, color, and inventory for each variant
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {variantFields.fields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Variant {index + 1}</h4>
                                                {variantFields.fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => variantFields.remove(index)}
                                                        disabled={isFormDisabled}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.size`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Size *</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value} disabled={isFormDisabled}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select size" />
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

                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.color`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Color *</FormLabel>
                                                            <Select onValueChange={(value) => {
                                                                field.onChange(value);
                                                                const selectedColor = commonColors.find(c => c.name === value);
                                                                if (selectedColor) {
                                                                    form.setValue(`variants.${index}.colorHex`, selectedColor.hex);
                                                                }
                                                            }} value={field.value} disabled={isFormDisabled}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select color" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {commonColors.map((color) => (
                                                                        <SelectItem key={color.name} value={color.name}>
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className="w-4 h-4 rounded border"
                                                                                    style={{ backgroundColor: color.hex }}
                                                                                />
                                                                                {color.name}
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.sku`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Variant SKU *</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g., SHIRT-001-M-BLK" disabled={isFormDisabled} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.stockQuantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Stock Quantity *</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" disabled={isFormDisabled} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.additionalPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Additional Price ($)</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="0.00"
                                                                        className="pl-10" disabled={isFormDisabled}                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Extra charge for this variant
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => variantFields.append({
                                            size: "",
                                            color: "",
                                            colorHex: "",
                                            stockQuantity: 0,
                                            additionalPrice: 0,
                                            sku: ""
                                        })}
                                        disabled={isFormDisabled}
                                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Another Variant
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Settings Sidebar */}
                        <div className="space-y-6">
                            {/* Category & Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                    <CardDescription>
                                        Product category and visibility settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isFormDisabled}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator />

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active</FormLabel>
                                                    <FormDescription>
                                                        Product is visible to customers
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isFormDisabled}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isDraft"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Draft</FormLabel>
                                                    <FormDescription>
                                                        Save as draft for later publishing
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isFormDisabled}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Summary Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Images:</span>
                                        <Badge variant="secondary">{imageFields.fields.length}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Variants:</span>
                                        <Badge variant="secondary">{variantFields.fields.length}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total Stock:</span>
                                        <Badge variant="secondary">
                                            {variantFields.fields.reduce((acc, field, index) => {
                                                const formValues = form.getValues(`variants.${index}`);
                                                return acc + (Number(formValues?.stockQuantity) || 0);
                                            }, 0)}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
