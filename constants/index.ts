import { PremiumProductCardProps } from "@/components/cards/home-premimum-product-card";
import {BestsellerCardProps} from "@/lib/types";
import { SizeGuideRow, SizeGuideMeasurement } from "@/lib/types";
//account
import { Order, PaymentCard, Address, MarketingPreference } from '@/lib/types';
import { Product } from '@/lib/types';
import {cartProduct} from "@/lib/types";

export const items: BestsellerCardProps[] = [
    {
        imageUrl: "/home/section2/sec1-col-1.webp",
        brand: "Nike",
        name: "Air Max 270",
        price: 150,
        colors: ["#000000", "#FFFFFF", "#FF0000"]
    },
    {
        imageUrl: "/home/section2/sec1-col-2.webp",
        brand: "Adidas",
        name: "Ultraboost 21",
        price: 180,
        colors: ["#000000", "#00FF00", "#0000FF"]
    },
    {
        imageUrl: "/home/section2/sec1-col-3.webp",
        brand: "Puma",
        name: "RS-X3",
        price: 120,
        colors: ["#FFFF00", "#FF00FF", "#00FFFF"]
    },
    {
        imageUrl: "/home/section2/sec1-col-4.webp",
        brand: "Reebok",
        name: "Nano X1",
        price: 130,
        colors: ["#C0C0C0", "#808080", "#800000"]
    },
    {
        imageUrl: "/home/section2/sec2-col-2.webp",
        brand: "New Balance",
        name: "Fresh Foam 1080v11",

        price: 160,

        colors: ["#008000", "#000080", "#FFA500"]
    }
];

export const features = [
    {
        icon: "/icons/payment.avif",
        title: "PAYMENT",
        description: "Credit card & PayPal",
    },
    {
        icon: "/icons/Delivery.avif",
        title: "DELIVERY",
        description: "24h Green delivery",
    },
    {
        icon: "/icons/wonder-card.avif",
        title: "WONDER CARD",
        description: "Special discount club card",
    },
    {
        icon: "/icons/shipping.avif",
        title: "SHIPPING",
        description: "Free standard shipping",
    }
];

export const categories = [
    {
        id: 1,
        title: "MEN",
        image: "/home/section2/sec1-col-1.webp",
        url : "/products?category=men"
    },
    {
        id: 2,
        title: "WOMEN",
        image: "/home/section2/sec1-col-2.webp",
        url : "/products?category=women"
    },
    {
        id: 3,
        title: "KIDS",
        image: "/home/section2/sec1-col-3.webp",
        url : "/products?category=kids"
    },
];

export const testimonials = [
    {
        id: 1,
        name: "Sarah Mitchell",
        role: "Fashion Enthusiast",
        avatar: "/home/testimonials/avatar1.jpg",
        rating: 5,
        text: "Absolutely in love with the quality and craftsmanship! Every piece feels like it was made just for me. The attention to detail is remarkable.",
    },
    {
        id: 2,
        name: "Emily Rodriguez",
        role: "Style Blogger",
        avatar: "/home/testimonials/avatar2.jpg",
        rating: 5,
        text: "The Nala Armoire has become my go-to for unique, handmade pieces. The designs are timeless and the customer service is exceptional!",
    },
    {
        id: 3,
        name: "Jessica Chen",
        role: "Creative Director",
        avatar: "/home/testimonials/avatar3.jpg",
        rating: 5,
        text: "I've never felt more confident in my wardrobe choices. These pieces are not just clothes, they're wearable art. Highly recommend!",
    },
];


export const MOCK_PRODUCT: Product = {
    id: "1",
    slug: "dress-tied-at-the-waist",
    name: "DRESS TIED AT THE WAIST",
    brand: "MOE",
    price: 550.00,
    currency: "IND",
    description: "The dress is made of thin knit fabric. The long-sleeved dress combined with a ramon jacket and sports shoes will create an interesting styling for any occasion. Unfinished elements and a cut-out bottom add character to the dress.",
    washCare: "Machine wash at 40°C, do not tumble dry, A shrinkage of up to 5% may occur.",
    features: [
        { id: "1", text: "Length before the knee" },
        { id: "2", text: "Unlined" },
        { id: "3", text: "Cut-out bottom" },
        { id: "4", text: "100% cotton" },
        { id: "5", text: "Our model is 171 cm tall and wears size S" }
    ],
    variants: [
        {
            id: "v1",
            color: "Pink",
            colorCode: "#F5B8C5",
            sizes: [
                { id: "s1", value: "36", inStock: true },
                { id: "s2", value: "38", inStock: true },
                { id: "s3", value: "40", inStock: true },
                { id: "s4", value: "42", inStock: false }
            ],
            images: [
                { id: "i1", url: "/products/pink-1-dress.webp", alt: "Pink dress front view" },
                { id: "i2", url: "/products/pink-2-dress.webp", alt: "Pink dress side view" }
            ]
        },
        {
            id: "v2",
            color: "Blue",
            colorCode: "#6B9AC4",
            sizes: [
                { id: "s1", value: "36", inStock: true },
                { id: "s2", value: "38", inStock: true },
                { id: "s3", value: "40", inStock: true },
                { id: "s4", value: "42", inStock: true }
            ],
            images: [
                { id: "i1", url: "/products/blue-1-dress.webp", alt: "Blue dress front view" },
                { id: "i2", url: "/products/blue-2-dress.webp", alt: "Blue dress side view" }
            ]
        },
        {
            id: "v3",
            color: "Black",
            colorCode: "#000000",
            sizes: [
                { id: "s1", value: "36", inStock: true },
                { id: "s2", value: "38", inStock: true },
                { id: "s3", value: "40", inStock: true },
                { id: "s4", value: "42", inStock: true }
            ],
            images: [
                { id: "i1", url: "/products/black-1-dress.webp", alt: "Black dress front view" },
                { id: "i2", url: "/products/black-2-dress.webp", alt: "Black dress back view" }
            ]
        }
    ],
    selectedVariantId: "v3"
};


export const SIZE_GUIDE_DATA: SizeGuideRow[] = [
    {
        size: "36",
        waist: "36",
        hips: "62",
        inseam: "76",
        outseam: "102",
    },
    {
        size: "38",
        waist: "38.5",
        hips: "64.5",
        inseam: "77",
        outseam: "104",
    },
    {
        size: "40",
        waist: "41",
        hips: "67",
        inseam: "78",
        outseam: "106",
    },
    {
        size: "42",
        waist: "43.5",
        hips: "69.5",
        inseam: "79",
        outseam: "108",
    },
];

export const MEASUREMENT_DESCRIPTIONS: SizeGuideMeasurement[] = [
    {
        label: "Shoulders:",
        description: "Measured from one shoulder end to the other across the back.",
    },
    {
        label: "Chest:",
        description: "Measured around the widest part of the chest, just under the armpits.",
    },
    {
        label: "Waist:",
        description: "Measured around the natural waistline, usually above the belly button.",
    },
    {
        label: "Hips:",
        description: "Measured around the widest part of the hips and buttocks.",
    },
    {
        label: "Length:",
        description: "Measured from the highest point of the shoulder near the neck to the bottom edge of the garment.",
    },
    {
        label: "Sleeve Length:",
        description: "Measured from the shoulder seam to the end of the cuff.",
    },
    {
        label: "Inseam:",
        description: "Measured from the crotch to the bottom of the leg.",
    },
    {
        label: "Outseam:",
        description: "Measured from the waist to the bottom of the leg.",
    },
];


export const INITIAL_ORDERS: Order[] = [
    {
        id: 'ORD-2024-001',
        date: '2024-11-15',
        total: 299.99,
        status: 'delivered',
        items: [
            { id: 'item-1', name: 'Wireless Headphones', quantity: 1, price: 149.99, image: '/home/section10/img1.webp' },
            { id: 'item-2', name: 'Phone Case', quantity: 2, price: 75.00, image: '/home/section10/img2.webp' },
        ],
        deliveryAddress: '123 Main St, New York, NY 10001'
    },
    {
        id: 'ORD-2024-002',
        date: '2024-11-20',
        total: 89.99,
        status: 'expected',
        items: [
            { id: 'item-3', name: 'Fitness Tracker', quantity: 1, price: 89.99, image: '/home/section10/img3.webp' },
        ],
        deliveryAddress: '123 Main St, New York, NY 10001'
    },
    {
        id: 'ORD-2024-003',
        date: '2024-10-28',
        total: 45.50,
        status: 'returned',
        items: [
            { id: 'item-4', name: 'USB Cable', quantity: 3, price: 45.50, image: '/home/section6/image1.png' },
        ],
        deliveryAddress: '123 Main St, New York, NY 10001'
    }
];

export const INITIAL_CARDS: PaymentCard[] = [
    { id: 'card-1', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: 'card-2', last4: '8888', brand: 'Mastercard', expiry: '06/26', isDefault: false }
];

export const INITIAL_ADDRESSES: Address[] = [
    {
        id: 'addr-1',
        type: 'Home',
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        isDefault: true
    },
    {
        id: 'addr-2',
        type: 'Work',
        name: 'John Doe',
        street: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        isDefault: false
    }
];

export const INITIAL_PREFERENCES: MarketingPreference[] = [
    {
        id: 'pref-1',
        title: 'Email Newsletters',
        description: 'Receive our weekly newsletter with the latest products and exclusive offers.',
        enabled: true
    },
    {
        id: 'pref-2',
        title: 'SMS Notifications',
        description: 'Get order updates and special promotions sent directly to your phone.',
        enabled: false
    },
    {
        id: 'pref-3',
        title: 'Personalized Recommendations',
        description: 'Allow us to send product suggestions based on your browsing and purchase history.',
        enabled: true
    },
    {
        id: 'pref-4',
        title: 'Partner Offers',
        description: 'Receive special deals from our trusted partners and affiliated brands.',
        enabled: false
    }
];



export const sampleProducts: cartProduct[] = [
    {id: 'AN2-518',
    name: 'Black Slim Tailored Trousers With Wool',
    price: 3543,
    image: '/home/section4/img1.webp',
    size: 'UK 12 Short (Medium)',
    stockStatus: 'in-stock'},

    {id: 'AN2-517',
        name: 'Black Slim Tailored Trousers With Wool',
        price: 3543,
        image: '/home/section4/img1.webp',
        size: 'UK 12 Short (Medium)',
        stockStatus: 'in-stock'},

];

export const customersAlsoBought: cartProduct[] = [
    { id: '1', name: 'Next Black Tailored Single Breasted...', price: 6089, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: '2', name: 'Next Black Slim Tailored Trousers', price: 3764, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: '3', name: 'Next Navy Blue Tailored Single...', price: 6089, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: '4', name: 'Next Black Tailored Pencil Skirt With...', price: 3321, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: '5', name: 'Next Black Button Detail Skinny...', price: 4650, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: '6', name: 'Next Black Tailored Single Breasted...', price: 6089, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },

];

export const recentlyViewedProducts: cartProduct[] = [
    { id: 'rv1', name: 'Black Trousers', price: 3543, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: 'rv2', name: 'White Shirts Pack', price: 2426, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: 'rv3', name: 'Colored Shirts Pack', price: 2426, image: '/home/section4/img1.webp', stockStatus: 'in-stock' },
    { id: 'rv4', name: 'White Shirts Pack', price: 2426, image: '/home/section4/img1.webp', stockStatus: 'in-stock' }
];


