"use client"

import HeroSection from "./hero-section";


export default function HomeClient() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      <div className="h-[200vh]"/>
    </div>
  );
}
