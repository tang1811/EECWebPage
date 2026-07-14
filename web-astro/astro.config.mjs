// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Placeholder domain — swap for the real domain when one exists (same caveat
// as the old web/ Next.js app; canonical/OG/sitemap all derive from this).
// Sitemap is hand-rolled at src/pages/sitemap.xml.ts for exact parity with
// the old Next.js sitemap (per-route priority/changefreq, /sitemap.xml URL).
const SITE_URL = 'https://eec.example';

export default defineConfig({
  site: SITE_URL,
  // Match the Next.js app's trailingSlash: true — every page is /path/index.html.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7 default 'jsx' strips whitespace between inline elements, which can
  // glue mixed Thai/Latin text together across tags — keep HTML-rule behavior.
  compressHTML: true,
  integrations: [react()],
});