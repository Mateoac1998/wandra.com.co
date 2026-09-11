import type { Metadata } from 'next';
import { products, formatCOP } from '@/lib/catalog';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = {
  title: `Productos | ${site.shortName}`,
  description: 'Conoce las kombuchas, ghee, aceites, mantequillas y bebidas funcionales de Wandra.',
  alternates: { canonical: '/productos' },
};

export default function ProductsPage() {
  const byCategory = products.reduce<Record<string, typeof products>>((groups, product) => {
    (groups[product.category] ??= []).push(product);
    return groups;
  }, {});

  return <main className="content-page catalog-page">
    <header className="content-hero"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Tienda Wandra</p><h1>ALIMENTOS<br /><i>VIVOS</i></h1><p>Una selección de kombuchas, ghee, aceites, mantequillas y bebidas para acompañar tu rutina.</p></header>
    {Object.entries(byCategory).map(([category, items]) => <section className="catalog-group" key={category} aria-labelledby={`category-${category}`}><h2 id={`category-${category}`}>{category}</h2><div className="catalog-grid">{items.map((product) => <article className="catalog-card" key={product.slug}><img src={product.image} alt={product.name} loading="lazy" decoding="async" /><div><p className="catalog-card-category">{product.category}</p><h3>{product.name}</h3><p>{product.description}</p><strong>Desde {formatCOP(Math.min(...product.variants.map((variant) => variant.price)))}</strong><a className="text-link" href={`/productos/${product.slug}`}>Ver producto <span>↗</span></a></div></article>)}</div></section>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Productos Wandra', itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: absoluteUrl(`/productos/${product.slug}`), name: product.name })) }) }} />
  </main>;
}
