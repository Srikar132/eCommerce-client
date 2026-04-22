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
          <NavigationMenuTrigger className=" text-xs tracking-[0.15em] uppercase text-foreground  h-8 px-3">
            Collections
            <ChevronDown className="ml-1.5 h-3 w-3 transition-transform duration-200" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-60 gap-2 p-3 bg-background/95 backdrop-blur-sm shadow-lg border border-accent/20">
              {collections.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
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
            "block select-none space-y-0.5 rounded-lg p-2.5 leading-none no-underline outline-none ",
            className
          )}
          {...props}
        >
          <div className="text-xs font-medium leading-tight tracking-wide">{title}</div>
          <p className="line-clamp-1 text-[10px] leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
