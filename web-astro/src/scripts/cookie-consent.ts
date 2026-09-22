import { CONSENT_MAX_AGE, readConsent, saveConsent } from '../lib/cookie-consent';
import { createConsentedAnalytics, pauseCookieFeatures } from '../lib/consented-analytics';
import { COOKIE_CONSENT_ENABLED, GA_ID } from '../config';

const root = document.querySelector<HTMLElement>('#cookie-consent');
if (!COOKIE_CONSENT_ENABLED) {
  pauseCookieFeatures(GA_ID || '');
} else if (root) {
  const banner = root.querySelector<HTMLElement>('#cookie-banner')!;
  const dialog = root.querySelector<HTMLDialogElement>('#cookie-dialog')!;
  const checkbox = root.querySelector<HTMLInputElement>('#cookie-analytics')!;
  const error = root.querySelector<HTMLElement>('[data-cookie-error]')!;
  const status = root.querySelector<HTMLElement>('.cookie-status')!;
  const analytics = createConsentedAnalytics(root.dataset.gaId || '');
  let timer: ReturnType<typeof setTimeout>;
  // No identifiers or form data are transmitted between tabs.
  let channel: BroadcastChannel | undefined;
  try { channel = new BroadcastChannel('eec-cookie-consent'); } catch { /* Focus sync remains available. */ }

  function sync(): void {
    const consent = readConsent();
    banner.hidden = !!consent;
    analytics.sync();
    clearTimeout(timer);
    if (consent) {
      const remaining = consent.savedAt + CONSENT_MAX_AGE * 1000 - Date.now();
      timer = setTimeout(sync, Math.min(Math.max(remaining, 1), 2_147_483_647));
    }
  }
  function openSettings(): void {
    checkbox.checked = readConsent()?.analytics === true;
    error.hidden = true;
    if (!dialog.open) dialog.showModal();
  }
  function choose(allowAnalytics: boolean): void {
    if (!saveConsent(allowAnalytics)) {
      if (!dialog.open) openSettings();
      error.hidden = false;
      return;
    }
    dialog.close();
    sync();
    channel?.postMessage('changed');
    status.textContent = allowAnalytics ? 'บันทึกแล้ว: ยินยอมคุกกี้วิเคราะห์การใช้งาน' : 'บันทึกแล้ว: ใช้เฉพาะคุกกี้ที่จำเป็น';
    status.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', openSettings));
  root.querySelectorAll<HTMLElement>('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => choose(button.dataset.cookieChoice === 'all'));
  });
  root.querySelector('[data-cookie-save]')!.addEventListener('click', () => choose(checkbox.checked));
  root.querySelector('[data-cookie-close]')!.addEventListener('click', () => dialog.close());
  window.addEventListener('focus', sync);
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  if (channel) channel.onmessage = () => { if (dialog.open) checkbox.checked = readConsent()?.analytics === true; sync(); };
  sync();
}
