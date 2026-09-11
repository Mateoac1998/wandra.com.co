export const SITE_URL = 'https://wandra.com.co';

import { media } from '@/lib/media';

export const site = {
  name: 'Wandra Herencia Saludable',
  shortName: 'Wandra',
  description: 'Compra kombucha artesanal en Colombia. Bebida fermentada, hecha en el Quindío y enviada a todo el país.',
  instagram: 'https://www.instagram.com/wandra_herencia_saludable/',
  facebook: process.env.NEXT_PUBLIC_WANDRA_FACEBOOK_URL || 'https://www.facebook.com/WandraHerenciaSaludable',
  tiktok: 'https://www.tiktok.com/@wandra_saludable',
  pinterest: 'https://co.pinterest.com/herenciawandrama/?actingBusinessId=1144899673929169193',
  whatsapp: process.env.NEXT_PUBLIC_WANDRA_WHATSAPP_URL || 'https://wa.me/573214320429',
  email: 'Herenciawandra.ma@gmail.com',
  location: 'Armenia, Quindío, Colombia',
  logo: media.logo,
};

export function whatsappUrl(message: string) {
  if (!site.whatsapp) return '/contacto';
  const url = new URL(site.whatsapp);
  url.searchParams.set('text', message);
  return url.toString();
}

export function whatsappProductUrl(productName: string, presentation?: string) {
  const product = presentation ? `${productName} (${presentation})` : productName;
  return whatsappUrl(`Hola, estoy interesado(a) en ${product}. ¿Me comparten disponibilidad y cómo puedo comprarlo?`);
}

export function whatsappWholesaleUrl() {
  return whatsappUrl('Hola, quiero solicitar el catálogo mayorista de kombucha Wandra. Mi negocio es: ___, estoy en: ___ y me interesan estas presentaciones: ___.');
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
