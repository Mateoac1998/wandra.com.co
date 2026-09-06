import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatCOP, getProduct, products } from '@/lib/catalog';
import { absoluteUrl, site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name} | ${site.shortName}`;
  return { title, description: product.description, alternates: { canonical: `/productos/${product.slug}` }, openGraph: { title, description: product.description, url: `/productos/${product.slug}`, images: [{ url: product.image, alt: product.name }] } };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const lowestPrice = Math.min(...product.variants.map((variant) => variant.price));
  const schema = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku,
    image: absoluteUrl(product.image), description: product.description,
    brand: { '@type': 'Brand', name: site.shortName },
    offers: product.variants.map((variant) => ({ '@type': 'Offer', url: absoluteUrl(`/productos/${product.slug}`), priceCurrency: 'COP', price: variant.price, sku: variant.sku, name: `${product.name} · ${variant.label}`, availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' })),
  };
  return <main className="content-page product-page"><header className="product-top"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><a className="back-link" href="/productos">← Todos los productos</a></header><article className="product-detail"><div className="product-media"><img src={product.image} alt={product.name} fetchPriority="high" /></div><div className="product-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-description">{product.description}</p><div className="variant-list" aria-label="Presentaciones y precios">{product.variants.map((variant) => <div key={variant.sku}><span>{variant.label}</span><strong>{formatCOP(variant.price)}</strong></div>)}</div><p className="product-note">Precio desde {formatCOP(lowestPrice)}. La disponibilidad, ingredientes y condiciones de envío se confirmarán en el checkout.</p><a className="button button-dark" href="/#comprar">Consultar compra</a></div></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
