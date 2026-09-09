export const SITE_URL = 'https://wandra.com.co';

import { media } from '@/lib/media';

export const site = {
  name: 'Wandra Herencia Saludable',
  shortName: 'Wandra',
  description: 'Kombucha, ghee, mantequillas y alimentos naturales hechos en Colombia.',
  instagram: 'https://www.instagram.com/wandra_herencia_saludable/',
  logo: media.logo,
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

