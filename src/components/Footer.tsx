import { useState } from 'react';
import { Send, Instagram, Facebook, MessageCircle, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-whs-dark text-white">
      {/* Newsletter Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2">
                Únete y obtén{' '}
                <span className="shimmer-text italic">10% OFF</span> en tu primera compra
              </h3>
              <p className="font-body text-white/60 font-light">
                Suscríbete a nuestro boletín y recibe recetas, consejos de salud digestiva y ofertas exclusivas.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/40 font-body focus:border-whs-gold focus:outline-none transition-colors"
              />
              <button type="submit" className="btn-gold justify-center">
                <Send className="w-4 h-4" />
                Suscribirme
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="mt-4 font-body text-sm text-whs-gold animate-fade-in">
              ¡Gracias por suscribirte! Revisa tu correo para el cupón de bienvenida.
            </p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo + Manifesto */}
          <div className="lg:pr-6">
            <div className="mb-4">
              <span className="font-display text-2xl font-bold text-white block leading-none">
                Wandra
              </span>
              <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-whs-gold font-medium">
                Herencia Saludable
              </span>
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-6 font-light">
              Fermentación ancestral colombiana, ingredientes seleccionados y el compromiso de llevar bienestar real a cada hogar. Hecho con amor en el Quindío.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-whs-gold hover:border-transparent transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 text-white/70 group-hover:text-whs-dark transition-colors" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-whs-gold hover:border-transparent transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 text-white/70 group-hover:text-whs-dark transition-colors" />
              </a>
              <a
                href="https://wa.me/5730000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-whs-gold hover:border-transparent transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4 text-white/70 group-hover:text-whs-dark transition-colors" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-[0.15em] text-whs-gold font-medium mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', href: '#inicio' },
                { label: 'Kombuchas', href: '#kombucha' },
                { label: 'Despensa Saludable', href: '#despensa' },
                { label: 'Mayoristas / B2B', href: '#b2b' },
                { label: 'Blog', href: '#blog' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-whs-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal + INVIMA */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-[0.15em] text-whs-gold font-medium mb-5">
              Información Legal
            </h4>
            <ul className="space-y-3 mb-5">
              {[
                'Términos y Condiciones',
                'Política de Privacidad',
                'Política de Envíos',
                'Preguntas Frecuentes',
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-white/50 hover:text-whs-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-1">
                Registro INVIMA
              </p>
              <p className="font-body text-sm text-white/60">
                Productos con registro sanitario y código de barras trazable.
              </p>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-[0.15em] text-whs-gold font-medium mb-5">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-whs-gold mt-0.5 shrink-0" />
                <span className="font-body text-sm text-white/50">
                  Quindío, Colombia
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-whs-gold mt-0.5 shrink-0" />
                <span className="font-body text-sm text-white/50">
                  hola@wandraherencia.co
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-whs-gold mt-0.5 shrink-0" />
                <a
                  href="https://wa.me/5730000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-whs-gold transition-colors"
                >
                  +57 300 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/30">
            © 2026 Wandra Herencia Saludable. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-white/30">
            Hecho con fermentación natural en el Quindío, Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
