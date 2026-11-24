import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, formatArticleDate, getArticle, guidesUrl } from '@/lib/blog';
import { media } from '@/lib/media';
import { site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

const defaultImage = { src: media.hero, alt: 'Botellas y caja de kombucha artesanal Wandra' };

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const url = `${guidesUrl}/${article.slug}`;
  const image = article.image ?? defaultImage;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url,
      locale: 'es_CO',
      siteName: site.name,
      publishedTime: article.published,
      images: [{ url: image.src, alt: image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [{ url: image.src, alt: image.alt }],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const url = `${guidesUrl}/${article.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'es-CO',
    image: [(article.image ?? defaultImage).src],
    datePublished: article.published,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: site.name, url: new URL('/nosotros', url).href },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: new URL(site.logo, url).href },
    },
  };

  return (
    <main className="content-page article-page">
      <article>
        <header className="article-header">
          <a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a>
          <a className="back-link" href="/guias">← Todas las guías</a>
          <p className="eyebrow">{article.category}</p>
          <h1 className="text-[clamp(2.15rem,6vw,5.5rem)]! leading-[1.05]! [overflow-wrap:anywhere]">{article.title}</h1>
          <p>{article.description}</p>
          <p>{site.name} · <time dateTime={article.published}>{formatArticleDate(article.published)}</time></p>
        </header>
        <div className="article-body">
          {article.body.map((section) => (
            <section key={section.heading}>
              <h2 className="[overflow-wrap:anywhere]">{section.heading}</h2>
              <p>{section.text}</p>
              {section.subsections?.map((subsection) => (
                <div className="pt-5" key={subsection.heading}>
                  <h3 className="mb-2 text-xl">{subsection.heading}</h3>
                  <p>{subsection.text}</p>
                </div>
              ))}
            </section>
          ))}
          {article.sources && (
            <section>
              <h2>Fuentes</h2>
              <ul className="space-y-2">
                {article.sources.map(({ title, url }) => (
                  <li key={url}><a className="underline underline-offset-4" href={url}>{title}</a></li>
                ))}
              </ul>
            </section>
          )}
          <a className="button button-dark" href="/productos">Ver el catálogo de Wandra <span aria-hidden="true">↗</span></a>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </main>
  );
}
