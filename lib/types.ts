export interface BestsellerCardProps {
    imageUrl: string;
    brand: string;
    name: string;
    price: number;
    colors?: string[];
}

export interface featuredCards {
    id: number;
    image: string;
    alt: string;
}

// product.ts

export interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

export interface ProductVariant {
    id: string;
    color: string;
    colorCode: string;
    images: ProductImage[];
    sizes: ProductSize[];
}

export interface ProductSize {
    id: string;
    value: string;
    inStock: boolean;
}

export interface ProductFeature {
    id: string;
    text: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    currency: string;
    description: string;
    washCare: string;
    features: ProductFeature[];
    variants: ProductVariant[];
    selectedVariantId?: string;
    selectedSize?: string;
}

export interface ProductPageProps {
    params: {
        slug: string;
    };
}

export interface SizeGuideRow {
    size: string;
    waist: string;
    hips: string;
    inseam: string;
    outseam: string;
}

export interface SizeGuideMeasurement {
    label: string;
    description: string;
}
