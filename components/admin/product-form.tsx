"use client";

import { useState, useCallback, useMemo } from "react";
import { Form } from "@/components/ui/form";
import { useProductForm } from "@/hooks/use-product-form";
import { UploadedImage } from "./image-upload";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { ProductFormData } from "@/lib/validations";

// Modular components - use explicit paths to avoid circular imports
import { BasicInfoSection } from "./product-form/basic-info-section";
import { ImagesSection } from "./product-form/images-section";
import { VariantsSection } from "./product-form/variants-section";
import { StatusCard, SummaryCard } from "./product-form/sidebar-cards";
import { LoadingState, ErrorState, NotFoundState, FormHeader } from "./product-form/form-states";

// ============================================================================
// Types
// ============================================================================

interface ProductFormProps {
    initialData?: Partial<ProductFormData> & { id?: string };
    isEditing?: boolean;
    productId?: string;
}

interface DeleteDialogState {
    open: boolean;
    index: number;
    type: "variant" | "image";
}

// ============================================================================
// Main Component
// ============================================================================

export function ProductForm({ initialData, isEditing = false, productId }: ProductFormProps) {
    // Form hook
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

    // Local state
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        open: false,
        index: -1,
        type: "variant",
    });

    // ========================================================================
    // Image handling
    // ========================================================================

    const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
        // Use replace instead of multiple remove/append calls to avoid UI freeze
        const formattedImages = newImages
            .filter(img => img.url)
            .map((img, index) => ({
                imageUrl: img.url,
                altText: img.altText || "",
                isPrimary: img.isPrimary || index === 0,
                displayOrder: index,
            }));

        // Replace entire array in one operation
        imageFields.replace(formattedImages);
    }, [imageFields]);

    // Watch for changes in the images field array
    const watchedImages = form.watch("images");

    const currentImages: UploadedImage[] = useMemo(() => {
        if (!watchedImages || !Array.isArray(watchedImages)) return [];

        return watchedImages
            .map((img, index) => ({
                url: img?.imageUrl || "",
                altText: img?.altText || "",
                isPrimary: img?.isPrimary || index === 0,
                displayOrder: img?.displayOrder || index,
            }))
            .filter(img => img.url);
    }, [watchedImages]);

    // ========================================================================
    // Variant deletion
    // ========================================================================

    const handleDeleteVariant = useCallback((index: number) => {
        setDeleteDialog({ open: true, index, type: "variant" });
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteDialog.type === "variant" && deleteDialog.index >= 0) {
            variantFields.remove(deleteDialog.index);
        }
        setDeleteDialog({ open: false, index: -1, type: "variant" });
    }, [deleteDialog, variantFields]);

    const closeDeleteDialog = useCallback((open: boolean) => {
        setDeleteDialog(prev => ({ ...prev, open }));
    }, []);

    // ========================================================================
    // Computed values
    // ========================================================================

    const totalStock = useMemo(() => {
        return variantFields.fields.reduce((acc, _, index) => {
            const qty = form.getValues(`variants.${index}.stockQuantity`);
            return acc + (Number(qty) || 0);
        }, 0);
    }, [variantFields.fields, form]);

    // ========================================================================
    // Render states
    // ========================================================================

    if (isEditing && isLoadingProduct) {
        return <LoadingState />;
    }

    if (isEditing && productError) {
        const message = productError instanceof Error
            ? productError.message
            : "Failed to load product";
        return <ErrorState message={message} onRetry={refetchProduct} />;
    }

    if (isEditing && productData && !productData.success) {
        return <NotFoundState />;
    }

    // ========================================================================
    // Main render
    // ========================================================================

    return (
        <>
            <Form {...form}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
                    <FormHeader isEditing={isEditing} isSubmitting={isFormDisabled} />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <BasicInfoSection
                                form={form}
                                categories={categories}
                                disabled={isFormDisabled}
                            />

                            <ImagesSection
                                images={currentImages}
                                onImagesChange={handleImagesChange}
                                disabled={isFormDisabled}
                            />

                            <VariantsSection
                                form={form}
                                variantFields={variantFields}
                                disabled={isFormDisabled}
                                onDeleteVariant={handleDeleteVariant}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <StatusCard
                                control={form.control}
                                disabled={isFormDisabled}
                            />

                            <SummaryCard
                                imageCount={currentImages.length}
                                variantCount={variantFields.fields.length}
                                totalStock={totalStock}
                            />
                        </div>
                    </div>
                </form>
            </Form>

            <DeleteConfirmDialog
                open={deleteDialog.open}
                onOpenChange={closeDeleteDialog}
                onConfirm={confirmDelete}
                title="Delete Variant"
                description="Are you sure you want to delete this variant? This action cannot be undone."
            />
        </>
    );
}
