"use client";

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SearchInput } from '../search-input';
import { cn } from '@/lib/utils';
import { CollectionsDropdown } from './collections-dropdown';
import { Search } from 'lucide-react';
import WishlistButton from './wishlist-button';
import CartButton from '../cart/cart-button';
import { AccountHoverCard } from './account-hover-card';
import { useSession } from 'next-auth/react';



const Navbar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Scroll state
    const isHomePage = pathname === '/';
    const isProductsPage = pathname === '/products';



    return (
        <>
            <nav
                className={cn(
                    "w-full bg-background z-50 transition-all duration-500 ease-in-out",
                    isHomePage
                        ? cn(
                            "fixed rounded-none sm:rounded-full max-w-full sm:max-w-[96vw] lg:max-w-[92vw] left-1/2 -translate-x-1/2 sm:my-5 lg:my-6 shadow-md border border-rose-100/20 top-5",

                        )
                        : "sticky top-0",
                )}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                    <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-3 sm:gap-4 lg:gap-6">
                        {/* LEFT: Logo + Collections */}
                        <div className='flex items-center space-x-4 sm:space-x-6 lg:space-x-8'>

                            {/* Mobile Menu Button */}
                            <SidebarTrigger className="lg:hidden" />

                            {/* Logo - Centered on Mobile */}
                            <Link href="/" className="flex items-center space-x-2 group lg:flex-none flex-1 lg:flex-initial justify-center lg:justify-start">
                                <div className="relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="The Nala Armoire"
                                        fill
                                        sizes="(max-width: 640px) 40px, (max-width: 1024px) 44px, 48px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="hidden xl:block">
                                    <p className="text-xs font-light tracking-[0.2em] uppercase text-foreground">Nala Armoire</p>
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

                            {/* Search Icon - Mobile Only, Hidden on Products Page */}
                            {!isProductsPage && (
                                <Link href="/products" className="lg:hidden">
                                    <Button
                                        className="p-1 hover:bg-primary rounded-full transition-colors border-0 bg-transparent"
                                        aria-label="Search products"
                                    >
                                        <Search className="w-5 h-5 text-foreground" strokeWidth={2} />
                                    </Button>
                                </Link>
                            )}

                            {/* Divider */}
                            <div className="hidden sm:block h-6 w-px bg-rose-200/50"></div>

                            {/* Account with Hover Card */}
                            <AccountHoverCard />


                            <Link href="/wishlist">
                                <WishlistButton enabled={!!session} />
                            </Link>

                            <Link href="/cart">
                                <CartButton enabled={!!session} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;