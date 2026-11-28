'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/lib/consent';
import { syncTrackingConsent, trackPageView } from '@/lib/analytics';

/**
 * Activa o desactiva Meta Pixel / GA4 según la preferencia de cookies y registra una vista de página por ruta
 * (Next navega sin recargar, así que `PageView` se envía al cambiar la ruta, no solo en la carga inicial).
 */
export function Tracking() {
  const pathname = usePathname();
  const { consent } = useConsent();
  const marketing = consent?.marketing === true;
  const analytics = consent?.analytics === true;
  const lastMeta = useRef<string | null>(null);
  const lastGa = useRef<string | null>(null);

  useEffect(() => { syncTrackingConsent(); }, [marketing, analytics]);

  useEffect(() => {
    trackPageView(pathname, { meta: marketing && lastMeta.current !== pathname, ga: analytics && lastGa.current !== pathname });
    lastMeta.current = marketing ? pathname : null;
    lastGa.current = analytics ? pathname : null;
  }, [pathname, marketing, analytics]);

  return null;
}
