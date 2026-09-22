import { readConsent } from './cookie-consent';
import { COOKIE_CONSENT_ENABLED } from '../config';
// Never queue interaction events before consent or after it expires.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = import.meta.env.PUBLIC_GA_ID;

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (COOKIE_CONSENT_ENABLED && typeof window !== 'undefined' && readConsent()?.analytics === true && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
