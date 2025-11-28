"use client"

import BestSeller from "./best-seller";
import DealSection from "./deal-section";
import HeroSection from "./hero-section";
import MCategories from "./main-categories";


export default function HomeClient() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      <MCategories />

      <BestSeller />

      <DealSection />

      <div className="h-[200vh]"/>
    </div>
  );
}
