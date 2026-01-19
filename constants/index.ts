import { BestsellerCardProps } from "@/components/cards/best-seller";
//account

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


interface SizeGuideRow {
    size: string;
    waist: string;
    hips: string;
    inseam: string;
    outseam: string;
}



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

interface SizeGuideMeasurement {
    label: string;
    description: string;
}

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
