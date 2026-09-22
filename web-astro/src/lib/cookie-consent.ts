export const CONSENT_COOKIE = 'eec_cookie_consent';
// Re-prompt once for the revised notice/settings entry point.
export const CONSENT_VERSION = 2;
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60;

export type CookieConsent = {
  version: number;
  necessary: true;
  analytics: boolean;
  savedAt: number;
};

export function parseConsent(value: string, now = Date.now()): CookieConsent | null {
  try {
    const consent = JSON.parse(decodeURIComponent(value));
    if (consent.version !== CONSENT_VERSION || consent.necessary !== true ||
        typeof consent.analytics !== 'boolean' || !Number.isFinite(consent.savedAt) ||
        consent.savedAt > now || now - consent.savedAt >= CONSENT_MAX_AGE * 1000) return null;
    return consent;
  } catch {
    return null;
  }
}

export function readConsent(): CookieConsent | null {
  try {
    const value = document.cookie.split('; ').find((item) => item.startsWith(`${CONSENT_COOKIE}=`));
    return value ? parseConsent(value.slice(CONSENT_COOKIE.length + 1)) : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): boolean {
  const consent: CookieConsent = { version: CONSENT_VERSION, necessary: true, analytics, savedAt: Date.now() };
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    return readConsent()?.savedAt === consent.savedAt && readConsent()?.analytics === analytics;
  } catch {
    return false;
  }
}

export function clearConsentCookie(): void {
  try {
    document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  } catch { /* Browsers may block access to cookies. */ }
}

// Remove GA cookies, including older cookies set on a parent domain.
// Never touch login/session cookies belonging to other services.
export function clearAnalyticsCookies(): void {
  try {
    const names = document.cookie.split(';').map((item) => item.trim().split('=')[0])
      .filter((name) => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
    const parts = location.hostname.split('.');
    const domains = ['', ...parts.map((_, i) => parts.slice(i).join('.'))];
    const paths = new Set(['/', ...location.pathname.split('/').map((_, i, segments) => segments.slice(0, i + 1).join('/') || '/')]);
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? `; Domain=${domain}` : ''}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    }
  } catch { /* Analytics remains disabled when browser storage is unavailable. */ }
}
