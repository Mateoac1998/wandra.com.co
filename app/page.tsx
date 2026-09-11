'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Leaf, MapPin, ShieldCheck, Snowflake } from 'lucide-react';
import { media } from '@/lib/media';
import { site, whatsappProductUrl, whatsappWholesaleUrl } from '@/lib/site';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/social-icons';

function AssetSlot({ className = '', children, source, alt = '' }: { className?: string; children?: ReactNode; source?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  const loading = className.includes('hero-bottle') ? 'eager' : 'lazy';
  const canRenderSource = Boolean(source) && !failed;
  return <div className={`asset-slot ${canRenderSource ? 'has-source' : ''} ${className}`}>
    {canRenderSource ? <img alt={alt} src={source} loading={loading} decoding="async" fetchPriority={loading === 'eager' ? 'high' : 'auto'} onError={() => setFailed(true)} /> : <span className="asset-fallback" aria-hidden="true">{children}</span>}
  </div>;
}

const products = [
  { name: 'Kombucha Café', color: 'mango', mark: '01', image: media.coffee },
  { name: 'Kombucha de Jengibre', color: 'cocoa', mark: '02', image: media.ginger },
  { name: 'Kombucha Flor de Jamaica', color: 'earth', mark: '03', image: media.pack500 },
];

const trustCards = [
  { title: 'Ingredientes reales', copy: 'Sin azúcar ni aditivos añadidos. Una kombucha de fermentación viva.', Icon: Leaf },
  { title: 'Registro sanitario', copy: 'Registro sanitario INVIMA: RSA-1563-2025 para la línea de kombucha Wandra.', Icon: ShieldCheck },
  { title: 'Envíos nacionales', copy: 'Despachos desde Armenia, Quindío. El envío se confirma en tu cotización.', Icon: MapPin },
  { title: 'Conservación en frío', copy: 'Producto vivo, no pasteurizado. Mantener refrigerado entre 0 y 6 °C.', Icon: Snowflake },
];

const moreToTry = [
  { category: 'Ghee', name: 'Ghee', price: 'Desde $21.000', image: media.ghee },
  { category: 'Aceites naturales', name: 'Aceite de coco', price: 'Desde $30.000', image: media.coconutOil },
  { category: 'Aceites naturales', name: 'Aceite de ajonjolí', price: 'Desde $42.000', image: media.sesameOil },
  { category: 'Bebidas funcionales', name: 'Leche dorada', price: 'Desde $12.000', image: media.goldenMilk },
];

const wholesaleUrl = whatsappWholesaleUrl();

export default function Home() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [productStart, setProductStart] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroSlides = [
    { emphasis: 'Natural para tu bienestar', description: 'Té, fruta y un cultivo vivo: una bebida fermentada hecha despacio en Colombia.' },
    { emphasis: 'Hecha despacio para tu ritual', description: 'Sabor auténtico, ingredientes seleccionados y un momento de pausa para todos los días.' },
  ];
  const currentHero = heroSlides[heroSlide];
  const nextProduct = (direction: number) => setProductStart((current) => (current + direction + products.length) % products.length);
  const shownProducts = [0, 1, 2].map((offset) => products[(productStart + offset) % products.length]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    elements.forEach((element) => observer.observe(element));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <main className={scrolled ? 'is-scrolled' : ''}>
    <div className="shipping-strip"><span>Fermentación viva · Hecha en Colombia</span><span className="shipping-city">Envíos nacionales desde Armenia, Quindío</span></div>
    <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
      <a className="wordmark brand-logo" href="#inicio" aria-label="Wandra, inicio"><img src={media.logo} alt="Wandra" /></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)}>Menú <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></button>
      <nav className="main-navigation" id="main-navigation" aria-label="Navegación principal">
        <a href="/tienda" onClick={() => setMenuOpen(false)}>Tienda</a>
        <a href="#origen" onClick={() => setMenuOpen(false)}>Nuestro origen</a>
        <a href="/productos" onClick={() => setMenuOpen(false)}>La despensa</a>
        <a href="/guias" onClick={() => setMenuOpen(false)}>Guías</a>
        <a href="/mayoristas" onClick={() => setMenuOpen(false)}>Mayoristas / HORECA</a>
      </nav>
      <div className="header-actions"><a href="/mayoristas">B2B / HORECA</a><a href="/tienda" aria-label="Ir a la tienda">Mi bolsa ↗</a></div>
    </header>
    <aside className="social-rail" aria-label="Redes sociales de Wandra">
      <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Visitar Instagram de Wandra"><InstagramIcon /></a>
      <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Visitar Facebook de Wandra"><FacebookIcon /></a>
    </aside>
    <section className="hero kombucha-hero" id="inicio" aria-label="Presentación de Wandra">
      <div className="hero-copy" key={heroSlide}>
        <p className="hero-badge">✦ Kombucha artesanal · Hecha en Colombia</p>
        <h1>Comprar<br />kombucha<br />artesanal:<br /><i>{currentHero.emphasis}</i></h1>
        <p className="hero-description">{currentHero.description}</p>
        <div className="hero-cta"><a className="button button-yellow" href="/tienda">Ver la tienda <span aria-hidden="true">→</span></a><a className="hero-secondary" href={wholesaleUrl}>¿Tienes un negocio? Solicita catálogo</a></div>
      </div>
      <div className="hero-bottle-stage" aria-label="Fotografía editorial de Wandra"><AssetSlot source={media.hero} alt="Productos Wandra en una fotografía editorial" className="hero-bottle" /><span className="hero-number">0{heroSlide + 1}</span></div>
      <div className="hero-controls"><button aria-label="Mensaje anterior" type="button" onClick={() => setHeroSlide((heroSlide + heroSlides.length - 1) % heroSlides.length)}>←</button><button aria-label="Mensaje siguiente" type="button" onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)}>→</button></div>
      <a className="scroll-cue" href="#ritual"><span>Descubre abajo</span><i aria-hidden="true" /></a>
    </section>
    <section className="trust-section" aria-label="Compromisos de Wandra" data-reveal>
      <div className="trust-heading"><p className="eyebrow">Lo que cuidamos</p><h2>HECHO PARA<br /><i>CONFIAR</i></h2></div>
      <div className="trust-grid">
        {trustCards.map(({ title, copy, Icon }) => <article className="trust-card" key={title}>
          <Icon aria-hidden="true" strokeWidth={1.5} />
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>)}
      </div>
    </section>
    <section className="pause-banner" data-reveal>
      <AssetSlot source={media.ritual} alt="Dos kombuchas Wandra listas para compartir" className="pause-image" />
      <div className="pause-copy"><p className="eyebrow">Tu pausa favorita, todos los días</p><h2>Abre.<br />Disfruta.<br /><i>Repite.</i></h2><p>Bien fría, en tu vaso favorito o acompañando una buena conversación. No necesitas una ocasión especial para hacer espacio a lo que te gusta.</p><a className="button pause-button" href="#comprar">Encuentra tu ritual <span aria-hidden="true">↗</span></a></div>
    </section>
    <section className="split section-find" id="puntos" data-reveal><div className="find-title"><p className="eyebrow">Encuentra el ritual</p><h2>ENCUENTRA<br /><i>WANDRA</i></h2><span className="drawn-line" /></div><div className="find-copy"><p>Una botella fría cambia el ritmo de cualquier día. Encuentra Wandra cerca de ti o recibe tu ritual en casa.</p><a className="text-link" href="#comprar">Ver puntos de venta <span>↗</span></a></div></section>
    <section className="ritual-section" id="ritual" data-reveal><div className="ritual-video"><AssetSlot source={media.ritualVideo} alt="Proceso de fermentación de Kombucha Wandra" className="video-slot"><span className="video-placeholder">01<br /><b>UN SORBO<br />DESPIERTA</b></span></AssetSlot></div><div className="ritual-stills"><div className="still-copy"><p className="eyebrow">Tu pausa favorita</p><h2>VIVE<br />A TU <i>RITMO</i></h2><p>Una kombucha fría, una pausa real y el sabor de hacer las cosas despacio.</p></div><AssetSlot source={media.ritual} alt="Kombucha Wandra servida para un momento de pausa" className="ritual-image"><span className="asset-shape shape-circle" /></AssetSlot></div></section>
    <section className="origin-section" id="origen" data-reveal><div className="origin-image-wrap"><AssetSlot source={media.origin} alt="Packaging de Kombucha Wandra" className="origin-image"><span className="asset-shape shape-tall" /></AssetSlot></div><article className="origin-copy"><p className="eyebrow">Nuestro origen</p><h2>EL TIEMPO<br />HACE LA <i>MAGIA</i></h2><p>Dejamos que el té, la fruta y nuestro cultivo vivo encuentren su equilibrio. No hay atajos: hay sabor en cada burbuja.</p><a className="button button-wine" href="#sabores">Conoce el proceso</a></article></section>
    <section className="inside-section" id="dentro" data-reveal><p className="eyebrow">Nada que esconder</p><h2>LO QUE <i>VIVE</i><br />ADENTRO</h2><div className="inside-grid"><div><b>01</b><span>Té<br />de origen</span></div><div><b>02</b><span>Cultivo<br />vivo</span></div><div><b>03</b><span>Fruta, flor,<br />café y jengibre</span></div><div><b>04</b><span>Tiempo<br />preciso</span></div></div></section>
    <section className="flavors-section" id="sabores" data-reveal><div className="flavors-head"><div><p className="eyebrow">Elige tu ritual</p><h2>SABORES<br /><i>WANDRA</i></h2></div><div className="round-controls"><button aria-label="Ver sabor anterior" type="button" onClick={() => nextProduct(-1)}>←</button><button aria-label="Ver sabor siguiente" type="button" onClick={() => nextProduct(1)}>→</button></div></div><div className="flavor-rail" key={productStart} aria-live="polite">{shownProducts.map((product) => <article className={`flavor-card ${product.color}`} key={product.mark}><div className="flavor-side"><span>{product.mark}</span></div><div className="flavor-main"><AssetSlot source={product.image} alt={`Kombucha Wandra sabor ${product.name}`} className={`product-slot product-${product.mark}`}><span className="bottle-silhouette" /></AssetSlot><a href={whatsappProductUrl(product.name)} target="_blank" rel="noreferrer">Consultar por WhatsApp</a></div><div className="flavor-stamp">WANDRA<br />KOMBUCHA</div><div className="flavor-info"><p className="flavor-kicker">Kombucha artesanal</p><p className="flavor-name">{product.name}</p><div className="flavor-sizes"><span><b>280 ml</b><strong>$8.000</strong></span><span><b>500 ml</b><strong>$12.000</strong></span></div><a className="flavor-buy" href={whatsappProductUrl(product.name)} target="_blank" rel="noreferrer">Agregar al ritual</a></div></article>)}</div></section>
    <section className="more-products" aria-label="Otros productos Wandra" data-reveal><div className="more-products-head"><h2>Hay mucho más<br /><i>por probar.</i></h2><p>Del primer sorbo a tu receta favorita.<br />Ingredientes para darle vida a tu mesa.</p></div><div className="more-products-grid">{moreToTry.map((product) => <a href={whatsappProductUrl(product.name)} target="_blank" rel="noreferrer" className="more-product-card" key={product.name} aria-label={`Consultar ${product.name} por WhatsApp`}><span className="more-product-image"><img src={product.image} alt={product.name} loading="lazy" /></span><span className="more-product-category">{product.category}</span><strong>{product.name}</strong><small>{product.price}</small><b aria-hidden="true">↗</b></a>)}</div><a className="button more-products-cta" href="/productos">Abrir la despensa <span aria-hidden="true">↗</span></a></section>
    <section className="shop-section" id="comprar"><p className="eyebrow">Directo a tu nevera</p><h2>COMPRA EL<br /><i>RITUAL</i></h2><div className="pack-grid">{[['Six pack de Kombucha 280 ml', '$42.000 · 6 botellas de 280 ml', 'PACK_280', media.pack280, '6 botellas de 280 ml'], ['Six pack de Kombucha 500 ml', '$62.000 · 6 botellas de 500 ml', 'PACK_500', media.pack500, '6 botellas de 500 ml']].map(([title, copy, slot, image, presentation], index) => <article className={`pack-card pack-${index + 1}`} key={slot}><AssetSlot source={image} alt={title} className="pack-image"><span className="pack-graphic">W</span></AssetSlot><h3>{title}</h3><p>{copy}</p><a className="button button-dark" href={whatsappProductUrl(title, presentation)} target="_blank" rel="noreferrer">Pedir por WhatsApp</a></article>)}</div><a className="text-link catalog-link" href="/productos">Ver catálogo completo <span>↗</span></a></section>
    <section className="share-pack" data-reveal><div className="share-pack-copy"><p className="eyebrow">Mejor cuando se comparte</p><h2>Seis razones<br />para decir<br /><i>¡salud!</i></h2><p>Para compartir, regalar o tener tu nevera lista. Tu ritual favorito, en un six pack.</p><div><a className="button share-primary" href={whatsappProductUrl('Six pack de Kombucha 280 ml', '6 botellas de 280 ml')} target="_blank" rel="noreferrer">Six pack 280 ml · $42.000 <span aria-hidden="true">↗</span></a><a className="share-secondary" href={whatsappProductUrl('Six pack de Kombucha 500 ml', '6 botellas de 500 ml')} target="_blank" rel="noreferrer">También en 500 ml · $62.000 →</a></div></div><AssetSlot source={media.pack280} alt="Six pack de Kombucha Wandra para compartir" className="share-pack-image" /></section>
    <section className="business-section" id="mayoristas" data-reveal>
      <div className="business-copy"><p className="eyebrow">Servicio para negocios · B2B</p><h2>Llevar Wandra a tu<br /><i>Restaurante,<br className="mobile-break" /> Café o Hotel</i></h2><p>Kombucha artesanal para carta, vitrina y venta directa. Te orientamos según tu ciudad, volumen y operación.</p><div className="business-benefits"><div><b>◫</b><span><strong>Botellas para tu negocio</strong><small>280 ml, 500 ml y 1.000 ml disponibles. La presentación de 750 ml está próxima a disponibilidad.</small></span></div><div><b>◌</b><span><strong>Tap System bajo consulta</strong><small>Si buscas servicio por copa, confirmamos contigo la disponibilidad vigente y sus condiciones.</small></span></div></div><div className="business-actions"><a className="button business-whatsapp" href={wholesaleUrl} target="_blank" rel="noreferrer">Contactar asesor B2B por WhatsApp</a><a className="button business-email" href={`mailto:${site.email}?subject=Solicitud%20cat%C3%A1logo%20mayorista`}>Solicitar por correo</a></div></div>
      <div className="business-offer"><section><h3>Formatos de distribuidor</h3><div className="business-pills"><span>280 ml</span><span>500 ml</span><span>1.000 ml</span><span>750 ml próximamente</span></div><h3>Condiciones confirmadas</h3><div className="business-pills"><span>3–5 días hábiles</span><span>0–6 °C</span><span>Vida útil: 4 meses</span></div><div className="business-note"><h3>Precio y disponibilidad, claros</h3><p>Consulta la lista vigente de precios mayoristas y recibe una cotización para tu negocio.</p><a className="text-link" href="/mayoristas#catalogo">Ver formatos y precios <span>↗</span></a></div></section></div>
    </section>
    <section className="club-section"><div className="club-copy"><p className="eyebrow">Para los que vuelven</p><h2>RITUAL<br /><i>WANDRA</i></h2><p>Recibe tus sabores favoritos a tu ritmo y descubre ediciones que solo llegan a quienes viven el ritual.</p><a className="button button-yellow" href="#newsletter">Quiero ser parte</a></div><AssetSlot source={media.delivery} alt="Entrega de un ritual Wandra a domicilio" className="club-image"><span className="asset-shape shape-wave" /></AssetSlot></section>
    <footer id="newsletter"><div className="footer-top"><div><a className="wordmark footer-logo brand-logo" href="#inicio" aria-label="Wandra, inicio"><img src={media.logo} alt="Wandra" /></a><p>Hecha despacio para los días que se viven despiertos.</p></div><form className="newsletter" onSubmit={(event) => event.preventDefault()}><label htmlFor="email">Recibe lo que está fermentando</label><div><input id="email" type="email" placeholder="Tu correo" /><button type="submit">→</button></div></form></div><div className="footer-links"><div><b>Tienda</b><a href="/tienda">Catálogo</a><a href="/productos">Todos los productos</a><a href="/mayoristas">Mayoristas</a></div><div><b>Wandra</b><a href="/nosotros">Nosotros</a><a href="#origen">El proceso</a><a href="/contacto">Contacto</a><span>{site.location}</span></div><div><b>Guías</b><a href="/guias">Blog</a><a href="/preguntas-frecuentes">Preguntas frecuentes</a><a href="/politicas">Políticas</a></div><div className="footer-social"><b>Redes sociales</b><a href={site.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={site.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={site.tiktok} target="_blank" rel="noreferrer">TikTok ↗</a><a href={site.pinterest} target="_blank" rel="noreferrer">Pinterest ↗</a></div><p>Productos, guías y el origen de Wandra, reunidos para acompañar tu ritual.</p></div><div className="footer-bottom"><span>© 2026 Wandra</span><a href="/politicas">Políticas, términos y envíos</a></div></footer>
    <a className="whatsapp-float" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Escribir a Wandra por WhatsApp"><WhatsAppIcon /></a>
  </main>;
}

