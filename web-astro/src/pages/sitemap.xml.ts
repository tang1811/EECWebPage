import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';
import { COURSE_SLUGS } from '../data/course-data';
import { NEWS_SLUGS } from '../data/news-data';

// Exact replica of the old web/app/sitemap.ts output: 13 static + 19 course
// + 3 news URLs, <loc> WITHOUT trailing slash, lastmod = build timestamp.
const STATIC_ROUTES = [
  '', '/about', '/courses', '/tuition', '/personnel', '/portfolio', '/admission',
  '/contact', '/video', '/study-vocational-chonburi', '/job-outcomes',
  '/admission-no-exam', '/news',
];

export const GET: APIRoute = () => {
  const now = new Date().toISOString();
  const entry = (path: string, changefreq: string, priority: number) =>
    `<url>\n<loc>${SITE_URL}${path}</loc>\n<lastmod>${now}</lastmod>\n<changefreq>${changefreq}</changefreq>\n<priority>${priority}</priority>\n</url>`;

  const urls = [
    ...STATIC_ROUTES.map((p) =>
      entry(p, p === '' ? 'daily' : 'weekly', p === '' ? 1 : p === '/admission' || p === '/courses' ? 0.9 : 0.7),
    ),
    ...COURSE_SLUGS.map((s) => entry(`/courses/${s}`, 'monthly', 0.8)),
    ...NEWS_SLUGS.map((s) => entry(`/news/${s}`, 'monthly', 0.6)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
