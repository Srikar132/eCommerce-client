"use client";

import React from "react";
import { Check, ChevronsUpDown, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "CREATED_AT_ASC", label: "Date: Old to New" },
  { value: "CREATED_AT_DESC", label: "Date: New to Old" },
  { value: "BEST_SELLING", label: "Best Selling" }
];

interface SortDropdownProps {
  currentSort?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort = "RELEVANCE"
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sortValue: ProductParams["sortBy"]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === "RELEVANCE") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortValue ?? "");
    }

    // Reset to first page when sorting changes
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const currentOption = sortOptions.find((opt) => opt.value === currentSort);
  const currentLabel = currentOption?.label || "Featured";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-40!">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          {/* Desktop: Show full text */}
          <span className="hidden lg:inline text-sm">Sort: {currentLabel}</span>
          <ChevronsUpDown className="hidden lg:block h-4 w-4 opacity-50" />
          
          {/* Mobile: Show only icon */}
          <ListFilter className="lg:hidden h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50 z-40">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              "cursor-pointer flex items-center justify-between",
              currentSort === option.value && "bg-accent"
            )}
          >
            <span>{option.label}</span>
            {currentSort === option.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;