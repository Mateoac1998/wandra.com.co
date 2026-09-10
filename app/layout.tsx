import type { Metadata } from 'next';
import './design.css';
import { site, SITE_URL } from '@/lib/site';
import { StoreProvider, Navigation } from '@/components/storefront';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Wandra | Kombucha y alimentos vivos en Colombia',
    template: '%s | Wandra',
  },
  description: site.description,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: site.name,
    title: 'Wandra | Kombucha y alimentos vivos en Colombia',
    description: site.description,
    url: '/',
    images: [
      {
        url: '/assets/cloudinary-upload/wandra-hero-editorial.webp',
        width: 1672,
        height: 941,
        alt: 'Kombucha y herencia saludable Wandra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wandra | Kombucha y alimentos vivos en Colombia',
    description: site.description,
    images: ['/assets/cloudinary-upload/wandra-hero-editorial.webp'],
  },
  icons: { icon: '/assets/cloudinary-upload/wandra-logo-web.webp' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: site.name,
    alternateName: site.shortName,
    url: SITE_URL,
    logo: site.logo,
    sameAs: [site.instagram],
    hasMerchantReturnPolicy: undefined,
  };
  return (
    <html lang="es-CO" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <StoreProvider>
          <Navigation />
          {children}
          <Footer />
        </StoreProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema,
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: site.name,
                url: SITE_URL,
                inLanguage: 'es-CO',
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
