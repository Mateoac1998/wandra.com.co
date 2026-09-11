import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kombucha mayorista para restaurantes, cafés y hoteles | Wandra',
  description: 'Kombucha artesanal mayorista en Colombia para restaurantes, cafés, hoteles y tiendas saludables. Botellas y opciones de Tap System.',
  alternates: { canonical: '/mayoristas' },
};

export default function MayoristasPage() {
  const catalogUrl = site.whatsapp || '/contacto';
  const externalCatalog = Boolean(site.whatsapp);
  return <main className="content-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Kombucha para negocios</p><h1>KOMBUCHA PARA<br /><i>TU NEGOCIO</i></h1><p>Una propuesta de kombucha artesanal para restaurantes, cafés, hoteles y tiendas saludables en Colombia.</p></header>
    <article className="article-body">
      <section><p className="eyebrow">Alianzas</p><h2>PRODUCTOS PARA COMPARTIR</h2><p>Te acompañamos a encontrar presentaciones y productos acordes a tu operación. Cuéntanos sobre tu proyecto, ciudad, volumen y el tipo de selección que buscas.</p></section>
      <section id="catalogo"><p className="eyebrow">Formatos</p><h2>BOTELLAS Y TAP SYSTEM</h2><p>Disponemos de botellas para carta, vitrina y venta directa. Para establecimientos con servicio por copa, conversemos sobre disponibilidad de barriles para sistemas de presión.</p></section>
      <a className="button button-wine" href={catalogUrl} target={externalCatalog ? '_blank' : undefined} rel={externalCatalog ? 'noreferrer' : undefined}>Solicitar catálogo mayorista por WhatsApp</a>
    </article>
  </main>;
}
