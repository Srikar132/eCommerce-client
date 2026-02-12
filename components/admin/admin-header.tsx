"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { Bell } from "lucide-react";
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
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="admin-glow-button relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

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