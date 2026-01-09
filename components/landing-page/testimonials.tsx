

"use client";

import { testimonials } from "@/constants";
import TestimonialCard from "@/components/cards/testimonial-card";

const Testimonials = () => {
    return (
        <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 bg-background overflow-hidden">
            
            {/* Section Header */}
            <div className="relative text-center mb-12 sm:mb-16 px-4 space-y-3">
                <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                    What Our Customers Say
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                    Loved by Many
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground italic max-w-2xl mx-auto">
                    Join thousands of happy customers who trust us for quality and style
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto relative z-10">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            name={testimonial.name}
                            
                            role={testimonial.role}
                            avatar={testimonial.avatar}
                            rating={testimonial.rating}
                            text={testimonial.text}
                        />
                    ))}
                </div>
            </div>

            {/* Decorative Gradient Blobs */}
            <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-20 right-0 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        </section>
    );
};

export default Testimonials;