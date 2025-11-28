import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import BestsellerCard, { BestsellerCardProps } from "./cards/best-seller";

const items: BestsellerCardProps[] = [
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

export function CarouselComponent() {
    return (
        <Carousel
            opts={{
                align: "start",
                containScroll: "trimSnaps",
                slidesToScroll: 1,
                dragFree: true,
                dragThreshold: 10,
                skipSnaps: false,
                loop: false,
            }}
            className="w-full max-w-full"
        >
            <CarouselContent className="-ml-1 py-5 overflow-x-scroll
                                                    [&::-webkit-scrollbar]:block
                                                    [&::-webkit-scrollbar]:h-1.5
                                                    [&::-webkit-scrollbar-track]:bg-gray-200
                                                    [&::-webkit-scrollbar-track]:rounded-lg
                                                    [&::-webkit-scrollbar-thumb]:bg-gray-400
                                                    [&::-webkit-scrollbar-thumb]:rounded-lg
                                                    [&::-webkit-scrollbar-thumb]:hover:bg-gray-600
                                                    lg:[&::-webkit-scrollbar]:h-1.5
                                                    lg:[&::-webkit-scrollbar-thumb]:bg-gray-500
                                                    lg:[&::-webkit-scrollbar-track]:bg-gray-300"
            >
                {Array.from({ length: 8 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-1 basis-[45%] sm:basis-[30%] md:basis-[25%] lg:basis-[20%]">
                        <div className="p-1">
                            <BestsellerCard {...items[index % items.length]} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className="hidden sm:flex" />
            <CarouselPrevious className="hidden sm:flex" />
        </Carousel>
    )
}



const BestSeller = () => {
    return (
        <section className="w-full py-6 lg:py-12 px-4">
            <h2 className="text-xl uppercase tracking-wider mb-6 text-center">OUR BEST SELLERS</h2>

            <CarouselComponent />
        </section>
    );
};


export default BestSeller;