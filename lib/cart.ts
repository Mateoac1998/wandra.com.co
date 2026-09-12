'use client';

import { useEffect, useState } from 'react';

export type CartLine = {
  sku: string;
  productSlug: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

const cartKey = 'wandra-cart-v1';
const cartEvent = 'wandra-cart-updated';

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false;
  const line = value as Partial<CartLine>;
  return typeof line.sku === 'string' && typeof line.name === 'string' && typeof line.variant === 'string' && typeof line.price === 'number' && typeof line.quantity === 'number';
}

export function readCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(cartKey) || '[]');
    return Array.isArray(stored) ? stored.filter(isCartLine) : [];
  } catch { return []; }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(cartKey, JSON.stringify(lines));
  window.dispatchEvent(new Event(cartEvent));
}

export function addToCart(line: Omit<CartLine, 'quantity'>, quantity = 1) {
  const safeQuantity = Math.max(1, Math.min(quantity, 24));
  const lines = readCart();
  const existing = lines.find((item) => item.sku === line.sku);
  const next = existing
    ? lines.map((item) => item.sku === line.sku ? { ...item, quantity: Math.min(item.quantity + safeQuantity, 24) } : item)
    : [...lines, { ...line, quantity: safeQuantity }];
  writeCart(next);
}

export function changeCartQuantity(sku: string, quantity: number) {
  const next = readCart().flatMap((item) => item.sku !== sku ? [item] : quantity > 0 ? [{ ...item, quantity: Math.min(quantity, 24) }] : []);
  writeCart(next);
}

export function clearCart() { writeCart([]); }

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const sync = () => setLines(readCart());
    sync();
    window.addEventListener(cartEvent, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(cartEvent, sync); window.removeEventListener('storage', sync); };
  }, []);
  return lines;
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((total, item) => total + item.price * item.quantity, 0);
}
