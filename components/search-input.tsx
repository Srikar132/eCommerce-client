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
  placeholder = "Search for products, brands and more", 
  className = "",
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/products?searchQuery=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 flex items-center pointer-events-none z-10">
          <Search className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-11 pl-12 pr-12 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-card transition-all duration-300 shadow-sm hover:shadow-md"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}