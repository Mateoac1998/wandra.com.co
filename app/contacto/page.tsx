import type { Metadata } from 'next';
import { site, whatsappWholesaleUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contacto | Wandra',
  description: 'Ponte en contacto con Wandra.',
  alternates: { canonical: '/contacto' },
};

export default function ContactoPage() {
  return <main className="content-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Hablemos</p><h1>ESTAMOS<br /><i>CERCA</i></h1><p>Para dudas sobre productos, pedidos o alianzas, escríbenos por WhatsApp, correo o redes sociales.</p></header>
    <article className="article-body">
      <section><p className="eyebrow">Canales oficiales</p><h2>HABLEMOS DE<br />TU PEDIDO</h2><p>Estamos en {site.location}. Para compra directa, disponibilidad o una cotización, escríbenos al WhatsApp {site.whatsapp.replace('https://wa.me/57', '')} o a {site.email}.</p></section>
      <div className="contact-actions"><a className="button button-wine" href={site.whatsapp} target="_blank" rel="noreferrer">Escribir por WhatsApp</a><a className="button button-dark" href={`mailto:${site.email}`}>Enviar correo</a><a className="text-link" href={whatsappWholesaleUrl()} target="_blank" rel="noreferrer">¿Tienes un negocio? Solicita catálogo mayorista <span>↗</span></a></div>
    </article>
  </main>;
}
