import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros | Wandra',
  description: 'Conoce el origen y la forma de hacer de Wandra.',
  alternates: { canonical: '/nosotros' },
};

export default function NosotrosPage() {
  return <main className="content-page">
    <header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Nuestro origen</p><h1>HECHO CON<br /><i>TIEMPO</i></h1><p>Wandra nace del respeto por los ingredientes, los procesos lentos y los rituales cotidianos que se disfrutan mejor sin prisa.</p></header>
    <article className="article-body">
      <section><p className="eyebrow">La forma de hacer</p><h2>EL TIEMPO HACE LA MAGIA</h2><p>Seleccionamos ingredientes y dejamos que cada proceso encuentre su ritmo. Así construimos productos para acompañar momentos reales, desde una comida hasta una pausa en medio del día.</p></section>
      <section><p className="eyebrow">Herencia saludable</p><h2>DE COLOMBIA PARA TU RITUAL</h2><p>Buscamos una relación más cercana con lo que consumimos: información clara, sabores honestos y decisiones que se sientan bien en la rutina.</p></section>
      <a className="button button-wine" href="/tienda">Conoce la tienda</a>
    </article>
  </main>;
}
