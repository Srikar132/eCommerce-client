import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export interface TestimonialCardProps {
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  text: string;
  className?: string;
}

export default function TestimonialCard({
  name,
  role,
  avatar,
  rating,
  text,
  className
}: TestimonialCardProps) {
  return (
    <Card className={`w-full overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card group ${className}`}>
      <CardContent className="p-6 sm:p-8 space-y-6">

        {/* Rating Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted'
                }`}
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
          "{text}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-lg font-medium text-primary">
              {name.charAt(0)}
            </span>
          </div>

          {/* Name & Role */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {role}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
