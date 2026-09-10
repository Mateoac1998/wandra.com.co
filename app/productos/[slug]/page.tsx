import MediaImage from '@/components/media-image';

import Link from 'next/link';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, products } from '@/lib/catalog';
import { absoluteUrl, site } from '@/lib/site';
import { BuyProduct } from '@/components/storefront';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/productos/${product.slug}`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const url = absoluteUrl(`/productos/${product.slug}`);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      image: absoluteUrl(product.image),
      description: product.description,
      url,
      brand: { '@type': 'Brand', name: site.shortName },
      offers: product.variants.map((variant) => ({
        '@type': 'Offer',
        url,
        priceCurrency: 'COP',
        price: variant.price,
        sku: variant.sku,
        name: `${product.name} · ${variant.label}`,
        itemCondition: 'https://schema.org/NewCondition',
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Productos',
          item: absoluteUrl('/productos'),
        },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    },
  ];
  return (
    <main id="contenido" className="content-page product-page">
      <header className="product-top">
        <Link prefetch={false} className="back-link" href="/productos">
          ← Todos los productos
        </Link>
        <span className="eyebrow">La despensa Wandra</span>
      </header>
      <article className="product-detail">
        <div className="product-media">
          <MediaImage
            src={product.image}
            alt={product.name}
            width="800"
            height="850"
            fetchPriority="high"
          />
        </div>
        <div className="product-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <BuyProduct product={product} />
          <p className="product-note">
            Precios en pesos colombianos. Consulta con Wandra la disponibilidad,
            los ingredientes y el envío a tu ciudad. El pago en línea aún no
            está habilitado.
          </p>
          <Link
            prefetch={false}
            className="underlined-link"
            href="/preguntas-frecuentes"
          >
            Resolvemos tus dudas ↗
          </Link>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
