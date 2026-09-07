import type { Metadata } from 'next';
import './globals.css';
import { site, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Wandra | Mateo y alimentos vivos en Colombia', template: '%s | Wandra' },
  description: site.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', locale: 'es_CO', siteName: site.name, title: 'Wandra | Mateo y alimentos vivos en Colombia', description: site.description, url: '/' },
  twitter: { card: 'summary_large_image', title: 'Wandra | Mateo y alimentos vivos en Colombia', description: site.description },
  icons: { icon: '/assets/cloudinary-upload/wandra-logo-web.webp' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'OnlineStore', name: site.name,
    alternateName: site.shortName, url: SITE_URL, logo: site.logo,
    sameAs: [site.instagram],
    hasMerchantReturnPolicy: undefined,
  };
  return <html lang="es-CO"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
