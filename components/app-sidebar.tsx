"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { useEffect } from "react";
import { 
  ChevronDown, 
  User, 
  Mail, 
  ShoppingCart, 
  Search, 
  Home,
  ShoppingBag,
  Heart,
  Sparkles,
  Info,
  Package
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { collections } from "@/constants";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import Image from "next/image";

export default function AppSidebar() {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar()

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
          className="fixed inset-0 backdrop-blur-sm bg-black/40 z-9999 transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <Sidebar collapsible="offcanvas" className="z-99999 border-r border-border overflow-x-hidden">
        {/* Header with Logo */}
        <SidebarHeader className="border-b border-border bg-background/95 backdrop-blur-sm overflow-x-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" onClick={handleClose} className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.webp"
                    alt="The Nala Armoire"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-foreground">The Nala Armoire</p>
                  <p className="text-[10px] italic text-muted-foreground -mt-0.5">where beauty roars</p>
                </div>
              </Link>
              
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="text-2xl font-light">×</span>
              </Button>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="py-2 scrollbar-hide overflow-x-hidden">
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
              >
                <Link href="/" onClick={handleClose} className="flex items-center gap-3">
                  <Home className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Collections - Expandable */}
            <SidebarMenuItem>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-light tracking-wide">Collections</span>
                    </div>
                    <ChevronDown 
                      className="w-4 h-4 mr-5 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                      strokeWidth={1.5}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="mx-4 mt-1 mb-2 bg-accent/30 rounded-lg overflow-hidden">
                    {collections.map((collection) => (
                      <Link 
                        key={collection.title}
                        href={collection.href}
                        onClick={handleClose}
                        className={`block px-6 py-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0 ${collection.special ? 'bg-destructive/10' : ''}`}
                      >
                        <p className={`text-xs font-medium tracking-wider uppercase ${collection.special ? 'text-destructive italic' : 'text-foreground'}`}>
                          {collection.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {collection.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            <Separator className="my-2 mx-4" />

            {/* Shop */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
              >
                <Link href="/products" onClick={handleClose} className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">Shop</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator className="my-2 mx-4" />

            {/* Search */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
              >
                <Link href="/products" onClick={handleClose} className="flex items-center gap-3">
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">Search</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Wishlist */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
              >
                <Link href="/account/wishlist" onClick={handleClose} className="flex items-center gap-3">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">Wishlist</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Cart */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="mx-4 my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
              >
                <Link href="/cart" onClick={handleClose} className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">Cart</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border bg-muted/30 overflow-x-hidden">
          <div className="px-4 py-3">
            <SidebarMenu>
              {/* Account */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
                >
                  <Link href="/account" onClick={handleClose} className="flex items-center gap-3">
                    <User className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm font-light tracking-wide">Account</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* About */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
                >
                  <Link href="/about" onClick={handleClose} className="flex items-center gap-3">
                    <Info className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm font-light tracking-wide">About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Contact */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="my-1 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
                >
                  <Link href="/contact" onClick={handleClose} className="flex items-center gap-3">
                    <Mail className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm font-light tracking-wide">Contact</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
    
  )
}