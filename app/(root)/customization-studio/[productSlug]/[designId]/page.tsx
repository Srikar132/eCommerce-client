


import CustomizationStudioClient from "./customization-studio-client";

export default async function CustomizationStudioPage({ 
    params, 
    searchParams 
}: { 
    params: { productSlug: string; designId: string }; 
    searchParams: { variantId: string } 
}) {
    const { productSlug, designId } = await params;
    const { variantId } = await searchParams;

    return (
        <CustomizationStudioClient
            productSlug={productSlug}
            designId={designId}
            variantId={variantId}
        />
    );
}