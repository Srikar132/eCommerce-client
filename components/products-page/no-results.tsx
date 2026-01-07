
import Image from 'next/image';
import Link from 'next/link';
import { handleSearchAction } from '@/lib/actions/search-actions';

interface NoResultsProps {
  searchQuery: string;
  popularSearches?: string[];
  imageSrc?: string;
}

export function NoResults({ 
  searchQuery, 
  popularSearches = [
    'Nike Shoes',
    'Woodland Shoes',
    'Adidas Shoes',
    'Titan Watches',
    'Fila Shoes',
    'Puma Shoes',
    'Fastrack Watches'
  ],
  imageSrc = '/images/no-results.png' 
}: NoResultsProps) {


  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Search Query Display */}
      <div className="text-center mb-8">
        <p className="text-gray-700 text-base">
          You searched for{' '}
          <span className="text-black-600 font-medium">{searchQuery}</span>
        </p>
      </div>

      {/* Hanger Image */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-32">
          <Image
            src={imageSrc}
            alt="No results"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* No Matches Message */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-medium text-gray-800 mb-3">
          We couldn't find any matches!
        </h2>
        <p className="text-gray-500 text-base">
          Please check the spelling or try searching something else
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-10">
        <form action={handleSearchAction} className="flex gap-3">
          <input
            name="query"
            type="text"
            placeholder="Shoes, T-shirts, Tops etc."
            className="flex-1 px-4 py-3 border border-gray-300 rounded text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            required
          />
          <button
            type='submit'
            className="px-8 py-3 bg-white border border-gray-300 rounded text-black-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* Popular Searches */}
      <div className="text-center flex gap-2">
        <span className="text-gray-600 text-sm">Popular searches: </span>
        {popularSearches.map((search, index) => (
          <span key={search}>
            <Link
              href={`/products?searchQuery=${encodeURIComponent(search)}`}
              className="text-gray-600 text-sm hover:text-black-600 transition-colors"
            >
              {search}
            </Link>
            {index < popularSearches.length - 1 && (
              <span className="text-gray-400 text-sm">,</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NoResults;