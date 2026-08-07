import type { MetadataRoute } from 'next';
import { COURSE_SLUGS } from './courses/[slug]/course-data';
import { NEWS_SLUGS } from './news/news-data';

// Emit sitemap.xml at build time (required for output: 'export').
export const dynamic = 'force-static';

const SITE_URL = 'https://eec.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/about', '/courses', '/tuition', '/personnel', '/portfolio', '/admission', '/contact', '/video',
    '/study-vocational-chonburi', '/job-outcomes', '/admission-no-exam', '/news'];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/admission' || path === '/courses' ? 0.9 : 0.7,
  }));

  const courses: MetadataRoute.Sitemap = COURSE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/courses/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const news: MetadataRoute.Sitemap = NEWS_SLUGS.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...courses, ...news];
}
