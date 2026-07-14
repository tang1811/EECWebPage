// Tiny GA4 event helper. No-op when gtag isn't loaded (dev / GA id unset).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = import.meta.env.PUBLIC_GA_ID;

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
