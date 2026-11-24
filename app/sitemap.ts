import type { MetadataRoute } from 'next';
import { articles } from '@/lib/blog';
import { products } from '@/lib/catalog';
import { CANONICAL_SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/',
    '/productos',
    '/mayoristas',
    '/nosotros',
    '/contacto',
    '/preguntas-frecuentes',
    '/politicas',
    '/blog',
  ];

  return [
    ...pages.map((path) => ({ url: new URL(path, CANONICAL_SITE_URL).href })),
    ...products.map((product) => ({
      url: new URL(`/productos/${product.slug}`, CANONICAL_SITE_URL).href,
    })),
    ...articles.map((article) => ({
      url: new URL(`/blog/${article.slug}`, CANONICAL_SITE_URL).href,
      lastModified: article.published,
    })),
  ];
}
