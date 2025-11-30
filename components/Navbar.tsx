"use client";
import { useState, useEffect, useRef } from 'react';
import NavbarTitle from './navbar-title';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import Link from 'next/link';
import { SearchInput } from './search-input';

const menuItems = [
    { name: 'Men', href: '/category/men?sort=relevance' },
    { name: 'Women', href: '/category/women?sort=relevance' },
    { name: 'Kids', href: '/category/kids?sort=relevance' },
    { name: 'Genz', href: '/category/genz?sort=relevance' },
    { name: 'Brands & Designs', href: '/customization' }
];

const HERO_SECTION_HEIGHT = 1000;

const Navbar = () => {
    const pathname = usePathname();
    const { setOpen, open, isMobile, setOpenMobile, openMobile } = useSidebar();
    const logoRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isPastHero, setIsPastHero] = useState(false);

    const isHomePage = pathname === '/';

    // Scroll handler - only for home page
    useEffect(() => {
        if (!isHomePage) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Navbar hide/show logic
            if (currentScrollY < 400) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            // Check if at top
            const newIsAtTop = currentScrollY <= 10;
            if (newIsAtTop !== isAtTop) {
                setIsAtTop(newIsAtTop);
            }

            // Check if past hero section
            const newIsPastHero = currentScrollY > HERO_SECTION_HEIGHT;
            if (newIsPastHero !== isPastHero) {
                setIsPastHero(newIsPastHero);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isAtTop, isPastHero, isHomePage]);

    const shouldShowBackdrop = !isHomePage || isPastHero;

    return (
        <nav
            className={`${isHomePage
                    ? `${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} fixed`
                    : 'sticky'
                } ${shouldShowBackdrop
                    ? isHomePage
                        ? 'bg-black/50 backdrop-blur-md lg:shadow-sm'
                        : 'bg-white shadow-sm'
                    : 'bg-transparent'
                }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center h-16 gap-4">
                    <div className='flex items-center space-x-4'>
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

                        <div className="hidden lg:flex items-center space-x-3">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`nav-link ${!isHomePage ? 'text-black!' : ''}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <NavbarTitle logoRef={logoRef} pathname={pathname} isAtTop={isAtTop} isHome={isHomePage} />
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        {/* Mobile Search Icon - Always show below lg */}
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

                        {/* Desktop Search - Show icon on home page, input on other pages */}
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
        </nav>
    );
}

export default Navbar;