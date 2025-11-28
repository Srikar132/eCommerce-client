import {BestsellerCardProps} from "@/lib/types";
import {Product} from "@/lib/types";
import { SizeGuideRow, SizeGuideMeasurement } from "@/lib/types";

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
        image: "/home/section2/sec1-col-1.webp"
    },
    {
        id: 2,
        title: "WOMEN",
        image: "/home/section2/sec1-col-2.webp"
    },
    {
        id: 3,
        title: "KIDS BOYS",
        image: "/home/section2/sec1-col-3.webp"
    },
    {
        id: 4,
        title: "KIDS GIRLS",
        image: "/home/section2/sec1-col-4.webp"
    }
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

