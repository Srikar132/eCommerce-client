"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  customerName: string;
  customerRole: string | null;
  reviewText: string;
  rating: number;
  isVerifiedPurchase: boolean;
}

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

const TestimonialsClient = ({ testimonials }: TestimonialsClientProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play: change testimonial every 5 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="relative text-center section-header">
          <p className="p-inline">
            Customer Love
          </p>
          <h2>
            What Our Customers Say
          </h2>
          {/* <p className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-wide p-inline">
          Handpicked collections for everyone
        </p> */}
        </div>

        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote className="w-12 h-12 md:w-16 md:h-16 text-primary/30 fill-primary/30" />
        </div>

        {/* Testimonial Slider */}
        <div className="relative min-h-40 flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
                }`}
            >
              <div className="text-center space-y-8 px-4">
                {/* Testimonial Text */}
                <p className="text-xl md:text-2xl lg:text-3xl  text-foreground leading-relaxed max-w-3xl mx-auto">
                  &ldquo;{testimonial.reviewText}&rdquo;
                </p>

                {/* Author Info */}
                <div className="space-y-1">
                  <h4>
                    {testimonial.customerName}
                  </h4>
                  <p className="p-base text-muted-foreground tracking-widest">
                    {testimonial.isVerifiedPurchase ? "Verified Customer" : testimonial.customerRole}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsClient;