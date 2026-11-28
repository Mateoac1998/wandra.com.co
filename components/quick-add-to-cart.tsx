'use client';

import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { addToCart } from '@/lib/cart';
import { trackAddToCart } from '@/lib/analytics';
import { products } from '@/lib/catalog';

export function QuickAddToCart({ sku, className, children }: { sku: string; className?: string; children: ReactNode }) {
  const [added, setAdded] = useState(false);
  const entry = products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))).find(({ variant }) => variant.sku === sku);
  if (!entry) return null;
  const add = () => {
    addToCart({ sku: entry.variant.sku, productSlug: entry.product.slug, name: entry.product.name, variant: entry.variant.label, price: entry.variant.price, image: entry.product.image });
    trackAddToCart({ sku: entry.variant.sku, name: entry.product.name, category: entry.product.category, price: entry.variant.price, quantity: 1 });
    toast.success('Producto agregado a tu bolsa', { description: 'Puedes continuar comprando o finalizar tu pedido cuando quieras.' });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return <button type="button" className={className} onClick={add}>{added ? 'Agregado ✓' : children}</button>;
}
