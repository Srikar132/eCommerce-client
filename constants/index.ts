import {BestsellerCardProps} from "@/lib/types";

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