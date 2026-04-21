"use client";

import Link from "next/link";
import { MoveLeft, Scissors, Wind, Map } from "lucide-react";
import CustomButton2 from "@/components/ui/custom-button-2";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Background Narrative: Giant Watermark */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <span className="text-[40vw] font-black tracking-tighter leading-none select-none">404</span>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 opacity-10 animate-pulse hidden lg:block">
                <Scissors className="w-12 h-12 rotate-45" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-10 animate-bounce hidden lg:block">
                <Wind className="w-12 h-12" />
            </div>

            <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center space-y-12">
                
                {/* Central Visual Marker */}
                <div className="relative group">
                    <div className="absolute -inset-8 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-1000" />
                    <div className="relative space-y-2">
                        <span className="text-[120px] md:text-[180px] font-black tracking-tighter leading-none text-foreground select-none">
                            404
                        </span>
                        <div className="h-1 w-full bg-accent/20 rounded-full scale-x-50 group-hover:scale-x-100 transition-transform duration-1000" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent opacity-60">
                            Pattern Not Found
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter italic font-serif">
                            The Thread Has <span className="font-light opacity-60 italic">Slipped</span>
                        </h1>
                    </div>
                    
                    <p className="text-base md:text-lg text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
                        &quot;In the intricate tapestry of our sanctuary, even the most intentional threads 
                        can sometimes wander. This particular memory appears to have unraveled.&quot;
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-8 items-center pt-4">
                    <CustomButton2
                        href="/"
                        bgColor="#000000"
                        fillColor="#ffffff"
                        textColor="#ffffff"
                        textHoverColor="#000000"
                        className="scale-110"
                    >
                        <span className="flex items-center gap-2">
                            <MoveLeft className="w-4 h-4" />
                            Return to Safety
                        </span>
                    </CustomButton2>
                    
                    <Link 
                        href="/products"
                        className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-all"
                    >
                        <Map className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Explore Collections
                    </Link>
                </div>

                {/* Brand Footnote */}
                <div className="pt-20 border-t border-border/10 w-full max-w-xs opacity-40">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold">
                        Nala Armoire — Artisan Sanctuary
                    </p>
                </div>
            </div>

            {/* Side Labels */}
            <div className="hidden xl:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-24 items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] -rotate-90 text-muted-foreground/20">Lost Pattern</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] -rotate-90 text-muted-foreground/20">Memory Slip</span>
            </div>
        </div>
    );
}
