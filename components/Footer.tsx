import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import BrandServices from './landing-page/brand-services';
import { getStoreSettings } from '@/lib/actions/store-settings-actions';

const Footer = async () => {
    const settings = await getStoreSettings();

    return (
        <>
            <BrandServices />

            <footer className="bg-foreground text-background rounded-t-[28px] lg:rounded-t-[40px] border-t border-white/5">
                {/* Top Footer: Navigation & Links */}
                <div className="py-24 md:py-32">
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">

                            {/* Brand Column */}
                            <div className="md:col-span-4 flex flex-col gap-8">
                                <Link href="/" className="flex flex-col">
                                    <span className="text-3xl font-bold tracking-tighter uppercase text-white">
                                        <span className='font-cursive! lowercase text-4xl mr-1'>Nala</span>
                                        Armoire
                                    </span>
                                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mt-2">
                                        Crafted with Love
                                    </span>
                                </Link>
                                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                                    Redefining the artisan tradition through custom hand-stitched embroidery. Every piece is a unique story waiting to be worn.
                                </p>

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 group">
                                        <MapPin className="w-4 h-4 text-white/30 mt-1 shrink-0 group-hover:text-white transition-colors" />
                                        <div className="text-sm text-white/50 leading-relaxed group-hover:text-white transition-colors">
                                            {settings.address},<br />
                                            {settings.city}, {settings.state} - {settings.pincode}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <Mail className="w-4 h-4 text-white/30 shrink-0 group-hover:text-white transition-colors" />
                                        <Link href={`mailto:${settings.email}`} className="text-sm text-white/50 hover:text-white transition-colors">
                                            {settings.email}
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <Phone className="w-4 h-4 text-white/30 shrink-0 group-hover:text-white transition-colors" />
                                        <Link href={`tel:${settings.phone}`} className="text-sm text-white/50 hover:text-white transition-colors">
                                            {settings.phone}
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                        <Link
                                            key={i}
                                            href="#"
                                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Links Grid */}
                            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
                                {/* Shop Column */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Shop</h3>
                                    <ul className="flex flex-col gap-4">
                                        {['Men', 'Women', 'Boys', 'Girls'].map((item) => (
                                            <li key={item}>
                                                <Link href={`/products?category=${item.toLowerCase()}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors inline-block link-underline">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Service Column */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Service</h3>
                                    <ul className="flex flex-col gap-4">
                                        {['FAQ', 'Contact', 'Shipping', 'Returns'].map((item) => (
                                            <li key={item}>
                                                <Link href={`/${item.toLowerCase()}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors inline-block link-underline">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Company Column */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Company</h3>
                                    <ul className="flex flex-col gap-4">
                                        {['About Us', 'Sustainability', 'Artisans', 'Careers'].map((item) => (
                                            <li key={item}>
                                                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors inline-block link-underline">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Giant Brand Marker */}
                <div className="pb-12 overflow-hidden border-white /5">
                    <div className="container relative">
                        <h2 className="text-[15vw] lg:text-[220px] font-bold leading-none tracking-tighter text-white/[0.03] select-none pointer-events-none text-center">
                            ARMOIRE
                        </h2>

                        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                            <div className="flex gap-8">
                                <span>© 2024 Nala Armoire</span>
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Made with heart</span>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <span>Worldwide Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;