import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mayoristas | Wandra',
  description: 'Conoce las opciones mayoristas de Wandra para tu negocio.',
  alternates: { canonical: '/mayoristas' },
};

export default function MayoristasPage() {
  return <main className="content-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Wandra para negocios</p><h1>LLEVA EL RITUAL<br /><i>A TU ESPACIO</i></h1><p>Si tienes una tienda, café, restaurante o proyecto de bienestar, hablemos sobre una selección de Wandra para tus clientes.</p></header>
    <article className="article-body">
      <section><p className="eyebrow">Alianzas</p><h2>PRODUCTOS PARA COMPARTIR</h2><p>Te acompañamos para encontrar presentaciones y productos acordes a tu negocio. Cuéntanos sobre tu proyecto, ciudad y el tipo de selección que buscas.</p></section>
      <a className="button button-wine" href="https://www.instagram.com/wandra_herencia_saludable/" target="_blank" rel="noreferrer">Escríbenos por Instagram</a>
    </article>
  </main>;
}
