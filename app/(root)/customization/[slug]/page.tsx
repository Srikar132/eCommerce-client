import CustomizationClient from "@/components/customization/customization-client";

export default async function CustomizationPage({
    params,
    searchParams
}: {
    params: { slug: string };
    searchParams: { variantId?: string };
}) {
    const { slug } = await params;
    const { variantId } = await searchParams;

    return <CustomizationClient slug={slug} variantId={variantId} />;
}