"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFormProps {
    action: string;
    search?: string;
    page?: number;
    size?: number;
    className?: string;
    placeholder?: string;
}

export function SearchForm({ action, search, page, size, className, placeholder = "Search products..." }: SearchFormProps) {
    const [query, setQuery] = useState(search || "");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (query.trim()) {
            params.set("search", query.trim());
        }
        if (size) {
            params.set("size", size.toString());
        }
        // Reset to first page when searching
        params.set("page", "0");

        const queryString = params.toString();
        router.push(`${action}${queryString ? `?${queryString}` : ""}`);
    };

    const handleClear = () => {
        setQuery("");
        const params = new URLSearchParams();
        if (size) {
            params.set("size", size.toString());
        }
        params.set("page", "0");

        const queryString = params.toString();
        router.push(`${action}${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className || ""}`}>
            <div className="relative flex-1">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-8"
                />
                {query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>
            <Button type="submit" size="sm" className="admin-glow-button">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
        </form>
    );
}