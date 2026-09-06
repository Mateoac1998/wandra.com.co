'use client';

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';

type AssetKind = 'image' | 'video';

function AssetSlot({ name, kind = 'image', className = '', children, source, alt = '' }: { name: string; kind?: AssetKind; className?: string; children?: ReactNode; source?: string; alt?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<AssetKind>(kind);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = className.includes('hero-bottle') ? 'eager' : 'lazy';
  function applyFile(file?: File) {
    if (!file) return;
    setPreviewKind(file.type.startsWith('video/') ? 'video' : 'image');
    setPreview(URL.createObjectURL(file));
  }
  function dropFile(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); applyFile(event.dataTransfer.files[0]); }
  return <label className={`asset-slot ${preview ? 'has-preview' : ''} ${source ? 'has-source' : ''} ${className}`} data-asset-slot={name} onDragOver={(event) => event.preventDefault()} onDrop={dropFile}>
    <input ref={inputRef} accept={kind === 'video' ? 'video/*' : 'image/*'} className="asset-input" type="file" onChange={(event) => applyFile(event.target.files?.[0])} />
    {preview ? previewKind === 'video' ? <video autoPlay loop muted playsInline src={preview} /> : <img alt="Vista previa cargada" src={preview} decoding="async" /> : source ? <img alt={alt} src={source} loading={loading} decoding="async" /> : <span className="asset-fallback" aria-hidden="true">{children}</span>}
    <span className="asset-caption"><b>{kind === 'video' ? 'VIDEO' : 'IMAGEN'}</b><small>{name}</small><em>Arrastra o selecciona</em></span>
  </label>;
}

const products = [
  { name: 'Café', color: 'mango', mark: '01', image: '/assets/cloudinary-upload/wandra-origin-editorial.webp' },
  { name: 'Jengibre', color: 'wine', mark: '02', image: '/assets/cloudinary-upload/wandra-pack-280-editorial.webp' },
  { name: 'Flor de Jamaica', color: 'earth', mark: '03', image: '/assets/cloudinary-upload/wandra-pack-500-editorial.webp' },
];

export default function Home() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [productStart, setProductStart] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const heroSlides = [['KOMBUCHA', 'VIVA', 'Tu ritual empieza en lo que cultivas.'], ['HECHA', 'DESPACIO', 'Té, fruta, cultivo vivo y tiempo.']];
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
    <div className="shipping-strip"><span>Envíos sin costo desde $120.000</span><span className="shipping-city">Hecho en Colombia · Enviado frío</span></div>
    <header className="site-header"><a className="nav-link" href="/productos">Tienda</a><a className="wordmark brand-logo" href="#inicio" aria-label="Wandra, inicio"><img src="/assets/cloudinary-upload/wandra-logo-web.webp" alt="Wandra" /></a><a className="nav-link nav-bag" href="/blog">Guías <span>↗</span></a></header>
    <section className="hero" id="inicio" aria-label="Presentación de Wandra">
      <div className="hero-copy" key={heroSlide}><p className="eyebrow">Fermentada en Colombia</p><h1>{currentHero[0]}<br /><i>{currentHero[1]}</i></h1><p className="hero-description">{currentHero[2]}</p><a className="button button-dark" href="#sabores">Conoce Wandra</a></div>
      <div className="hero-bottle-stage" aria-label="Packaging Wandra"><span className="hero-sun" /><AssetSlot name="HERO_EDITORIAL · foto de campaña" source="/assets/cloudinary-upload/wandra-hero-editorial.webp" alt="Fotografía editorial de productos Wandra" className="hero-bottle" /><span className="hero-number">0{heroSlide + 1}</span></div>
      <div className="hero-controls"><button aria-label="Slide anterior" type="button" onClick={() => setHeroSlide((heroSlide + heroSlides.length - 1) % heroSlides.length)}>←</button><button aria-label="Slide siguiente" type="button" onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)}>→</button></div>
      <a className="scroll-cue" href="#ritual"><span>DESCUBRE ABAJO</span><i aria-hidden="true" /></a>
    </section>
    <section className="split section-find" id="puntos" data-reveal><div className="find-title"><p className="eyebrow">Encuentra el ritual</p><h2>ENCUENTRA<br /><i>WANDRA</i></h2><span className="drawn-line" /></div><div className="find-copy"><p>Una botella fría cambia el ritmo de cualquier día. Encuentra Wandra cerca de ti o recibe tu ritual en casa.</p><a className="text-link" href="#comprar">Ver puntos de venta <span>↗</span></a></div></section>
    <section className="ritual-section" id="ritual" data-reveal><div className="ritual-video"><AssetSlot name="RITUAL_VIDEO · MP4 vertical o horizontal" kind="video" source="/assets/cloudinary-upload/wandra-origin-editorial.webp" alt="Packaging Wandra de alta resolución; reemplazable por video" className="video-slot"><span className="video-placeholder">01<br /><b>UN SORBO<br />DESPIERTA</b></span></AssetSlot><span className="media-control" aria-hidden="true">Ⅱ</span></div><div className="ritual-stills"><div className="still-copy"><p className="eyebrow">Tu pausa favorita</p><h2>VIVE<br />A TU <i>RITMO</i></h2></div><AssetSlot name="RITUAL_EDITORIAL · escena de consumo" source="/assets/cloudinary-upload/wandra-ritual-editorial.webp" alt="Botellas de Wandra en una escena de desayuno" className="ritual-image"><span className="asset-shape shape-circle" /></AssetSlot><p className="side-note">SABOR QUE<br />SE SIENTE VIVO</p></div></section>
    <section className="origin-section" id="origen" data-reveal><div className="origin-image-wrap"><AssetSlot name="ORIGEN_IMAGEN · fermentación" source="/assets/cloudinary-upload/wandra-origin-editorial.webp" alt="Packaging de Kombucha Wandra" className="origin-image"><span className="asset-shape shape-tall" /></AssetSlot></div><article className="origin-copy"><p className="eyebrow">Nuestro origen</p><h2>EL TIEMPO<br />HACE LA <i>MAGIA</i></h2><p>Dejamos que el té, la fruta y nuestro cultivo vivo encuentren su equilibrio. No hay atajos: hay sabor en cada burbuja.</p><a className="button button-wine" href="#sabores">Conoce el proceso</a></article></section>
    <section className="inside-section" id="dentro" data-reveal><p className="eyebrow">Nada que esconder</p><h2>LO QUE <i>VIVE</i><br />ADENTRO</h2><div className="inside-grid"><div><b>01</b><span>Té<br />de origen</span></div><div><b>02</b><span>Cultivo<br />vivo</span></div><div><b>03</b><span>Fruta<br />real</span></div><div><b>04</b><span>Tiempo<br />preciso</span></div></div></section>
    <section className="flavors-section" id="sabores" data-reveal><div className="flavors-head"><div><p className="eyebrow">Elige tu ritual</p><h2>SABORES<br /><i>WANDRA</i></h2></div><div className="round-controls"><button aria-label="Ver sabor anterior" type="button" onClick={() => nextProduct(-1)}>←</button><button aria-label="Ver sabor siguiente" type="button" onClick={() => nextProduct(1)}>→</button></div></div><div className="flavor-rail" key={productStart} aria-live="polite">{shownProducts.map((product) => <article className={`flavor-card ${product.color}`} key={product.mark}><div className="flavor-side"><span>{product.mark}</span></div><div className="flavor-main"><AssetSlot name={`SABOR_${product.mark} · botella o packshot`} source={product.image} alt={`Kombucha Wandra sabor ${product.name}`} className={`product-slot product-${product.mark}`}><span className="bottle-silhouette" /></AssetSlot><a href="#comprar">Ver presentación</a></div><div className="flavor-stamp">WANDRA<br />KOMBUCHA</div><div className="flavor-info"><p className="flavor-kicker">Kombucha viva</p><p className="flavor-name">{product.name}</p><div className="flavor-sizes"><span><b>280 ml</b><strong>$8.000</strong></span><span><b>500 ml</b><strong>$12.000</strong></span></div><a className="flavor-buy" href="#comprar">Agregar al ritual</a></div></article>)}</div></section>
    <section className="shop-section" id="comprar"><p className="eyebrow">Directo a tu nevera</p><h2>COMPRA EL<br /><i>RITUAL</i></h2><div className="pack-grid">{[['Six pack 280 ml', '$42.000 · 6 botellas de 280 ml', 'PACK_280', '/assets/cloudinary-upload/wandra-pack-280-editorial.webp'], ['Six pack 500 ml', '$58.000 · 6 botellas de 500 ml', 'PACK_500', '/assets/cloudinary-upload/wandra-pack-500-editorial.webp']].map(([title, copy, slot, image], index) => <article className={`pack-card pack-${index + 1}`} key={slot}><AssetSlot name={`${slot} · packshot WebP`} source={image} alt={title} className="pack-image"><span className="pack-graphic">W</span></AssetSlot><h3>{title}</h3><p>{copy}</p><a className="button button-dark" href={index === 0 ? '/productos/six-pack-kombucha-280-ml' : '/productos/six-pack-kombucha-500-ml'}>Ver pack</a></article>)}</div><a className="text-link catalog-link" href="/productos">Ver catálogo completo <span>↗</span></a></section>
    <section className="club-section"><div className="club-copy"><p className="eyebrow">Para los que vuelven</p><h2>RITUAL<br /><i>WANDRA</i></h2><p>Recibe tus sabores favoritos a tu ritmo y descubre ediciones que solo llegan a quienes viven el ritual.</p><a className="button button-yellow" href="#newsletter">Quiero ser parte</a></div><AssetSlot name="COMUNIDAD_IMAGEN · entrega Wandra" source="/assets/cloudinary-upload/wandra-delivery-editorial.webp" alt="Entrega de un ritual Wandra a domicilio" className="club-image"><span className="asset-shape shape-wave" /></AssetSlot></section>
    <footer id="newsletter"><div className="footer-top"><div><a className="wordmark footer-logo brand-logo" href="#inicio" aria-label="Wandra, inicio"><img src="/assets/cloudinary-upload/wandra-logo-web.webp" alt="Wandra" /></a><p>Hecha despacio para los días que se viven despiertos.</p></div><form className="newsletter" onSubmit={(event) => event.preventDefault()}><label htmlFor="email">Recibe lo que está fermentando</label><div><input id="email" type="email" placeholder="Tu correo" /><button type="submit">→</button></div></form></div><div className="footer-links"><div><b>Tienda</b><a href="/productos">Catálogo</a><a href="#comprar">Packs</a></div><div><b>Wandra</b><a href="#origen">El proceso</a><a href="/blog">Guías</a><a href="https://wandra.com.co/contacto/">Contacto</a></div><div><b>Síguenos</b><a href="https://www.instagram.com/wandra_herencia_saludable/">Instagram</a></div><p>Productos, precios y guías organizados para que encuentres lo que buscas con facilidad.</p></div><div className="footer-bottom"><span>© 2026 Wandra</span><span>Políticas y términos próximamente</span></div></footer>
  </main>;
}
