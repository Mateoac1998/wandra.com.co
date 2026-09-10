import Link from 'next/link';

import type { Metadata } from 'next';
import { articles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Historias y guías',
  description:
    'Guías de Wandra sobre kombucha, ghee y una alimentación consciente.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <main id="contenido" className="content-page blog-page">
      <header className="content-hero">
        <p className="eyebrow">Historias Wandra</p>
        <h1>
          Ideas para
          <br />
          <em>disfrutar.</em>
        </h1>
        <p>
          Información clara sobre nuestros productos, sus ingredientes y maneras
          de incorporarlos a tu rutina.
        </p>
      </header>
      <section className="article-grid">
        {articles.map((article) => (
          <article className="article-card" key={article.slug}>
            <p className="catalog-card-category">
              {article.category} ·{' '}
              {new Date(`${article.published}T12:00:00`).toLocaleDateString(
                'es-CO',
                { year: 'numeric', month: 'long', day: 'numeric' },
              )}
            </p>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <Link
              prefetch={false}
              className="text-link"
              href={`/blog/${article.slug}`}
            >
              Leer guía <span>↗</span>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
