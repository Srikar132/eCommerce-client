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
    <Sidebar collapsible="icon" className="border-r border-border/40 transition-all duration-300">
      <SidebarHeader className="h-16 border-b border-border/40 p-0 flex items-center justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="w-full flex justify-center">
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="absolute top-5 right-4 h-6 w-8 md:hidden z-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <SidebarMenuButton
              size="lg"
              asChild
              className="h-16 w-full px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
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
                  <span className="truncate font-bold text-base tracking-tight">ARMOIRE</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">Admin Panel</span>
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
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={`
                        rounded-lg h-10 px-3 transition-all duration-200
                        group-data-[collapsible=icon]:size-10! 
                        group-data-[collapsible=icon]:p-0! 
                        group-data-[collapsible=icon]:justify-center!
                        ${active
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <Link href={route.href} className="flex items-center gap-3 w-full">
                        <Icon className={`size-5! shrink-0 transition-colors ${active ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
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