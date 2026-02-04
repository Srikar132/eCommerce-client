"use client";

import Image from "next/image";
import { features } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10 ">
                    {features.map((feature, i) => (
                        <Card 
                            key={i} 
                            className="border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl sm:rounded-2xl bg-none! overflow-hidden"
                        >
                            <CardContent className="flex flex-col items-center text-center p-4 sm:p-6 lg:p-8">
                                {/* Icon */}
                                <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={50}
                                        height={40}
                                        style={{ width: 'auto', height: 'auto' }}
                                        className="object-contain drop-shadow-sm sm:w-15 sm:h-12.5"
                                    />
                                </div>

                                <h3 className="text-xs sm:text-sm lg:text-base font-semibold tracking-wider mb-1.5 sm:mb-2 text-foreground uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 sm:w-100 sm:h-100 lg:w-125 lg:h-125 bg-accent/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none z-0" />
            </section>
        );
    };

export default Features;
