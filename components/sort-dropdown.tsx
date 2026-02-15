"use client";

import React from "react";
import { Check, ChevronsUpDown, ListFilter, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  const currentOption = sortOptions.find((opt) => opt.value === value);
  const currentLabel = currentOption?.label || "Newest First";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-40!">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          {/* Desktop: Show full text */}
          <span className="hidden lg:inline text-sm">Sort: {currentLabel}</span>
          {isLoading ? (
            <Loader2 className="hidden lg:block h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="hidden lg:block h-4 w-4 opacity-50" />
          )}

          {/* Mobile: Show only icon */}
          {isLoading ? (
            <Loader2 className="lg:hidden h-5 w-5 animate-spin" />
          ) : (
            <ListFilter className="lg:hidden h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50 z-40">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer flex items-center justify-between",
              value === option.value && "bg-accent"
            )}
          >
            <span>{option.label}</span>
            {value === option.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;