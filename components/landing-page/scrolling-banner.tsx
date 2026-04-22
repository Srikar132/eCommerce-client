"use client"

const BANNER_ITEMS = [
  { text: "NaLa ARMOIRE", isBold: true },
  { text: "Handcrafted Embroidery", isBold: false },
  { text: "NaLa ARMOIRE", isBold: true },
  { text: "Stitched with Stories", isBold: false },
  { text: "NaLa ARMOIRE", isBold: true },
  { text: "Premium Custom Stitching", isBold: false },
  { text: "NaLa ARMOIRE", isBold: true },
  { text: "Artisanal Heritage", isBold: false },
]

export default function ScrollingBanner() {
  return (
    <div className="w-full relative z-30 bg-[#F5F5C6] py-5 overflow-hidden border-y border-black/5 select-none">
      <div className="flex w-max animate-marquee space-x-12">
        {/* Render twice for seamless loop */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-12 pr-12">
            {BANNER_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-12">
                <span
                  className={item.isBold
                    ? "text-2xl md:text-3xl font-black tracking-tighter text-foreground"
                    : "text-lg md:text-xl font-medium text-foreground/60"
                  }
                >
                  {item.text}
                </span>
                <span className="w-2 h-2 rounded-full bg-black/20" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

