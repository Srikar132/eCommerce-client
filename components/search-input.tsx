"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fetchAutocomplete } from '@/lib/api';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  variant?: 'light' | 'dark';
}

interface Suggestion {
  text: string;
  count: number;
}

export function SearchInput({ 
  placeholder = "Search products...", 
  className = "", 
  showSuggestions = true,
  onSearch,
  variant = 'light'
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
      fetchAutocomplete(debouncedQuery)
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
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  // Theme-based styles
  const themeStyles = variant === 'light' ? {
    searchIcon: "text-gray-600",
    input: "bg-white border border-gray-300 text-black placeholder:text-gray-500",
    clearButton: "text-gray-400 hover:text-gray-600"
  } : {
    searchIcon: "text-white/70",
    input: "bg-white/10 border border-white/20 text-white placeholder:text-white/70",
    clearButton: "text-white/70 hover:text-white"
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeStyles.searchIcon}`} />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`pl-10 pr-10 transition-colors rounded py-2 h-10 w-full ${themeStyles.input}`}
        />
        {query && (
          <button
            onClick={clearSearch}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${themeStyles.clearButton}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-9999 max-h-60 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSuggestionClick(suggestion.text);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{suggestion.text}</span>
                <span className="text-xs text-gray-500">{suggestion.count} results</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
