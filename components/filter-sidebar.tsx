"use client";

import React, { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Facets } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    facets?: Facets;
    currentFilters: Record<string, string | string[]>;
}

// Configuration for each filter type
const FILTER_CONFIG = {
    availability: {
        label: "Availability",
        options: [
            { value: "in-stock", label: "In Stock" },
            { value: "out-of-stock", label: "Out of Stock" },
        ],
    },
    priceRanges: {
        label: "Price",
        formatOption: (range: any) => ({
            value: `${range.min}-${range.max}`,
            label: `$${range.min} - $${range.max}`,
        }),
    },
    colors: {
        label: "Color",
        formatOption: (color: string) => ({
            value: color,
            label: color,
            className: "capitalize",
        }),
    },
    sizes: {
        label: "Size",
        formatOption: (size: string) => ({
            value: size,
            label: size,
            className: "uppercase",
        }),
    },
    brands: {
        label: "Brand",
        formatOption: (brand: string) => ({
            value: brand,
            label: brand,
        }),
    },
    categories: {
        label: "Category",
        formatOption: (category: string) => ({
            value: category,
            label: category,
            className: "capitalize",
        }),
    },
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    facets,
    currentFilters,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Dynamic expanded sections based on available facets
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        Object.keys(FILTER_CONFIG).forEach((key) => {
            initial[key] = true;
        });
        return initial;
    });

    // Count active filters
    const activeFilterCount = useMemo(() => {
        return Object.values(currentFilters).reduce((count, value) => {
            return count + (Array.isArray(value) ? value.length : 1);
        }, 0);
    }, [currentFilters]);

    // Apply filters to URL
    const applyFilters = (newFilters: Record<string, string | string[]>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Clear existing filter params
        Object.keys(currentFilters).forEach((key) => {
            params.delete(key);
        });

        // Add new filter params
        Object.entries(newFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else if (value) {
                params.set(key, value);
            }
        });

        // Reset to first page
        params.delete("page");

        router.push(`?${params.toString()}`);
    };

    // Handle filter change
    const handleFilterChange = (
        filterType: string,
        value: string,
        isChecked: boolean
    ) => {
        const updatedFilters = { ...currentFilters };

        if (isChecked) {
            const current = updatedFilters[filterType];
            if (current) {
                updatedFilters[filterType] = Array.isArray(current)
                    ? [...current, value]
                    : [current, value];
            } else {
                updatedFilters[filterType] = value;
            }
        } else {
            const current = updatedFilters[filterType];
            if (Array.isArray(current)) {
                const filtered = current.filter((v) => v !== value);
                if (filtered.length === 0) {
                    delete updatedFilters[filterType];
                } else if (filtered.length === 1) {
                    updatedFilters[filterType] = filtered[0];
                } else {
                    updatedFilters[filterType] = filtered;
                }
            } else if (current === value) {
                delete updatedFilters[filterType];
            }
        }

        applyFilters(updatedFilters);
    };

    // Clear all filters
    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        const paramsToKeep = ["page", "size", "sort"];

        Array.from(params.keys())
            .filter((key) => !paramsToKeep.includes(key))
            .forEach((key) => params.delete(key));

        router.push(`?${params.toString()}`);
    };

    // Toggle section
    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Check if filter is selected
    const isFilterSelected = (filterType: string, value: string): boolean => {
        const current = currentFilters[filterType];
        if (Array.isArray(current)) {
            return current.includes(value);
        }
        return current === value;
    };

    // Get filter key name for URL params
    const getFilterKey = (configKey: string): string => {
        if (configKey === "priceRanges") return "price";
        if (configKey === "brands") return "brand";
        if (configKey === "categories") return "category";
        return configKey;
    };

    // Render dynamic filter section
    const renderFilterSection = (configKey: string) => {
        const config = FILTER_CONFIG[configKey as keyof typeof FILTER_CONFIG];
        const filterKey = getFilterKey(configKey);

        // Get options based on config
        let options: Array<{ value: string; label: string; className?: string }> = [];

        if (configKey === "availability") {
            options = (config as { options: { value: string; label: string; }[] })?.options || [];
        } else if (facets && configKey in facets) {
            const facetData = facets[configKey as keyof Facets];
            if (facetData && Array.isArray(facetData) && facetData.length > 0) {
                options = facetData.map((item: any) =>
                    'formatOption' in config ? config.formatOption(item) : { value: item, label: item }
                );
            } else {
                return null; // Don't render if no data
            }
        } else {
            return null; // Don't render if not in facets
        }

        if (options.length === 0) return null;

        return (
            <Collapsible
                key={configKey}
                open={expandedSections[configKey]}
                onOpenChange={() => toggleSection(configKey)}
            >
                <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h3 className="font-medium text-sm uppercase tracking-wide">
                        {config.label}
                    </h3>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedSections[configKey] && "rotate-180"
                        )}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                    {options.map((option, index) => {
                        const id = `${configKey}-${index}`;
                        return (
                            <div key={id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={id}
                                    checked={isFilterSelected(filterKey, option.value)}
                                    onCheckedChange={(checked) =>
                                        handleFilterChange(filterKey, option.value, checked as boolean)
                                    }
                                    className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer"
                                />
                                <Label
                                    htmlFor={id}
                                    className={cn(
                                        "text-sm font-normal cursor-pointer",
                                        option.className
                                    )}
                                >
                                    {option.label}
                                </Label>
                            </div>
                        );
                    })}
                </CollapsibleContent>
            </Collapsible>
        );
    };

    return (
        <>
            {/* Mobile Backdrop - only on small screens */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Filter Panel */}
            <aside
                className={cn(
                    // Base styles
                    "bg-background border-r border-border flex flex-col",
                    // Desktop: Always visible left panel
                    "hidden lg:flex lg:w-64 lg:sticky lg:top-0 lg:h-auto ",
                    // Mobile: Modal overlay
                    "lg:block",
                    isOpen && "fixed inset-y-0 left-0 z-50 w-80 sm:w-96 flex shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transform-none",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header - Only on mobile */}
                <header className="flex items-center justify-between p-6 border-b lg:hidden">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="rounded-full">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:block px-4 py-4.5 border-b">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="rounded-full">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                </header>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {Object.keys(FILTER_CONFIG).map((configKey) =>
                            renderFilterSection(configKey)
                        )}
                    </div>
                </div>

                {/* Mobile Footer */}
                <footer className="border-t p-6 space-y-3 bg-muted/30 lg:hidden">
                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearAllFilters}
                        >
                            Clear All ({activeFilterCount})
                        </Button>
                    )}
                    <Button className="w-full" onClick={onClose}>
                        View Results
                    </Button>
                </footer>

                {/* Desktop Footer */}
                <footer className="hidden lg:block border-t p-6 bg-muted/30">
                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearAllFilters}
                        >
                            Clear All ({activeFilterCount})
                        </Button>
                    )}
                </footer>
            </aside>
        </>
    );
};

export default FilterSidebar;