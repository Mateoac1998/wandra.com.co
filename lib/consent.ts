'use client';

import { useMemo, useSyncExternalStore } from 'react';

/** Preferencia de cookies del visitante. Las cookies necesarias no se guardan aquí: siempre están activas. */
export type Consent = { analytics: boolean; marketing: boolean };

const consentKey = 'wandra-consent-v1';
const consentEvent = 'wandra-consent-changed';
export const openConsentEvent = 'wandra-consent-open';

// Respaldo en memoria por si el navegador bloquea localStorage (modo privado, por ejemplo).
let memoryRaw: string | null = null;

function parse(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as { v?: number; analytics?: unknown; marketing?: unknown };
    if (value?.v === 1 && typeof value.analytics === 'boolean' && typeof value.marketing === 'boolean') {
      return { analytics: value.analytics, marketing: value.marketing };
    }
  } catch { /* preferencia corrupta: se vuelve a preguntar */ }
  return null;
}

function readRaw(): string | null {
  try { return window.localStorage.getItem(consentKey) ?? memoryRaw; } catch { return memoryRaw; }
}

/** Lectura síncrona (solo navegador). Devuelve null si el visitante aún no decidió. */
export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  return parse(readRaw());
}

export function saveConsent(consent: Consent) {
  const raw = JSON.stringify({ v: 1, analytics: consent.analytics, marketing: consent.marketing, ts: Date.now() });
  memoryRaw = raw;
  try { window.localStorage.setItem(consentKey, raw); } catch { /* se mantiene en memoria */ }
  window.dispatchEvent(new Event(consentEvent));
}

/** Reabre el banner para que el visitante cambie su decisión (por ejemplo, desde /politicas). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(openConsentEvent));
}

function subscribe(listener: () => void) {
  window.addEventListener(consentEvent, listener);
  window.addEventListener('storage', listener);
  return () => { window.removeEventListener(consentEvent, listener); window.removeEventListener('storage', listener); };
}

/**
 * `ready` es false en el servidor y durante la hidratación; así el banner nunca se pinta en el HTML inicial
 * ni provoca diferencias de hidratación.
 */
export function useConsent(): { ready: boolean; consent: Consent | null } {
  const raw = useSyncExternalStore<string | null>(subscribe, () => readRaw() ?? '', () => null);
  const consent = useMemo(() => parse(raw), [raw]);
  return { ready: raw !== null, consent };
}
