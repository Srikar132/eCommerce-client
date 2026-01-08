"use client";

import React, { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ProductFacets, FacetItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    facets?: ProductFacets;
    currentFilters: Record<string, string | string[]>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    facets,
    currentFilters,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        const paramsToKeep = ["page", "size", "sort", "searchQuery"];

        Array.from(params.keys())
            .filter((key) => !paramsToKeep.includes(key))
            .forEach((key) => params.delete(key));

        router.push(`?${params.toString()}`);
    };

    // Check if filter is selected
    const isFilterSelected = (filterType: string, value: string): boolean => {
        const current = currentFilters[filterType];
        if (Array.isArray(current)) {
            return current.includes(value);
        }
        return current === value;
    };

    // Get URL parameter name for filter type
    const getFilterUrlParam = (filterType: string): string => {
        switch (filterType) {
            case 'categories':
                return 'category';
            case 'brands':
                return 'brand';
            case 'sizes':
                return 'productSize';
            case 'colors':
                return 'color';
            default:
                return filterType;
        }
    };

    // Render facet filter section
    const renderFacetSection = (
        sectionKey: keyof ProductFacets,
        title: string,
        items: FacetItem[]
    ) => {
        if (!items || items.length === 0) return null;

        const urlParam = getFilterUrlParam(sectionKey);

        return (
            <div key={sectionKey} className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                    {title}
                </h3>
                <div className="space-y-3">
                    {items.map((item, index) => {
                        const id = `${sectionKey}-${index}`;
                        const isSelected = isFilterSelected(urlParam, item.value);

                        return (
                            <div key={id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handleFilterChange(urlParam, item.value, checked as boolean)
                                    }
                                    className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer"
                                />
                                <Label
                                    htmlFor={id}
                                    className={cn(
                                        "text-sm font-normal cursor-pointer flex items-center gap-2",
                                        sectionKey === 'colors' && "capitalize",
                                        sectionKey === 'sizes' && "uppercase"
                                    )}
                                >
                                    {/* Color dot for color filters */}
                                    {sectionKey === 'colors' && item.colorHex && (
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: item.colorHex }}
                                        />
                                    )}
                                    <span>
                                        {item.label} ({item.count})
                                    </span>
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Handle price range filter change
    const handlePriceRangeChange = (range: string, isChecked: boolean) => {
        const updatedFilters = { ...currentFilters };

        if (isChecked) {
            const [minStr, maxStr] = range.split('-');
            updatedFilters['minPrice'] = minStr;
            updatedFilters['maxPrice'] = maxStr;
        } else {
            delete updatedFilters['minPrice'];
            delete updatedFilters['maxPrice'];
        }

        applyFilters(updatedFilters);
    };

    // Check if price range is selected
    const isPriceRangeSelected = (range: string): boolean => {
        const [minStr, maxStr] = range.split('-');
        return currentFilters['minPrice'] === minStr && currentFilters['maxPrice'] === maxStr;
    };

    // Render price range section
    const renderPriceRangeSection = () => {
        if (!facets?.priceRange) return null;

        const { min, max } = facets.priceRange;

        // Generate some common price ranges
        const priceRanges = [
            { min: min, max: 30, label: `$${min.toFixed(0)} - $30` },
            { min: 30, max: 50, label: '$30 - $50' },
            { min: 50, max: 100, label: '$50 - $100' },
            { min: 100, max: max, label: `$100 - $${max.toFixed(0)}` },
        ].filter(range => range.min < range.max);

        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                    Price Range
                </h3>
                <div className="space-y-3">
                    {priceRanges.map((range, index) => {
                        const rangeValue = `${range.min}-${range.max}`;
                        const id = `price-${index}`;
                        const isSelected = isPriceRangeSelected(rangeValue);

                        return (
                            <div key={id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handlePriceRangeChange(rangeValue, checked as boolean)
                                    }
                                    className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer"
                                />
                                <Label
                                    htmlFor={id}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {range.label}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render customizable products section
    const renderCustomizableSection = () => {
        const isSelected = isFilterSelected('customizable', 'true');

        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                    Customizable
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="customizable-true"
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                                handleFilterChange('customizable', 'true', checked as boolean)
                            }
                            className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer"
                        />
                        <Label
                            htmlFor="customizable-true"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Customizable Products Only
                        </Label>
                    </div>
                </div>
            </div>
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
                    // Desktop: Always visible left panel with sticky positioning
                    "hidden lg:flex lg:w-64 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen",
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
                        {/* Categories */}
                        {facets?.categories && renderFacetSection('categories', 'Categories', facets.categories)}

                        {/* Brands */}
                        {facets?.brands && renderFacetSection('brands', 'Brands', facets.brands)}

                        {/* Sizes */}
                        {facets?.sizes && renderFacetSection('sizes', 'Sizes', facets.sizes)}

                        {/* Colors */}
                        {facets?.colors && renderFacetSection('colors', 'Colors', facets.colors)}

                        {/* Price Range */}
                        {renderPriceRangeSection()}

                        {/* Customizable */}
                        {renderCustomizableSection()}
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