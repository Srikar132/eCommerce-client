"use client";

import { Shirt, Wand2, Package } from "lucide-react";
import { creationSteps } from "@/constants";

export default function ArtOfCreation() {
  const icons = [Shirt, Wand2, Package];

  return (
    <section className="w-full  py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-4">
            The Art of Creation
          </h2>
          <p className="text-sm md:text-base text-gray-600 tracking-widest uppercase">
            A three-step journey to your unique piece
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {creationSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:shadow-md transition-shadow duration-300">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-rose-400" strokeWidth={1.5} />
                </div>

                {/* Step Title */}
                <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-3">
                  <span className="text-gray-400 mr-2">{step.number}.</span>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
