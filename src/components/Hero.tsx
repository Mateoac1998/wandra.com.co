import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[88vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8217309/pexels-photo-8217309.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Kombucha artesanal servida en copa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-whs-dark/85 via-whs-dark/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-whs-dark/60 via-transparent to-whs-dark/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-whs-cream/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-whs-gold" />
            <span className="font-body text-xs uppercase tracking-[0.15em] text-whs-dark font-medium">
              Fermentación Natural · Registro INVIMA
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Kombucha Artesanal Colombiana:{' '}
            <span className="italic shimmer-text">Bebida Probiótica</span> y Natural para tu Bienestar
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg lg:text-xl text-white/85 mb-8 max-w-xl leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Fermentación ancestral, ingredientes seleccionados y registro INVIMA. Sabor auténtico que transforma tu salud digestiva.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <a href="#kombucha" className="btn-gold">
              Ver Colección de Kombuchas
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#b2b"
              className="btn-ghost-light group"
            >
              <MessageCircle className="w-4 h-4" />
              ¿Tienes un negocio? Pide catálogo mayorista
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-whs-gold-light animate-pulse" />
              <span className="font-body text-sm uppercase tracking-wide">Probióticos Vivos</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-whs-gold-light animate-pulse" />
              <span className="font-body text-sm uppercase tracking-wide">Hecho en el Quindío</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-whs-gold-light animate-pulse" />
              <span className="font-body text-sm uppercase tracking-wide">Sin Azúcares Añadidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
