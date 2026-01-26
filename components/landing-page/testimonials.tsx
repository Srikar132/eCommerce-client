"use client";

import { useState, useEffect } from "react";
import { testimonials } from "@/constants";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play: change testimonial every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex items-center justify-center w-full py-16 md:py-24  overflow-hidden">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote className="w-12 h-12 md:w-16 md:h-16 text-rose-300 fill-rose-300" />
        </div>

        {/* Testimonial Slider */}
        <div className="relative min-h-75 flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 translate-x-0"
                  : index < currentIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="text-center space-y-8 px-4">
                {/* Testimonial Text */}
                <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-gray-800 leading-relaxed max-w-3xl mx-auto">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="space-y-1">
                  <h4 className="text-base md:text-lg font-medium text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">
                    Verified Customer
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
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-rose-400 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section> 
  );
};

export default Testimonials;