"use client";

import { useState } from 'react';
import Image from "next/image";
import { features } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Features = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (email && email.includes('@')) {
            alert('Thank you for subscribing!');
            setEmail('');
        }
    };

    return (
        <div className="w-full">

            {/* ---------- Features Section ---------- */}
            <section className="relative bg-background py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
                    {features.map((feature, i) => (
                        <Card 
                            key={i} 
                            className="border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl sm:rounded-2xl overflow-hidden"
                        >
                            <CardContent className="flex flex-col items-center text-center p-4 sm:p-6 lg:p-8">
                                {/* Icon */}
                                <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={50}
                                        height={40}
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

            {/* ---------- Newsletter Section ---------- */}
            <section className="relative bg-secondary py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-2xl mx-auto text-center relative z-10">

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium italic tracking-tight mb-3 sm:mb-4 text-foreground">
                        Join Our Newsletter
                    </h2>

                    <p className="text-muted-foreground mb-6 sm:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed px-4">
                        Be the first to know about new collections and exclusive offers.
                    </p>

                    {/* Input + Button */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl mx-auto px-2">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 rounded-full border-border bg-card text-foreground focus-visible:ring-primary/50 transition-all text-xs sm:text-sm placeholder:text-muted-foreground"
                        />

                        <Button
                            onClick={handleSubmit}
                            className="bg-primary text-primary-foreground px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6 rounded-full text-xs sm:text-sm lg:text-base font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>

                {/* Decorative Gradient Blobs */}
                <div className="absolute top-10 left-10 w-50 h-50 sm:w-75 sm:h-75 bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 right-10 w-62.5 h-62.5 sm:w-87.5 sm:h-87.5 bg-accent/15 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
            </section>
        </div>
    );
};

export default Features;
