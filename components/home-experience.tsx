'use client';

import MediaImage from '@/components/media-image';

import Link from 'next/link';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { media } from '@/lib/media';
import { type Product } from '@/lib/catalog';
import { BuyProduct } from '@/components/storefront';

const heroSlides = [
  {
    color: 'gold',
    label: 'Kombucha artesanal · Hecha en Colombia',
    first: 'Dale vida',
    second: 'a tu día.',
    text: 'Una pausa rica. Un sorbo vivo. Descubre tu próximo ritual favorito.',
    image: media.hero,
    name: 'Un ritual con mucho sabor',
    href: '#sabores',
  },
  {
    color: 'berry',
    label: 'Flor de Jamaica · Café · Jengibre',
    first: 'Lo natural',
    second: 'se disfruta.',
    text: 'Tres sabores, muchas formas de hacer de lo cotidiano algo extraordinario.',
    image: media.ritual,
    name: 'Encuentra tu sabor',
    href: '#sabores',
  },
  {
    color: 'ocean',
    label: 'Kombucha, ghee, aceites y mucho más',
    first: 'Tu despensa,',
    second: 'más viva.',
    text: 'Pequeñas elecciones, grandes momentos. Hay todo un mundo Wandra por descubrir.',
    image: media.origin,
    name: 'Explora la despensa',
    href: '#despensa',
  },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true);
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slide = heroSlides[active];
  const change = (direction: number) =>
    setActive((i) => (i + direction + heroSlides.length) % heroSlides.length);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    const timer = window.setInterval(() => {
      if (
        !document.hidden &&
        (section.current?.getBoundingClientRect().bottom ?? 0) > 0
      )
        setActive((i) => (i + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);
  useEffect(() => {
    if (paused) video.current?.pause();
    else video.current?.play().catch(() => setPaused(true));
  }, [paused, active]);
  return (
    <section
      ref={section}
      className={`new-hero theme-${slide.color}`}
      id="inicio"
      aria-label="Descubre Wandra"
      aria-roledescription="carrusel"
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (touch.current) {
          const dx = touch.current.x - e.changedTouches[0].clientX;
          const dy = touch.current.y - e.changedTouches[0].clientY;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) change(dx > 0 ? 1 : -1);
        }
        touch.current = null;
      }}
    >
      <div className="hero-rings" aria-hidden="true" />
      <div className="hero-layout">
        <div className="new-hero-copy" aria-live={paused ? 'polite' : 'off'}>
          <p className="eyebrow">{slide.label}</p>
          <h1 key={active}>
            {slide.first}
            <br />
            <em>{slide.second}</em>
          </h1>
          <p className="hero-intro">{slide.text}</p>
          <Link prefetch={false} className="button hero-cta" href={slide.href}>
            {active === 2 ? 'Explorar productos' : 'Encuentra tu sabor'}
            <ArrowUpRight size={20} />
          </Link>
          <div className="hero-footnote">
            <span>✳</span> Cultivamos tiempo. Compartimos vida.
          </div>
        </div>
        <div className="hero-art" data-parallax="hero">
          <div className="hero-orbit" aria-hidden="true">
            <span>HECHO CON CALMA · DISFRÚTALO A TU RITMO · </span>
          </div>
          <div className="hero-photo-wrap" key={slide.color}>
            {media.hero.video && active === 0 ? (
              <video
                ref={video}
                src={media.hero.video}
                poster={slide.image.src}
                muted
                loop
                playsInline
                preload="none"
                className="hero-photo"
              />
            ) : (
              <MediaImage
                src={
                  active === 0 && media.hero.cutout
                    ? media.hero.cutout
                    : slide.image.src
                }
                alt={slide.image.alt}
                width="1672"
                height="941"
                fetchPriority={active === 0 ? 'high' : 'auto'}
                className={`hero-photo ${active === 0 && media.hero.cutout ? 'is-cutout' : ''}`}
              />
            )}
            <div className="photo-caption">
              <span>WANDRA / HERENCIA SALUDABLE</span>
              <span>0{active + 1}</span>
            </div>
          </div>
          <div className="hero-sticker" aria-hidden="true">
            SABOR
            <br />
            <em>vivo</em>
            <span>DESDE EL ORIGEN</span>
          </div>
          <span className="floating-type" aria-hidden="true">
            ¡Qué rico
            <br />
            sentirse bien!
          </span>
        </div>
      </div>
      <div className="hero-bottom">
        <Link prefetch={false} href="#origen" className="discover">
          Sigue la buena vibra <ArrowDown size={17} />
        </Link>
        <div className="slide-controls">
          <button
            className="icon-button"
            aria-label="Diapositiva anterior"
            onClick={() => change(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="slide-dots">
            {heroSlides.map((s, i) => (
              <button
                key={s.color}
                aria-label={`Ver ${s.name}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button
            className="icon-button"
            aria-label="Diapositiva siguiente"
            onClick={() => change(1)}
          >
            <ArrowRight size={18} />
          </button>
          <button
            className="icon-button play-toggle"
            aria-label={
              paused ? 'Activar cambio automático' : 'Pausar cambio automático'
            }
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      </div>
    </section>
  );
}

export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [
      ...document.querySelectorAll<HTMLElement>('[data-reveal]'),
    ];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach((el) => {
      el.classList.add('motion-ready');
      observer.observe(el);
    });
    const layers = [
      ...document.querySelectorAll<HTMLElement>('[data-parallax]'),
    ];
    let frame = 0;
    const update = () => {
      frame = 0;
      layers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
          const p = reduce.matches
            ? 0
            : Math.max(
                -1,
                Math.min(
                  1,
                  (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
                    window.innerHeight,
                ),
              );
          el.style.setProperty('--travel', `${p * 65}px`);
          el.style.setProperty('--turn', `${p * 30}deg`);
        }
      });
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
    };
  }, []);
  return null;
}

export function FlavorCarousel({ products }: { products: Product[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);
  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'center', loop: true, duration: 35 }}
      className="flavor-carousel"
      aria-label="Sabores y packs Wandra"
    >
      <CarouselContent className="flavor-track">
        {products.map((product, i) => (
          <CarouselItem
            key={product.slug}
            className={`flavor-slide ${selected === i ? 'is-active' : ''}`}
            aria-label={`${i + 1} de ${products.length}: ${product.name}`}
          >
            <article className="flavor-product">
              <Link
                prefetch={false}
                href={`/productos/${product.slug}`}
                className={`flavor-picture flavor-tone-${i}`}
                style={{ '--tilt': `${i % 2 ? 4 : -4}deg` } as CSSProperties}
              >
                <span className="product-index">W / 0{i + 1}</span>
                <MediaImage
                  src={product.image}
                  alt={product.name}
                  width="560"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />
                <span className="flavor-photo-label">
                  {product.slug.startsWith('six')
                    ? 'PARA COMPARTIR'
                    : 'CULTIVO VIVO'}
                </span>
              </Link>
              <div className="flavor-description">
                <p className="eyebrow">
                  {product.slug.startsWith('six')
                    ? 'El combo de la felicidad'
                    : 'Kombucha artesanal'}
                </p>
                <h3>
                  <Link prefetch={false} href={`/productos/${product.slug}`}>
                    {product.name
                      .replace('Kombucha de ', '')
                      .replace('Kombucha ', '')
                      .replace('Six pack de ', 'Six pack ')}
                  </Link>
                </h3>
                <p>{product.description}</p>
                <BuyProduct product={product} compact />
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Producto anterior"
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeft />
        </button>
        <span aria-live="polite">
          {String(selected + 1).padStart(2, '0')}{' '}
          <span className="muted">
            / {String(products.length).padStart(2, '0')}
          </span>
        </span>
        <button
          className="icon-button"
          aria-label="Producto siguiente"
          onClick={() => api?.scrollNext()}
        >
          <ArrowRight />
        </button>
      </div>
    </Carousel>
  );
}

export function Faq({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  return (
    <Accordion className="home-faq" multiple>
      {questions.map((q, i) => (
        <AccordionItem key={q.question} value={i}>
          <AccordionTrigger>{q.question}</AccordionTrigger>
          <AccordionContent>{q.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
