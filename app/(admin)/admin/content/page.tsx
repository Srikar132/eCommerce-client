"use client";

import { useState, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid,
    Sparkles,
    MessageSquareQuote,
    ImageIcon,
    LayoutPanelTop,
} from "lucide-react";
import {
    CategoriesSection,
    CategoriesSectionSkeleton,
    ShowcaseSection,
    ShowcaseSectionSkeleton,
    TestimonialsSection,
    TestimonialsSectionSkeleton,
    SliderSection,
    SliderSectionSkeleton,
    HeroSection,
    HeroSectionSkeleton,
} from "@/components/admin/content";
import {
    useLandingCategories,
    useShowcaseProducts,
    useTestimonials,
    useSliderImages,
    useHeroSlides,
} from "@/lib/tanstack/queries/content.queries";

// Stats component to show counts in tabs
function useContentStats() {
    const { data: categories = [] } = useLandingCategories();
    const { data: showcase = [] } = useShowcaseProducts();
    const { data: testimonials = [] } = useTestimonials();
    const { data: slider = [] } = useSliderImages();
    const { data: hero = [] } = useHeroSlides();

    return {
        categories: categories.length,
        showcase: showcase.length,
        testimonials: testimonials.length,
        slider: slider.length,
        hero: hero.length,
    };
}

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
    const stats = useContentStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="admin-page-title">Content Management</h1>
                <p className="admin-page-description">
                    Manage your store&apos;s landing page sections and content
                </p>
            </div>

            {/* Quick Stats - clickable to switch tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <QuickStatCard
                    label="Hero Slides"
                    count={stats.hero}
                    icon={LayoutPanelTop}
                    color="bg-indigo-500/10 text-indigo-600"
                    isActive={activeTab === "hero"}
                    onClick={() => setActiveTab("hero")}
                />
                <QuickStatCard
                    label="Categories"
                    count={stats.categories}
                    icon={LayoutGrid}
                    color="bg-primary/10 text-primary"
                    isActive={activeTab === "categories"}
                    onClick={() => setActiveTab("categories")}
                />
                <QuickStatCard
                    label="Showcase"
                    count={stats.showcase}
                    icon={Sparkles}
                    color="bg-amber-500/10 text-amber-600"
                    isActive={activeTab === "showcase"}
                    onClick={() => setActiveTab("showcase")}
                />
                <QuickStatCard
                    label="Testimonials"
                    count={stats.testimonials}
                    icon={MessageSquareQuote}
                    color="bg-blue-500/10 text-blue-600"
                    isActive={activeTab === "testimonials"}
                    onClick={() => setActiveTab("testimonials")}
                />
                <QuickStatCard
                    label="Slider"
                    count={stats.slider}
                    icon={ImageIcon}
                    color="bg-pink-500/10 text-pink-600"
                    isActive={activeTab === "slider"}
                    onClick={() => setActiveTab("slider")}
                />
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
                        <TabsTrigger value="categories" className={TAB_TRIGGER_CLASS}>
                            <LayoutGrid className="h-4 w-4 shrink-0" />
                            <span>Categories</span>
                            <TabBadge count={stats.categories} isActive={activeTab === "categories"} />
                        </TabsTrigger>
                        <TabsTrigger value="showcase" className={TAB_TRIGGER_CLASS}>
                            <Sparkles className="h-4 w-4 shrink-0" />
                            <span>Showcase</span>
                            <TabBadge count={stats.showcase} isActive={activeTab === "showcase"} />
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className={TAB_TRIGGER_CLASS}>
                            <MessageSquareQuote className="h-4 w-4 shrink-0" />
                            <span>Testimonials</span>
                            <TabBadge count={stats.testimonials} isActive={activeTab === "testimonials"} />
                        </TabsTrigger>
                        <TabsTrigger value="slider" className={TAB_TRIGGER_CLASS}>
                            <ImageIcon className="h-4 w-4 shrink-0" />
                            <span>Slider</span>
                            <TabBadge count={stats.slider} isActive={activeTab === "slider"} />
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="categories" className="mt-6">
                    <Suspense fallback={<CategoriesSectionSkeleton />}>
                        <CategoriesSection />
                    </Suspense>
                </TabsContent>

                <TabsContent value="showcase" className="mt-6">
                    <Suspense fallback={<ShowcaseSectionSkeleton />}>
                        <ShowcaseSection />
                    </Suspense>
                </TabsContent>

                <TabsContent value="testimonials" className="mt-6">
                    <Suspense fallback={<TestimonialsSectionSkeleton />}>
                        <TestimonialsSection />
                    </Suspense>
                </TabsContent>

                <TabsContent value="slider" className="mt-6">
                    <Suspense fallback={<SliderSectionSkeleton />}>
                        <SliderSection />
                    </Suspense>
                </TabsContent>

                <TabsContent value="hero" className="mt-6">
                    <Suspense fallback={<HeroSectionSkeleton />}>
                        <HeroSection />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Quick stat card component - clickable to switch tabs
function QuickStatCard({
    label,
    count,
    icon: Icon,
    color,
    isActive,
    onClick,
}: {
    label: string;
    count: number;
    icon: React.ElementType;
    color: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`admin-stat-card cursor-pointer text-left transition-all duration-200 ${
                isActive
                    ? "ring-2 ring-primary/40 border-primary/30 shadow-md"
                    : "hover:shadow-md hover:border-border"
            }`}
        >
            <div className={`admin-stat-icon ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </button>
    );
}
