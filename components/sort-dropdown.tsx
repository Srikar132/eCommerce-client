"use client";

import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "basePrice,asc", label: "Price: Low to High" },
  { value: "basePrice,desc", label: "Price: High to Low" },
  { value: "createdAt,asc", label: "Date: Old to New" },
  { value: "createdAt,desc", label: "Date: New to Old" },
];

interface SortDropdownProps {
  currentSort?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ 
  currentSort = "relevance" 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
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
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-sm">Sort: {currentLabel}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-40">
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