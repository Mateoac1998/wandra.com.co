'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import styles from './native-product-gallery.module.css';

type Props = {
  photos: { src: string; alt: string }[];
  label: string;
  compact?: boolean;
  priority?: boolean;
};

export function NativeProductGallery({ photos, label, compact = false, priority = false }: Props) {
  const trackId = useId();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const sizes = compact
    ? '(max-width: 600px) 86vw, (max-width: 912px) 43vw, 29vw'
    : '(max-width: 912px) 100vw, 55vw';

  function goTo(index: number) {
    const viewport = track.current;
    if (!viewport) return;
    viewport.scrollTo({ left: index * viewport.clientWidth });
  }

  function syncActive() {
    const viewport = track.current;
    if (!viewport?.clientWidth) return;
    const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setActive(Math.max(0, Math.min(photos.length - 1, index)));
  }

  return (
    <section className={compact ? `${styles.gallery} ${styles.compact}` : styles.gallery} aria-label={label}>
      <div className={styles.frame}>
        <div
          id={trackId}
          ref={track}
          className={`${styles.track} flex overflow-x-auto snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto`}
          tabIndex={0}
          onScroll={syncActive}
        >
          {photos.map(({ src, alt }, index) => (
            <div className={`${styles.slide} relative w-full shrink-0 snap-start`} key={src}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority && index === 0}
                loading={priority && index === 0 ? undefined : 'lazy'}
              />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              aria-label="Ver foto anterior"
              aria-controls={trackId}
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              aria-label="Ver foto siguiente"
              aria-controls={trackId}
              disabled={active === photos.length - 1}
              onClick={() => goTo(active + 1)}
            >
              ›
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className={styles.thumbnails}>
          {photos.map(({ src, alt }, index) => (
            <button
              type="button"
              className={styles.thumb}
              aria-label={`Ver foto: ${alt}`}
              aria-controls={trackId}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => goTo(index)}
              key={src}
            >
              <Image src={src} alt="" fill sizes="56px" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
