"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "FREE_SIZE"];
const COLORS = [
  "BLACK", "WHITE", "RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE",
  "PINK", "BROWN", "GREY", "NAVY", "BEIGE", "MAROON", "OLIVE", "TEAL",
  "CREAM", "MULTICOLOR"
];

const MAX_PRICE = 2000;

type Props = {
  activeSizes: string[];
  activeColors: string[];
  activeMinPrice?: number;
  activeMaxPrice?: number;
};

/* ── Sub-component for active filter pills ── */
const ActivePills = ({
  activeSizes,
  activeColors,
  activeMinPrice,
  activeMaxPrice,
  onToggleSize,
  onToggleColor,
  onClearPrice
}: {
  activeSizes: string[];
  activeColors: string[];
  activeMinPrice?: number;
  activeMaxPrice?: number;
  onToggleSize: (s: string) => void;
  onToggleColor: (c: string) => void;
  onClearPrice: () => void;
}) => (
  <>
    {activeSizes.map((s) => (
      <button
        key={s}
        onClick={() => onToggleSize(s)}
        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-foreground/5 text-foreground px-3 py-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive border border-foreground/10 transition-colors"
      >
        {s} <X size={10} />
      </button>
    ))}
    {activeColors.map((c) => (
      <button
        key={c}
        onClick={() => onToggleColor(c)}
        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-foreground/5 text-foreground px-3 py-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive border border-foreground/10 transition-colors"
      >
        {c} <X size={10} />
      </button>
    ))}
    {(activeMinPrice !== undefined || activeMaxPrice !== undefined) && (
      <button
        onClick={onClearPrice}
        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-foreground/5 text-foreground px-3 py-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive border border-foreground/10 transition-colors"
      >
        ₹{activeMinPrice || 0} - ₹{activeMaxPrice || `${MAX_PRICE}+`} <X size={10} />
      </button>
    )}
  </>
);

export function ProductFilters({
  activeSizes,
  activeColors,
  activeMinPrice,
  activeMaxPrice,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Local state for sliders so they update immediately while dragging
  const [priceRange, setPriceRange] = useState([
    activeMinPrice || 0,
    activeMaxPrice || MAX_PRICE,
  ]);

  // Sync sliders if props change externally - using render-time state adjustment
  // to avoid cascading renders from useEffect.
  const [prevPrices, setPrevPrices] = useState({ activeMinPrice, activeMaxPrice });

  if (prevPrices.activeMinPrice !== activeMinPrice || prevPrices.activeMaxPrice !== activeMaxPrice) {
    setPriceRange([activeMinPrice || 0, activeMaxPrice || MAX_PRICE]);
    setPrevPrices({ activeMinPrice, activeMaxPrice });
  }

  const updateParams = useCallback(
    (updates: { key: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const { key, value } of updates) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const toggleSize = (size: string) => {
    const current = new Set(activeSizes);
    if (current.has(size)) {
      current.delete(size);
    } else {
      current.add(size);
    }
    updateParams([
      { key: "sizes", value: current.size > 0 ? Array.from(current).join(",") : null },
    ]);
  }

  const toggleColor = (color: string) => {
    const current = new Set(activeColors);
    if (current.has(color)) {
      current.delete(color);
    } else {
      current.add(color);
    }
    updateParams([
      { key: "colors", value: current.size > 0 ? Array.from(current).join(",") : null },
    ]);
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sizes");
    params.delete("colors");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(false);
    });
  }

  const hasActiveFilters =
    activeSizes.length > 0 ||
    activeColors.length > 0 ||
    activeMinPrice !== undefined ||
    activeMaxPrice !== undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar trigger & active filters */}
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full border-foreground/10 bg-background hover:bg-accent/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <SlidersHorizontal size={18} strokeWidth={1.5} />}
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Filter</span>
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold">
                    {(activeSizes.length > 0 ? 1 : 0) +
                      (activeColors.length > 0 ? 1 : 0) +
                      (activeMinPrice !== undefined || activeMaxPrice !== undefined ? 1 : 0)}
                  </span>
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-[400px] p-0 flex flex-col !rounded-r-[32px] overflow-hidden">
            <SheetHeader className="px-8 pt-10 pb-6 shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold tracking-tight">Filters</SheetTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-8 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="px-8 space-y-10 pb-10">
                {/* Price range */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                      Price Range
                    </h4>
                    <span className="text-sm font-bold">
                      ₹{priceRange[0]} -{" "}
                      {priceRange[1] >= MAX_PRICE ? `₹${MAX_PRICE}+` : `₹${priceRange[1]}`}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[activeMinPrice || 0, activeMaxPrice || MAX_PRICE]}
                    value={priceRange}
                    onValueChange={(vals) => setPriceRange(vals as number[])}
                    onValueCommit={(vals) => {
                      const v = vals as number[];
                      updateParams([
                        {
                          key: "minPrice",
                          value: v[0] > 0 ? String(v[0]) : null,
                        },
                        {
                          key: "maxPrice",
                          value: v[1] < MAX_PRICE ? String(v[1]) : null,
                        },
                      ]);
                    }}
                    max={MAX_PRICE}
                    step={100}
                    className="w-full"
                  />
                </div>

                <Separator className="bg-foreground/5" />

                {/* Color */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                    Colors
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {COLORS.map((color) => (
                      <div key={color} className="flex items-center gap-3">
                        <Checkbox
                          id={`color-${color}`}
                          checked={activeColors.includes(color)}
                          onCheckedChange={() => toggleColor(color)}
                          className="rounded-full w-5 h-5"
                        />
                        <Label
                          htmlFor={`color-${color}`}
                          className="flex-1 cursor-pointer text-sm font-medium tracking-tight uppercase"
                        >
                          {color.toLowerCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-foreground/5" />

                {/* Size */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                    Sizes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeSizes.includes(size)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-foreground/10 hover:border-foreground/40"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Active filter pills inline next to button on desktop */}
        {hasActiveFilters ? (
          <div className="hidden sm:flex items-center flex-wrap gap-2">
            <ActivePills
              activeSizes={activeSizes}
              activeColors={activeColors}
              activeMinPrice={activeMinPrice}
              activeMaxPrice={activeMaxPrice}
              onToggleSize={toggleSize}
              onToggleColor={toggleColor}
              onClearPrice={() => updateParams([
                { key: "minPrice", value: null },
                { key: "maxPrice", value: null },
              ])}
            />
            <button
              onClick={clearAll}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground ml-2 transition-colors"
            >
              Clear All
            </button>
          </div>
        ) : null}
      </div>

      {/* Mobile active pills */}
      {hasActiveFilters ? (
        <div className="flex sm:hidden items-center flex-wrap gap-2">
          <ActivePills
            activeSizes={activeSizes}
            activeColors={activeColors}
            activeMinPrice={activeMinPrice}
            activeMaxPrice={activeMaxPrice}
            onToggleSize={toggleSize}
            onToggleColor={toggleColor}
            onClearPrice={() => updateParams([
              { key: "minPrice", value: null },
              { key: "maxPrice", value: null },
            ])}
          />
        </div>
      ) : null}
    </div>
  );
}
