"use client";

import { LogIn, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface LoginRequiredProps {
    title?: string;
    description?: string;
    image?: string;
}

export function LoginRequired({
    title = "Login Required",
    description = "Please login to continue your personalized shopping experience.",
    image = "/images/login-required.webp"
}: LoginRequiredProps) {
    const pathname = usePathname();

    return (
        <div className="relative w-full flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">

            {/* Decorative Background Gradient Blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-accent/10 rounded-full blur-[80px] pointer-events-none -z-10" />

            {/* Decorative Flowers - Smaller and more subtle */}
            <div className="absolute top-10 sm:top-16 left-[5%] w-12 h-12 sm:w-16 sm:h-16 opacity-30 pointer-events-none">
                <Image
                    src="/images/home/flower2.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 48px, 64px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>
            <div className="absolute bottom-10 sm:bottom-16 right-[5%] w-14 h-14 sm:w-20 sm:h-20 opacity-30 pointer-events-none">
                <Image
                    src="/images/home/flower3.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 56px, 80px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Main Content Card */}
            <div className="relative max-w-lg mx-auto">
                <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">

                    {/* Illustration - Smaller and cuter */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                        <Image
                            src={image}
                            alt="Login illustration"
                            fill
                            className="object-contain scale-150"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 sm:space-y-4 max-w-md px-2">
                        <div className="space-y-2">
                            <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground">
                                Welcome Back
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium italic tracking-tight text-foreground leading-tight">
                                {title}
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Action Buttons - More compact */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 px-4 sm:px-0">
                        <Link
                            href={`/login?redirect=${encodeURIComponent(pathname)}`}
                            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Login to Continue
                        </Link>

                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center bg-secondary text-foreground px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-medium border border-border/50 hover:bg-secondary/80 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
