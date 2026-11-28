'use client';

import { useEffect, useRef, useState } from 'react';
import { openConsentEvent, readConsent, saveConsent, useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const { ready, consent } = useConsent();
  const [reopened, setReopened] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const region = useRef<HTMLElement>(null);

  // Permite volver a abrir el banner desde /politicas con la preferencia actual precargada.
  useEffect(() => {
    const reopen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics === true);
      setMarketing(current?.marketing === true);
      setPanel(true);
      setReopened(true);
    };
    window.addEventListener(openConsentEvent, reopen);
    return () => window.removeEventListener(openConsentEvent, reopen);
  }, []);

  const visible = ready && (consent === null || reopened);

  useEffect(() => {
    if (!visible || !reopened) return;
    region.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setReopened(false); setPanel(false); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [visible, reopened]);

  if (!visible) return null;

  const decide = (next: { analytics: boolean; marketing: boolean }) => {
    saveConsent(next);
    setReopened(false);
    setPanel(false);
  };

  return <section ref={region} tabIndex={-1} className="consent-banner" aria-labelledby="consent-title">
    <h2 id="consent-title">Tu privacidad</h2>
    <p>Usamos cookies necesarias para que la tienda funcione. Con tu permiso, también usamos cookies de analítica y de marketing para entender qué contenido te interesa y medir nuestra publicidad. Puedes cambiar tu decisión cuando quieras. <a href="/politicas#cookies">Más información</a></p>
    {panel && <fieldset className="consent-options">
      <legend className="consent-visually-hidden">Tipos de cookies</legend>
      <div className="consent-option"><input id="consent-necessary" type="checkbox" checked disabled /><label htmlFor="consent-necessary"><b>Necesarias</b><small>Guardan tu bolsa de compra y esta preferencia. Siempre activas.</small></label></div>
      <div className="consent-option"><input id="consent-analytics" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><label htmlFor="consent-analytics"><b>Analítica</b><small>Nos dicen qué páginas visitas y cómo llegas al sitio.</small></label></div>
      <div className="consent-option"><input id="consent-marketing" type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><label htmlFor="consent-marketing"><b>Marketing</b><small>Nos permiten medir qué anuncios llevan a una compra.</small></label></div>
    </fieldset>}
    <div className="consent-actions">
      <button type="button" className="consent-button consent-primary" onClick={() => decide({ analytics: true, marketing: true })}>Aceptar todas</button>
      <button type="button" className="consent-button" onClick={() => decide({ analytics: false, marketing: false })}>Rechazar</button>
      {panel
        ? <button type="button" className="consent-button" onClick={() => decide({ analytics, marketing })}>Guardar selección</button>
        : <button type="button" className="consent-button" onClick={() => setPanel(true)} aria-expanded={false}>Configurar</button>}
    </div>
  </section>;
}
