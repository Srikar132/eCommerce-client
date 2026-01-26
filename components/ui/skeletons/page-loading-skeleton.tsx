"use client";

// Page loading skeleton
export default function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {/* Main Loading Container */}
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Brand Initials */}
        <div className="relative">
          {/* Elegant N A letters */}
          <div className="flex items-center gap-8 mb-4">
            <span className="text-6xl md:text-7xl font-light text-muted-foreground tracking-[0.3em] transition-all duration-1000 animate-pulse">
              N
            </span>
            <span className="text-6xl md:text-7xl font-light text-primary tracking-[0.3em] transition-all duration-1000 animate-pulse [animation-delay:0.5s]">
              A
            </span>
          </div>
        </div>

        {/* Elegant Divider Line */}
        <div className="w-64 h-px bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Loading Text */}
        <div className="text-center space-y-1 mt-2">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase italic animate-pulse">
            Stitching your masterpiece...
          </p>
        </div>

        {/* Minimal Progress Indicator */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-linear-to-r from-primary via-accent to-primary animate-[shimmer_2s_infinite]"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}