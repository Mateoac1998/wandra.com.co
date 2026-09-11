import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatCOP, getProduct, products } from '@/lib/catalog';
import { absoluteUrl, site, whatsappProductUrl } from '@/lib/site';
import { ProductGallery } from '@/components/product-gallery';

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
    image: (product.images || [product.image]).map(absoluteUrl), description: product.description,
    brand: { '@type': 'Brand', name: site.shortName },
    additionalProperty: product.sanitaryRegistration ? [{ '@type': 'PropertyValue', name: 'Registro sanitario RSA INVIMA', value: product.sanitaryRegistration }] : undefined,
    offers: product.variants.map((variant) => ({ '@type': 'Offer', url: absoluteUrl(`/productos/${product.slug}`), priceCurrency: 'COP', price: variant.price, sku: variant.sku, name: `${product.name} · ${variant.label}`, availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' })),
  };
  return <main className="content-page product-page"><header className="product-top"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><a className="back-link" href="/productos">← Todos los productos</a></header><article className="product-detail"><div className="product-media"><ProductGallery images={product.images || [product.image]} alt={product.name} /></div><div className="product-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-description">{product.description}</p><div className="variant-list" aria-label="Presentaciones y precios">{product.variants.map((variant) => <div key={variant.sku}><span>{variant.label}</span><strong>{formatCOP(variant.price)}</strong></div>)}</div>{product.sanitaryRegistration && <p className="product-registry">Registro sanitario INVIMA: {product.sanitaryRegistration}. Mantener refrigerado entre 0 y 6 °C.</p>}<p className="product-note">Precio desde {formatCOP(lowestPrice)}. Te confirmaremos disponibilidad, ingredientes y condiciones de envío por WhatsApp.</p><a className="button button-dark" href={whatsappProductUrl(product.name)} target="_blank" rel="noreferrer">Consultar por WhatsApp</a></div></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
