"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Design } from "@/types";

interface DesignCardProps {
  design: Design;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// Memoized component to prevent unnecessary re-renders
const DesignCard = memo(function DesignCard({ 
  design, 
  isSelected, 
  onSelect 
}: DesignCardProps) {
  const handleClick = useCallback(() => {
    onSelect(design.id);
  }, [design.id, onSelect]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "design-card group relative bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm transition-all overflow-hidden cursor-pointer",
        isSelected
          ? "border-2 border-primary"
          : "border border-stone-200 dark:border-slate-800 hover:border-primary/50"
      )}
    >
      {/* Image Container */}
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        {design.thumbnailUrl ? (
          <Image
            src={design.thumbnailUrl}
            alt={design.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isSelected ? "scale-105" : "group-hover:scale-110"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50 dark:bg-slate-800">
            <span className="material-icons-outlined text-slate-400 text-4xl">image</span>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-icons-outlined text-sm">check</span>
            </span>
          </div>
        )}

        {/* Add Button on Hover */}
        {!isSelected && (
          <button 
            className="add-btn absolute bottom-2 right-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg opacity-0 translate-y-2 transition-all hover:bg-primary hover:text-white uppercase tracking-wider"
            aria-label={`Add ${design.name}`}
          >
            Add +
          </button>
        )}
      </div>

      {/* Design Info */}
      <h4 className="font-semibold text-sm truncate">{design.name}</h4>
      <p className={cn(
        "text-[10px] font-bold uppercase tracking-wider",
        isSelected ? "text-primary" : "text-slate-400"
      )}>
        {design.category.name}
      </p>

      {/* Price and Status */}
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold text-sm">₹{design.designPrice || 300}</span>
        {isSelected && (
          <span className="text-[10px] text-slate-400">Selected</span>
        )}
      </div>
    </div>
  );
});

export default DesignCard;
