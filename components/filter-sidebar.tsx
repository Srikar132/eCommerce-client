"use client";

import React, { useMemo, useState, useCallback } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { ProductFacets, FacetItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    facets?: ProductFacets;
    currentFilters: Record<string, string | string[]>;
}

const INITIAL_VISIBLE_ITEMS = 3;

// Reusable Filter Item Component
interface FilterItemProps {
    id: string;
    label: string;
    count: number;
    isSelected: boolean;
    onChange: (checked: boolean) => void;
    colorHex?: string;
    itemType?: 'colors' | 'sizes' | 'default';
}

const FilterItem: React.FC<FilterItemProps> = ({
    id,
    label,
    count,
    isSelected,
    onChange,
    colorHex,
    itemType = 'default',
}) => (
    <div className="flex items-center space-x-2 py-0.5">
        <Checkbox
            id={id}
            checked={isSelected}
            onCheckedChange={onChange}
            className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer h-3.5 w-3.5"
        />
        <Label
            htmlFor={id}
            className={cn(
                "text-xs font-normal cursor-pointer flex items-center gap-1.5 flex-1 leading-tight",
                itemType === 'colors' && "capitalize",
                itemType === 'sizes' && "uppercase"
            )}
        >
            {itemType === 'colors' && colorHex && (
                <div
                    className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: colorHex }}
                />
            )}
            <span className="truncate">
                {label} ({count})
            </span>
        </Label>
    </div>
);

// Reusable Dropdown Filter Section Component
interface DropdownFilterSectionProps {
    title: string;
    items: FacetItem[];
    urlParam: string;
    itemType?: 'colors' | 'sizes' | 'default';
    isFilterSelected: (urlParam: string, value: string) => boolean;
    onFilterChange: (urlParam: string, value: string, checked: boolean) => void;
}

const DropdownFilterSection: React.FC<DropdownFilterSectionProps> = ({
    title,
    items,
    urlParam,
    itemType = 'default',
    isFilterSelected,
    onFilterChange,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item => 
            item.label.toLowerCase().includes(query) ||
            item.value.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    const visibleItems = items.slice(0, INITIAL_VISIBLE_ITEMS);
    const hasMore = items.length > INITIAL_VISIBLE_ITEMS;
    const hiddenCount = items.length - INITIAL_VISIBLE_ITEMS;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const renderFilterItems = (itemsToRender: FacetItem[]) => {
        return itemsToRender.map((item, index) => {
            const id = `${urlParam}-${item.value}-${index}`;
            return (
                <FilterItem
                    key={id}
                    id={id}
                    label={item.label}
                    count={item.count}
                    isSelected={isFilterSelected(urlParam, item.value)}
                    onChange={(checked) => onFilterChange(urlParam, item.value, checked as boolean)}
                    colorHex={item.colorHex}
                    itemType={itemType}
                />
            );
        });
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-xs uppercase tracking-wide text-gray-900">
                {title}
            </h3>

            <div className="space-y-2">
                {/* Initial visible items */}
                <div className="space-y-1">
                    {renderFilterItems(visibleItems)}
                </div>

                {/* Show More Dropdown */}
                {hasMore && (
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-center text-xs font-medium h-7 py-0"
                            >
                                +{hiddenCount} More
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className="w-72 p-0" 
                            align="start"
                            side="right"
                            sideOffset={8}
                        >
                            <div className="p-3 space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-xs">
                                        Select {title}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={`Search ${title.toLowerCase()}...`}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="pl-8 h-8 text-xs"
                                    />
                                </div>

                                {/* Scrollable Items */}
                                <ScrollArea className="h-[250px] pr-3">
                                    <div className="space-y-1">
                                        {filteredItems.length > 0 ? (
                                            renderFilterItems(filteredItems)
                                        ) : (
                                            <p className="text-xs text-muted-foreground py-3 text-center">
                                                No results found
                                            </p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div>
    );
};

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
    const applyFilters = useCallback((newFilters: Record<string, string | string[]>) => {
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
    }, [currentFilters, router, searchParams]);

    // Handle filter change
    const handleFilterChange = useCallback((
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
    }, [currentFilters, applyFilters]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        const paramsToKeep = ["page", "size", "sort", "searchQuery"];

        Array.from(params.keys())
            .filter((key) => !paramsToKeep.includes(key))
            .forEach((key) => params.delete(key));

        router.push(`?${params.toString()}`);
    }, [router, searchParams]);

    // Check if filter is selected
    const isFilterSelected = useCallback((filterType: string, value: string): boolean => {
        const current = currentFilters[filterType];
        if (Array.isArray(current)) {
            return current.includes(value);
        }
        return current === value;
    }, [currentFilters]);

    // Get URL parameter name for filter type
    const getFilterUrlParam = useCallback((filterType: string): string => {
        const mapping: Record<string, string> = {
            'categories': 'category',
            'brands': 'brand',
            'sizes': 'productSize',
            'colors': 'color',
        };
        return mapping[filterType] || filterType;
    }, []);

    // Handle price range filter change
    const handlePriceRangeChange = useCallback((range: string, isChecked: boolean) => {
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
    }, [currentFilters, applyFilters]);

    // Check if price range is selected
    const isPriceRangeSelected = useCallback((range: string): boolean => {
        const [minStr, maxStr] = range.split('-');
        return currentFilters['minPrice'] === minStr && currentFilters['maxPrice'] === maxStr;
    }, [currentFilters]);

    // Render price range section
    const renderPriceRangeSection = () => {
        if (!facets?.priceRange) return null;

        const { min, max } = facets.priceRange;

        const priceRanges = [
            { min: min, max: 30, label: `$${min.toFixed(0)} - $30` },
            { min: 30, max: 50, label: '$30 - $50' },
            { min: 50, max: 100, label: '$50 - $100' },
            { min: 100, max: max, label: `$100 - $${max.toFixed(0)}` },
        ].filter(range => range.min < range.max);

        return (
            <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wide text-gray-900">
                    Price Range
                </h3>
                <div className="space-y-1">
                    {priceRanges.map((range, index) => {
                        const rangeValue = `${range.min}-${range.max}`;
                        const id = `price-${index}`;
                        const isSelected = isPriceRangeSelected(rangeValue);

                        return (
                            <div key={id} className="flex items-center space-x-2 py-0.5">
                                <Checkbox
                                    id={id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handlePriceRangeChange(rangeValue, checked as boolean)
                                    }
                                    className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer h-3.5 w-3.5"
                                />
                                <Label
                                    htmlFor={id}
                                    className="text-xs font-normal cursor-pointer leading-tight"
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
            <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wide text-gray-900">
                    Customizable
                </h3>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 py-0.5">
                        <Checkbox
                            id="customizable-true"
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                                handleFilterChange('customizable', 'true', checked as boolean)
                            }
                            className="border-gray-900 hover:border-black rounded-none transition-colors duration-200 cursor-pointer h-3.5 w-3.5"
                        />
                        <Label
                            htmlFor="customizable-true"
                            className="text-xs font-normal cursor-pointer leading-tight"
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
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Filter Panel */}
            <aside
                className={cn(
                    "bg-background border-r border-border flex flex-col",
                    "hidden lg:flex lg:w-56 lg:sticky lg:top-0 lg:h-[110vh]",
                    "lg:block",
                    isOpen && "fixed inset-y-0 left-0 z-50 w-80 sm:w-96 flex shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transform-none",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header - Mobile */}
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

                {/* Header - Desktop */}
                <header className="hidden lg:block px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold">Filters</h2>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="rounded-full text-xs h-5 px-2">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                </header>

                {/* Filter Content */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Categories */}
                        {facets?.categories && (
                            <DropdownFilterSection
                                title="Categories"
                                items={facets.categories}
                                urlParam={getFilterUrlParam('categories')}
                                isFilterSelected={isFilterSelected}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        {/* Brands */}
                        {facets?.brands && (
                            <DropdownFilterSection
                                title="Brands"
                                items={facets.brands}
                                urlParam={getFilterUrlParam('brands')}
                                isFilterSelected={isFilterSelected}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        {/* Sizes */}
                        {facets?.sizes && (
                            <DropdownFilterSection
                                title="Sizes"
                                items={facets.sizes}
                                urlParam={getFilterUrlParam('sizes')}
                                itemType="sizes"
                                isFilterSelected={isFilterSelected}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        {/* Colors */}
                        {facets?.colors && (
                            <DropdownFilterSection
                                title="Colors"
                                items={facets.colors}
                                urlParam={getFilterUrlParam('colors')}
                                itemType="colors"
                                isFilterSelected={isFilterSelected}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        {/* Price Range */}
                        {renderPriceRangeSection()}

                        {/* Customizable */}
                        {renderCustomizableSection()}
                    </div>
                </ScrollArea>

                {/* Footer - Mobile */}
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

                {/* Footer - Desktop */}
                <footer className="hidden lg:block border-t p-3 bg-muted/30">
                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            className="w-full text-xs h-8"
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