import type { Metadata } from 'next';
import './globals.css';
import { site, SITE_URL } from '@/lib/site';
import { media } from '@/lib/media';

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
  return <html lang="es-CO"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
