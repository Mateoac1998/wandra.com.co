import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatCOP, getProduct, products } from '@/lib/catalog';
import { absoluteUrl, site } from '@/lib/site';
import { ProductGallery } from '@/components/product-gallery';
import { AddToCart } from '@/components/add-to-cart';
import { CartButton } from '@/components/cart-button';

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: absoluteUrl(product.image),
    description: product.description,
    sku: product.slug,
    brand: { '@type': 'Brand', name: site.name },
    additionalProperty: product.sanitaryRegistration
      ? [{ '@type': 'PropertyValue', name: 'Registro sanitario RSA INVIMA', value: product.sanitaryRegistration }]
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: lowestPrice,
      availability: product.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: absoluteUrl(`/productos/${product.slug}`),
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
  return <main className="content-page product-page"><header className="product-top"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><a className="back-link" href="/productos">← Todos los productos</a><CartButton /></header><article className="product-detail"><div className="product-media"><ProductGallery images={product.images || [product.image]} alt={product.name} /></div><div className="product-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-description">{product.description}</p><div className="variant-list" aria-label="Presentaciones y precios">{product.variants.map((variant) => <div key={variant.sku}><span>{variant.label}</span><strong>{formatCOP(variant.price)}</strong></div>)}</div>{product.sanitaryRegistration && <p className="product-registry">Registro sanitario INVIMA: {product.sanitaryRegistration}. Mantener refrigerado entre 0 y 6 °C.</p>}<p className="product-note">Precio desde {formatCOP(lowestPrice)}. El envío se confirma antes del despacho; es gratis desde $250.000, sujeto a cobertura.</p><AddToCart product={product} /></div></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /></main>;
}
