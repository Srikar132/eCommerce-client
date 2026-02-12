/**
 * Sample Edit Product Page Component
 * 
 * This demonstrates how to use the enhanced ProductForm component
 * for editing products with proper production-level implementation.
 * 
 * Usage: Place this in app/(admin)/admin/products/[productId]/edit/page.tsx
 */

"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useParams } from "next/navigation";

interface EditProductPageProps {
    params: {
        productId: string;
    };
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const { productId } = useParams();

    return (
        <ProductForm
            isEditing={true}
            productId={productId as string}
        />
    );
}

/**
 * Alternative usage with initial data (if you prefer to pass data from server):
 * 
 * export default function EditProductPage({ 
 *     params, 
 *     initialProductData 
 * }: {
 *     params: { productId: string };
 *     initialProductData?: any;
 * }) {
 *     return (
 *         <ProductForm
 *             isEditing={true}
 *             productId={params.productId}
 *             initialData={initialProductData}
 *         />
 *     );
 * }
 */