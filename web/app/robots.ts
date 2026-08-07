import type { MetadataRoute } from 'next';

// Emit robots.txt at build time (required for output: 'export').
export const dynamic = 'force-static';

const SITE_URL = 'https://eec.example';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
