"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
  paramKey: string; // URL parameter key (e.g., 'isActive', 'isDraft', 'stockStatus')
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  filterOptions?: FilterOption[]; // Optional filter configuration
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  filterOptions,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (option: FilterOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 0 when filtering
    params.set('page', '0');
    
    // Set the filter parameter
    params.set(option.paramKey, option.value);
    
    // Remove other filter params from the same group if needed
    if (filterOptions) {
      filterOptions.forEach(opt => {
        if (opt.paramKey !== option.paramKey) {
          params.delete(opt.paramKey);
        }
      });
    }
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove all filter parameters for this column
    if (filterOptions) {
      filterOptions.forEach(opt => {
        params.delete(opt.paramKey);
      });
    }
    
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilter = filterOptions?.some(opt => 
    searchParams.get(opt.paramKey) !== null
  );

  if (!column.getCanSort() && !filterOptions) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {hasActiveFilter && (
              <Filter className="ml-2 h-4 w-4 text-chart-1" />
            )}
            {column.getCanSort() && (
              <>
                {column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                )}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* Sorting options - Only show if no custom filters */}
          {column.getCanSort() && !filterOptions && (
            <>
              <DropdownMenuLabel>Sort</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Desc
              </DropdownMenuItem>
            </>
          )}

          {/* Filter options */}
          {filterOptions && (
            <>
              {filterOptions.map((option, index) => {
                const isActive = searchParams.get(option.paramKey) === option.value;
                return (
                  <DropdownMenuItem 
                    key={index}
                    onClick={() => handleFilter(option)}
                    className={isActive ? "bg-accent" : ""}
                  >
                    <div className="flex items-center w-full">
                      {isActive && (
                        <Filter className="mr-2 h-4 w-4 text-chart-1 shrink-0" />
                      )}
                      <span className="flex-1 text-left">{option.label}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              {hasActiveFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Visibility toggle */}
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}