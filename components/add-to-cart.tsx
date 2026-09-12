'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart';

type CartProduct = { slug: string; name: string; image: string; variants: { label: string; price: number; sku: string }[] };

export function AddToCart({ product, className = 'button button-dark' }: { product: CartProduct; className?: string }) {
  const [sku, setSku] = useState(product.variants[0]?.sku || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((item) => item.sku === sku) || product.variants[0];
  if (!variant) return null;
  const add = () => {
    addToCart({ sku: variant.sku, productSlug: product.slug, name: product.name, variant: variant.label, price: variant.price, image: product.image }, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return <div className="add-to-cart">
    {product.variants.length > 1 && <label>Presentación<select value={variant.sku} onChange={(event) => setSku(event.target.value)}>{product.variants.map((item) => <option value={item.sku} key={item.sku}>{item.label} · ${item.price.toLocaleString('es-CO')}</option>)}</select></label>}
    <div className="product-quantity-picker" aria-label="Cantidad"><button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Reducir cantidad">−</button><b>{quantity}</b><button type="button" onClick={() => setQuantity((current) => Math.min(24, current + 1))} aria-label="Aumentar cantidad">+</button></div>
    <button className={className} type="button" onClick={add}>{added ? 'Agregado a tu bolsa ✓' : `Agregar ${quantity} al carrito`}</button>
  </div>;
}
