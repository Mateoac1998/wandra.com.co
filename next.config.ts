import type { NextConfig } from 'next';

// Rutas heredadas de WordPress/WooCommerce con destino claro en el sitio actual.
// El orden importa: Next aplica la primera regla que coincide, así que las rutas
// específicas van antes que los comodines. Ningún destino coincide con un origen
// de esta lista (no hay bucles).
const legacyRedirects = [
  // Productos heredados (/producto/<slug>/)
  { source: '/producto/aceite-de-macadamia', destination: '/productos' }, // aceite descontinuado, sin equivalente exacto
  { source: '/producto/aceite-de-ajonjoli', destination: '/productos/aceite-de-ajonjoli' },
  { source: '/producto/mantequilla-de-mani', destination: '/productos/mantequilla-de-mani' },
  { source: '/producto/mantequilla-de-macadamia', destination: '/productos/mantequilla-de-macadamia' },
  { source: '/producto/six-pack-de-kombucha', destination: '/productos/six-pack-kombucha-280-ml' },
  { source: '/producto/six-pack-kombuchas-de-500-ml', destination: '/productos/six-pack-kombucha-500-ml' },
  { source: '/producto/kombucha-cafe', destination: '/productos/kombucha-cafe' },
  { source: '/producto/kombu-flor-de-jamaica', destination: '/productos/kombucha-flor-de-jamaica' },
  { source: '/producto/kombucha-de-jengibre', destination: '/productos/kombucha-jengibre' },
  { source: '/producto/ghee', destination: '/productos/ghee' },
  { source: '/producto/tahini', destination: '/productos/tahini-mantequilla-de-ajonjoli' },
  { source: '/producto/leche-dorada', destination: '/productos/leche-dorada' },
  { source: '/producto/aceite-de-coco', destination: '/productos/aceite-de-coco' },
  { source: '/producto/mantequilla-de-almendra', destination: '/productos' }, // sin equivalente en el catálogo actual
  { source: '/producto/:path*', destination: '/productos' },

  // Tienda y categorías heredadas
  { source: '/tienda/page/:page', destination: '/productos' },
  { source: '/categoria-producto/ghee', destination: '/productos/ghee' },
  { source: '/categoria-producto/:path*', destination: '/productos' },

  // Páginas institucionales y políticas
  { source: '/acerca-de-nosotros', destination: '/nosotros' },
  { source: '/terminos-y-condiciones', destination: '/politicas' },
  { source: '/politicas-de-envio-y-devolucion', destination: '/politicas' },
  { source: '/politica-de-privacidad', destination: '/politicas' },

  // Entradas de blog con fecha (/AAAA/MM/DD/<slug>/)
  { source: '/2025/01/20/ghee-mantequilla-o-margarina-por-que-el-ghee-es-la-opcion-mas-saludable', destination: '/guias/ghee-en-la-cocina' },
  { source: '/2024/01/28/introduccion-a-la-kombucha-bebida-probiotica-saludable-y-deliciosa', destination: '/guias/que-es-la-kombucha' },
  { source: '/2023/10/06/descubriendo-los-beneficios-de-la-kombucha', destination: '/guias/guia-definitiva-kombucha' },
  { source: '/2024/12/09/microbiota-intestinal-el-ecosistema-que-cuida-de-ti', destination: '/guias/guia-definitiva-kombucha' },
  { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*', destination: '/guias' },
].map((rule) => ({ ...rule, permanent: true as const }));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/mk5klko9/image/upload/**')],
  },
  async redirects() {
    return [
      { source: '/productos/mateo-cafe', destination: '/productos/kombucha-cafe', permanent: true },
      { source: '/productos/mateo-jengibre', destination: '/productos/kombucha-jengibre', permanent: true },
      { source: '/productos/mateo-flor-de-jamaica', destination: '/productos/kombucha-flor-de-jamaica', permanent: true },
      { source: '/productos/six-pack-mateo-280-ml', destination: '/productos/six-pack-kombucha-280-ml', permanent: true },
      { source: '/productos/six-pack-mateo-500-ml', destination: '/productos/six-pack-kombucha-500-ml', permanent: true },
      { source: '/blog/guia-definitiva-mateo', destination: '/guias/guia-definitiva-kombucha', permanent: true },
      { source: '/blog/que-es-mateo', destination: '/guias/que-es-la-kombucha', permanent: true },
      { source: '/blog/:path*', destination: '/guias/:path*', permanent: true },
      // /tienda era un redirect temporal (307) desde la página; ahora es permanente.
      { source: '/tienda', destination: '/productos', permanent: true },
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
