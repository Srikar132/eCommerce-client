
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEMO_COLORS = [
  { name: "Blush Pink", hex: "#FFB7B2" },
  { name: "Sand", hex: "#E8D5C4" },
  { name: "Sage", hex: "#A8B5A0" },
  { name: "Charcoal", hex: "#2C3E50" },
];

export default function CustomStudioShowcase() {

  return (
    <section className="w-full  py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Product Preview */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full flex items-center justify-center ">
                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/home/custom-studio-showcase.webp"
                    alt="Customizable Shirt"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customization Options */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
                Custom Studio
              </h2>
              <p className="text-sm md:text-base text-gray-500 tracking-wider uppercase">
                Live Preview
              </p>
            </div>

            {/* Select Base Color */}
            <div>
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 block">
                Select Base Color
              </label>
              <div className="flex gap-4">
                {DEMO_COLORS.map((color, index) => (
                  <div
                    key={color.hex}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${
                      index === 0
                        ? "ring-2 ring-offset-4 ring-gray-900"
                        : "ring-1 ring-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Message for Artisan */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Message for the Artisan{" "}
                  <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                </label>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  0 / 200
                </span>
              </div>
              <Textarea
                value=""
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm min-h-25 placeholder:text-gray-400 resize-none"
                placeholder="Add a personal touch or specific placement notes for the artisan to consider while embroidering..."
              />
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/customization">
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 px-8 rounded-xl font-medium text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl h-auto group"
                >
                  Add to Cart — $129.00
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-400 mt-4 tracking-wide">
                This is a demo preview. Visit our customization studio for full options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
