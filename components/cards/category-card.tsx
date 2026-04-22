import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface CategoryCardProps {
  id?: string | number;
  title: string;
  image: string;
  url: string;
  className?: string;
}

export default function CategoryCard({
  title,
  image,
  url,
  className
}: CategoryCardProps) {
  return (
    <Link
      href={url}
      className="group block w-full flex flex-col gap-6"
    >
      <div className={cn(
        "relative w-full rounded-[40px] overflow-hidden bg-muted transition-all duration-700 ease-out",
        "group-hover:shadow-2xl group-hover:shadow-black/5",
        className || "aspect-[4/5]"
      )}>
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] text-foreground/30 uppercase mb-1">
            Collection
          </span>
          <h3 className="font-bold text-2xl text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}