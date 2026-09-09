import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/productos/mateo-cafe', destination: '/productos/kombucha-cafe', permanent: true },
      { source: '/productos/mateo-jengibre', destination: '/productos/kombucha-jengibre', permanent: true },
      { source: '/productos/mateo-flor-de-jamaica', destination: '/productos/kombucha-flor-de-jamaica', permanent: true },
      { source: '/productos/six-pack-mateo-280-ml', destination: '/productos/six-pack-kombucha-280-ml', permanent: true },
      { source: '/productos/six-pack-mateo-500-ml', destination: '/productos/six-pack-kombucha-500-ml', permanent: true },
      { source: '/blog/guia-definitiva-mateo', destination: '/blog/guia-definitiva-kombucha', permanent: true },
      { source: '/blog/que-es-mateo', destination: '/blog/que-es-la-kombucha', permanent: true },
    ];
  },
};

export default nextConfig;

