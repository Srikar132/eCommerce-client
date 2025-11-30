"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, User, HelpCircle, Mail, ShoppingCart, Search, Home, MapPin } from "lucide-react";
import Link from "next/link";

export default function AppSidebar() {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar()
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // lock scrolling when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);


  const toggleSection = useCallback((section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <>

      {!isMobile && open && (
        <div
          className="fixed inset-0 backdrop-blur bg-black/50 z-9999 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}


      <Sidebar collapsible="offcanvas" className="z-99999">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">MENU</h2>
            <button 
              onClick={handleClose}
              className="text-2xl hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-6 py-4">
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <Home className="w-5 h-5 mr-3" />
                <Link href="/" className="w-full">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Categories */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => toggleSection('categories')}
                className="w-full justify-between text-base py-6 border-b"
              >
                <span>Categories</span>
                <ChevronDown className={`transition-transform ${expandedSection === 'categories' ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
              {expandedSection === 'categories' && (
                <div className="pl-4 py-2 space-y-2">
                  <Link href="/category/men?sort=relevance" className="block py-2 text-sm hover:opacity-70">Men</Link>
                  <Link href="/category/women?sort=relevance" className="block py-2 text-sm hover:opacity-70">Women</Link>
                  <Link href="/category/kids?sort=relevance" className="block py-2 text-sm hover:opacity-70">Kids</Link>
                  <Link href="/category/genz?sort=relevance" className="block py-2 text-sm hover:opacity-70">GenZ</Link>
                </div>
              )}
            </SidebarMenuItem>

            {/* Search */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <Search className="w-5 h-5 mr-3" />
                <Link href="/search" className="w-full">Search</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Cart */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <ShoppingCart className="w-5 h-5 mr-3" />
                <Link href="/cart" className="w-full">Cart</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Customization */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <Link href="/customization" className="w-full">Brands & Designs</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t px-6 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <User className="w-5 h-5 mr-3" />
                <Link href="/account" className="w-full">Account</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <Mail className="w-5 h-5 mr-3" />
                <Link href="/contact" className="w-full">Contact</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
    
  )
}