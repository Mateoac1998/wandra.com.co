'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const hasMultipleImages = images.length > 1;

  return <Carousel className="product-gallery" opts={{ loop: hasMultipleImages }} aria-label={`Galería de ${alt}`}>
    <CarouselContent className="ml-0">
      {images.map((image, index) => <CarouselItem className="pl-0" key={image}>
        <img src={image} alt={index === 0 ? alt : `${alt}, vista ${index + 1}`} fetchPriority={index === 0 ? 'high' : undefined} loading={index === 0 ? 'eager' : 'lazy'} />
      </CarouselItem>)}
    </CarouselContent>
    {hasMultipleImages && <>
      <CarouselPrevious className="product-gallery-control product-gallery-prev" aria-label="Ver imagen anterior" />
      <CarouselNext className="product-gallery-control product-gallery-next" aria-label="Ver imagen siguiente" />
    </>}
  </Carousel>;
}
