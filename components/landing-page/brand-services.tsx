"use client"

import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react"

const SERVICES = [
  {
    icon: Truck,
    title: "Free delivery",
    description: "In most US countries from $100"
  },
  {
    icon: RotateCcw,
    title: "Free returns",
    description: "Up to 30 days to return your items."
  },
  {
    icon: ShieldCheck,
    title: "Payment 100% secured",
    description: "Multiple payment options offered."
  },
  {
    icon: Headset,
    title: "Customer service",
    description: "Monday-Friday: 9AM-4PM"
  }
]

export default function BrandServices() {
  return (
    <section className="section border-t border-black/5">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {SERVICES.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-6 p-4 rounded-full bg-secondary/30 group-hover:bg-secondary/50 transition-colors duration-300">
                <service.icon className="w-8 h-8 text-black/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-black mb-2 tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-black/50 leading-relaxed max-w-[200px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
