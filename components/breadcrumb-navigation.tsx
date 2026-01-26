"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
  // Main routes
  products: "Products",
  cart: "Shopping Cart",
  checkout: "Checkout",
  contact: "Contact Us",
  account: "My Account",
  orders: "Orders",
  wishlist: "Wishlist",
  login: "Login",
  
  // Account sub-routes
  "account-details": "Account Details",
  "saved-addresses": "Saved Addresses",
};

function formatSegment(segment: string): string {
  // Check if we have a custom name
  if (routeNameMap[segment]) {
    return routeNameMap[segment];
  }
  
  // Handle slugs (kebab-case to Title Case)
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function BreadcrumbNavigation() {
  const pathname = usePathname();

  // Don't show breadcrumb on home page
  if (pathname === "/") {
    return null;
  }

  // Split pathname and filter empty segments
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // Don't show breadcrumb if only one segment and it's a main route
  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="py-4 bg-background/50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem className="pl-0">
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Dynamic segments */}
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label = formatSegment(segment);

            return (
              <div key={segment + index} className="flex items-center gap-2">
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        href={href}
                        className="hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      </div>
    </div>
  );
}
