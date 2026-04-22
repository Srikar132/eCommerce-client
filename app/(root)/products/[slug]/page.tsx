import ProductDetailClient from "@/components/product/product-detail-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { getProductBySlug, getProductVariants } from "@/lib/actions/product-actions";
import ProductReviewsSection from "@/components/product/product-reviews-section";
import { ReviewsSkeleton } from "@/components/product/reviews-skeleton";
import { ProductSchema, BreadcrumbSchema } from "@/components/shared/structured-data";
import ScrollingBanner from "@/components/landing-page/scrolling-banner";
import ProductRecommendations from "@/components/product/product-recommendations";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";


interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}


const URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://nalaarmoire.com";




export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    try {
        const { slug } = await params;
        const product = await getProductBySlug(slug);

        if (!product) {
            return {
                title: "Product Not Found",
            };
        }

        const productImage = product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;
        
        // Construct a richer SEO description
        const baseDescription = product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160);
        const description = baseDescription || `Shop the exquisite ${product.name} at Nala Armoire. Premium handcrafted embroidered clothing made with the finest fabrics.`;

        // SEO Title: Product Type + Brand
        const seoTitle = `${product.name} | Handcrafted Embroidered Clothing | Nala Armoire`;

        return {
            title: seoTitle,
            description,
            keywords: [
                product.name,
                "handcrafted embroidered clothing",
                "premium fabric outfits",
                "handcrafted embroidery",
                "Nala Armoire clothing",
                "family ethnic wear",
            ],
            openGraph: {
                title: seoTitle,
                description,
                url: `${URL}/products/${slug}`,
                images: [
                    {
                        url: productImage,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: seoTitle,
                description,
                images: [productImage],
            },
            alternates: {
                canonical: `${URL}/products/${slug}`,
            },
        };
    } catch {
        return {
            title: "Product Not Found",
        };
    }
}



export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Fetch product data using cached function
    const product = await getProductBySlug(slug).catch(() => null);

    if (!product) {
        notFound();
    }

    // Fetch variants using cached function
    const variants = product.variants;

    // Prepare structured data
    const productUrl = `${URL}/products/${product.slug}`;
    const productImage = product.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;
    const productPrice = product.basePrice;

    const breadcrumbItems = [
        { name: "Home", url: URL },
        { name: "Products", url: "https://nalaarmoire.com/products" },
        { name: product.name, url: productUrl },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data for SEO */}
            <ProductSchema
                name={product.name}
                description={product.description || "Premium customizable fashion from Nala Armoire"}
                image={productImage}
                price={productPrice}
                currency="INR"
                availability="InStock"
                sku={product.id}
                url={productUrl}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            {/* BREADCRUMB  */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6 lg:hidden">
                <BreadcrumbNavigation />
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <ProductDetailClient product={product} variants={variants || []} />

                {/* Reviews Section - Moved up */}
                <Suspense fallback={<ReviewsSkeleton />}>
                    <div className="mt-20">
                        <ProductReviewsSection productId={product.id} />
                    </div>
                </Suspense>

                {/* Scrolling Banner */}
                <div className="mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
                    <ScrollingBanner />
                </div>

                {/* You May Also Like Section */}
                <Suspense fallback={<div>...</div>}>
                    <div className="mt-20">
                        <ProductRecommendations
                            excludeProductId={product.id}
                            categorySlug={product.category?.slug}
                        />
                    </div>
                </Suspense>
            </div>
        </div>
    );
}