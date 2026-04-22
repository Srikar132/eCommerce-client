"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchInput({
  placeholder = "Search our wardrobe...",
  className = "",
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/products?searchQuery=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { 
        e.preventDefault(); 
        handleSearch(); 
    }
  };

  const clearSearch = () => { 
    setQuery(''); 
    inputRef.current?.focus(); 
  };

  return (
    <div className={cn("relative w-full max-w-sm group", className)}>
        <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-foreground transition-colors duration-300" strokeWidth={1.5} />
            
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full h-12 pl-12 pr-12 rounded-full",
                    "bg-accent/5 border-border/40 text-sm",
                    "focus:bg-background focus:ring-accent/10 focus:border-accent",
                    "transition-all duration-500 ease-in-out",
                    "placeholder:text-muted-foreground/60 placeholder:italic font-medium"
                )}
            />

            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute right-4 p-1 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-all active:scale-90"
                    aria-label="Clear search"
                >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
            )}
        </div>
    </div>
  );
}