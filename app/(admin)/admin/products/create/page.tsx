"use client";

import { ProductForm } from "@/components/admin/product-form";
import { Suspense } from "react";

export default function CreateProductPage() {
    return (
        <Suspense fallback={
            <div className="admin-container">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading product creator...</span>
                    </div>
                </div>
            </div>
        }>
            <ProductForm isEditing={false} />
        </Suspense>
    );
}