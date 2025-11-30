"use client"

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-black">

            {/* Main Footer Content */}
            <div className=" py-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Products Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm tracking-wider">PRODUCTS</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Dress</a></li>
                            <li><a href="#" className="hover:underline">Blazer</a></li>
                            <li><a href="#" className="hover:underline">Skirt</a></li>
                            <li><a href="#" className="hover:underline">Trousers</a></li>
                            <li><a href="#" className="hover:underline">Jumpers</a></li>
                        </ul>
                    </div>

                    {/* Service Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm tracking-wider">SERVICE</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">FAQ</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>

                    {/* Information Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm tracking-wider">INFORMATION</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:underline">Return and Refunds</a></li>
                            <li><a href="#" className="hover:underline">Legal Area</a></li>
                        </ul>
                    </div>

                    {/* About Us Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm tracking-wider">ABOUT US</h3>
                        <p className="text-sm leading-relaxed">
                            We could not have created this demo without the help of an amazing source of content and products. Visit our{' '}
                            <a href="#" className="underline">about page</a> to find out where all the products used in this demo care from.
                        </p>
                    </div>
                </div>

                {/* Social Icons and Payment Methods */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
                    {/* Language and Social Icons */}
                    <div className="flex items-center gap-6">
                        <select className="px-3 py-1 text-sm focus:outline-none focus:border-black bg-transparent">
                            <option>EN</option>
                        </select>
                        <div className="flex gap-4">
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.75 2h-2.5v20h2.5c7.2 0 7.2-20 0-20M13 2H6C2.5 2 2.5 22 6 22h7V2z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Payment Methods - Using Image placeholders */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {/* Visa */}
                        <div className="w-12 h-8 bg-neutral-100 border border-neutral-300 rounded overflow-hidden relative">
                            <Image
                                src="/home/footer/pay-1.jpg"
                                alt="Visa"
                                fill
                                className="object-contain p-1"
                            />
                        </div>

                        <div className="w-12 h-8 bg-neutral-100 border border-neutral-300 rounded overflow-hidden relative">
                            <Image
                                src="/home/footer/pay-2.png"
                                alt="Mastercard"
                                fill
                                className="object-contain p-1"
                            />
                        </div>

                        <div className="w-12 h-8 bg-neutral-100 border border-neutral-300 rounded overflow-hidden relative">
                            <Image
                                src="/home/footer/pay-3.jpg"
                                alt="American Express"
                                fill
                                className="object-contain p-1"
                            />
                        </div>

                        <div className="w-12 h-8 bg-neutral-100 border border-neutral-300 rounded overflow-hidden relative">
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

            {/* Large Brand Name */}
            <div className="w-full overflow-hidden">
                <div className="max-w-7xl mx-auto py-12 px-4">
                    <p className="text-center text-2xl font-bold">THE NALA</p>
                    <h2 className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[180px] xl:text-[220px] font-medium leading-none tracking-widest text-center overflow-wrap-break-word">
                        ALMORIE
                    </h2>
                </div>
            </div>
        </footer>
    );
};

export default Footer;