"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, User, HelpCircle, Mail, MapPin } from "lucide-react";

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
            {/* Men's Section */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => toggleSection('mens')}
                className="w-full justify-between text-base py-6 border-b"
              >
                <span>Men's</span>
                <ChevronDown className={`transition-transform ${expandedSection === 'mens' ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
              {expandedSection === 'mens' && (
                <div className="pl-4 py-2 space-y-2">
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Clothing</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Shoes</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Accessories</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Sale</a>
                </div>
              )}
            </SidebarMenuItem>

            {/* Women's Section */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => toggleSection('womens')}
                className="w-full justify-between text-base py-6 border-b"
              >
                <span>Women's</span>
                <ChevronDown className={`transition-transform ${expandedSection === 'womens' ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
              {expandedSection === 'womens' && (
                <div className="pl-4 py-2 space-y-2">
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Clothing</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Shoes</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Accessories</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Sale</a>
                </div>
              )}
            </SidebarMenuItem>

            {/* Kids Section */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => toggleSection('kids')}
                className="w-full justify-between text-base py-6 border-b"
              >
                <span>Kids</span>
                <ChevronDown className={`transition-transform ${expandedSection === 'kids' ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
              {expandedSection === 'kids' && (
                <div className="pl-4 py-2 space-y-2">
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Boys</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Girls</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Baby</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Sale</a>
                </div>
              )}
            </SidebarMenuItem>

            {/* Bags */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <a href="#" className="w-full">Bags</a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Bestsellers */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => toggleSection('bestsellers')}
                className="w-full justify-between text-base py-6 border-b"
              >
                <span>Bestsellers</span>
                <ChevronDown className={`transition-transform ${expandedSection === 'bestsellers' ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
              {expandedSection === 'bestsellers' && (
                <div className="pl-4 py-2 space-y-2">
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Top Rated</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Most Popular</a>
                  <a href="#" className="block py-2 text-sm hover:opacity-70">Trending Now</a>
                </div>
              )}
            </SidebarMenuItem>

            {/* Sale */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <a href="#" className="w-full">Sale</a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* New Arrival */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <a href="#" className="w-full">New Arrival</a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Lookbook */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <a href="#" className="w-full">Lookbook</a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* About Us */}
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-6 border-b">
                <a href="#" className="w-full">About Us</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t px-6 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <User className="w-5 h-5 mr-3" />
                <a href="#" className="w-full">Log in</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <HelpCircle className="w-5 h-5 mr-3" />
                <a href="#" className="w-full">FAQ</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <Mail className="w-5 h-5 mr-3" />
                <a href="#" className="w-full">Contact</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start text-base py-3">
                <MapPin className="w-5 h-5 mr-3" />
                <a href="#" className="w-full">USD</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
    
  )
}