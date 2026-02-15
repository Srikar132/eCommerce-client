"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid,
    Sparkles,
    MessageSquareQuote,
    ImageIcon,
    ExternalLink,
    Palette,
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
} from "@/components/admin/content";
import {
    useLandingCategories,
    useShowcaseProducts,
    useTestimonials,
    useSliderImages,
} from "@/lib/tanstack/queries/content.queries";

// Stats component to show counts in tabs
function useContentStats() {
    const { data: categories = [] } = useLandingCategories();
    const { data: showcase = [] } = useShowcaseProducts();
    const { data: testimonials = [] } = useTestimonials();
    const { data: slider = [] } = useSliderImages();

    return {
        categories: categories.length,
        showcase: showcase.length,
        testimonials: testimonials.length,
        slider: slider.length,
    };
}

function TabBadge({ count }: { count: number }) {
    return (
        <Badge
            variant="secondary"
            className="ml-1.5 h-5 min-w-5 px-1.5 text-xs font-medium bg-primary/10 text-primary border-0"
        >
            {count}
        </Badge>
    );
}

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState("categories");
    const stats = useContentStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/60 shadow-lg">
                            <Palette className="h-5 w-5 text-white" />
                        </div>
                        Content Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage landing page content dynamically
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-2 w-fit">
                    <a href="/?admin_browse=true" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Preview Site
                    </a>
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickStatCard
                    label="Categories"
                    count={stats.categories}
                    icon={LayoutGrid}
                    color="bg-primary/10 text-primary"
                />
                <QuickStatCard
                    label="Showcase"
                    count={stats.showcase}
                    icon={Sparkles}
                    color="bg-amber-500/10 text-amber-500"
                />
                <QuickStatCard
                    label="Testimonials"
                    count={stats.testimonials}
                    icon={MessageSquareQuote}
                    color="bg-blue-500/10 text-blue-500"
                />
                <QuickStatCard
                    label="Slider Images"
                    count={stats.slider}
                    icon={ImageIcon}
                    color="bg-pink-500/10 text-pink-500"
                />
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card/50 border border-border/50 p-1.5 h-auto flex flex-wrap gap-1 backdrop-blur-sm">
                    <TabsTrigger
                        value="categories"
                        className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Categories</span>
                        <TabBadge count={stats.categories} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="showcase"
                        className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Showcase</span>
                        <TabBadge count={stats.showcase} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="testimonials"
                        className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                        <MessageSquareQuote className="h-4 w-4" />
                        <span className="hidden sm:inline">Testimonials</span>
                        <TabBadge count={stats.testimonials} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="slider"
                        className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                        <ImageIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Slider</span>
                        <TabBadge count={stats.slider} />
                    </TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories" className="mt-6">
                    <Suspense fallback={<CategoriesSectionSkeleton />}>
                        <CategoriesSection />
                    </Suspense>
                </TabsContent>

                {/* Showcase Tab */}
                <TabsContent value="showcase" className="mt-6">
                    <Suspense fallback={<ShowcaseSectionSkeleton />}>
                        <ShowcaseSection />
                    </Suspense>
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="mt-6">
                    <Suspense fallback={<TestimonialsSectionSkeleton />}>
                        <TestimonialsSection />
                    </Suspense>
                </TabsContent>

                {/* Slider Tab */}
                <TabsContent value="slider" className="mt-6">
                    <Suspense fallback={<SliderSectionSkeleton />}>
                        <SliderSection />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Quick stat card component
function QuickStatCard({
    label,
    count,
    icon: Icon,
    color,
}: {
    label: string;
    count: number;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
