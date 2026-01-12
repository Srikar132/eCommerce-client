"use client";

import Link from "next/link";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";
import { useRootCategories, useCategoryChildren } from "@/lib/tanstack/queries";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
    className?: string;
}

export function CategoryNavigation({ className }: CategoryNavigationProps) {
    const { data: rootCategories = FALLBACK_CATEGORIES } = useRootCategories();

    return (
        <NavigationMenu viewport={false} className={cn("hidden xl:flex", className)}>
            <NavigationMenuList>
                {rootCategories.map((category) => (
                    <NavigationMenuItem key={category.id}>
                        <NavigationMenuTrigger className="bg-transparent!">
                            {category.name}
                        </NavigationMenuTrigger>
                        
                        <CategoryMegaMenu categorySlug={category.slug} />
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function CategoryMegaMenu({ categorySlug }: { categorySlug: string }) {
    const { data: subCategories = [] } = useCategoryChildren(categorySlug);

    if (!subCategories || subCategories.length === 0) {
        return null;
    }

    return (
        <NavigationMenuContent>
            <div className="w-[900px] p-4 z-50">
                <div className="grid grid-cols-5 gap-x-8">
                    {subCategories.map((subCategory) => {
                        const hasSubCategories = subCategory.subCategories && subCategory.subCategories.length > 0;
                        
                        return (
                            <div key={subCategory.id} className="mb-6">
                                <Link
                                    href={`/products?category=${subCategory.slug}`}
                                    className="block text-[13px] font-semibold text-gray-900 hover:text-primary transition-colors"
                                >
                                    {subCategory.name}
                                </Link>

                                {hasSubCategories && (
                                    <ul className="space-y-1.5 mt-2.5">
                                        {subCategory?.subCategories?.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={`/products?category=${item.slug}`}
                                                    className="block text-[13px] text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                                                >
                                                    {item.name}
                                                    {item.productCount !== undefined && item.productCount > 0 && (
                                                        <span className="ml-1 text-[11px]">
                                                            ({item.productCount})
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </NavigationMenuContent>
    );
}