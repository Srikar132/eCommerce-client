"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { collections } from "@/constants";



export function CollectionsDropdown() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-primary-50/50 data-[state=open]:bg-primary/50 data-[state=open]:font-bold text-xs font-light tracking-[0.15em] uppercase text-foreground  hover:text-primary transition-colors h-8 px-3">
            Collections
            <ChevronDown className="ml-1.5 h-3 w-3 transition-transform duration-200" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-60 gap-2 p-3 bg-background/95 backdrop-blur-sm shadow-lg border border-primary-100/20">
              {collections.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                  className={cn(
                    item.special && "text-destructive italic"
                  )}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-0.5 rounded-lg p-2.5 leading-none no-underline outline-none transition-colors hover:bg-rose-50 hover:text-rose-500 focus:bg-rose-50 focus:text-rose-500",
            className
          )}
          {...props}
        >
          <div className="text-xs font-medium leading-tight tracking-wide">{title}</div>
          <p className="line-clamp-1 text-[10px] leading-snug text-gray-500">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
