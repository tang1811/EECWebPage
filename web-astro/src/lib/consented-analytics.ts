import { CONSENT_MAX_AGE, clearAnalyticsCookies, clearConsentCookie, readConsent } from './cookie-consent.ts';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function pauseCookieFeatures(measurementId: string): void {
  const wasActive = typeof window.gtag === 'function';
  const flags = window as unknown as Record<string, unknown>;
  flags[`ga-disable-${measurementId}`] = true;
  window.gtag = undefined;
  window.dataLayer = [];
  clearAnalyticsCookies();
  clearConsentCookie();
  if (wasActive) window.location.reload();
}

export function createConsentedAnalytics(measurementId: string) {
  let started = false;
  const validId = /^G-[A-Z0-9]+$/.test(measurementId);
  const flags = window as unknown as Record<string, unknown>;
  const disabledKey = `ga-disable-${measurementId}`;

  function sync(): void {
    const allowed = readConsent()?.analytics === true;
    if (!allowed) {
      flags[disabledKey] = true;
      clearAnalyticsCookies();
      if (started) {
        // End all automatic GA listeners and queued events after withdrawal.
        // Reload also ensures re-consenting cannot send old queued events.
        window.gtag = undefined;
        window.dataLayer = [];
        window.location.reload();
      }
      return;
    }
    if (!validId || started) return;
    started = true;
    flags[disabledKey] = false;
    window.dataLayer = [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* No referrer. */ }
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: 'none', cookie_path: '/',
      cookie_expires: CONSENT_MAX_AGE, cookie_update: false,
      cookie_flags: `SameSite=Lax${location.protocol === 'https:' ? ';Secure' : ''}`,
      page_location: location.origin + location.pathname,
      page_referrer: referrer,
    });
    const script = document.createElement('script');
    script.id = 'eec-google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  }
  return { sync };
}
