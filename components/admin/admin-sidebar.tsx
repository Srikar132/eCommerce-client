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

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-2">
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

            <SidebarMenuButton
              size="lg"
              asChild
              className="h-12 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0!"
            >
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-xl overflow-hidden size-10 shrink-0">
                  <Image
                    src="/images/logo.webp"
                    alt="Nala-armoire"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-base">ARMOIRE</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {routes.map((route) => {
                const Icon = route.icon;
                const active = isActive(route.href);

                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={route.label}
                      className={`
                        rounded-lg h-10 px-3 transition-all duration-200
                        group-data-[collapsible=icon]:size-10! 
                        group-data-[collapsible=icon]:p-0! 
                        group-data-[collapsible=icon]:justify-center!
                        ${active
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-sidebar-accent"
                        }
                      `}
                    >
                      <Link href={route.href} className="flex items-center gap-3">
                        <Icon className={`size-5! shrink-0 ${active ? "" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                          {route.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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