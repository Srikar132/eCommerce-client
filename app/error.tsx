"use client";

import { useEffect } from "react";
import CustomButton2 from "@/components/ui/custom-button-2";
import { AlertCircle, RefreshCcw, Home, Wind } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console
        console.error("Sanctuary Error Encountered:", error);
    }, [error]);

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Background Narrative: Giant Watermark */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                <span className="text-[30vw] font-black tracking-tighter leading-none select-none uppercase">Error</span>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 right-10 opacity-10 animate-pulse hidden lg:block">
                <AlertCircle className="w-12 h-12" />
            </div>
            <div className="absolute bottom-20 left-10 opacity-10 animate-bounce hidden lg:block">
                <Wind className="w-12 h-12" />
            </div>

            <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-12">

                {/* Central Visual Marker */}
                <div className="relative group">
                    <div className="absolute -inset-8 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-1000" />
                    <div className="w-24 h-24 rounded-full bg-background border border-border shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <AlertCircle className="w-10 h-10 text-accent/40" strokeWidth={1} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent opacity-60">
                            A Stitch Has Slipped
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter italic font-serif">
                            Unexpected <span className="font-light opacity-60 italic">Knot</span>
                        </h1>
                    </div>

                    <p className="text-base text-muted-foreground italic max-w-lg mx-auto leading-relaxed">
                        &quot;Even the finest patterns encounter a knot. Our artisans have been
                        notified, and we&apos;re working to smooth out this thread.&quot;
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6 items-center pt-4">
                    <button
                        onClick={() => reset()}
                        className="group relative flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-full font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-foreground/20"
                    >
                        <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-1000" />
                        Try Re-weaving
                    </button>

                    <CustomButton2
                        href="/"
                        bgColor="transparent"
                        fillColor="#000000"
                        textColor="#000000"
                        textHoverColor="#ffffff"
                        className="border border-foreground/10 h-auto py-5"
                    >
                        <span className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Back to Sanctuary
                        </span>
                    </CustomButton2>
                </div>

                {/* Technical Footnote */}
                <div className="pt-20 border-t border-border/10 w-full opacity-40">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold mb-2">
                        Nala Armoire Artisan Support
                    </p>
                    {error.digest && (
                        <code className="text-[8px] font-mono opacity-50 bg-muted px-2 py-1 rounded">
                            Ref ID: {error.digest}
                        </code>
                    )}
                </div>
            </div>
        </div>
    );
}
