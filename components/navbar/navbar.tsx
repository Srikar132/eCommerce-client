"use client";

import { useState, useEffect, useRef } from 'react';
import NavbarTitle from './navbar-title';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SearchInput } from '../search-input';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api/category';
import { FALLBACK_CATEGORIES } from '@/lib/constants/fallback-data';

const HERO_SECTION_HEIGHT = 1000;

/**
 * Production-Grade Navbar with Inline Category Navigation
 * 
 * Features:
 * ✅ Categories inline with navbar (Myntra-style)
 * ✅ Server-prefetched data (no loading state)
 * ✅ Mega menu on hover
 * ✅ Responsive design
 * ✅ Fallback data for reliability
 */
const Navbar = () => {
    const pathname = usePathname();
    const { setOpen, open, isMobile, setOpenMobile, openMobile } = useSidebar();
    const logoRef = useRef<HTMLDivElement>(null);

    // Scroll state
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isPastHero, setIsPastHero] = useState(false);

    // Category menu state
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [hoveredCategorySlug, setHoveredCategorySlug] = useState<string | null>(null);

    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);

    const isHomePage = pathname === '/';

    /**
     * Get root categories (prefetched on server)
     */
    const { data: rootCategories = FALLBACK_CATEGORIES } = useQuery({
        queryKey: ['categories', { minimal: true }],
        queryFn: async () => {
            console.log('[Navbar] Fetching root categories (cache miss)');
            return await categoryApi.getCategories({
                filters: { minimal: true },
            });
        },
        staleTime: 1000 * 60 * 60,
        placeholderData: FALLBACK_CATEGORIES,
    });

    /**
     * Get category children for mega menu
     */
    const { data: categoryChildren } = useQuery({
        queryKey: ['category-children', hoveredCategorySlug],
        queryFn: async () => {
            if (!hoveredCategorySlug) return null;

            console.log(`[Navbar] Fetching children: ${hoveredCategorySlug}`);

            const data = await categoryApi.getCategories({
                filters: {
                    slug: hoveredCategorySlug,
                    recursive: true,
                    minimal: true,
                    includeProductCount: true,
                },
            });

            return data[0];
        },
        enabled: !!hoveredCategorySlug,
        staleTime: 1000 * 60 * 60,
    });

    /**
     * Handle category hover
     */
    const handleCategoryHover = (slug: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setActiveCategory(slug);

        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredCategorySlug(slug);
        }, 150);
    };

    /**
     * Handle navigation leave
     */
    const handleNavLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setTimeout(() => {
            setActiveCategory(null);
            setHoveredCategorySlug(null);
        }, 100);
    };

    /**
     * Scroll handler for home page
     */
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

            const newIsAtTop = currentScrollY <= 10;
            if (newIsAtTop !== isAtTop) {
                setIsAtTop(newIsAtTop);
            }

            const newIsPastHero = currentScrollY > HERO_SECTION_HEIGHT;
            if (newIsPastHero !== isPastHero) {
                setIsPastHero(newIsPastHero);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isAtTop, isPastHero, isHomePage]);

    /**
     * Cleanup
     */
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const shouldShowBackdrop = !isHomePage || isPastHero;

    return (
        <>
            <nav
                className={`${isHomePage
                    ? `${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} fixed`
                    : 'sticky'
                    } ${shouldShowBackdrop
                        ? isHomePage
                            ? 'bg-black/50 backdrop-blur-md lg:shadow-sm'
                            : 'bg-white shadow-sm'
                        : 'bg-transparent'
                    } w-full top-0 z-50 transition-all duration-300`}
                onMouseLeave={handleNavLeave}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* LEFT: Menu + Categories */}
                        <div className='flex items-center space-x-6'>
                            {/* Menu Button */}
                            <Button
                                className={`nav-btn ${!isHomePage ? 'invert-0!' : ''}`}
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

                            {/* Category Links - Desktop Only */}
                            <div className="hidden xl:flex items-center space-x-6">
                                {rootCategories.map((category: any) => (
                                    <div
                                        key={category.id}
                                        onMouseEnter={() => handleCategoryHover(category.slug)}
                                        className="relative"
                                    >
                                        <Link
                                            href={`/products/${category.slug}`}
                                            className={`
                                                text-sm font-semibold uppercase tracking-wide
                                                transition-all duration-200
                                                inline-block
                                                ${!isHomePage
                                                    ? activeCategory === category.slug
                                                        ? 'text-pink-600'
                                                        : 'text-gray-900 hover:text-pink-600'
                                                    : activeCategory === category.slug
                                                        ? 'text-white border-b-2 border-white pb-1'
                                                        : 'text-white/90 hover:text-white'
                                                }
                                            `}
                                        >
                                            {category.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CENTER: Logo */}
                        <div className="flex-shrink-0">
                            <NavbarTitle
                                logoRef={logoRef}
                                pathname={pathname}
                                isAtTop={isAtTop}
                                isHome={isHomePage}
                            />
                        </div>

                        {/* RIGHT: Search + Profile + Cart */}
                        <div className="flex items-center justify-end md:space-x-3 space-x-2 lg:space-x-4">
                            {/* Mobile Search */}
                            <Link href={"/search"} className='lg:hidden'>
                                <Button
                                    className={`nav-btn ${!isHomePage ? 'invert-0!' : ''}`}
                                    aria-label="Search"
                                >
                                    <Image
                                        src={'/icons/search_icon.png'}
                                        alt='search'
                                        height={15}
                                        width={15}
                                    />
                                </Button>
                            </Link>

                            {/* Desktop Search */}
                            {isHomePage ? (
                                <Link href={"/search"} className='hidden lg:block'>
                                    <Button
                                        className={`nav-btn ${!isHomePage ? 'invert-0!' : ''}`}
                                        aria-label="Search"
                                    >
                                        <Image
                                            src={'/icons/search_icon.png'}
                                            alt='search'
                                            height={15}
                                            width={15}
                                        />
                                    </Button>
                                </Link>
                            ) : (
                                <div className="max-w-2xl max-lg:hidden w-full">
                                    <SearchInput
                                        className="w-full"
                                        placeholder="Search for products, brands, categories..."
                                        variant={shouldShowBackdrop ? "light" : "dark"}
                                    />
                                </div>
                            )}

                            <div className={`hidden sm:block border-l h-6 ${!isHomePage ? 'border-gray-300' : 'border-gray-600'}`}></div>

                            <Link href={"/account"}>
                                <Button
                                    className={`hidden sm:block nav-btn ${!isHomePage ? 'invert-0!' : ''}`}
                                    aria-label="Account"
                                >
                                    <Image
                                        src={'/icons/profile_icon.png'}
                                        alt='profile'
                                        height={15}
                                        width={15}
                                    />
                                </Button>
                            </Link>

                            <Link href={"/cart"}>
                                <Button
                                    className={`nav-btn relative ${!isHomePage ? 'invert-0!' : ''}`}
                                    aria-label="Shopping cart"
                                >
                                    <Image
                                        src={'/icons/cart_icon.png'}
                                        alt='cart'
                                        height={15}
                                        width={15}
                                    />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Dropdown - FIXED */}
            
                {activeCategory &&
                    categoryChildren?.subCategories &&
                    categoryChildren.subCategories.length > 0 && (
                        <div
                            ref={megaMenuRef}
                            className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t z-50"
                            onMouseEnter={() => {
                                if (hoverTimeoutRef.current) {
                                    clearTimeout(hoverTimeoutRef.current);
                                }
                            }}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
                                    {categoryChildren.subCategories.map((subCategory) => (
                                        <div key={subCategory.id} className="space-y-4">
                                            {/* Parent: Topwear, Bottomwear, etc */}
                                            <Link
                                                href={`/categories/${subCategory.slug}`}
                                                className="block text-sm font-bold text-pink-600 hover:text-pink-700 uppercase tracking-wide transition-colors"
                                            >
                                                {subCategory.name}
                                            </Link>

                                            {/* Children: T-Shirts, Jeans, etc */}
                                            {subCategory.subCategories && subCategory.subCategories.length > 0 && (
                                                <ul className="space-y-2.5">
                                                    {subCategory.subCategories.map((item) => (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={`/categories/${item.slug}`}
                                                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors block"
                                                            >
                                                                {item.name}
                                                                {item.productCount !== undefined && item.productCount > 0 && (
                                                                    <span className="ml-1.5 text-xs text-gray-400">
                                                                        ({item.productCount})
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
            </nav>
        </>
    );
}

export default Navbar;