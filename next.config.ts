import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wandra.com.co',
        port: '',
        pathname: '/wp-content/uploads/**',
        search: '',
      },
    ],
  },
  async redirects() {
    return [
      ...['cafe', 'jengibre', 'flor-de-jamaica'].map((flavor) => ({
        source: `/productos/mateo-${flavor}`,
        destination: `/productos/kombucha-${flavor}`,
        permanent: true,
      })),
      ...['280', '500'].map((size) => ({
        source: `/productos/six-pack-mateo-${size}-ml`,
        destination: `/productos/six-pack-kombucha-${size}-ml`,
        permanent: true,
      })),
      {
        source: '/blog/guia-definitiva-mateo',
        destination: '/blog/guia-definitiva-kombucha',
        permanent: true,
      },
      {
        source: '/blog/que-es-mateo',
        destination: '/blog/que-es-la-kombucha',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
