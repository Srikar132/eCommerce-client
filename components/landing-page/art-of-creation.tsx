

export default function ArtOfCreation() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
            Personalize Your Style
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
            Custom Creations
          </h2>
        </div>
        
        {/* Description Paragraph */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Have something special in mind? We love bringing your ideas to life. Every thread is carefully chosen for quality, and every stitch is crafted with patience and a whole lot of love.
            From the first sketch to the final touch, each piece is made to reflect you — your style, your moments, and your story. Because at NaLa Armoire, every detail truly matters when creating your memories.
          </p>
        </div>

        {/* Decorative Gradient Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-lg sm:h-128 bg-primary/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
      </div>
    </section>
  );
}
