"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    User,
    Mail,
    ShoppingCart,
    Home,
    ShoppingBag,
    Info,
    Package,
    HelpCircle,
    X,
    ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { collections } from "@/constants";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import Image from "next/image";

export default function AppSidebar() {
    const { open, setOpen, isMobile, setOpenMobile } = useSidebar();

    const handleClose = () => {
        if (isMobile) {
            setOpenMobile(false);
        } else {
            setOpen(false);
        }
    };

    return (
        <>
            {/* Backdrop Blur Overlay */}
            <div
                className={cn(
                    "fixed inset-0 backdrop-blur-sm bg-black/10 z-[9998] transition-all duration-500 ease-in-out hidden md:block",
                    open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            <Sidebar
                collapsible="offcanvas"
                className="z-[9999] border-r-0 shadow-2xl overflow-x-hidden bg-background"
            >
                {/* Header with Brand Identity */}
                <SidebarHeader className="bg-background pt-10 pb-6 px-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" onClick={handleClose} className="group">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 transition-transform duration-500 group-hover:rotate-12">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="Nala Armoire"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold tracking-tighter text-foreground leading-none">
                                        NaLa ARMOIRE
                                    </p>
                                    <p className="text-xs italic text-muted-foreground tracking-wide mt-1 opacity-60">
                                        where beauty roars
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="rounded-full hover:bg-accent/10 h-10 w-10"
                        >
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                </SidebarHeader>

                {/* Main Navigation - Unified Scrollable Content */}
                <SidebarContent className="px-6 py-6 scrollbar-hide">
                    <div className="flex flex-col min-h-full">
                        <SidebarMenu className="gap-3">
                            {/* Primary Links */}
                            {[
                                { icon: Home, label: "Home", href: "/" },
                                { icon: ShoppingBag, label: "Shop All", href: "/products" },
                            ].map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        className="h-16 px-6 rounded-full hover:bg-accent/5 transition-all duration-300 active:scale-95"
                                    >
                                        <Link href={item.href} onClick={handleClose} className="flex items-center gap-4">
                                            <item.icon className="w-6 h-6 text-accent" strokeWidth={1.25} />
                                            <span className="text-lg font-medium tracking-tight text-foreground/80">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {/* Expandable Collections */}
                            <SidebarMenuItem>
                                <Collapsible className="group/collapsible">
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className="h-16 px-6 rounded-full hover:bg-accent/5 transition-all duration-300 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Package className="w-6 h-6 text-accent" strokeWidth={1.25} />
                                                <span className="text-lg font-medium tracking-tight text-foreground/80">Collections</span>
                                            </div>
                                            <ChevronDown
                                                className="w-5 h-5 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180"
                                                strokeWidth={1.25}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="px-4 pt-3">
                                        <div className="space-y-2 pl-6 border-l border-accent/20 py-2 ml-3">
                                            {collections.map((collection) => (
                                                <Link
                                                    key={collection.title}
                                                    href={collection.href}
                                                    onClick={handleClose}
                                                    className="flex flex-col py-3.5 px-5 rounded-2xl hover:bg-accent/5 transition-colors group/subitem"
                                                >
                                                    <span className="text-sm font-semibold text-foreground/70 group-hover/subitem:text-accent transition-colors">
                                                        {collection.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground/70 leading-relaxed mt-1">
                                                        {collection.description}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Secondary Links */}
                            {[
                                { icon: ShoppingCart, label: "Shopping Bag", href: "/cart" },
                                { icon: ClipboardList, label: "My Orders", href: "/orders" },
                            ].map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        className="h-16 px-6 rounded-full hover:bg-accent/5 transition-all duration-300"
                                    >
                                        <Link href={item.href} onClick={handleClose} className="flex items-center gap-4">
                                            <item.icon className="w-6 h-6 text-accent" strokeWidth={1.25} />
                                            <span className="text-lg font-medium tracking-tight text-foreground/80">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                        {/* Support & Info Section - Now part of the main scroll */}
                        <div className="mt-12 mb-8 space-y-6">
                            <p className="text-[10px] font-bold text-muted-foreground/40 px-6 tracking-[0.3em] uppercase">
                                Support & Info
                            </p>
                            <SidebarMenu className="gap-2">
                                {[
                                    { icon: User, label: "My Account", href: "/account" },
                                    { icon: Info, label: "About Nala", href: "/about" },
                                    { icon: Mail, label: "Get in Touch", href: "/contact" },
                                    { icon: HelpCircle, label: "FAQ", href: "/faq" },
                                ].map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            className="h-14 px-6 rounded-full hover:bg-accent/5 transition-all duration-300"
                                        >
                                            <Link href={item.href} onClick={handleClose} className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5 text-accent/50" strokeWidth={1.5} />
                                                <span className="text-base font-medium text-foreground/60 tracking-tight">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </div>
                    </div>
                </SidebarContent>
            </Sidebar>
        </>
    );
}