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
  logo: media.logo,
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
