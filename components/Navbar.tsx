"use client";
import { useState, useEffect, useRef } from 'react';
import NavbarTitle from './navbar-title';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import Link from 'next/link';

const menuItems = [
    { name: 'Men', href: '/products?category=men' },
    { name: 'Women', href: '/products?category=women' },
    { name: 'Kids', href: '/products?category=kids' },
];

 const HERO_SECTION_HEIGHT = 1000; 

export const Navbar = () => {
    const pathname = usePathname();
    const { setOpen, open, isMobile, setOpenMobile, openMobile } = useSidebar();
    const logoRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isPastHero, setIsPastHero] = useState(false);


    // Scroll handler
    useEffect(() => {
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
    }, [lastScrollY, isAtTop, isPastHero]);

    const shouldShowBackdrop = pathname !== '/' || isPastHero;

    return (
        <nav
            className={`${
                isVisible ? 'translate-y-0' : '-translate-y-[150%]'
            } ${
                shouldShowBackdrop 
                    ? 'bg-white/20 backdrop-blur-md shadow-sm' 
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center h-16 gap-4">
                    <div className='flex items-center space-x-4'>
                        <Button
                            className="nav-btn"
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
                                    className="nav-link"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <NavbarTitle logoRef={logoRef} pathname={pathname} isAtTop={isAtTop} />
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <Button 
                            className="nav-btn"
                            aria-label="Search"
                        >
                            <Image
                                src={'/icons/search_icon.png'}
                                alt='search'
                                height={15}
                                width={15}
                            />
                        </Button>

                        <div className="hidden sm:block border-l border-gray-600 h-6"></div>

                        <Button
                            className="hidden sm:block nav-btn"
                            aria-label="Account"
                        >
                            <Image
                                src={'/icons/profile_icon.png'}
                                alt='profile'
                                height={15}
                                width={15}
                            />
                        </Button>

                        <Button
                            className="nav-btn relative"
                            aria-label="Shopping cart"
                        >
                            <Image
                                src={'/icons/cart_icon.png'}
                                alt='cart'
                                height={15}
                                width={15}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;