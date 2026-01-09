import CustomizationClient from "./customization-client";

export default async function CustomizationPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    return <CustomizationClient slug={slug} />;
}