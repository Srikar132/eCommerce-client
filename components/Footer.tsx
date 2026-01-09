"use client"

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary text-foreground border-t border-border">

            {/* Main Footer Content */}
            <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        {/* Products Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-sm tracking-widest uppercase text-foreground">Products</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/products?category=dress" className="text-muted-foreground hover:text-primary transition-colors">
                                        Dress
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=blazer" className="text-muted-foreground hover:text-primary transition-colors">
                                        Blazer
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=skirt" className="text-muted-foreground hover:text-primary transition-colors">
                                        Skirt
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=trousers" className="text-muted-foreground hover:text-primary transition-colors">
                                        Trousers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=jumpers" className="text-muted-foreground hover:text-primary transition-colors">
                                        Jumpers
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Service Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-sm tracking-widest uppercase text-foreground">Service</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Information Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-sm tracking-widest uppercase text-foreground">Information</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                                        Return and Refunds
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/legal" className="text-muted-foreground hover:text-primary transition-colors">
                                        Legal Area
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* About Us Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-sm tracking-widest uppercase text-foreground">About Us</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                We craft beautiful, handmade pieces with love and care. Every stitch tells a story. Visit our{' '}
                                <Link href="/about" className="text-primary hover:underline font-medium">
                                    about page
                                </Link>
                                {' '}to discover our journey.
                            </p>
                        </div>
                    </div>

                    {/* Social Icons and Payment Methods */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
                        {/* Language and Social Icons */}
                        <div className="flex items-center gap-6">
                            <select className="px-4 py-2 text-sm rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer">
                                <option>EN</option>
                                <option>ES</option>
                                <option>FR</option>
                            </select>
                            <div className="flex gap-4">
                                <Link 
                                    href="https://facebook.com" 
                                    target="_blank"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </Link>
                                <Link 
                                    href="https://twitter.com" 
                                    target="_blank"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link 
                                    href="https://instagram.com/the-nala-armoire" 
                                    target="_blank"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link 
                                    href="#" 
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16.75 2h-2.5v20h2.5c7.2 0 7.2-20 0-20M13 2H6C2.5 2 2.5 22 6 22h7V2z"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex gap-3 flex-wrap justify-center">
                            <div className="w-14 h-9 bg-card border border-border rounded-lg overflow-hidden relative shadow-sm">
                                <Image
                                    src="/home/footer/pay-1.jpg"
                                    alt="Visa"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>

                            <div className="w-14 h-9 bg-card border border-border rounded-lg overflow-hidden relative shadow-sm">
                                <Image
                                    src="/home/footer/pay-2.png"
                                    alt="Mastercard"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>

                            <div className="w-14 h-9 bg-card border border-border rounded-lg overflow-hidden relative shadow-sm">
                                <Image
                                    src="/home/footer/pay-3.jpg"
                                    alt="American Express"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>

                            <div className="w-14 h-9 bg-card border border-border rounded-lg overflow-hidden relative shadow-sm">
                                <Image
                                    src="/home/footer/pay-4.png"
                                    alt="PayPal"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Large Brand Name */}
            <div className="w-full overflow-hidden bg-background border-t border-border">
                <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4">
                    <p className="text-center text-lg sm:text-xl tracking-[0.3em] uppercase text-muted-foreground mb-2">
                        The Nala
                    </p>
                    <h2 className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[180px] xl:text-[220px] font-medium italic leading-none tracking-wider text-center text-foreground">
                        Armoire
                    </h2>
                    <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 italic">
                        Where beauty roars in every stitch
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;