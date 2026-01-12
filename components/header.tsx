import Image from 'next/image';


interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title , subtitle  }: HeaderProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-background px-4 py-8 sm:py-12 md:py-16">
      {/* Decorative Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side decoration */}
        <div className="absolute left-0 top-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 opacity-60">
          <Image
            src="/images/home/flower5.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        {/* Right side decoration */}
        <div className="absolute right-0 bottom-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-60">
          <Image
            src="/images/home/flower5.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light  mb-2 sm:mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light">
          {subtitle}
        </p>
      </div>
    </div>
  );
};


export default Header;