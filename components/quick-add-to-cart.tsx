'use client';

import { type ReactNode, useState } from 'react';
import { addToCart } from '@/lib/cart';
import { products } from '@/lib/catalog';

export function QuickAddToCart({ sku, className, children }: { sku: string; className?: string; children: ReactNode }) {
  const [added, setAdded] = useState(false);
  const entry = products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))).find(({ variant }) => variant.sku === sku);
  if (!entry) return null;
  const add = () => {
    addToCart({ sku: entry.variant.sku, productSlug: entry.product.slug, name: entry.product.name, variant: entry.variant.label, price: entry.variant.price, image: entry.product.image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return <button type="button" className={className} onClick={add}>{added ? 'Agregado ✓' : children}</button>;
}
