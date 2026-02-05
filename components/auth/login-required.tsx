"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface LoginRequiredProps {
    title?: string;
    description?: string;
    image?: string;
}

export function LoginRequired({
    title = "Please Log In",
    description = "Login to view items in your wishlist.",
    image = "/images/login-required.webp"
}: LoginRequiredProps) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl h-[85vh] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                {/* Illustration/Image */}
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                    <Image
                        src={image}
                        alt="Login Required"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                        {title}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        {description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
                    <Button 
                        asChild 
                        size="lg" 
                        className="min-w-35"
                    >
                        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                        </Link>
                    </Button>
                    
                    <Button 
                        asChild 
                        variant="outline" 
                        size="lg"
                        className="min-w-[140px]"
                    >
                        <Link href="/products">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
