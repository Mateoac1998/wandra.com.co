import MediaImage from '@/components/media-image';

import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="new-footer" id="newsletter">
      <div className="footer-social">
        <p>
          Las buenas cosas
          <br />
          <em>se comparten.</em>
        </p>
        <Link
          prefetch={false}
          href={site.instagram}
          className="underlined-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Encuéntranos en Instagram <ArrowUpRight />
        </Link>
      </div>
      <div className="footer-brand">
        <Link prefetch={false} href="/" aria-label="Wandra, inicio">
          <MediaImage
            src="/assets/cloudinary-upload/wandra-logo-web.webp"
            alt="Wandra"
            width="120"
            height="120"
          />
        </Link>
        <span aria-hidden="true">WANDRA</span>
        <span className="footer-seal">
          HERENCIA
          <br />
          SALUDABLE
          <br />✳ COLOMBIA
        </span>
      </div>
      <nav className="footer-nav" aria-label="Enlaces del pie de página">
        <Link prefetch={false} href="/productos">
          Tienda
        </Link>
        <Link prefetch={false} href="/#origen">
          Nuestro origen
        </Link>
        <Link prefetch={false} href="/blog">
          Guías
        </Link>
        <Link prefetch={false} href="/preguntas-frecuentes">
          Preguntas frecuentes
        </Link>
        <Link prefetch={false} href="https://wandra.com.co/contacto/">
          Contacto <ArrowUpRight size={16} />
        </Link>
      </nav>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Wandra Herencia Saludable</span>
        <span>Hecho con calma. Disfrutado con ganas.</span>
        <Link prefetch={false} href="#contenido">
          Volver arriba ↑
        </Link>
      </div>
    </footer>
  );
}
