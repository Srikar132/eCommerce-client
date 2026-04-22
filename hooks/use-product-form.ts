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
import { useEffect, useMemo } from "react";
import { getAllCategories, getProductById } from "@/lib/actions/product-actions";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product-mutations";
import { productFormSchema, ProductFormData, PRODUCT_SIZES, PRODUCT_COLORS } from "@/lib/validations";
import { generateSKU } from "@/lib/utils";

// Transform API product data to form data structure
function transformProductToFormData(productData: any): ProductFormData {
    if (!productData) return getDefaultFormValues();

    return {
        name: productData.name || "",
        description: productData.description || "",
        basePrice:
            typeof productData.basePrice === "number"
                ? productData.basePrice
                : parseFloat(productData.basePrice?.toString() || "0"),
        sku: productData.sku || generateSKU("PRD"),
        material: productData.material || "",
        careInstructions: productData.careInstructions || "",
        categoryId: productData.categoryId || "",
        isActive: productData.isActive ?? true,
        isDraft: productData.isDraft ?? false,
        images:
            Array.isArray(productData.images) && productData.images.length > 0
                ? productData.images.map((img: any, index: number) => ({
                      imageUrl: img.imageUrl || "",
                      altText: img.altText || "",
                      isPrimary: img.isPrimary || index === 0,
                      displayOrder: img.displayOrder ?? index,
                  }))
                : [
                      {
                          imageUrl: "https://placehold.co/600x600?text=No+Image",
                          altText: "No Image",
                          isPrimary: true,
                          displayOrder: 0,
                      },
                  ],
        variants:
            Array.isArray(productData.variants) && productData.variants.length > 0
                ? productData.variants.map((v: any) => ({
                      // FIX: fall back to the first enum value, not a free-text string
                      size: (PRODUCT_SIZES as readonly string[]).includes(v.size)
                          ? v.size
                          : PRODUCT_SIZES[0],
                      color: (PRODUCT_COLORS as readonly string[]).includes(v.color)
                          ? v.color
                          : PRODUCT_COLORS[0],
                      colorHex: v.colorHex || "#000000",
                      stockQuantity:
                          typeof v.stockQuantity === "number"
                              ? v.stockQuantity
                              : parseInt(v.stockQuantity?.toString() || "0"),
                      // FIX: field was renamed additionalPrice → priceModifier
                      priceModifier:
                          typeof v.priceModifier === "number"
                              ? v.priceModifier
                              : parseFloat(v.priceModifier?.toString() || "0"),
                      sku: v.sku || generateSKU("VAR"),
                      isActive: v.isActive ?? true,
                  }))
                : [
                      {
                          size: PRODUCT_SIZES[0],
                          color: PRODUCT_COLORS[0],
                          colorHex: "#000000",
                          stockQuantity: 0,
                          priceModifier: 0,
                          sku: generateSKU("VAR"),
                          isActive: true,
                      },
                  ],
    };
}

// Default form values for new products
const getDefaultFormValues = (): ProductFormData => ({
    name: "",
    description: "",
    basePrice: 0,
    sku: generateSKU("PRD"),
    material: "",
    careInstructions: "",
    categoryId: "",
    isActive: true,
    isDraft: false,
    images: [
        {
            imageUrl: "https://placehold.co/600x600?text=Product+Image",
            altText: "Product Image",
            isPrimary: true,
            displayOrder: 0,
        },
    ],
    variants: [
        {
            size: PRODUCT_SIZES[0],
            color: PRODUCT_COLORS[0],
            colorHex: "#000000",
            stockQuantity: 0,
            priceModifier: 0,
            sku: generateSKU("VAR"),
            isActive: true,
        },
    ],
});

interface UseProductFormProps {
    isEditing?: boolean;
    productId?: string;
    initialData?: any;
}

export function useProductForm({
    isEditing = false,
    productId,
    initialData,
}: UseProductFormProps) {
    // Get categories
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    // Fetch product data for editing
    const {
        data: fetchedProduct,
        isLoading: isLoadingProduct,
        error: productError,
        refetch: refetchProduct,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => (productId ? getProductById(productId) : null),
        enabled: isEditing && !!productId && !initialData,
    });

    // Mutations
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();

    // Determine the actual product data source
    const effectiveProductData = useMemo(() => {
        if (initialData) return initialData;
        if (isEditing && fetchedProduct?.success) return fetchedProduct.data;
        return null;
    }, [initialData, isEditing, fetchedProduct]);

    // Initialize form
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: useMemo(() => {
            return effectiveProductData
                ? transformProductToFormData(effectiveProductData)
                : getDefaultFormValues();
        }, [effectiveProductData]),
        mode: "onChange",
    });

    // Reset form when product data changes (for edit mode)
    useEffect(() => {
        if (isEditing && effectiveProductData) {
            form.reset(transformProductToFormData(effectiveProductData));
        }
    }, [effectiveProductData, isEditing, form]);

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
            if (isEditing) {
                const id = productId || initialData?.id;
                if (!id) throw new Error("Product ID is missing");
                await updateProductMutation.mutateAsync({ id, data });
            } else {
                await createProductMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    // Computed states
    const isLoading =
        createProductMutation.isPending || updateProductMutation.isPending;
    const isFormDisabled = isLoading || isLoadingProduct;
    const categories = categoriesData?.data || [];

    return {
        // Form management
        form,
        imageFields,
        variantFields,
        handleSubmit: form.handleSubmit(handleSubmit),

        // Data
        categories,
        isLoadingProduct,
        isFormDisabled,
        productError,
        // FIX: expose fetchedProduct so ProductForm can check .success
        productData: fetchedProduct,

        // Actions
        refetchProduct,
        createProductMutation,
        updateProductMutation,
    };
}

export { transformProductToFormData, getDefaultFormValues };