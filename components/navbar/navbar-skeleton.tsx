export default function NavbarSkeleton() {
  return (
    <nav className="bg-white/80 backdrop-blur-xl w-full sticky top-0 z-50 border-b border-rose-100/20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-3 sm:gap-4 lg:gap-6">
          {/* LEFT: Logo skeleton */}
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            {/* Menu button skeleton */}
            <div className="lg:hidden w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            
            {/* Logo skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gray-100 animate-pulse" />
              <div className="hidden xl:block space-y-1">
                <div className="h-3 w-32 bg-gray-100 animate-pulse rounded" />
                <div className="h-2 w-24 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>

            {/* Collections dropdown skeleton */}
            <div className="hidden lg:block w-24 h-8 bg-gray-100 animate-pulse rounded" />
          </div>

          {/* RIGHT: Icons skeleton */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="hidden sm:block h-6 w-px bg-rose-200/50" />
            <div className="hidden sm:block w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}
