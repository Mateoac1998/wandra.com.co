export const SITE_URL = 'https://wandra.com.co';

export const site = {
  name: 'Wandra Herencia Saludable',
  shortName: 'Wandra',
  description: 'Mateo, ghee, mantequillas y alimentos naturales hechos en Colombia.',
  instagram: 'https://www.instagram.com/wandra_herencia_saludable/',
  logo: `${SITE_URL}/assets/cloudinary-upload/wandra-logo-web.webp`,
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
