"use client";

import Link from "next/link";
import Image from "next/image";
import BreadcrumbNavigation from "../breadcrumb-navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-12">
                <BreadcrumbNavigation />
                {/* Brand Header - Premium Editorial Style */}
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-accent/5 flex items-center justify-center border border-border/10 p-4 transition-transform duration-700 group-hover:rotate-12">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/images/logo.webp"
                                    alt="Nala Armoire"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                                Sanctuary Membership
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                                Welcome <span className="italic font-serif font-light">back</span>
                            </h1>
                            <p className="text-sm text-muted-foreground tracking-tight max-w-[280px] mx-auto">
                                Sign in to access your curated wardrobe and handcrafted pieces.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content Wrapper - Pebble Theme Card */}
                <div className="bg-accent/5 rounded-[40px] p-6 md:p-10 border border-border/10 space-y-8 shadow-sm">
                    {children}

                    {/* Divider */}
                    <div className="relative pt-4">
                        <div className="absolute inset-0 flex items-center px-8" aria-hidden="true">
                            <div className="w-full border-t border-border/20"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground/40">
                            <span className="bg-background px-4 rounded-full">Secure Sanctuary</span>
                        </div>
                    </div>

                    {/* Footer Assistance */}
                    <div className="text-center">
                        <p className="text-[11px] text-muted-foreground tracking-wide">
                            Need assistance?{" "}
                            <Link
                                href="/contact"
                                className="text-foreground font-bold hover:text-accent transition-colors underline underline-offset-4 decoration-border/40"
                            >
                                Contact Concierge
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="text-center pt-4">
                    <div className="flex items-center justify-center gap-3 opacity-40">
                        <div className="h-px w-6 bg-border" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                            Where Beauty Roars
                        </span>
                        <div className="h-px w-6 bg-border" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;