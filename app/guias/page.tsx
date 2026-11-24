import type { Metadata } from 'next';
import { articles, formatArticleDate, guidesUrl } from '@/lib/blog';
import { media } from '@/lib/media';
import { site } from '@/lib/site';

const title = 'Blog y guías de Wandra';
const description = 'Conoce la kombucha artesanal y el ghee de Wandra. Encuentra guías sobre fermentación, conservación y formas de disfrutar nuestros productos.';

export const metadata: Metadata = {
  title: 'Blog y guías',
  description,
  alternates: { canonical: guidesUrl },
  openGraph: {
    type: 'website',
    title,
    description,
    url: guidesUrl,
    locale: 'es_CO',
    siteName: site.name,
    images: [{ url: media.hero, alt: 'Botellas y caja de kombucha artesanal Wandra' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [media.hero] },
};

export default function GuiasPage() {
  return (
    <main className="content-page blog-page">
      <header className="content-hero">
        <a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a>
        <h1 className="break-words">Blog y <br /><i>guías</i></h1>
        <p>{description}</p>
      </header>
      <section className="article-grid" aria-label="Guías de Wandra">
        {articles.map((article) => (
          <article className="article-card min-w-0" key={article.slug}>
            <p className="catalog-card-category">
              {article.category} · <time dateTime={article.published}>{formatArticleDate(article.published)}</time>
            </p>
            <h2 className="[overflow-wrap:anywhere]">{article.title}</h2>
            <p>{article.description}</p>
            <a className="text-link" href={`/guias/${article.slug}`} aria-label={`Leer guía: ${article.title}`}>
              Leer guía <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
