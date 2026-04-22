"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CollectionsDropdown } from './collections-dropdown';
import { Search } from 'lucide-react';
import CartButton from '../cart/cart-button';
import { AccountHoverCard } from './account-hover-card';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_THRESHOLD = 60;

const Navbar = () => {

    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);

    const isHomePage = pathname === '/';
    const isProductsPage = pathname === '/products';

    useGSAP(() => {
        if (!navRef.current) return;
        const nav = navRef.current;

        // Non-home: clear any residual GSAP inline styles and exit
        if (!isHomePage) {
            gsap.set(nav, { clearProps: 'all' });
            ScrollTrigger.getAll().forEach(t => t.kill());
            return;
        }

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const initialTop = nav.offsetTop;

            // ── Initial State Transition ──
            // Instead of snapping, we animate from the "default" state to the "pill" state
            gsap.fromTo(nav,
                {
                    autoAlpha: 0,
                    borderRadius: '0px',
                    maxWidth: '100%',
                    marginTop: '0px',
                    top: '0px'
                },
                {
                    autoAlpha: 1,
                    borderRadius: '1rem',
                    maxWidth: '90vw',
                    marginTop: '20px',
                    top: `${initialTop}px`,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );

            const toScrolled = () => gsap.to(nav, {
                borderRadius: '0px', maxWidth: '100%', marginTop: '0px', top: '0px',
                duration: 0.4, ease: 'power2.out',
            });

            const toTop = () => gsap.to(nav, {
                borderRadius: '1rem', maxWidth: '90vw', marginTop: '20px', top: `${initialTop}px`,
                duration: 0.4, ease: 'power2.out',
            });

            const trigger = ScrollTrigger.create({
                start: `top+=${SCROLL_THRESHOLD} top`,
                onEnter: toScrolled,
                onLeaveBack: toTop,
            });

            return () => {
                trigger.kill();
                gsap.set(nav, { clearProps: 'borderRadius,maxWidth,marginTop,top,autoAlpha' });
            };
        });

        mm.add("(max-width: 1023px)", () => {
            // ── Mobile: Simple fade in ──
            gsap.to(nav, {
                autoAlpha: 1,
                duration: 0.6,
                ease: 'power2.out'
            });

            return () => {
                gsap.set(nav, { clearProps: 'autoAlpha' });
            };
        });

        return () => mm.revert();

    }, { scope: navRef, dependencies: [isHomePage] });

    return (
        <nav
            ref={navRef}
            className={cn(
                "w-full bg-background z-50 border-b border-border transition-colors duration-300",
                isHomePage
                    ? "max-sm:sticky! max-sm:top-0 sm:fixed sm:left-1/2 sm:-translate-x-1/2 shadow-sm border border-border"
                    : "sticky top-0 shadow-sm",
            )}
            style={isHomePage ? { opacity: 0, visibility: "hidden" } : {}}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="flex items-center h-16 lg:h-[4.5rem] gap-4">

                    {/* ── MOBILE: Hamburger | Logo | Icons ── */}
                    <div className="flex xl:hidden items-center w-full justify-between">
                        <SidebarTrigger />
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/images/logo.webp"
                                    alt="The Nala Armoire"
                                    fill
                                    sizes="32px"
                                    className="object-cover rounded-full"
                                    priority
                                />
                            </div>
                            <p className="text-xl font-bold uppercase text-foreground">
                                <span className='font-cursive! lowercase'>Nala</span> Armoire
                            </p>
                        </Link>
                        <div className="flex items-center gap-2">
                            {!isProductsPage && (
                                <Link href="/products">
                                    <Button className="p-1 rounded-full bg-transparent border-0 hover:bg-accent" aria-label="Search">
                                        <Search className="w-5 h-5 text-foreground" strokeWidth={1.75} />
                                    </Button>
                                </Link>
                            )}
                            <AccountHoverCard />
                            <CartButton />
                        </div>
                    </div>

                    {/* ── DESKTOP: Left | Center | Right ── */}

                    {/* LEFT: Nav links + Collections */}
                    <div className="hidden xl:flex items-center gap-6 flex-1">
                        {/* Mobile trigger hidden on desktop — SidebarTrigger only for mobile above */}
                        <CollectionsDropdown />
                        {isHomePage && (
                            <>
                                <Link href="/products" className="nav-link font-medium text-sm whitespace-nowrap link-underline">Shop</Link>
                                <Link href="/about" className="nav-link font-medium text-sm whitespace-nowrap link-underline">About</Link>
                                <Link href="/contact" className="nav-link font-medium text-sm whitespace-nowrap link-underline">Contact</Link>
                                <Link href="/faq" className="nav-link font-medium text-sm whitespace-nowrap link-underline">FAQ</Link>
                            </>
                        )}
                        {!isHomePage && (
                            <>
                                <Link href="/products" className="nav-link font-medium text-sm whitespace-nowrap link-underline">Shop</Link>
                                <Link href="/about" className="nav-link font-medium text-sm whitespace-nowrap link-underline">About</Link>
                                <Link href="/contact" className="nav-link font-medium text-sm whitespace-nowrap link-underline">Contact</Link>
                                <Link href="/faq" className="nav-link font-medium text-sm whitespace-nowrap link-underline">FAQ</Link>
                            </>
                        )}
                    </div>

                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/images/logo.webp"
                                    alt="The Nala Armoire"
                                    fill
                                    sizes="44px"
                                    className="object-cover rounded-full"
                                    priority
                                />
                            </div>
                            <div>
                                <p className="text-2xl xl:text-3xl font-bold  text-foreground tracking-tight">
                                    NaLa ARMOIRE
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* RIGHT: Search + icons */}
                    <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
                        {/* Search — always visible on desktop */}
                        {/* <SearchInput
                            className="w-52 xl:w-64"
                            placeholder="What are you looking for?"
                        /> */}
                        <div className="h-5 w-px bg-border mx-1" />
                        <AccountHoverCard />
                        <CartButton />
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;