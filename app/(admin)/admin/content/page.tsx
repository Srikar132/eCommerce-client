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
            className={`ml-1.5 h-5 min-w-5 px-1.5 text-[10px] font-bold border-0 transition-colors duration-200 ${
                isActive 
                    ? "bg-white text-primary shadow-sm" 
                    : "bg-primary/10 text-primary"
            }`}
        >
            {count}
        </Badge>
    );
}

const TAB_TRIGGER_CLASS = "flex-shrink-0 inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-semibold transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg cursor-pointer whitespace-nowrap min-w-[140px] sm:min-w-0 sm:flex-1 mx-0.5";

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState("hero");
    const { data: hero = [] } = useHeroSlides();
    const { data: testimonials = [] } = useTestimonials();
    const { data: categories = [] } = useCategories();

    const stats = {
        hero: hero.length,
        testimonials: testimonials.length,
        categories: categories.length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="admin-page-title">Content Management</h1>
                <p className="admin-page-description">
                    Manage your store&apos;s landing page sections and content
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`admin-stat-card cursor-pointer text-left transition-all duration-200 ${
                        activeTab === "hero"
                            ? "ring-2 ring-primary/40 border-primary/30 shadow-md"
                            : "hover:shadow-md hover:border-border"
                    }`}
                >
                    <div className="admin-stat-icon bg-indigo-500/10 text-indigo-600">
                        <LayoutPanelTop className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.hero}</p>
                        <p className="text-xs text-muted-foreground">Hero Slides</p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("testimonials")}
                    className={`admin-stat-card cursor-pointer text-left transition-all duration-200 ${
                        activeTab === "testimonials"
                            ? "ring-2 ring-primary/40 border-primary/30 shadow-md"
                            : "hover:shadow-md hover:border-border"
                    }`}
                >
                    <div className="admin-stat-icon bg-blue-500/10 text-blue-600">
                        <MessageSquareQuote className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.testimonials}</p>
                        <p className="text-xs text-muted-foreground">Testimonials</p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`admin-stat-card cursor-pointer text-left transition-all duration-200 ${
                        activeTab === "categories"
                            ? "ring-2 ring-primary/40 border-primary/30 shadow-md"
                            : "hover:shadow-md hover:border-border"
                    }`}
                >
                    <div className="admin-stat-icon bg-amber-500/10 text-amber-600">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.categories}</p>
                        <p className="text-xs text-muted-foreground">Categories</p>
                    </div>
                </button>
            </div>

            <div className="h-px bg-border/50 my-2" />

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="relative">
                    <TabsList className="w-full h-auto p-1.5 bg-card border border-border/50 shadow-sm flex overflow-x-auto no-scrollbar gap-2 justify-start sm:justify-center">
                        <TabsTrigger value="hero" className={TAB_TRIGGER_CLASS}>
                            <LayoutPanelTop className="h-4 w-4 shrink-0" />
                            <span>Hero</span>
                            <TabBadge count={stats.hero} isActive={activeTab === "hero"} />
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className={TAB_TRIGGER_CLASS}>
                            <MessageSquareQuote className="h-4 w-4 shrink-0" />
                            <span>Testimonials</span>
                            <TabBadge count={stats.testimonials} isActive={activeTab === "testimonials"} />
                        </TabsTrigger>
                        <TabsTrigger value="categories" className={TAB_TRIGGER_CLASS}>
                            <LayoutGrid className="h-4 w-4 shrink-0" />
                            <span>Categories</span>
                            <TabBadge count={stats.categories} isActive={activeTab === "categories"} />
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="hero" className="mt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <LayoutPanelTop className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Hero Carousel</h2>
                        </div>
                        
                        <Suspense fallback={<HeroSectionSkeleton />}>
                            <HeroSection />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="testimonials" className="mt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <MessageSquareQuote className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Customer Testimonials</h2>
                        </div>
                        
                        <Suspense fallback={<TestimonialsSectionSkeleton />}>
                            <TestimonialsSection />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <LayoutGrid className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Landing Page Categories</h2>
                        </div>
                        
                        <Suspense fallback={<CategoriesSectionSkeleton />}>
                            <CategoriesSection />
                        </Suspense>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
