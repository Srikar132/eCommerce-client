"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingChatProps {
    phoneNumber: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ phoneNumber }) => {
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const encodedMessage = encodeURIComponent(message);
        
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
        
        setMessage("");
        setOpen(false);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 font-sans">
            <TooltipProvider delayDuration={300}>
                <Popover open={open} onOpenChange={setOpen}>
                    {/* Tooltip for the button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                        open ? "bg-muted text-foreground" : "bg-foreground text-background"
                                    )}
                                >
                                    {open ? (
                                        <X size={24} className="animate-in spin-in-90 duration-300" />
                                    ) : (
                                        <MessageCircle size={24} className="animate-in zoom-in-50 duration-300" />
                                    )}
                                </button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent 
                            side="left" 
                            className="bg-white text-foreground border-border shadow-xl rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest mb-2 mr-2"
                        >
                            Chat with our artisan
                        </TooltipContent>
                    </Tooltip>

                    {/* Chat Window Content */}
                    <PopoverContent 
                        side="top" 
                        align="end" 
                        sideOffset={20}
                        className="w-[320px] p-0 bg-transparent border-none shadow-none focus:ring-0"
                    >
                        <div 
                            className={cn(
                                "w-full bg-background border border-border shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-black/95",
                                "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300"
                            )}
                        >
                            {/* Header */}
                            <div className="bg-foreground text-background p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Concierge</span>
                                    </div>
                                    <button 
                                        onClick={() => setOpen(false)}
                                        className="hover:rotate-90 transition-transform duration-300"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold tracking-tighter">How can we help <span className="italic font-serif font-light">you?</span></h3>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Tell us what you&apos;re looking for, and we&apos;ll guide you through our artisan sanctuary via WhatsApp.
                                </p>
                                <div className="relative">
                                    <Textarea 
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="min-h-[100px] bg-muted/30 border-none rounded-2xl resize-none focus-visible:ring-1 focus-visible:ring-accent/30 text-sm py-4"
                                    />
                                </div>
                                <Button 
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-6 h-auto text-[10px] font-bold uppercase tracking-[0.2em] group transition-all"
                                >
                                    <span className="flex items-center gap-2">
                                        Begin Conversation
                                        <Send className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                </Button>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 pt-2 text-center">
                                <div className="flex items-center justify-center gap-1.5 opacity-30">
                                    <Sparkles className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Nala Armoire Artisan Support</span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </TooltipProvider>
        </div>
    );
};
