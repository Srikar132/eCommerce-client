
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleSearchAction } from '@/lib/actions/search-actions';
import { Search, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';

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
  imageSrc = '/images/no-results.webp'
}: NoResultsProps) {


  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Search Query Display */}
      <div className="text-center mb-8">
        <Card className="inline-block border-border bg-accent/50">
          <CardContent className="p-3 px-6">
            <p className="text-muted-foreground text-sm">
              You searched for{' '}
              <span className="font-medium text-foreground">{searchQuery}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hanger Image */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="relative w-48 h-48">
            <Image
              src={imageSrc}
              alt="No results"
              fill
              className="object-contain scale-150"
              priority
            />
          </div>
          {/* Decorative circle */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-accent/30 rounded-full blur-xl" />
        </div>
      </div>

      {/* No Matches Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-serif font-light text-foreground mb-3">
          We couldn&apos;t find any matches!
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Please check the spelling or try searching something else
        </p>
      </div>

      {/* Browse all button */}
      <div className="text-center mb-12">
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
        >
          <Link href="/products" className="inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Browse All Products
          </Link>
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-10">
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <form action={handleSearchAction} className="flex gap-3">
              <Input
                name="query"
                type="text"
                placeholder="Shoes, T-shirts, Tops etc."
                className="flex-1 h-12 border-border bg-background focus:border-primary focus:ring-primary/20"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Popular Searches */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-light text-lg text-foreground">
              Popular Searches
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Link
                key={search}
                href={`/products?searchQuery=${encodeURIComponent(search)}`}
                className="group inline-flex items-center gap-1 px-4 py-2 border border-border rounded-full bg-background hover:bg-accent hover:border-primary/30 transition-all duration-300"
              >
                <Sparkles className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {search}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default NoResults;