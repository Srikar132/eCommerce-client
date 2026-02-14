"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/constants/admin-data";
import { X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Collapsible } from "@/components/ui/collapsible";

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="absolute top-4 right-4 h-6 w-8 md:hidden z-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <SidebarMenuButton size="lg" asChild className="">
              <Link href="/admin">
                <div className="flex aspect-square size-16 items-center justify-center rounded-xl overflow-hidden">
                  <Image
                    src="/images/logo.webp"
                    alt="Nala-armoire"
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-base">ARMOIRE</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {routes.map((route) => {
                const Icon = route.icon;
                const active = isActive(route.href);

                return (
                  <Collapsible key={route.label}
                    asChild
                    className="group/collapsible">
                    <SidebarMenuItem key={route.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={route.label}
                        className={`rounded-xl h-11 transition-all duration-200 ${active
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-sidebar-accent"
                          }`}
                      >
                        <Link href={route.href}>
                          <Icon className={`h-5 w-5 ${active ? "" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">{route.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}