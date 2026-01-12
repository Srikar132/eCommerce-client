import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';

interface ProductNotFoundProps {
  productSlug?: string;
  message?: string;
  imageSrc?: string;
  suggestions?: Array<{
    name: string;
    href: string;
  }>;
}

export function ProductNotFound({
  productSlug,
  message = "The product you're looking for doesn't exist or has been removed.",
  imageSrc = '/images/product-not-found.png',
}: ProductNotFoundProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Product Slug Display (if provided) */}
        {productSlug && (
          <div className="text-center mb-6">
            <Card className="inline-block border-border bg-accent/50">
              <CardContent className="p-3 px-5">
                <p className="text-muted-foreground text-sm">
                  Searching for: <span className="font-medium text-foreground">{productSlug}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 404 Icon/Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="relative w-56 h-52">
              <Image
                src={imageSrc}
                alt="Product not found"
                fill
                className="object-contain opacity-90"
                priority
              />
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-accent/30 rounded-full blur-xl" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-light text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border bg-card hover:bg-accent transition-all duration-300"
          >
            <Link href="/products" className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">or explore our collection</span>
          </div>
        </div>

        {/* Quick Links Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-light text-lg text-foreground">
                Discover Something Beautiful
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/products?category=new-arrivals"
                className="group p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/30 transition-all duration-300"
              >
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  New Arrivals
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest collection
                </p>
              </Link>
              <Link
                href="/products?category=best-sellers"
                className="group p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/30 transition-all duration-300"
              >
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Best Sellers
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Popular items
                </p>
              </Link>
              <Link
                href="/products?category=featured"
                className="group p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/30 transition-all duration-300"
              >
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Featured
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Curated picks
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Need help? <Link href="/contact" className="text-primary font-medium hover:underline transition-colors">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductNotFound;
