import type { Metadata } from 'next';
import { products, formatCOP } from '@/lib/catalog';
import { absoluteUrl, site } from '@/lib/site';
import { CartButton } from '@/components/cart-button';
import { AddToCart } from '@/components/add-to-cart';

function categoryId(category: string) {
  return `categoria-${category.toLocaleLowerCase('es-CO').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`;
}

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
  const categories = Object.keys(byCategory);

  return <main className="content-page catalog-page">
    <header className="content-hero"><div className="catalog-top-actions"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><CartButton /></div><p className="eyebrow">Tienda Wandra</p><h1>ALIMENTOS<br /><i>VIVOS</i></h1><p>Una selección de kombuchas, ghee, aceites, mantequillas y bebidas para acompañar tu rutina.</p></header>
    <nav className="catalog-category-nav" aria-label="Categorías de productos"><span>Explora por categoría</span>{categories.map((category) => <a key={category} href={`#${categoryId(category)}`}>{category}</a>)}</nav>
    {Object.entries(byCategory).map(([category, items]) => <section className="catalog-group" id={categoryId(category)} key={category} aria-labelledby={`heading-${categoryId(category)}`}><h2 id={`heading-${categoryId(category)}`}>{category}</h2><div className="catalog-grid">{items.map((product) => <article className="catalog-card" key={product.slug}><img src={product.image} alt={product.name} loading="lazy" decoding="async" /><div><p className="catalog-card-category">{product.category}</p><h3>{product.name}</h3><p>{product.description}</p><strong>Desde {formatCOP(Math.min(...product.variants.map((variant) => variant.price)))}</strong><AddToCart product={product} className="button button-dark catalog-add-button" /><a className="text-link" href={`/productos/${product.slug}`}>Ver ficha del producto <span>↗</span></a></div></article>)}</div></section>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Productos Wandra', itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: absoluteUrl(`/productos/${product.slug}`), name: product.name })) }) }} />
  </main>;
}
