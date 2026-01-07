"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/category";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
    isHomePage?: boolean;
    className?: string;
}


export function CategoryNavigation({ isHomePage = false, className }: CategoryNavigationProps) {
    /**
     * Get root categories (prefetched on server)
     */
    const { data: rootCategories = FALLBACK_CATEGORIES } = useQuery({
        queryKey: ["categories", { minimal: true }],
        queryFn: async () => {
            return await categoryApi.getCategories({
                filters: { minimal: true },
            });
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours - keep data fresh all day
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
        placeholderData: FALLBACK_CATEGORIES as any,
    });

    return (
        <NavigationMenu viewport={false} className={cn("hidden xl:flex", className)}>
            <NavigationMenuList>
                {rootCategories.map((category) => (
                    <NavigationMenuItem key={category.id}>
                        <NavigationMenuTrigger
                            className={cn(
                                // Override all default styles
                                "h-10 px-3 text-sm font-medium transition-colors rounded-md",
                                "inline-flex items-center justify-center outline-none",
                                "focus-visible:ring-2 focus-visible:ring-offset-2",
                                isHomePage
                                    ? "bg-transparent! text-white/90 hover:bg-white/10! hover:text-white! data-[state=open]:bg-white/10! data-[state=open]:text-white!"
                                    : "bg-transparent! text-gray-700 hover:text-gray-900! hover:bg-gray-50! data-[state=open]:bg-gray-50! data-[state=open]:text-gray-900!"
                            )}
                        >
                            {category.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <CategoryMegaMenu categorySlug={category.slug} />
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

/**
 * CategoryMegaMenu - Displays category children in a mega menu
 */
function CategoryMegaMenu({ categorySlug }: { categorySlug: string }) {
    /**
     * Get category children - always use cached data, never show loading
     */
    const { data: subCategories = [] } = useQuery({
        queryKey: ["category-children", categorySlug],
        queryFn: async () => {
            const data = await categoryApi.getCategories({
                filters: {
                    slug: categorySlug,
                    recursive: true,
                    minimal: true,
                    includeProductCount: true,
                },
            });
            return data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours - keep data fresh all day
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
        placeholderData: [], // Always have data, never show loading
    });

    // Never show loading or empty states - data is always prefetched
    if (!subCategories || subCategories.length === 0) {
        return null; // Silently return nothing if no data
    }

    return (
        <div className="w-[900px] p-4 z-50">
            <div className="grid grid-cols-5 gap-x-8 gap-y-6">
                {subCategories.map((subCategory) => (
                    <div key={subCategory.id} className="space-y-2.5">
                        {/* Main Category (Topwear, Bottomwear, etc.) - Clean link style */}
                        <Link
                            href={`/products?category=${subCategory.slug}`}
                            className="block text-[13px] font-semibold text-gray-900 hover:text-pink-600 transition-colors"
                        >
                            {subCategory.name}
                        </Link>

                        {/* Child Categories (T-Shirts, Jeans, etc.) - Simple text links */}
                        {subCategory.subCategories && subCategory.subCategories.length > 0 && (
                            <ul className="space-y-1.5">
                                {subCategory.subCategories.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={`/products?category=${item.slug}`}
                                            className="block text-[13px] text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                                        >
                                            {item.name}
                                            {item.productCount !== undefined && item.productCount > 0 && (
                                                <span className="ml-1 text-[11px] text-gray-400">
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
    );
}
