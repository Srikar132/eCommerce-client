"use client";

interface BottomActionBarProps {
  selectedDesignId: string | null;
  onContinue: () => void;
}

export default function BottomActionBar({ selectedDesignId, onContinue }: BottomActionBarProps) {
  return (
    <>
      {/* Bottom Action Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-stone-200 dark:border-slate-800 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side - Status */}
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedDesignId 
                ? "bg-primary/20 text-primary" 
                : "bg-stone-100 dark:bg-slate-800 text-slate-400"
            }`}>
              <span className="material-icons-outlined">
                {selectedDesignId ? "check" : "auto_awesome"}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                {selectedDesignId ? "Design Selected" : "Select a Design"}
              </h4>
              <p className="text-xs text-slate-500">
                {selectedDesignId 
                  ? "Ready to customize colors & placement" 
                  : "Choose from our collection"}
              </p>
            </div>
          </div>

          {/* Right Side - Progress and Button */}
          <div className="flex items-center gap-8">
            {/* Progress Indicator */}
            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Step 2 of 3
              </p>
              <div className="flex gap-1.5 mt-1">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <div className="w-8 h-1 bg-stone-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              disabled={!selectedDesignId}
              className={`px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg group ${
                selectedDesignId
                  ? "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
                  : "bg-stone-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>{selectedDesignId ? "Proceed to Styling" : "Select a Design First"}</span>
              {selectedDesignId && (
                <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed button */}
      <div className="h-24" />
    </>
  );
}
