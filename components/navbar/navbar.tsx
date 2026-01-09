"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SearchInput } from '../search-input';
import { CategoryNavigation } from './category-navigation';
import { cn } from '@/lib/utils';
import { is } from 'zod/v4/locales';

const HERO_SECTION_HEIGHT = 1000;


const Navbar = () => {
    const pathname = usePathname();
    const { setOpen, open, isMobile, setOpenMobile, openMobile } = useSidebar();

    // Scroll state
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    // const [isAtTop, setIsAtTop] = useState(true);
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

            // const newIsAtTop = currentScrollY <= 10;
            // if (newIsAtTop !== isAtTop) {
            //     setIsAtTop(newIsAtTop);
            // }

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
                    ? `${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} fixed rounded-full max-w-[90vw] mx-auto my-7 py-2 shadow-lg border border-black/10`
                    : 'sticky'
                    } ${shouldShowBackdrop
                        ? 'bg-white/50 backdrop-blur-md lg:shadow-sm'
                        : 'bg-white'
                    } w-full top-0 z-50 transition-all duration-300`}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* LEFT: Menu/Logo + Categories */}
                        <div className='flex items-center space-x-2'>

                            {/* Logo - Desktop Only */}
                            <Link href="/" className="hidden lg:flex items-center space-x-2">
                                <div className="relative w-14 h-14" >
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        fill
                                        className={`object-cover `}
                                        priority
                                    />

                                </div>

                            </Link>

                            <Button
                                className={cn(`nav-btn lg:hidden!`)}
                                aria-label="Toggle menu"
                                onClick={() => isMobile ? setOpenMobile(!openMobile) : setOpen(!open)}
                            >
                                <Image
                                    src={'/icons/menu_icon.png'}
                                    alt='menu'
                                    height={15}
                                    width={15}
                                />
                            </Button>

                            {/* Category Navigation - Desktop Only */}
                            {<CategoryNavigation />}
                        </div>


                        <div className="flex items-center justify-end md:space-x-3 space-x-2 lg:space-x-4">


                            {isHomePage && (
                                <>
                                    <Link href="/products" className="nav-link">Shop</Link>
                                    <Link href="/about" className="nav-link">About</Link>
                                    <Link href="/contact" className="nav-link">Contact</Link>
                                </>
                            )}

                            
                            <Link href={"/search"} className='lg:hidden'>
                                <Button
                                    className={`nav-btn`}
                                    aria-label="Search"
                                >
                                    <Image
                                        src={'/icons/search.svg'}
                                        alt='search'
                                        height={24}
                                        width={24}
                                    />
                                </Button>
                            </Link>

                            {!isHomePage && (
                                <div className="min-w-xl max-lg:hidden w-full">
                                    <SearchInput
                                        className="w-full"
                                        placeholder="Search for products, brands, categories..."
                                    />
                                </div>
                            )}

                            <div className={`hidden sm:block border-l h-6 border-gray-600`}></div>

                            <Link href={"/account"}>
                                <Button
                                    className={`hidden sm:block nav-btn `}
                                    aria-label="Account"
                                >
                                    <Image
                                        src={'/icons/account.svg'}
                                        alt='profile'
                                        height={24}
                                        width={24}
                                    />
                                </Button>
                            </Link>

                            <Link href={"/cart"}>
                                <Button
                                    className={`nav-btn relative`}
                                    aria-label="Shopping cart"
                                >
                                    <Image
                                        src={'/icons/cart.svg'}
                                        alt='cart'
                                        height={24}
                                        width={24}
                                    />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;