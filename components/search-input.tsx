"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchInput({
  placeholder = "What are you looking for?",
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
    if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
  };

  const clearSearch = () => { setQuery(''); inputRef.current?.focus(); };

  return (
    <div className={`relative group ${className}`}>
      <div className="relative flex items-center">

        {/* Search icon — right side like the reference */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}       
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`
            w-full h-9 pl-4 pr-9
            bg-transparent
            border border-border
            rounded-full
            text-sm text-foreground
            placeholder:text-muted-foreground
            focus:outline-none
            focus:border-foreground/30
            focus:ring-0
            transition-all duration-200
          `}
        />

        {/* Clear button when typing */}
        {query ? (
          <button
            onClick={clearSearch}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        ) : (
          <button
            onClick={() => handleSearch()}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}

      </div>
    </div>
  );
}