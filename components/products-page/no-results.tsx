
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
  imageSrc = '/images/no-results.webp'
}: NoResultsProps) {


  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
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
        <h2 className="text-3xl font-serif font-light text-foreground mb-3">
          We couldn&apos;t find any matches!
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Please check the spelling or try searching something else
        </p>
      </div>

      {/* Browse all button */}
      <div className="text-center mb-5">
        <Button
          asChild
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
            <form action={handleSearchAction} className="flex gap-3 items-center">
              <Input
                name="query"
                type="text"
                placeholder="Shoes, T-shirts, Tops etc."
                className="flex-1 h-12 border-border bg-background focus:border-primary focus:ring-primary/20"
                required
              />
              <Button
                type="submit"
                className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default NoResults;