"use client";

import { useState, Suspense } from "react";
import { LayoutPanelTop, MessageSquareQuote, LayoutGrid } from "lucide-react";
import {
    HeroSection,
    HeroSectionSkeleton,
    TestimonialsSection,
    TestimonialsSectionSkeleton,
    CategoriesSection,
    CategoriesSectionSkeleton,
} from "@/components/admin/content";
import { useHeroSlides, useTestimonials } from "@/lib/tanstack/queries/content.queries";
import { useCategories } from "@/lib/tanstack/queries/product.queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function TabBadge({ count, isActive }: { count: number; isActive: boolean }) {
    return (
        <Badge
            variant="secondary"
            className={`ml-2 h-5.5 min-w-5.5 px-1.5 text-[10px] font-black border-0 transition-all duration-300 rounded-full ${isActive
                    ? "bg-white text-primary shadow-sm scale-110"
                    : "bg-primary/20 text-primary"
                }`}
        >
            {count}
        </Badge>
    );
}

const TAB_TRIGGER_CLASS = "flex-shrink-0 inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold transition-all rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 cursor-pointer whitespace-nowrap min-w-fit sm:flex-1 mx-0.5 sm:mx-1 hover:bg-muted/50 data-[state=active]:hover:bg-primary active:scale-[0.98]";

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState("hero");
    const { data: hero = [] } = useHeroSlides();
    const { data: testimonials = [] } = useTestimonials();
    const categoryQuery = useCategories();
    
    // categories query returns { success, data }
    const categoriesList = categoryQuery.data?.data || [];

    const stats = {
        hero: Array.isArray(hero) ? hero.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        categories: categoriesList.length,
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto py-2 md:py-6" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/60 text-left">
                <div className="space-y-1.5">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground/90 uppercase">
                        Storefront Content
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Curate your landing page experience, manage testimonials, and categorize your collections with our premium content suite.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-6 text-left transition-all duration-300 ${activeTab === "hero"
                            ? "bg-card shadow-xl border-primary/40 ring-1 ring-primary/20"
                            : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg shadow-sm"
                        }`}
                >
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-inner transition-all duration-300 ${activeTab === "hero" ? "bg-indigo-500 text-white scale-110" : "bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500/20"}`}>
                            <LayoutPanelTop className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 truncate">Hero Slides</p>
                            <p className="text-2xl sm:text-3xl font-black text-foreground/90">{stats.hero}</p>
                        </div>
                    </div>
                    {activeTab === "hero" && (
                        <div className="absolute top-0 right-0 p-3">
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        </div>
                    )}
                </button>
                
                <button
                    onClick={() => setActiveTab("testimonials")}
                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-6 text-left transition-all duration-300 ${activeTab === "testimonials"
                            ? "bg-card shadow-xl border-primary/40 ring-1 ring-primary/20"
                            : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg shadow-sm"
                        }`}
                >
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-inner transition-all duration-300 ${activeTab === "testimonials" ? "bg-blue-500 text-white scale-110" : "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20"}`}>
                            <MessageSquareQuote className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 truncate">Social Proof</p>
                            <p className="text-2xl sm:text-3xl font-black text-foreground/90">{stats.testimonials}</p>
                        </div>
                    </div>
                    {activeTab === "testimonials" && (
                        <div className="absolute top-0 right-0 p-3">
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("categories")}
                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-6 text-left transition-all duration-300 ${activeTab === "categories"
                            ? "bg-card shadow-xl border-primary/40 ring-1 ring-primary/20"
                            : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg shadow-sm"
                        }`}
                >
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-inner transition-all duration-300 ${activeTab === "categories" ? "bg-amber-500 text-white scale-110" : "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20"}`}>
                            <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 truncate">Collections</p>
                            <p className="text-2xl sm:text-3xl font-black text-foreground/90">{stats.categories}</p>
                        </div>
                    </div>
                    {activeTab === "categories" && (
                        <div className="absolute top-0 right-0 p-3">
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        </div>
                    )}
                </button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
                <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
                    <TabsList className="inline-flex h-auto p-1.5 bg-card/50 backdrop-blur-md border border-border/50 shadow-xl rounded-full flex-nowrap gap-1">
                        <TabsTrigger value="hero" className={TAB_TRIGGER_CLASS}>
                            <LayoutPanelTop className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                            <span className="hidden xs:inline">Hero Carousel</span>
                            <span className="xs:hidden">Hero</span>
                            <TabBadge count={stats.hero} isActive={activeTab === "hero"} />
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className={TAB_TRIGGER_CLASS}>
                            <MessageSquareQuote className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                            <span className="hidden xs:inline">Testimonials</span>
                            <span className="xs:hidden">Reviews</span>
                            <TabBadge count={stats.testimonials} isActive={activeTab === "testimonials"} />
                        </TabsTrigger>
                        <TabsTrigger value="categories" className={TAB_TRIGGER_CLASS}>
                            <LayoutGrid className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                            <span className="hidden xs:inline">Categories</span>
                            <span className="xs:hidden">Cats</span>
                            <TabBadge count={stats.categories} isActive={activeTab === "categories"} />
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="pt-4">
                    <TabsContent value="hero" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <LayoutPanelTop className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-foreground/90 uppercase tracking-tight">Hero Carousel</h2>
                                </div>
                            </div>

                            <Suspense fallback={<HeroSectionSkeleton />}>
                                <HeroSection />
                            </Suspense>
                        </div>
                    </TabsContent>

                    <TabsContent value="testimonials" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MessageSquareQuote className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-foreground/90 uppercase tracking-tight">Customer Voices</h2>
                                </div>
                            </div>

                            <Suspense fallback={<TestimonialsSectionSkeleton />}>
                                <TestimonialsSection />
                            </Suspense>
                        </div>
                    </TabsContent>

                    <TabsContent value="categories" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <LayoutGrid className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-foreground/90 uppercase tracking-tight">Landing Collections</h2>
                                </div>
                            </div>

                            <Suspense fallback={<CategoriesSectionSkeleton />}>
                                <CategoriesSection />
                            </Suspense>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
