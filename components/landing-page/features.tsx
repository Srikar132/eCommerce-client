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
            <section className="relative bg-background py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
                    {features.map((feature, i) => (
                        <Card 
                            key={i} 
                            className="border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 group rounded-2xl overflow-hidden"
                        >
                            <CardContent className="flex flex-col items-center text-center p-6 sm:p-8">
                                {/* Icon */}
                                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={60}
                                        height={50}
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
            </section>

            {/* ---------- Newsletter Section ---------- */}
            <section className="relative bg-secondary py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-2xl mx-auto text-center relative z-10">

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight mb-4 text-foreground">
                        Join Our Newsletter
                    </h2>

                    <p className="text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed">
                        Be the first to know about new collections and exclusive offers.
                    </p>

                    {/* Input + Button */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-6 rounded-full border-border bg-card text-foreground focus-visible:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground"
                        />

                        <Button
                            onClick={handleSubmit}
                            className="bg-primary text-primary-foreground px-8 sm:px-10 py-6 rounded-full text-sm sm:text-base font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>

                {/* Decorative Gradient Blobs */}
                <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-accent/15 rounded-full blur-[120px] pointer-events-none z-0" />
            </section>
        </div>
    );
};

export default Features;
