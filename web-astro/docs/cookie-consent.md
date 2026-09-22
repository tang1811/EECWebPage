# Cookie consent and Analytics

## Current status: temporarily disabled

`COOKIE_CONSENT_ENABLED = false` in `src/config.ts` pauses the banner, settings UI, GA script, and interaction events. On the next page load, a cleanup script deletes the host-only consent cookie and accessible Analytics cookies. It does not clear unrelated cookies or localStorage. Existing open tabs must refresh to receive this change. The disabled build was published to the configured production share on 2026-09-21; all 382 build files matched destination SHA-256 hashes. Production HTTP was not verified because its public URL has not been confirmed.

To reopen: set `COOKIE_CONSENT_ENABLED = true`, set the real `PUBLIC_GA_ID` in `.env`, restart the dev server after environment changes, and build again. Users whose old preference was removed while paused see the banner again. Users who did not visit during the pause can retain a valid preference; bump `CONSENT_VERSION` if everyone must consent again.

To pause Analytics alone while keeping the banner: leave `COOKIE_CONSENT_ENABLED = true`, clear `PUBLIC_GA_ID`, then restart/rebuild. This prevents loading Analytics on the next page load, but does not by itself remove previously stored cookies.

## Behavior when enabled

The shared Base layout includes the first-visit consent banner on all pages, including routes without a footer. Visitors can accept all, use necessary cookies only, or save an individual Analytics choice. After saving, no floating or footer settings button is displayed; visitors can change their choice or withdraw consent on `/privacy/#cookies`.

Consent version 2 resets earlier choices once for the revised settings entry point. Visitors with version 1 are prompted again on their next page load; subsequent choices are remembered normally.

## Enable GA4

1. Set the real web-stream Measurement ID in `.env`: `PUBLIC_GA_ID=G-…`. See `.env.example`. An empty or invalid ID never loads Google Analytics.
2. In the GA4 property, review the data retention setting (the site's privacy draft states no more than 12 months; select a retention period within that limit). Leave Google Signals, advertising features, and user-provided data collection disabled. Disable Enhanced Measurement form interactions so admission forms are not automatically measured.
3. Restart the local server after changing environment values, or rebuild for production. No production deployment is performed by these changes.
4. Verify in a fresh browser session: no Google Analytics request before consent or after rejection; accepting loads the Google tag; withdrawal removes accessible GA cookies and reloads the page to terminate automatic tracking.

The implementation uses basic consent: the Google script is not downloaded before consent. Advertising consent stays denied. Query strings and URL fragments are omitted from the configured page URL and referrer. Existing site interaction events are also gated on a valid, unexpired consent cookie.

## Cookies

| Cookie | Purpose | Lifetime |
| --- | --- | --- |
| `eec_cookie_consent` | Necessary: version, necessary=true, Analytics choice, timestamp. No visitor ID or applicant data. | 180 days after a choice is saved; not renewed by page views |
| `_ga`, `_ga_*` | Google Analytics, only after consent and with a configured Measurement ID | Configured to 180 days, no rolling refresh |

The consent cookie is host-only, `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS. JavaScript must read it, so it is not `HttpOnly`. It is a preference, not an authentication or CSRF credential. Invalid/expired choices fail closed and prompt again. Failed persistence leaves Analytics disabled. Open tabs synchronize through BroadcastChannel, with focus/visibility checks as a fallback.

The current site is static and online admissions are disabled. There is no invented "security cookie": login session/CSRF protection must be implemented and verified with the actual authentication backend when that feature is enabled. The consent cookie does not authenticate a user or protect server requests.

On withdrawal, set GA's disable flag, clear accessible GA cookies at host/parent-domain and path scopes, and reload if the tag was loaded. Do not remove unrelated authentication or preference cookies. Previously submitted Analytics data is not retroactively deleted. Browser preferences are not a server-side consent audit ledger.

Changing cookie purposes should bump `CONSENT_VERSION` and update the notice. Cookie expiration is separate from GA server-side data retention.

## Validation

Run `node --experimental-strip-types --test tests/cookie-consent.test.mjs` (Node 22.12+), then `npm run build`. Tests use an isolated browser-environment stub and a test Measurement ID; no requests are sent to Google.

References: [Google consent setup](https://developers.google.com/tag-platform/security/guides/consent), [GA4 configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
