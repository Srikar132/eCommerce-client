"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { User2, Package, Mail, LogIn, } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function AccountHoverCard() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button
                    className="hidden sm:flex  rounded-full transition-colors border-0 bg-transparent hover:bg-transparent cursor-pointer"
                    aria-label="Account"
                >
                    <User2
                        className="w-5 h-5 lg:w-7 lg:h-7 text-foreground"
                        strokeWidth={3}
                    />
                </Button>
            </HoverCardTrigger>

            <HoverCardContent
                className="w-64 p-0"
                align="end"
                sideOffset={8}
            >
                <div className="space-y-0">
                    {/* User Info or Welcome Header */}
                    {isAuthenticated ? (
                        <div className="p-3 bg-muted/30">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            width={36}
                                            height={36}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <User2 className="w-4 h-4 text-primary" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                        {session.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {session.user?.email || ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 space-y-2.5">
                            <div className="space-y-0.5">
                                <h3 className="font-semibold text-sm">Welcome</h3>
                                <p className="text-xs text-muted-foreground">
                                    To access account and manage orders
                                </p>
                            </div>
                            <Link href="/login" className="block">
                                <Button
                                    className="w-full font-medium h-9"
                                    size="sm"
                                >
                                    <LogIn className="w-3.5 h-3.5 mr-1.5" />
                                    LOGIN / SIGNUP
                                </Button>
                            </Link>
                            <Separator />
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="p-1.5">
                        {isAuthenticated && (
                            <Link
                                href="/account"
                                className="flex items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
                            >
                                <User2 className="w-3.5 h-3.5 text-muted-foreground" />
                                My Account
                            </Link>
                        )}
                        <Link
                            href="/orders"
                            className="flex items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
                        >
                            <Package className="w-3.5 h-3.5 text-muted-foreground" />
                            Orders
                        </Link>


                        <Link
                            href="/contact"
                            className="flex items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
                        >
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            Contact Us
                        </Link>
                    </div>


                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
