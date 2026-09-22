import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_COOKIE, CONSENT_MAX_AGE, parseConsent, readConsent, saveConsent } from '../src/lib/cookie-consent.ts';
import { createConsentedAnalytics, pauseCookieFeatures } from '../src/lib/consented-analytics.ts';

function browserStub({ secure = true, blocked = false } = {}) {
  const cookies = new Map();
  const writes = [];
  const scripts = [];
  let reloads = 0;
  globalThis.location = {
    protocol: secure ? 'https:' : 'http:', hostname: 'school.example',
    origin: `${secure ? 'https' : 'http'}://school.example`, pathname: '/personnel/',
    reload() { reloads++; },
  };
  globalThis.document = {
    referrer: 'https://search.example/results?private=value#fragment',
    get cookie() { if (blocked) return ''; return [...cookies].map(([k, v]) => `${k}=${v}`).join('; '); },
    set cookie(value) {
      writes.push(value);
      if (blocked) return;
      const pair = value.split(';')[0];
      const i = pair.indexOf('=');
      const key = pair.slice(0, i);
      if (value.includes('Max-Age=0')) cookies.delete(key);
      else cookies.set(key, pair.slice(i + 1));
    },
    createElement(tag) { assert.equal(tag, 'script'); return {}; },
    head: { append(script) { scripts.push(script); } },
  };
  globalThis.window = { location: globalThis.location };
  return { cookies, writes, scripts, get reloads() { return reloads; }, commands: () => window.dataLayer?.map((args) => [...args]) ?? [] };
}

test('first visit and rejection do not load or queue any Analytics', () => {
  const env = browserStub();
  const analytics = createConsentedAnalytics('G-TEST12345');
  analytics.sync();
  assert.equal(readConsent(), null);
  assert.equal(env.cookies.size, 0);
  assert.equal(window.gtag, undefined);
  assert.equal(saveConsent(false), true);
  analytics.sync();
  assert.equal(readConsent().analytics, false);
  assert.equal(env.scripts.length, 0);
  assert.deepEqual(env.commands(), []);
  assert.deepEqual([...env.cookies.keys()], [CONSENT_COOKIE]);
});

test('consent is versioned, expires, rejects malformed or future values', () => {
  browserStub();
  saveConsent(true);
  const consent = readConsent();
  const encode = (data) => encodeURIComponent(JSON.stringify(data));
  assert.equal(parseConsent(encode(consent), consent.savedAt + CONSENT_MAX_AGE * 1000), null);
  assert.equal(parseConsent(encode({ ...consent, version: 0 })), null);
  assert.equal(parseConsent(encode({ ...consent, analytics: 'true' })), null);
  assert.equal(parseConsent(encode({ ...consent, necessary: false })), null);
  assert.equal(parseConsent(encode({ ...consent, savedAt: Date.now() + 60000 })), null);
  for (const value of ['%', 'null', '{}', 'not-json']) assert.equal(parseConsent(value), null);
});

test('preference is host-only and hardened on HTTPS, also works on local HTTP', () => {
  let env = browserStub();
  saveConsent(false);
  assert.match(env.writes[0], /Path=\/; Max-Age=15552000; SameSite=Lax; Secure$/);
  assert.ok(!env.writes[0].includes('Domain='));
  env = browserStub({ secure: false });
  assert.equal(saveConsent(true), true);
  assert.ok(!env.writes[0].includes('Secure'));
});

test('accepting loads one tag, denies ads, strips query strings, limits cookie lifetime', () => {
  const env = browserStub();
  const analytics = createConsentedAnalytics('G-TEST12345');
  saveConsent(true);
  analytics.sync();
  analytics.sync();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST12345');
  const commands = env.commands();
  assert.deepEqual(commands[0], ['consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  }]);
  assert.deepEqual(commands[1], ['consent', 'update', { analytics_storage: 'granted' }]);
  const config = commands.find(([command]) => command === 'config')[2];
  assert.equal(config.page_location, 'https://school.example/personnel/');
  assert.equal(config.page_referrer, 'https://search.example/results');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.cookie_expires, CONSENT_MAX_AGE);
  assert.equal(config.cookie_update, false);
});

test('return visits restore consent without renewing its expiration', () => {
  const env = browserStub();
  saveConsent(true);
  const original = env.cookies.get(CONSENT_COOKIE);
  createConsentedAnalytics('G-TEST12345').sync();
  assert.equal(env.cookies.get(CONSENT_COOKIE), original);
  assert.equal(env.scripts.length, 1);
  assert.equal(env.writes.length, 1);
});

test('withdrawal disables Analytics, clears GA only, and reloads to end listeners', () => {
  const env = browserStub();
  saveConsent(true);
  const analytics = createConsentedAnalytics('G-TEST12345');
  analytics.sync();
  env.cookies.set('_ga', 'old-client');
  env.cookies.set('_ga_TEST12345', 'old-session');
  env.cookies.set('auth_session', 'keep');
  saveConsent(false);
  analytics.sync();
  assert.equal(window['ga-disable-G-TEST12345'], true);
  assert.equal(window.gtag, undefined);
  assert.equal(env.reloads, 1);
  assert.equal(env.cookies.has('_ga'), false);
  assert.equal(env.cookies.has('_ga_TEST12345'), false);
  assert.equal(env.cookies.get('auth_session'), 'keep');
  assert.equal(readConsent().analytics, false);
  assert.deepEqual(env.commands(), []);
});

test('expired consent while tracking disables Analytics and clears its cookies', () => {
  const env = browserStub();
  saveConsent(true);
  const analytics = createConsentedAnalytics('G-TEST12345');
  analytics.sync();
  const expired = { ...readConsent(), savedAt: Date.now() - CONSENT_MAX_AGE * 1000 - 1 };
  env.cookies.set(CONSENT_COOKIE, encodeURIComponent(JSON.stringify(expired)));
  env.cookies.set('_ga', 'old');
  analytics.sync();
  assert.equal(readConsent(), null);
  assert.equal(env.reloads, 1);
  assert.equal(env.cookies.has('_ga'), false);
});

test('missing or invalid Measurement IDs never load Google, even with consent', () => {
  for (const id of ['', 'G-<script>', 'UA-1234']) {
    const env = browserStub();
    saveConsent(true);
    createConsentedAnalytics(id).sync();
    assert.equal(env.scripts.length, 0);
    assert.equal(window.gtag, undefined);
  }
});

test('blocked storage cannot activate Analytics', () => {
  const env = browserStub({ blocked: true });
  assert.equal(saveConsent(true), false);
  createConsentedAnalytics('G-TEST12345').sync();
  assert.equal(env.scripts.length, 0);
});

test('pausing removes consent and GA cookies without touching unrelated sessions', () => {
  const env = browserStub();
  saveConsent(true);
  env.cookies.set('_ga', 'old-client');
  env.cookies.set('_ga_TEST12345', 'old-session');
  env.cookies.set('auth_session', 'keep');
  pauseCookieFeatures('G-TEST12345');
  assert.equal(readConsent(), null);
  assert.equal(env.cookies.has(CONSENT_COOKIE), false);
  assert.equal(env.cookies.has('_ga'), false);
  assert.equal(env.cookies.has('_ga_TEST12345'), false);
  assert.equal(env.cookies.get('auth_session'), 'keep');
  assert.equal(window['ga-disable-G-TEST12345'], true);
  assert.equal(env.scripts.length, 0);
  assert.equal(env.reloads, 0);
});

test('pausing an active tracker ends queued events and reloads once', () => {
  const env = browserStub();
  saveConsent(true);
  createConsentedAnalytics('G-TEST12345').sync();
  pauseCookieFeatures('G-TEST12345');
  assert.equal(window.gtag, undefined);
  assert.deepEqual(env.commands(), []);
  assert.equal(env.reloads, 1);
  pauseCookieFeatures('G-TEST12345');
  assert.equal(env.reloads, 1);
});
