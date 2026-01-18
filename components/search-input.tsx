"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { productApi } from '@/lib/api/product';
import { SearchDropdownSkeleton } from '@/components/ui/skeletons';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  variant?: 'light' | 'dark';
}

export function SearchInput({ 
  placeholder = "Search for products, brands and more", 
  className = "", 
  showSuggestions = true,
  onSearch,
  variant = 'light'
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() && showSuggestions) {
      setIsLoading(true);
      productApi.fetchAutocomplete(debouncedQuery)
        .then((newSuggestions) => {
          setSuggestions(newSuggestions);
          setShowDropdown(newSuggestions.length > 0);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, showSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setShowDropdown(false);
    
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
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle input focus/blur
  const handleFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't hide dropdown if focus is moving to dropdown
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (dropdownRef.current?.contains(relatedTarget)) {
      return;
    }
    // Delay hiding dropdown to allow for suggestion clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 flex items-center pointer-events-none z-10">
          <Search className="w-5 h-5 " strokeWidth={2} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full h-11 pl-12 pr-12  border-none rounded text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:bg-white transition-all duration-200"
        />
        
        {query && !isLoading && (
          <button
            onClick={clearSearch}
            className="absolute right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-4 flex items-center z-10">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && isLoading && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-9999 max-h-80 overflow-y-auto border border-gray-100"
        >
          <SearchDropdownSkeleton />
        </div>
      )}

      {showDropdown && !isLoading && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-9999 max-h-80 overflow-y-auto border border-gray-100"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSuggestionClick(suggestion);
              }}
              className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0 group focus:outline-none focus:bg-gray-50"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors shrink-0" strokeWidth={2} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}