import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product-actions";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;
    const result = await getProductById(id);

    const initialData = result.success && result.data
        ? {
            name: result.data.name,
            description: result.data.description || undefined,
            basePrice: Number(result.data.basePrice) || 0,
            sku: result.data.sku,
            material: result.data.material || undefined,
            careInstructions: result.data.careInstructions || undefined,
            categoryId: result.data.categoryId || "",
            isActive: result.data.isActive ?? true,
            isDraft: result.data.isDraft ?? false,
            images: (result.data.images || []).map((img) => ({
                imageUrl: img.imageUrl,
                altText: img.altText || undefined,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            })),
            variants: (result.data.variants || []).map((variant) => ({
                size: variant.size,
                color: variant.color,
                colorHex: variant.colorHex || undefined,
                stockQuantity: Number(variant.stockQuantity) || 0,
                additionalPrice: Number(variant.additionalPrice) || 0,
                sku: variant.sku,
            })),
        }
        : undefined;

    return (
        <ProductForm
            initialData={initialData}
            isEditing={true}
            productId={id}
        />
    );
}