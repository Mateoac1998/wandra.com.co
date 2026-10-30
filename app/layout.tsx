import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { site, SITE_URL } from '@/lib/site';
import { media } from '@/lib/media';
import { CartButton } from '@/components/cart-button';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Wandra | Kombucha y alimentos vivos en Colombia', template: '%s | Wandra' },
  description: site.description,
  keywords: ['comprar kombucha en Colombia', 'kombucha artesanal en Armenia', 'kombucha Quindío', 'kombucha mayorista', 'kombucha para restaurantes y cafés'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', locale: 'es_CO', siteName: site.name, title: 'Wandra | Kombucha y alimentos vivos en Colombia', description: site.description, url: '/' },
  twitter: { card: 'summary_large_image', title: 'Wandra | Kombucha y alimentos vivos en Colombia', description: site.description },
  icons: { icon: media.logo },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'OnlineStore', name: site.name,
    alternateName: site.shortName, url: SITE_URL, logo: site.logo,
    sameAs: [site.instagram, site.facebook, site.tiktok, site.pinterest].filter(Boolean),
    email: site.email,
    telephone: '+57 321 432 0429',
    address: { '@type': 'PostalAddress', addressLocality: 'Armenia', addressRegion: 'Quindío', addressCountry: 'CO' },
    contactPoint: [{ '@type': 'ContactPoint', telephone: '+57 321 432 0429', email: site.email, contactType: 'sales', availableLanguage: 'es' }],
  };
  return <html lang="es-CO"><body>{children}<div className="floating-cart"><CartButton /></div><a className="whatsapp-float" href="https://wa.me/573122858808" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Wandra por WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.24-1.64a11.96 11.96 0 0 0 5.8 1.48h.01C18.64 23.84 24 18.48 24 11.9a11.85 11.85 0 0 0-3.48-8.42ZM12.05 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.24-.38a9.89 9.89 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.94-9.94a9.88 9.88 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.9 7.03c0 5.48-4.46 9.94-9.99 9.87Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.12 4.52.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" /></svg></a><Toaster position="bottom-center" closeButton /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
