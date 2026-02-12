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
    return pathname === path;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="absolute top-4 right-4 h-8 w-8 md:hidden z-50"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/images/logo.webp"
                    alt="Nala-armoire"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ARMOIRE</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
                      >
                        <Link href={route.href}>
                          <Icon />
                          <span className="text-lg">{route.label}</span>
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