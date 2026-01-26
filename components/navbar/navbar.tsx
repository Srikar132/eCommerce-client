"use client";

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SearchInput } from '../search-input';
import { cn } from '@/lib/utils';
import CartButton from '../cart/cart-button';
import WishlistButton from './wishlist-button';
import { CollectionsDropdown } from './collections-dropdown';
import { User2, Menu, ShoppingBag, Heart, Search } from 'lucide-react';

const HERO_SECTION_HEIGHT = 1000;


const Navbar = () => {
    const pathname = usePathname();
    const { setOpen, open, isMobile, setOpenMobile, openMobile } = useSidebar();

    // Scroll state
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isPastHero, setIsPastHero] = useState(false);

    const isHomePage = pathname === '/';

    useEffect(() => {
        if (!isHomePage) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 400) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }


            const newIsPastHero = currentScrollY > HERO_SECTION_HEIGHT;
            if (newIsPastHero !== isPastHero) {
                setIsPastHero(newIsPastHero);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isPastHero, isHomePage]);

    const shouldShowBackdrop = !isHomePage || isPastHero;

    return (
        <>
            <nav
                className={`${isHomePage
                    ? `${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} fixed rounded-none sm:rounded-full max-w-full sm:max-w-[96vw] lg:max-w-[92vw] mx-auto sm:my-5 lg:my-6 shadow-md border border-rose-100/20`
                    : 'sticky'
                    } ${shouldShowBackdrop
                        ? 'bg-background/80 backdrop-blur-xl'
                        : 'bg-background/60 backdrop-blur-md'
                    } w-full top-0 z-50 transition-all duration-500 ease-in-out`}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                    <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-3 sm:gap-4 lg:gap-6">
                        {/* LEFT: Logo + Collections */}
                        <div className='flex items-center space-x-4 sm:space-x-6 lg:space-x-8'>

                            {/* Mobile Menu Button */}
                            <Button
                                className={cn(`lg:hidden p-2 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent`)}
                                aria-label="Toggle menu"
                                onClick={() => isMobile ? setOpenMobile(!openMobile) : setOpen(!open)}
                            >
                                <Menu
                                    className="w-5 h-5 text-foreground"
                                    strokeWidth={1.5}
                                />
                            </Button>

                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2 group">
                                <div className="relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="The Nala Armoire"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="hidden xl:block">
                                    <p className="text-xs font-light tracking-[0.2em] uppercase text-foreground">The Nala Armoire</p>
                                    <p className="text-[10px] italic text-foreground/70 -mt-0.5">where beauty roars</p>
                                </div>
                            </Link>

                            {/* Collections Dropdown - Desktop Only */}
                            <div className="hidden lg:block">
                                <CollectionsDropdown />
                            </div>
                            
                        </div>

                        {/* CENTER: Navigation Links - Desktop Only */}
                        {isHomePage && (
                            <div className="hidden lg:flex items-center space-x-8">
                                <Link href="/products" className="text-sm font-light tracking-wide text-foreground hover:text-primary transition-colors">
                                    Shop
                                </Link>
                                <Link href="/about" className="text-sm font-light tracking-wide text-foreground hover:text-primary transition-colors">
                                    About
                                </Link>
                                <Link href="/contact" className="text-sm font-light tracking-wide text-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </div>
                        )}

                        {/* Search Bar - Non-Home Pages */}
                        {!isHomePage && (
                            <div className="hidden lg:block flex-1 max-w-xl">
                                <SearchInput
                                    className="w-full"
                                    placeholder="Search products, collections..."
                                />
                            </div>
                        )}

                        {/* RIGHT: Icons */}
                        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">


                            {/* Divider */}
                            <div className="hidden sm:block h-6 w-px bg-rose-200/50"></div>

                            {/* Account */}
                            <Link href="/account">
                                <Button
                                    className="hidden sm:flex p-2 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
                                    aria-label="Account"
                                >
                                    <User2 
                                        className="w-5 h-5 text-foreground" 
                                        strokeWidth={1.5}
                                    />
                                </Button>
                            </Link>

                            {/* Wishlist & Cart with Suspense */}
                            <Suspense fallback={
                                <>
                                    <Button className="p-2 hover:bg-primary rounded-full transition-colors border-0 bg-transparent" aria-label="Wishlist">
                                        <Heart className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                                    </Button>
                                    <Button className="p-2 hover:bg-primary rounded-full transition-colors border-0 bg-transparent" aria-label="Cart">
                                        <ShoppingBag className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                                    </Button>
                                </>
                            }>
                                <Link href="/account/wishlist">
                                    <WishlistButton />
                                </Link>

                                <Link href="/cart">
                                    <CartButton />
                                </Link>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;