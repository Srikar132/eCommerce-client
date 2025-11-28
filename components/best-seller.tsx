import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import BestsellerCard from "./cards/best-seller";
import {items} from "@/constants";


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