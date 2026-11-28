'use client';

import { useEffect, useRef } from 'react';
import { type TrackedItem, trackViewItem } from '@/lib/analytics';

/** Registra la visualización de una ficha de producto (no pinta nada). */
export function TrackViewItem({ items, value }: { items: TrackedItem[]; value: number }) {
  const last = useRef('');
  const key = items.map((item) => item.sku).join('|');
  useEffect(() => {
    if (last.current === key) return;
    last.current = key;
    trackViewItem(items, value);
  }, [key, items, value]);
  return null;
}
