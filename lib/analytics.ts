'use client';

import { readConsent } from '@/lib/consent';

/**
 * Meta Pixel (marketing) y Google Analytics 4 (analítica).
 *
 * Reglas:
 * - Ninguna herramienta se carga si su variable de entorno falta, está vacía o no tiene el formato esperado.
 * - Ninguna herramienta se carga ni envía eventos sin el consentimiento correspondiente del visitante.
 * - Las funciones son idempotentes: no duplican scripts ni al navegar entre páginas ni al repetir llamadas.
 */

// Next solo sustituye `process.env.NEXT_PUBLIC_*` cuando se escribe literalmente.
const rawMetaPixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '').trim();
const rawGa4Id = (process.env.NEXT_PUBLIC_GA4_ID ?? '').trim();
const META_PIXEL_ID = /^\d{8,20}$/.test(rawMetaPixelId) ? rawMetaPixelId : '';
const GA4_ID = /^G-[A-Z0-9]{6,14}$/.test(rawGa4Id) ? rawGa4Id : '';

const CURRENCY = 'COP';

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: Fbq;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export type TrackedItem = { sku: string; name: string; category?: string; price: number; quantity: number };

/* ---------- Habilitación ---------- */

function metaEnabled() { return Boolean(META_PIXEL_ID) && readConsent()?.marketing === true; }
function gaEnabled() { return Boolean(GA4_ID) && readConsent()?.analytics === true; }

/* ---------- Carga de scripts ---------- */

function ensureMeta() {
  if (!metaEnabled() || window.fbq) return;
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args);
  }) as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', META_PIXEL_ID);
}

function ensureGa() {
  if (!gaEnabled() || window.gtag) return;
  window[`ga-disable-${GA4_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  // gtag.js exige empujar el objeto `arguments`, no un arreglo.
  window.gtag = function gtag() { // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);
}

function expireCookie(name: string) {
  const host = window.location.hostname;
  const bare = host.replace(/^www\./, '');
  const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = expired;
  for (const domain of new Set([host, `.${host}`, bare, `.${bare}`])) document.cookie = `${expired}; domain=${domain}`;
}

/**
 * Alinea las herramientas con la preferencia actual. Si el visitante retira el consentimiento después de que
 * un script ya se cargó, se dejan de enviar eventos y se borran sus cookies; el script desaparece del todo
 * en la siguiente carga de página.
 */
export function syncTrackingConsent() {
  if (typeof window === 'undefined') return;
  if (metaEnabled()) ensureMeta();
  else if (window.fbq) ['_fbp', '_fbc'].forEach(expireCookie);

  if (gaEnabled()) ensureGa();
  else if (window.gtag) {
    if (GA4_ID) window[`ga-disable-${GA4_ID}`] = true;
    document.cookie.split(';').map((part) => part.trim().split('=')[0]).filter((name) => name === '_ga' || name.startsWith('_ga_')).forEach(expireCookie);
  }
}

/* ---------- Envío de eventos ---------- */

function meta(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (!metaEnabled()) return;
  ensureMeta();
  if (!window.fbq) return;
  const args: unknown[] = ['track', event];
  if (params || eventId) args.push(params ?? {});
  if (eventId) args.push({ eventID: eventId });
  window.fbq(...args);
}

function ga(event: string, params?: Record<string, unknown>) {
  if (!gaEnabled()) return;
  ensureGa();
  window.gtag?.('event', event, params);
}

const metaContents = (items: TrackedItem[]) => items.map((item) => ({ id: item.sku, quantity: item.quantity, item_price: item.price }));
const gaItems = (items: TrackedItem[]) => items.map((item) => ({ item_id: item.sku, item_name: item.name, item_category: item.category, price: item.price, quantity: item.quantity }));
const itemCount = (items: TrackedItem[]) => items.reduce((total, item) => total + item.quantity, 0);

export function trackPageView(path: string, only: { meta: boolean; ga: boolean }) {
  if (only.meta) meta('PageView');
  if (only.ga) ga('page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
}

/** Ficha de producto: Meta `ViewContent` / GA4 `view_item`. */
export function trackViewItem(items: TrackedItem[], value: number) {
  meta('ViewContent', { content_type: 'product', content_ids: items.map((item) => item.sku), content_name: items[0]?.name, content_category: items[0]?.category, contents: metaContents(items), value, currency: CURRENCY });
  ga('view_item', { currency: CURRENCY, value, items: gaItems(items) });
}

/** Añadir a la bolsa: Meta `AddToCart` / GA4 `add_to_cart`. */
export function trackAddToCart(item: TrackedItem) {
  const value = item.price * item.quantity;
  meta('AddToCart', { content_type: 'product', content_ids: [item.sku], content_name: item.name, contents: metaContents([item]), value, currency: CURRENCY });
  ga('add_to_cart', { currency: CURRENCY, value, items: gaItems([item]) });
}

/** Inicio de checkout: Meta `InitiateCheckout` / GA4 `begin_checkout`. */
export function trackBeginCheckout(items: TrackedItem[], value: number) {
  meta('InitiateCheckout', { content_type: 'product', content_ids: items.map((item) => item.sku), contents: metaContents(items), num_items: itemCount(items), value, currency: CURRENCY });
  ga('begin_checkout', { currency: CURRENCY, value, items: gaItems(items) });
}

/* ---------- Compra ---------- */

const snapshotKey = 'wandra-checkout-snapshot-v1';
const trackedKey = 'wandra-purchase-tracked-v1';
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

/**
 * Antes de enviar al visitante a Mercado Pago guardamos qué estaba comprando, porque al volver el carrito ya
 * se vació y la página de resultado no conoce los importes.
 */
export function rememberCheckout(orderId: string, items: TrackedItem[], value: number) {
  if (!uuid.test(orderId)) return;
  try { window.localStorage.setItem(snapshotKey, JSON.stringify({ orderId, items, value, ts: Date.now() })); } catch { /* sin medición de compra */ }
}

/**
 * Compra aprobada al volver de Mercado Pago. Se dispara una sola vez por pedido (se recuerda en el navegador) y
 * usa el id del pedido como `eventID` / `transaction_id`, para poder deduplicarlo contra un evento de servidor.
 */
export function trackPurchaseFromReturn(orderId: string) {
  if (!uuid.test(orderId) || (!metaEnabled() && !gaEnabled())) return;
  try {
    const snapshot = JSON.parse(window.localStorage.getItem(snapshotKey) || 'null') as { orderId?: string; items?: TrackedItem[]; value?: number } | null;
    if (!snapshot || snapshot.orderId !== orderId || !Array.isArray(snapshot.items) || !snapshot.items.length || typeof snapshot.value !== 'number') return;
    const done = JSON.parse(window.localStorage.getItem(trackedKey) || '[]') as string[];
    if (done.includes(orderId)) return;
    const { items, value } = snapshot as { items: TrackedItem[]; value: number };
    meta('Purchase', { content_type: 'product', content_ids: items.map((item) => item.sku), contents: metaContents(items), num_items: itemCount(items), value, currency: CURRENCY }, orderId);
    ga('purchase', { transaction_id: orderId, currency: CURRENCY, value, items: gaItems(items) });
    window.localStorage.setItem(trackedKey, JSON.stringify([...done, orderId].slice(-20)));
  } catch { /* sin medición de compra */ }
}
