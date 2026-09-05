import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5730000000000?text=Hola%20Wandra%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-whs-dark" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-whs-dark text-white text-sm font-body rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Hablamos?
      </span>
      <span className="absolute inset-0 rounded-full bg-whs-gold-light animate-ping opacity-20" />
    </a>
  );
}
