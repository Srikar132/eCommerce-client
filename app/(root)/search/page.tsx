
import { Suspense } from 'react';
import { SearchClient } from '@/components/search-client';

export const metadata = {
  title: 'Search Results',
  description: 'Search for products in our store',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      }>
        <SearchClient />
      </Suspense>
    </main>
  );
}