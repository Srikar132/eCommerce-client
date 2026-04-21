"use client";

import React from "react";
import { ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ProductParams } from "@/types/product";

interface SortOption {
  value: ProductParams["sortBy"];
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "CREATED_AT_DESC", label: "Newest First" },
  { value: "CREATED_AT_ASC", label: "Oldest First" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "BEST_SELLING", label: "Best Selling" }
];

interface SortDropdownProps {
  value: ProductParams["sortBy"];
  onChange: (value: ProductParams["sortBy"]) => void;
  isLoading?: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  value = "CREATED_AT_DESC",
  onChange,
  isLoading = false
}) => {
  return (
    <Select 
      value={value} 
      onValueChange={(val) => onChange(val as ProductParams["sortBy"])} 
      disabled={isLoading}
    >
      <SelectTrigger 
        className={cn(
          "!h-12 px-8 rounded-full border-foreground/10 bg-background",
          "focus:ring-accent/10 focus:border-accent transition-all duration-300",
          "w-fit min-w-[140px] lg:min-w-[220px]"
        )}
      >
        <div className="flex items-center gap-3">
          <ListFilter className="h-4 w-4 lg:hidden" strokeWidth={1.5} />
          <span className="hidden lg:inline text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
            Sort: 
          </span>
          <div className="hidden lg:block text-xs font-bold uppercase tracking-[0.2em]">
            <SelectValue placeholder="Sort By" />
          </div>
        </div>
      </SelectTrigger>
      
      <SelectContent className="rounded-[24px] shadow-2xl border-border/40 backdrop-blur-md bg-background/95 z-50 p-2">
        {sortOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value || ""}
            className="cursor-pointer px-4 py-3 rounded-full mb-1 last:mb-0 focus:bg-foreground focus:text-background transition-colors"
          >
            <span className="text-xs uppercase tracking-widest font-medium">{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;