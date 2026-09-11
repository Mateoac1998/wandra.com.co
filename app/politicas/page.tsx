import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Políticas, términos y envíos | Wandra',
  description: 'Consulta las políticas de envíos, cambios, devoluciones, privacidad y términos de Wandra.',
  alternates: { canonical: '/politicas' },
};

export default function PoliticasPage() {
  return <main className="content-page legal-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Información para comprar</p><h1>POLÍTICAS Y<br /><i>CONDICIONES</i></h1><p>Información clara sobre pedidos, envíos, cambios, devoluciones y tratamiento de datos en Wandra.</p></header>
    <article className="article-body legal-body">
      <section id="envios"><p className="eyebrow">Envíos</p><h2>DESPACHOS NACIONALES</h2><p>Wandra realiza despachos nacionales desde Armenia, Quindío. El valor del envío y el tiempo final de entrega se confirman en la cotización, según destino, cobertura y condiciones del pedido. En pedidos para negocios, el tiempo estimado inicia tras la confirmación del pedido.</p></section>
      <section id="cambios"><p className="eyebrow">Cambios y devoluciones</p><h2>REVISAMOS CADA CASO</h2><p>Si recibes un producto defectuoso, repórtalo dentro de las 48 horas siguientes a la entrega por WhatsApp o correo. Incluye fotografías, número de pedido y una descripción del caso para que podamos revisarlo contigo.</p></section>
      <section id="conservacion"><p className="eyebrow">Conservación</p><h2>MANTÉN EL FRÍO</h2><p>La kombucha debe conservarse refrigerada entre 0 y 6 °C. Es un producto vivo, no pasteurizado. La vida útil indicada para la línea de kombucha es de 4 meses desde la fecha de elaboración, siempre refrigerada.</p></section>
      <section id="terminos"><p className="eyebrow">Términos de compra</p><h2>ANTES DE CONFIRMAR</h2><p>La disponibilidad, presentación, precio final y costo de envío se confirman directamente antes de cada pedido. Los precios mayoristas y el PVP sugerido se rigen por la vigencia del catálogo disponible al momento de la cotización.</p></section>
      <section id="privacidad"><p className="eyebrow">Tratamiento de datos</p><h2>USAMOS SOLO LO NECESARIO</h2><p>Los datos que compartes al escribirnos se usan para responder tu solicitud, elaborar una cotización, coordinar el pedido y brindar atención posterior. Puedes solicitar la actualización o eliminación de tu información escribiendo a {site.email}.</p></section>
      <section><p className="eyebrow">Contacto</p><h2>¿NECESITAS AYUDA?</h2><p>Escríbenos a {site.email} o por WhatsApp al 321 432 0429.</p></section>
    </article>
  </main>;
}
