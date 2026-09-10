import type { MetadataRoute } from 'next';
import { products } from '@/lib/catalog';
import { articles } from '@/lib/blog';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...['/', '/productos', '/blog', '/preguntas-frecuentes'].map((path) => ({
      url: absoluteUrl(path),
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/productos/${product.slug}`),
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
    })),
  ];
}
