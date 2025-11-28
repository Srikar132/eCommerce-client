
"use client";
import { useState, useEffect, useRef } from 'react';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import NavbarTitle from './NavbarTitle';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';
import { useSidebar } from './ui/sidebar';

const menuItems = [
    { name: 'Men', href: '/products?category=men' },
    { name: 'Women', href: '/products?category=women' },
    { name: 'Kids', href: '/products?category=kids' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const {setOpen, open, isMobile, setOpenMobile, openMobile} = useSidebar();
    const logoRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (pathname === '/' && logoRef.current && isLargeScreen) {
            gsap.set(logoRef.current, {
                y: 150,
                scale: 6,
                duration: 0.5
            });
        } else if (logoRef.current && !isLargeScreen) {
            // Reset animation on small screens
            gsap.set(logoRef.current, {
                y: 0,
                scale: 1
            });
        }
    }, [pathname, isLargeScreen]);

    useEffect(() => {
        if (pathname === '/' && logoRef.current && isLargeScreen) {
            if (isAtTop) {
                gsap.to(logoRef.current, {
                    y: 150,
                    scale: 6,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    }, [isAtTop, pathname, isLargeScreen]);

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

            if (isLargeScreen) {
                const newIsAtTop = currentScrollY <= 10;
                if (newIsAtTop !== isAtTop) {
                    setIsAtTop(newIsAtTop);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isAtTop, isLargeScreen]);

    return (
        <nav
            className={`fixed top-0  left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className='relative'>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Mobile Menu Button */}
                        <div className='flex items-center space-x-4'>
                            <button
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                                onClick={() => isMobile ? setOpenMobile(!openMobile) : setOpen(!open)}
                            >
                                <Image
                                    src={'/icons/menu_icon.png'}
                                    alt='menu'
                                    height={15}
                                    width={15}
                                />
                            </button>

                            {/* Desktop Menu Items - Left */}
                            <div className="hidden lg:flex items-center space-x-3">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-700 hover:text-black  transition-colors duration-200 text-sm md:text-md font-bold capitalize tracking-wide"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>

                        </div>

                        {/* Center: Logo */}
                        <NavbarTitle logoRef={logoRef} />

                        {/* Right: Icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                <Image
                                    src={'/icons/search_icon.png'}
                                    alt='search'
                                    height={15}
                                    width={15}
                                />
                            </button>

                            <div className="hidden sm:block border-l border-gray-600 h-6"></div>

                            <button
                                className="hidden sm:block p-2 rounded-md hover:bg-gray-100 transition-colors"
                                aria-label="Account"
                            >
                                <Image
                                    src={'/icons/profile_icon.png'}
                                    alt='profile'
                                    height={15}
                                    width={15}
                                />
                            </button>

                            <button
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
                                aria-label="Shopping cart"
                            >
                                <Image
                                    src={'/icons/cart_icon.png'}
                                    alt='cart'
                                    height={15}
                                    width={15}
                                />
                                {/* <span className="absolute top-0 right-0 bg-blue-400 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                                    0
                                </span> */}
                            </button>
{/* 
                            <div className="hidden sm:block">
                                <select className="text-sm text-gray-700 border-none bg-transparent focus:outline-none cursor-pointer">
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>GBP</option>
                                </select>
                            </div> */}
                        </div>
                    </div>
                </div>


            </div>
        </nav>
    );
}

export default Navbar;