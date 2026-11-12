import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticle } from '@/lib/blog';
import { media } from '@/lib/media';
import { absoluteUrl, site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const url = absoluteUrl(`/blog/${article.slug}`);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'es_CO',
      siteName: site.name,
      title: article.title,
      description: article.description,
      publishedTime: article.published,
      url,
      images: [media.socialPreview],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug); if (!article) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, datePublished: article.published, dateModified: article.published, mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`), author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.logo } } };
  return <main className="content-page article-page"><header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><a className="back-link" href="/blog">← Todas las guías</a><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.description}</p></header><article className="article-body">{article.body.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}</article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
