"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { Bell, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export function AdminHeader() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="admin-header sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 w-full">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="admin-glow-button" />
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link href="/?preview=true" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>Visit Store</span>
            </Link>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="admin-glow-button relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="admin-card">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="admin-glow-button cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}