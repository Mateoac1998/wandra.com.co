import type { Metadata } from 'next';
import { articles } from '@/lib/blog';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: `Historias y guías | ${site.shortName}`, description: 'Guías de Wandra sobre Mateo, ghee y una alimentación consciente.', alternates: { canonical: '/blog' } };

export default function BlogPage() {
  return <main className="content-page blog-page"><header className="content-hero"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Historias Wandra</p><h1>GUÍAS PARA<br /><i>DISFRUTAR</i></h1><p>Información clara sobre nuestros productos, sus ingredientes y maneras de incorporarlos a tu rutina.</p></header><section className="article-grid">{articles.map((article) => <article className="article-card" key={article.slug}><p className="catalog-card-category">{article.category} · {new Date(`${article.published}T12:00:00`).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p><h2>{article.title}</h2><p>{article.description}</p><a className="text-link" href={`/blog/${article.slug}`}>Leer guía <span>↗</span></a></article>)}</section></main>;
}
