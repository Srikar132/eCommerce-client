"use client";

import { useWishlist, useClearWishlist } from '@/lib/tanstack/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { WishlistCard } from '@/components/cards/wishlist-card';
import { useRouter } from 'next/navigation';
import ErrorCard from '@/components/cards/error-card';
import { WishlistPageSkeleton } from '@/components/ui/skeletons';

export default function WishlistClient() {
  const router = useRouter();
  const { data: wishlist, isLoading, error, refetch } = useWishlist();
  const clearWishlist = useClearWishlist();

  // Loading state
  if (isLoading) {
    return <WishlistPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorCard
        title="Unable to Load Wishlist"
        message="We couldn't retrieve your saved items. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const isEmpty = !wishlist?.items || wishlist.items.length === 0;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist? This action cannot be undone.')) {
      clearWishlist.mutate();
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Header with Gradient Card */}
        <Card className="mb-8 overflow-hidden border-border bg-linear-to-br from-card via-accent/5 to-primary/5 shadow-lg rounded-3xl">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md ring-4 ring-accent/30">
                  <Heart className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground">
                    My Wishlist
                  </h1>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                    {wishlist?.totalItems === 0 
                      ? 'No items saved yet' 
                      : `${wishlist?.totalItems} ${wishlist?.totalItems === 1 ? 'treasured item' : 'treasured items'}`
                    }
                  </p>
                </div>
              </div>
              
              {!isEmpty && (
                <Button
                  variant="ghost"
                  onClick={handleClearAll}
                  disabled={clearWishlist.isPending}
                  className="bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full shadow-md transition-all duration-300 hover:scale-105"
                >
                  {clearWishlist.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {isEmpty && (
          <Card className="border-dashed border-2 border-border rounded-3xl shadow-lg overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-16 lg:py-24 px-4 text-center">
              <div className="rounded-full bg-linear-to-br from-accent to-primary/10 p-8 mb-6 shadow-lg">
                <Heart className="h-20 w-20 text-primary/40" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif font-light text-foreground mb-3">
                Your wishlist is waiting
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                Save your favorite pieces and create your perfect collection. Your dream wardrobe starts here.
              </p>
              <Button 
                onClick={() => router.push('/products')}
                size="lg"
                className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Discover Products
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Wishlist Items Grid */}
        {!isEmpty && (
          <>
            {/* Stats Bar */}
            <Card className="mb-6 overflow-hidden border-border bg-linear-to-br from-secondary to-accent rounded-2xl shadow-md">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-card/80 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary fill-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {wishlist?.items.filter(item => item.inStock).length} items available in stock
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Total value:</span>
                    <span className="text-sm font-semibold text-foreground">
                      ₹{wishlist?.items.reduce((sum, item) => sum + item.basePrice, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {wishlist?.items.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom Actions */}
            <Card className="border-border shadow-lg bg-card rounded-3xl overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/products')}
                    className="rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    onClick={() => router.push('/cart')}
                    className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
  );
}
