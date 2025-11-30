import {OrdersSection} from "@/components/account/orders-section";
import {SavedCardsSection} from "@/components/account/payment-cards-section";
import {SignInDetailsSection} from "@/components/account/login-details-section";
import {ReactNode} from "react";

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
  metadata?: Record<string, never>;
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

//account section types

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

export interface AccountSectionProps {
    // Orders props
    orders?: Order[];

    // Cards props
    cards?: PaymentCard[];
    onAddCard?: () => void;
    onEditCard?: (cardId: string) => void;
    onDeleteCard?: (cardId: string) => void;
    onSetDefaultCard?: (cardId: string) => void;

    // Sign in props
    currentEmail?: string;
    onUpdateCredentials?: (data: SignInDetails) => void;

    // Address props
    addresses?: Address[];
    onAddAddress?: () => void;
    onEditAddress?: (addressId: string) => void;
    onDeleteAddress?: (addressId: string) => void;
    onSetDefaultAddress?: (addressId: string) => void;

    // Preferences props
    preferences?: MarketingPreference[];
    onTogglePreference?: (prefId: string, enabled: boolean) => void;
    onSavePreferences?: () => void;
}

export interface AccountSection {
    id: string;
    component: (props: SectionProps) => ReactNode;
}

