import type { Metadata } from 'next';
import { formatCOP } from '@/lib/catalog';
import { site, whatsappWholesaleUrl } from '@/lib/site';
import { wholesaleFlavors, wholesalePresentations, wholesaleTerms } from '@/lib/wholesale';

export const metadata: Metadata = {
  title: 'Kombucha mayorista para restaurantes, cafés y hoteles | Wandra',
  description: 'Kombucha artesanal mayorista en Colombia para restaurantes, cafés, hoteles y tiendas saludables. Consulta formatos, precios y condiciones para negocios.',
  alternates: { canonical: '/mayoristas' },
};

export default function MayoristasPage() {
  const catalogUrl = whatsappWholesaleUrl();

  return <main className="content-page wholesale-page">
    <header className="article-header">
      <a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a>
      <p className="eyebrow">Kombucha para negocios</p>
      <h1>KOMBUCHA PARA<br /><i>TU NEGOCIO</i></h1>
      <p>Botellas de kombucha artesanal para restaurantes, cafés, hoteles y tiendas saludables en Colombia. Producida en Armenia, Quindío.</p>
    </header>
    <article className="article-body wholesale-body">
      <section>
        <p className="eyebrow">Alianzas B2B</p>
        <h2>UNA CARTA CON<br />SABOR PROPIO</h2>
        <p>Cuéntanos sobre tu negocio, ciudad, volumen y selección que buscas. Te orientamos sobre sabores, formatos y condiciones de pedido.</p>
      </section>

      <section aria-labelledby="sabores-mayoristas">
        <p className="eyebrow">Sabores confirmados</p>
        <h2 id="sabores-mayoristas">CINCO FORMAS<br />DE SERVIR WANDRA</h2>
        <ul className="wholesale-flavors">
          {wholesaleFlavors.map((flavor) => <li key={flavor.name}>{flavor.name}</li>)}
        </ul>
      </section>

      <section id="catalogo" aria-labelledby="precios-mayoristas">
        <p className="eyebrow">Lista para distribuidores</p>
        <h2 id="precios-mayoristas">FORMATOS Y<br />PRECIOS</h2>
        <div className="wholesale-table-wrap">
          <table className="wholesale-table">
            <thead><tr><th>Presentación</th><th>Distribuidor</th><th>PVP sugerido</th><th>Margen</th></tr></thead>
            <tbody>{wholesalePresentations.map((item) => <tr key={item.label}>
              <td>{item.label}{item.availability === 'coming-soon' && <small>Próximamente</small>}</td>
              <td>{formatCOP(item.distributorPrice)}</td>
              <td>{formatCOP(item.suggestedRetailPrice)}</td>
              <td>{item.distributorMargin}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="wholesale-disclaimer">Valores por unidad para distribuidor, IVA incluido. El PVP es sugerido. {wholesaleTerms.priceValidity}</p>
      </section>

      <section className="wholesale-conditions" aria-labelledby="condiciones-comerciales">
        <p className="eyebrow">Condiciones comerciales</p>
        <h2 id="condiciones-comerciales">LO CLARO, DESDE<br />EL PRINCIPIO</h2>
        <dl>
          <div><dt>Entrega</dt><dd>{wholesaleTerms.deliveryEstimate}</dd></div>
          <div><dt>Pago</dt><dd>{wholesaleTerms.payment}</dd></div>
          <div><dt>Conservación</dt><dd>{wholesaleTerms.storage} Producto vivo, no pasteurizado.</dd></div>
          <div><dt>Vida útil</dt><dd>{wholesaleTerms.shelfLife}</dd></div>
          <div><dt>Devoluciones</dt><dd>{wholesaleTerms.returns}</dd></div>
          <div><dt>Registro sanitario</dt><dd>Registro sanitario INVIMA: {wholesaleTerms.sanitaryRegistration}</dd></div>
        </dl>
      </section>

      <section>
        <p className="eyebrow">Tap System</p>
        <h2>¿SERVICIO EN<br />GRIFO?</h2>
        <p>Si tu establecimiento busca servir kombucha por copa, escríbenos. Confirmaremos la disponibilidad vigente y las condiciones del Tap System para tu operación.</p>
      </section>

      <a className="button button-wine" href={catalogUrl} target="_blank" rel="noreferrer">Solicitar catálogo mayorista por WhatsApp</a>
      <a className="wholesale-email" href={`mailto:${site.email}?subject=Solicitud%20cat%C3%A1logo%20mayorista`}>O escríbenos a {site.email}</a>
    </article>
  </main>;
}
