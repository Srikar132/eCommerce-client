/**
 * Custom hook for managing product form state and operations
 * 
 * This hook encapsulates all the product form logic including:
 * - Data fetching for editing
 * - Form state management
 * - Submit operations
 * - Loading and error states
 */

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllCategories, getProductById } from "@/lib/actions/product-actions";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product-mutations";
import { productFormSchema, ProductFormData } from "@/lib/validations";

// Transform API product data to form data structure
function transformProductToFormData(productData: Record<string, unknown>): ProductFormData {
    return {
        name: (productData.name as string) || "",
        description: (productData.description as string) || "",
        basePrice: parseFloat((productData.basePrice as string)?.toString() || "0"),
        sku: (productData.sku as string) || "",
        material: (productData.material as string) || "",
        careInstructions: (productData.careInstructions as string) || "",
        categoryId: (productData.categoryId as string) || "",
        isActive: (productData.isActive as boolean) ?? true,
        isDraft: (productData.isDraft as boolean) ?? false,
        images: productData.images && Array.isArray(productData.images) && productData.images.length > 0
            ? productData.images.map((img: Record<string, unknown>, index: number) => ({
                imageUrl: (img.imageUrl as string) || "",
                altText: (img.altText as string) || "",
                isPrimary: (img.isPrimary as boolean) || index === 0,
                displayOrder: (img.displayOrder as number) ?? index
            })) : [{ imageUrl: "", altText: "", isPrimary: true, displayOrder: 0 }],
        variants: productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0
            ? productData.variants.map((variant: Record<string, unknown>) => ({
                size: (variant.size as string) || "",
                color: (variant.color as string) || "",
                colorHex: (variant.colorHex as string) || "",
                stockQuantity: (variant.stockQuantity as number) || 0,
                additionalPrice: parseFloat((variant.additionalPrice as string)?.toString() || "0"),
                sku: (variant.sku as string) || ""
            })) : [{
                size: "",
                color: "",
                colorHex: "",
                stockQuantity: 0,
                additionalPrice: 0,
                sku: ""
            }]
    };
}

// Default form values for new products
const getDefaultFormValues = (): ProductFormData => ({
    name: "",
    description: "",
    basePrice: 0,
    sku: "",
    material: "",
    careInstructions: "",
    categoryId: "",
    isActive: true,
    isDraft: false,
    images: [{ imageUrl: "", altText: "", isPrimary: true, displayOrder: 0 }],
    variants: [{
        size: "",
        color: "",
        colorHex: "",
        stockQuantity: 0,
        additionalPrice: 0,
        sku: ""
    }]
});

interface UseProductFormProps {
    isEditing?: boolean;
    productId?: string;
    initialData?: Partial<ProductFormData> & { id?: string };
}

export function useProductForm({
    isEditing = false,
    productId,
    initialData
}: UseProductFormProps) {
    // Get categories
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    // Fetch product data for editing
    const {
        data: productData,
        isLoading: isLoadingProduct,
        error: productError,
        refetch: refetchProduct
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => productId ? getProductById(productId) : null,
        enabled: isEditing && !!productId && !initialData,
        retry: 2,
        retryDelay: 1000,
    });

    // Mutations
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();

    // Determine the actual product data source
    const effectiveProductData = initialData
        ? initialData
        : isEditing && productData?.success
            ? productData.data
            : undefined;

    const hasProductData = isEditing ? !!effectiveProductData : true;

    // Initialize form
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        defaultValues: effectiveProductData
            ? transformProductToFormData(effectiveProductData)
            : getDefaultFormValues(),
        mode: "onChange",
    });

    // Reset form when product data changes (for edit mode)
    useEffect(() => {
        if (isEditing && effectiveProductData && hasProductData) {
            const formData = transformProductToFormData(effectiveProductData);
            form.reset(formData);
        }
    }, [effectiveProductData, form, isEditing, hasProductData]);

    // Field arrays
    const imageFields = useFieldArray({
        control: form.control,
        name: "images",
    });

    const variantFields = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Submit handler
    const handleSubmit = async (data: ProductFormData) => {
        try {
            if (isEditing && (productId || initialData?.id)) {
                const id = productId || initialData?.id;
                if (!id) {
                    throw new Error("Product ID is required for updating");
                }
                await updateProductMutation.mutateAsync({ id, data });
            } else {
                await createProductMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error('Submit error:', error);
            // Error handling is managed by the mutations
        }
    };

    // Computed states
    const isLoading = createProductMutation.isPending || updateProductMutation.isPending;
    const isFormDisabled = isLoading || isLoadingProduct;
    const categories = categoriesData?.data || [];

    return {
        // Form management
        form,
        imageFields,
        variantFields,
        handleSubmit,

        // Data
        categories,
        productData,
        effectiveProductData,
        hasProductData,

        // States
        isLoadingProduct,
        isFormDisabled,
        productError,

        // Actions
        refetchProduct,

        // Mutations (for external access if needed)
        createProductMutation,
        updateProductMutation,
    };
}

export { transformProductToFormData, getDefaultFormValues };