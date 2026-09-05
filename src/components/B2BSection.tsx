import { Check, MessageCircle, Wine, Package, BarChart3 } from 'lucide-react';

const bullets = [
  {
    icon: Wine,
    title: 'Botellas de múltiples formatos',
    text: '280ml, 500ml, 750ml y 1000ml para adaptarse a tu carta o estantería.',
  },
  {
    icon: Package,
    title: 'Barriles para Tap System',
    text: 'Desde 3L hasta 100L para servicio en grifo con máxima frescura.',
  },
  {
    icon: BarChart3,
    title: 'Márgenes competitivos',
    text: 'Precios mayoristas que protegen tu rentabilidad sin sacrificar calidad.',
  },
];

export default function B2BSection() {
  return (
    <section id="b2b" className="relative py-20 lg:py-28 bg-whs-dark overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.pexels.com/photos/2813132/pexels-photo-2813132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-whs-dark via-whs-dark/95 to-whs-dark/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="reveal">
            <span className="font-body text-sm uppercase tracking-[0.2em] text-whs-gold font-medium mb-4 block">
              Canal Horeca · B2B
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Llevar Wandra a tu{' '}
              <span className="shimmer-text italic">Restaurante, Café o Evento</span>
            </h2>
            <p className="font-body text-white/70 text-lg font-light mb-8 leading-relaxed">
              Convierte Wandra en la experiencia diferenciadora de tu negocio. Producción bajo norma INVIMA, respaldo técnico y formatos flexibles.
            </p>

            {/* Bullets */}
            <div className="space-y-5 mb-8">
              {bullets.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-whs-gold/15 border border-whs-gold/30 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-whs-gold" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-white mb-1">
                      {b.title}
                    </h4>
                    <p className="font-body text-sm text-white/60">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/5730000000000?text=Hola%20Wandra%2C%20quiero%20contactar%20un%20asesor%20B2B"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              <MessageCircle className="w-5 h-5" />
              Contactar Asesor B2B por WhatsApp
            </a>
          </div>

          {/* Right: Visual cards */}
          <div className="reveal reveal-delay-2 grid grid-cols-2 gap-4 lg:gap-6">
            {/* Format card */}
            <div className="col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
              <h4 className="font-body text-xs uppercase tracking-[0.15em] text-whs-gold mb-4 font-medium">
                Formatos Disponibles
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {['280ml', '500ml', '750ml', '1000ml'].map((size) => (
                  <div
                    key={size}
                    className="text-center bg-white/5 rounded-lg py-3 border border-white/10 hover:border-whs-gold/40 transition-colors"
                  >
                    <span className="font-display text-base lg:text-lg font-semibold text-white">
                      {size}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="font-body text-xs text-white/50 uppercase tracking-wide mb-2">
                  Barriles Tap System
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['3L', '5L', '10L', '20L', '50L', '100L'].map((size) => (
                    <span
                      key={size}
                      className="font-body text-sm text-whs-gold bg-whs-gold/10 px-2.5 py-1 rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* INVIMA card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
              <Check className="w-8 h-8 text-whs-gold mb-3" />
              <h4 className="font-display text-lg font-semibold text-white mb-1">
                Norma INVIMA
              </h4>
              <p className="font-body text-xs text-white/50">
                Producción trazable y respaldo técnico garantizado
              </p>
            </div>

            {/* Margin card */}
            <div className="bg-gradient-to-br from-whs-gold/15 to-whs-gold/5 border border-whs-gold/20 rounded-2xl p-6 flex flex-col justify-center">
              <BarChart3 className="w-8 h-8 text-whs-gold mb-3" />
              <h4 className="font-display text-lg font-semibold text-white mb-1">
                Márgenes Reales
              </h4>
              <p className="font-body text-xs text-white/50">
                Precios mayoristas que protegen tu rentabilidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
