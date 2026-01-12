"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Heart, Star, Shirt, Palette } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Sample brands data
const brands = [
  { 
    id: 'nike', 
    name: 'Nike', 
    image: '/home/section2/sec1-col-1.webp', 
    popular: true, 
    productCount: 156,
    description: 'Just Do It - Premium Athletic Wear'
  },
  { 
    id: 'adidas', 
    name: 'Adidas', 
    image: '/home/section2/sec1-col-2.webp', 
    popular: true, 
    productCount: 132,
    description: 'Impossible is Nothing - Sport Fashion'
  },
  { 
    id: 'puma', 
    name: 'Puma', 
    image: '/home/section2/sec1-col-3.webp', 
    popular: false, 
    productCount: 98,
    description: 'Forever Faster - Street Style'
  },
  { 
    id: 'reebok', 
    name: 'Reebok', 
    image: '/home/section2/sec1-col-4.webp', 
    popular: false, 
    productCount: 76,
    description: 'Be More Human - Fitness Lifestyle'
  },
  { 
    id: 'new-balance', 
    name: 'New Balance', 
    image: '/home/section2/sec2-col-1.webp', 
    popular: true, 
    productCount: 89,
    description: 'Endorsed by No One - Performance'
  },
  { 
    id: 'under-armour', 
    name: 'Under Armour', 
    image: '/home/section2/sec2-col-2.webp', 
    popular: false, 
    productCount: 67,
    description: 'I Will - Innovation & Performance'
  },
];

// Sample design collections
const designs = [
  { 
    id: 'minimal', 
    name: 'Minimal Collection', 
    image: '/home/section4/img1.webp', 
    premium: false, 
    productCount: 45,
    description: 'Clean, simple designs for everyday wear'
  },
  { 
    id: 'vintage', 
    name: 'Vintage Revival', 
    image: '/home/section4/img2.webp', 
    premium: false, 
    productCount: 38,
    description: 'Retro-inspired graphics and typography'
  },
  { 
    id: 'abstract', 
    name: 'Abstract Art', 
    image: '/home/section4/img3.webp', 
    premium: true, 
    productCount: 29,
    description: 'Artistic expressions and bold patterns'
  },
  { 
    id: 'nature', 
    name: 'Nature Elements', 
    image: '/home/section4/img4.webp', 
    premium: true, 
    productCount: 34,
    description: 'Botanical and natural world inspirations'
  },
  { 
    id: 'geometric', 
    name: 'Geometric Patterns', 
    image: '/home/section2/sec2-col-3.webp', 
    premium: true, 
    productCount: 41,
    description: 'Mathematical precision meets fashion'
  },
  { 
    id: 'typography', 
    name: 'Typography Art', 
    image: '/home/section2/sec2-col-4.webp', 
    premium: false, 
    productCount: 52,
    description: 'Words as art, text as design'
  },
];

const BrandsAndDesigns: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'brands' | 'designs'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = activeFilter === 'all' 
    ? [...brands.map(b => ({...b, type: 'brand' as const})), ...designs.map(d => ({...d, type: 'design' as const}))]
    : activeFilter === 'brands' 
    ? brands.map(b => ({...b, type: 'brand' as const}))
    : designs.map(d => ({...d, type: 'design' as const}));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-4">
            BRANDS & DESIGNS
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover premium brands and exclusive design collections for your perfect style
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({brands.length + designs.length})
              </button>
              <button
                onClick={() => setActiveFilter('brands')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  activeFilter === 'brands' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shirt className="w-4 h-4" />
                Brands ({brands.length})
              </button>
              <button
                onClick={() => setActiveFilter('designs')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  activeFilter === 'designs' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                Designs ({designs.length})
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} collections
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link 
              key={item.id} 
              href={`/category/${item.type === 'brand' ? 'brand' : 'design'}?filter=${item.id}`}
              className="group"
            >
              <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-[2.6/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
                      {item.type === 'brand' ? 'Brand' : 'Design'}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {((item.type === 'brand' && 'popular' in item && item.popular) || 
                    (item.type === 'design' && 'premium' in item && item.premium)) && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
                        {item.type === 'brand' ? 'Popular' : 'Premium'}
                      </div>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-2 rounded-full bg-white text-gray-600 hover:text-red-500 shadow-md transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1 uppercase tracking-wide">
                    {item.type === 'brand' ? 'Brand Collection' : 'Design Collection'}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {item.productCount} items
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.{Math.floor(Math.random() * 10)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Shirt className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16 text-center border-t pt-16">
          <h2 className="text-xl font-semibold mb-6 tracking-wide">Why Choose Our Collections?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shirt className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-2 tracking-wide">Premium Brands</h3>
              <p className="text-sm text-gray-600">Curated selection of top global fashion brands</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-2 tracking-wide">Exclusive Designs</h3>
              <p className="text-sm text-gray-600">Unique patterns and artistic collections</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-2 tracking-wide">Quality Assured</h3>
              <p className="text-sm text-gray-600">High-quality materials and craftsmanship</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsAndDesigns;
