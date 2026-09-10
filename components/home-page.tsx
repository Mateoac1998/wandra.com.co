import MediaImage from '@/components/media-image';

import Link from 'next/link';

import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  Hero,
  Motion,
  FlavorCarousel,
  Faq,
} from '@/components/home-experience';
import { products, formatCOP } from '@/lib/catalog';
import { articles } from '@/lib/blog';
import { media } from '@/lib/media';

const questions = [
  {
    question: '¿Qué es la kombucha?',
    answer:
      'Es una bebida fermentada elaborada con té endulzado y un cultivo vivo llamado SCOBY. Tiene un sabor ligeramente ácido y burbujas naturales. En Wandra la encuentras en sabores Café, Jengibre y Flor de Jamaica.',
  },
  {
    question: '¿Cómo debo conservarla?',
    answer:
      'Mantén la kombucha refrigerada. Consulta la etiqueta para conocer la fecha de consumo, los ingredientes y las recomendaciones de cada presentación.',
  },
  {
    question: '¿Qué tamaños y precios tienen?',
    answer:
      'Las botellas de kombucha de 280 ml cuestan $8.000 y las de 500 ml, $12.000. El six pack de 280 ml cuesta $42.000 y el de 500 ml, $58.000. Los valores están expresados en pesos colombianos; el envío se confirma por separado.',
  },
  {
    question: '¿Qué más puedo encontrar en Wandra?',
    answer:
      'Además de kombucha, nuestra despensa incluye ghee, aceites de coco, ajonjolí y macadamia, mantequillas de nueces, tahini y leche dorada. Puedes consultar cada presentación en el catálogo.',
  },
];
const pantry = [
  'ghee',
  'aceite-de-coco',
  'mantequilla-de-almendra',
  'leche-dorada',
].map((slug) => products.find((p) => p.slug === slug)!);

export default function Home() {
  return (
    <main id="contenido">
      <Motion />
      <Hero />
      <div
        className="marquee"
        aria-label="Kombucha artesanal, hecha en Colombia, a tu ritmo"
      >
        <div className="marquee-track" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              CULTIVO VIVO <b>✳</b> HECHA EN COLOMBIA <b>✳</b> A TU RITMO{' '}
              <b>✳</b> SABOR DE VERDAD <b>✳</b>
            </span>
          ))}
        </div>
      </div>
      <section className="good-inside" id="origen">
        <div className="origin-top">
          <span className="eyebrow">01 / Nuestro origen</span>
          <span className="eyebrow">Lo natural tiene su propio ritmo</span>
        </div>
        <div className="ingredient-stage" data-parallax="orbit">
          <div className="ingredient-ring" aria-hidden="true">
            <svg viewBox="0 0 600 600">
              <defs>
                <path
                  id="ring-type"
                  d="M300,300 m-265,0 a265,265 0 1,1 530,0 a265,265 0 1,1 -530,0"
                />
              </defs>
              <text>
                <textPath
                  href="#ring-type"
                  textLength="1640"
                  lengthAdjust="spacing"
                >
                  TÉ DE ORIGEN ✳ CULTIVO VIVO ✳ FRUTA ✳ TIEMPO ✳{' '}
                </textPath>
              </text>
            </svg>
          </div>
          <h2 data-reveal>
            Lo bueno
            <br />
            viene de
            <br />
            <em>adentro.</em>
          </h2>
          <div className="orbit-photo photo-left" data-parallax="photo">
            <MediaImage
              src={media.ritual.src}
              alt={media.ritual.alt}
              width="450"
              height="560"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="orbit-photo photo-right" data-parallax="photo">
            <MediaImage
              src={media.origin.src}
              alt={media.origin.alt}
              width="450"
              height="560"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="orbit-star" aria-hidden="true">
            ✳
          </span>
        </div>
        <div className="origin-bottom" data-reveal>
          <p>
            Dejamos que el té, la fruta y nuestro cultivo vivo hagan su magia.
            Sin afán. Porque las cosas buenas necesitan tiempo.
          </p>
          <Link
            prefetch={false}
            className="underlined-link"
            href="/blog/que-es-la-kombucha"
          >
            Conoce lo que estás tomando <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section className="flavors" id="sabores">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">02 / Encuentra tu favorito</p>
          <h2>
            Todos tenemos
            <br />
            <em>un lado delicioso.</em>
          </h2>
          <p>Elige tu sabor. Nosotros ponemos las burbujas.</p>
        </div>
        <FlavorCarousel
          products={products.filter((p) => p.category === 'Kombucha')}
        />
        <div className="center-link">
          <Link prefetch={false} className="underlined-link" href="/productos">
            Ver todo el catálogo <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section className="ritual-story" id="ritual">
        <div className="story-image" data-parallax="photo">
          <MediaImage
            src={media.ritual.src}
            alt={media.ritual.alt}
            width="1100"
            height="1000"
            loading="lazy"
            decoding="async"
          />
          <span className="image-note">LA VIDA SABE MEJOR SIN AFÁN.</span>
        </div>
        <div className="story-copy" data-reveal>
          <p className="eyebrow">Tu pausa favorita, todos los días</p>
          <h2>
            Abre.
            <br />
            Disfruta.
            <br />
            <em>Repite.</em>
          </h2>
          <p>
            Bien fría, en tu vaso favorito o acompañando una buena conversación.
            No necesitas una ocasión especial para hacer espacio a lo que te
            gusta.
          </p>
          <Link prefetch={false} className="button" href="#sabores">
            Encuentra tu ritual <ArrowUpRight size={19} />
          </Link>
          <span className="story-spark" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      <section className="pantry" id="despensa">
        <div className="section-heading horizontal" data-reveal>
          <div>
            <p className="eyebrow">03 / La despensa Wandra</p>
            <h2>
              Hay mucho más
              <br />
              <em>por probar.</em>
            </h2>
          </div>
          <p>
            Del primer sorbo a tu receta favorita.
            <br />
            Ingredientes para darle vida a tu mesa.
          </p>
        </div>
        <div className="pantry-grid">
          {pantry.map((product, i) => (
            <Link
              prefetch={false}
              href={`/productos/${product.slug}`}
              className={`pantry-card pantry-${i}`}
              key={product.slug}
              data-reveal
            >
              <div className="pantry-photo">
                <MediaImage
                  src={product.image}
                  alt={product.name}
                  width="480"
                  height="500"
                  loading="lazy"
                  decoding="async"
                />
                <span className="round-link">
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <p className="eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p>
                Desde{' '}
                <strong>
                  {formatCOP(Math.min(...product.variants.map((v) => v.price)))}
                </strong>
              </p>
            </Link>
          ))}
        </div>
        <div className="center-link">
          <Link prefetch={false} className="button" href="/productos">
            Abrir la despensa <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section className="packs-story" id="comprar">
        <div className="packs-copy" data-reveal>
          <p className="eyebrow">Mejor cuando se comparte</p>
          <h2>
            Seis razones
            <br />
            para decir
            <br />
            <em>¡salud!</em>
          </h2>
          <p>
            Para compartir, regalar o tener tu nevera lista. Tu ritual favorito,
            en un six pack.
          </p>
          <Link
            prefetch={false}
            className="button"
            href="/productos/six-pack-kombucha-280-ml"
          >
            Six pack 280 ml · $42.000 <ArrowUpRight size={18} />
          </Link>
          <Link
            prefetch={false}
            className="underlined-link"
            href="/productos/six-pack-kombucha-500-ml"
          >
            También en 500 ml · $58.000 <ArrowRight size={18} />
          </Link>
        </div>
        <div className="packs-art" data-parallax="photo">
          <MediaImage
            src={media.pack280.src}
            alt={media.pack280.alt}
            width="1000"
            height="1000"
            loading="lazy"
            decoding="async"
          />
          <span className="pack-stamp">
            6 ×<br />
            <small>buenos momentos</small>
          </span>
        </div>
      </section>
      <section className="journal" id="guias">
        <div className="section-heading horizontal" data-reveal>
          <div>
            <p className="eyebrow">04 / Un poquito de curiosidad</p>
            <h2>
              Alimenta
              <br />
              <em>las buenas ideas.</em>
            </h2>
          </div>
          <Link prefetch={false} className="underlined-link" href="/blog">
            Todas las guías <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="journal-grid">
          {articles.map((article, i) => (
            <Link
              prefetch={false}
              href={`/blog/${article.slug}`}
              className="journal-card"
              key={article.slug}
              data-reveal
            >
              <div className="journal-image">
                <MediaImage
                  src={[media.origin.src, media.ritual.src, pantry[0].image][i]}
                  alt={
                    [
                      'Empaque de Wandra',
                      'Kombucha lista para disfrutar',
                      'Ghee Wandra',
                    ][i]
                  }
                  width="680"
                  height="480"
                  loading="lazy"
                  decoding="async"
                />
                <span>{article.category}</span>
              </div>
              <div className="journal-info">
                <h3>{article.title}</h3>
                <ArrowUpRight size={25} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="faq-section">
        <div data-reveal>
          <p className="eyebrow">Sin misterios</p>
          <h2>
            La curiosidad
            <br />
            <em>se siente bien.</em>
          </h2>
          <Link
            prefetch={false}
            className="underlined-link"
            href="/preguntas-frecuentes"
          >
            Más respuestas <ArrowUpRight size={19} />
          </Link>
        </div>
        <Faq questions={questions} />
      </section>
      <section className="delivery-story">
        <div className="delivery-copy" data-reveal>
          <p className="eyebrow">De nuestro origen a tu casa</p>
          <h2>
            Que nunca falte
            <br />
            <em>lo bueno.</em>
          </h2>
          <p>
            Arma tu selección y consulta con nosotros la disponibilidad y el
            envío a tu ciudad.
          </p>
          <Link
            prefetch={false}
            className="button"
            href="https://wandra.com.co/contacto/"
          >
            Hablemos de tu pedido <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="delivery-image">
          <MediaImage
            src={media.delivery.src}
            alt={media.delivery.alt}
            width="1000"
            height="800"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: questions.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: { '@type': 'Answer', text: q.answer },
            })),
          }),
        }}
      />
    </main>
  );
}
