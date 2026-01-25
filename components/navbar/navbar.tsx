"use client";

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SearchInput } from '../search-input';
import { CategoryNavigation } from './category-navigation';
import { cn } from '@/lib/utils';
import CartButton from '../cart/cart-button';
import WishlistButton from './wishlist-button';
import { User, Menu, ShoppingCart, Heart } from 'lucide-react';
import { CategoryTree } from '@/lib/api/category';

const HERO_SECTION_HEIGHT = 1000;

interface NavbarProps {
    categoryTree: CategoryTree[]; // ✅ Receive complete tree from server
}

const Navbar = ({ categoryTree }: NavbarProps) => {
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
                    ? `${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} fixed rounded-none sm:rounded-full max-w-full sm:max-w-[95vw] lg:max-w-[90vw] mx-auto sm:my-4 lg:my-7 py-1 sm:py-2 shadow-lg border-0 sm:border border-black/10`
                    : 'sticky'
                    } ${shouldShowBackdrop
                        ? 'bg-white/50 backdrop-blur-md lg:shadow-sm'
                        : 'bg-white'
                    } w-full top-0 z-50 transition-all duration-300`}
            >
                <div className="mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                    <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16 gap-2 sm:gap-3 lg:gap-4">
                        {/* LEFT: Menu/Logo + Categories */}
                        <div className='flex items-center space-x-1 sm:space-x-2'>

                            {/* Logo - Desktop Only */}
                            <Link href="/" className="hidden lg:flex items-center space-x-2">
                                <div className="relative w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" >
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
                                className={cn(`nav-btn lg:hidden p-1.5 sm:p-2`)}
                                aria-label="Toggle menu"
                                onClick={() => isMobile ? setOpenMobile(!openMobile) : setOpen(!open)}
                            >
                                <Menu 
                                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-foreground" 
                                    strokeWidth={2}
                                />
                            </Button>

                            {/* Category Navigation - Desktop Only */}
                            {/* ✅ Pass complete tree - navigation is instant! */}
                            <CategoryNavigation categoryTree={categoryTree} />
                        </div>


                        <div className="flex items-center justify-end space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">


                            {isHomePage && (
                                <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                                    <Link href="/products" className="nav-link text-sm lg:text-base xl:text-lg">Shop</Link>
                                    <Link href="/about" className="nav-link text-sm lg:text-base xl:text-lg">About</Link>
                                    <Link href="/contact" className="nav-link text-sm lg:text-base xl:text-lg">Contact</Link>
                                </div>
                            )}

                            {!isHomePage && (
                                <div className="min-w-xl max-lg:hidden w-full">
                                    <SearchInput
                                        className="w-full"
                                        placeholder="Search for products, brands, categories..."
                                    />
                                </div>
                            )}

                            <div className={`hidden sm:block border-l h-4 sm:h-5 lg:h-6 border-gray-600`}></div>

                            <Link href="/account">
                                <Button
                                    className={`hidden sm:block nav-btn p-1.5 sm:p-2`}
                                    aria-label="Account"
                                >
                                    <User 
                                        className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-foreground" 
                                        strokeWidth={2}
                                    />
                                </Button>
                            </Link>

                            {/* Wrap dynamic cart/wishlist in Suspense for SSR compatibility */}
                            <Suspense fallback={
                                <>
                                    <Button className="nav-btn p-1.5 sm:p-2" aria-label="Wishlist">
                                        <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-foreground" strokeWidth={2} />
                                    </Button>
                                    <Button className="nav-btn p-1.5 sm:p-2" aria-label="Cart">
                                        <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-foreground" strokeWidth={2} />
                                    </Button>
                                </>
                            }>
                                <Link href="/account/wishlist">
                                    <WishlistButton />
                                </Link>

                                <Link href={"/cart"}>
                                    <CartButton/>
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