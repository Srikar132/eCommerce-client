"use client"

import React from "react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {CreditCard, Mail, MapPin, ShoppingBag, Bell, ChevronRight, LogOut} from "lucide-react";

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    onSignOut: () => void;
}

const menuItems = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'cards', label: 'Saved Cards', icon: CreditCard },
    { id: 'signin', label: 'Edit Sign In Details', icon: Mail },
    { id: 'address', label: 'Edit Billing Address', icon: MapPin },
    { id: 'preferences', label: 'Marketing Preferences', icon: Bell}
]

const Sidebar = ({ activeSection, onSectionChange, onSignOut }: SidebarProps) => {
    return(
        <div className="w-full lg:w-72 bg-white border-r border-zinc-200">
            <div className="p-8 border-b border-zinc-200">
                <h2 className="text-2xl font-medium tracking-wider">MY ACCOUNT</h2>
            </div>

            <nav className="p-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-between cursor-pointer rounded-none h-12 px-4 transition-all duration-200 ${
                                activeSection === item.id
                                    ? 'bg-black text-white hover:bg-black'
                                    : 'hover:bg-zinc-100 text-zinc-700'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <Icon size={18} />
                                <span className="text-sm font-medium tracking-wide">{item.label}</span>
                            </div>
                            <ChevronRight size={16} />
                        </Button>
                    );
                })}

                <Separator className="my-6 bg-zinc-200" />

                <Button
                    onClick={() => console.log('Navigate to shop')}
                    variant="ghost"
                    className="w-full justify-between h-12 px-4 hover:bg-zinc-100 text-zinc-700"
                >
                    <div className="flex items-center gap-4">
                        <ShoppingBag size={18} />
                        <span className="text-sm font-medium tracking-wide">Shop Now</span>
                    </div>
                    <ChevronRight size={16} />
                </Button>
            </nav>

            <div className="p-6">
                <Button
                    variant="outline"
                    className="w-full h-12 border-zinc-300 rounded-none hover:bg-zinc-100 hover:border-zinc-400"
                    onClick={onSignOut}
                >
                    <LogOut size={18} className="mr-3" />
                    <span className="font-medium tracking-widest">SIGN OUT</span>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar;