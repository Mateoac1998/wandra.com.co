'use client';

import { openConsentSettings } from '@/lib/consent';

export function CookieSettingsButton({ className = 'button button-dark' }: { className?: string }) {
  return <button type="button" className={className} onClick={openConsentSettings}>Gestionar cookies</button>;
}
