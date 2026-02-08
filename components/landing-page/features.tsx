import Image from "next/image";
import { features } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
            
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16 space-y-3">
                <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                    Why Choose Us
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                    Premium Quality & Service
                </h2>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 relative z-10">
                    {features.map((feature, i) => (
                        <Card
                            key={i}
                            className="border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl sm:rounded-2xl overflow-hidden w-full sm:w-64 md:w-72"
                        >
                            <CardContent className="flex flex-col items-center text-center p-6 sm:p-8">
                                {/* Icon */}
                                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={50}
                                        height={40}
                                        style={{ width: 'auto', height: 'auto' }}
                                        className="object-contain drop-shadow-sm"
                                    />
                                </div>

                                <h3 className="text-sm sm:text-base font-semibold tracking-wider mb-2 text-foreground uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-lg sm:h-128 bg-accent/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
            </div>
        </section>
    );
};

export default Features;
