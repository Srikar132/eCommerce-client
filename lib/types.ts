export type UUID = string;
export type ISODate = string;
export type Cents = number;


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


export type Category = {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type ProductCard = {
  id: UUID;
  name: string;
  slug: string;
  brand?: string;
  price: number; // cents
  imageUrl: string;
  badge?: string;
};



export type Facets = {
  colors?: string[];
  sizes?: string[];
  priceRanges?: { min: number; max: number }[];
  brands?: string[];
  [key: string]: any;
};


// types.ts
export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'expected' | 'delivered' | 'returned';
    items: OrderItem[];
    deliveryAddress: string;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface PaymentCard {
    id: string;
    last4: string;
    brand: string;
    expiry: string;
    isDefault: boolean;
}

export interface Address {
    id: string;
    type: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
}

export interface SignInDetails {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface MarketingPreference {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}