"use client";

import Image from 'next/image';
import Link from 'next/link';
import { handleSearchAction } from '@/lib/actions/search-actions';
import { Search } from 'lucide-react';
import CustomButton2 from '@/components/ui/custom-button-2';
import { Input } from '@/components/ui/input';

interface NoResultsProps {
    searchQuery: string;
    imageSrc?: string;
}

export function NoResults({
    searchQuery,
    imageSrc = '/images/no-results.webp'
}: NoResultsProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
            {/* Elegant Search Indicator */}
            <div className="mb-8">
                <div className="px-4 py-1.5 bg-accent/5 rounded-full border border-accent/10">
                    <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-bold">
                        No matches for: <span className="text-foreground">&quot;{searchQuery}&quot;</span>
                    </p>
                </div>
            </div>

            {/* Visual Centerpiece - Reduced Size */}
            <div className="relative mb-10">
                <div className="relative w-40 h-40 md:w-52 md:h-52 opacity-80">
                    <Image
                        src={imageSrc}
                        alt="No results"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                {/* Soft glow behind image */}
                <div className="absolute inset-0 bg-accent/10 blur-[60px] rounded-full -z-10" />
            </div>

            {/* Narrative Section - Scaled Down */}
            <div className="text-center max-w-sm mb-10 space-y-3">
                <h2 className="text-xl md:text-2xl italic font-light leading-tight">The thread seems to have broken here.</h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic opacity-80">
                    We couldn&apos;t find any products matching your search. Perhaps try a broader term 
                    or explore our signature collections?
                </p>
            </div>

            {/* Refined Search Form - Compact */}
            <div className="w-full max-w-sm mb-10">
                <form action={handleSearchAction} className="relative group">
                    <Input
                        name="query"
                        type="text"
                        placeholder="Search for something else..."
                        className="w-full h-12 pl-5 pr-12 rounded-full border-accent/20 bg-background text-sm focus:ring-accent/10 focus:border-accent transition-all duration-500"
                        required
                    />
                    <button 
                        type="submit"
                        className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>

            {/* Primary Action - Compact */}
            <div className="flex flex-col sm:flex-row gap-5 items-center">
                <CustomButton2
                    href="/products"
                    bgColor="#000000"
                    fillColor="#ffffff"
                    textColor="#ffffff"
                    textHoverColor="#000000"
                >
                    Browse Collections
                </CustomButton2>
                
                <Link 
                    href="/"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}

export default NoResults;