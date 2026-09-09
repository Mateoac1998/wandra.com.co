import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Wandra',
  description: 'Ponte en contacto con Wandra.',
  alternates: { canonical: '/contacto' },
};

export default function ContactoPage() {
  return <main className="content-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Hablemos</p><h1>ESTAMOS<br /><i>CERCA</i></h1><p>Para dudas sobre productos, pedidos o alianzas, escríbenos por nuestro canal verificado de Instagram.</p></header>
    <article className="article-body">
      <section><p className="eyebrow">Redes sociales</p><h2>ENCUÉNTRANOS EN INSTAGRAM</h2><p>Comparte tus preguntas o cuéntanos qué estás buscando. Te responderemos desde el perfil oficial de Wandra.</p></section>
      <a className="button button-wine" href="https://www.instagram.com/wandra_herencia_saludable/" target="_blank" rel="noreferrer">Abrir Instagram</a>
    </article>
  </main>;
}
