"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
} from "@/lib/actions/product-actions";
import { ProductFormData } from "@/lib/validations";

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Product created successfully!");
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
                router.push("/admin/products");
            } else {
                toast.error(result.error || "Failed to create product");
            }
        },
        onError: (error: Error) => {
            console.error("Create product error:", error);
            toast.error(error.message || "Failed to create product");
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
            updateProduct(id, data),
        onSuccess: (result, variables) => {
            if (result.success) {
                toast.success("Product updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
                queryClient.invalidateQueries({
                    queryKey: ["product", variables.id]
                });
                router.push("/admin/products");
            } else {
                toast.error(result.error || "Failed to update product");
            }
        },
        onError: (error: Error) => {
            console.error("Update product error:", error);
            toast.error(error.message || "Failed to update product");
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: (result) => {
            if (result.success) {
                // Show info toast for archived products, success for deleted
                if ('archived' in result && result.archived) {
                    toast.info(result.message || "Product archived");
                } else {
                    toast.success(result.message || "Product deleted successfully");
                }
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            } else {
                toast.error(result.error || "Failed to delete product");
            }
        },
        onError: (error: Error) => {
            console.error("Delete product error:", error);
            toast.error(error.message || "Failed to delete product");
        },
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkDeleteProducts,
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message || "Products deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            } else {
                toast.error(result.error || "Failed to delete products");
            }
        },
        onError: (error: Error) => {
            console.error("Bulk delete error:", error);
            toast.error(error.message || "Failed to delete products");
        },
    });
}

// Hook for product data fetching (related mutations)
export function useProductQueries() {
    const queryClient = useQueryClient();

    const invalidateProductQueries = () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    };

    const invalidateProductById = (productId: string) => {
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
    };

    return {
        invalidateProductQueries,
        invalidateProductById,
    };
}