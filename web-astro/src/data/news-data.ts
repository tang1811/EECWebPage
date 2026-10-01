// Shared authoritative news content, edited by EECWebAdmin.
import SITE_NEWS from './site-news.json';
import { SCHOLARSHIPS } from './scholarships';

export type NewsArticle = {
  slug: string;
  published?: boolean; // False hides a draft from production builds.
  tag: string;
  title: string;
  date: string;        // ISO for <time> + sorting
  dateLabel: string;   // Thai display
  image?: string;      // photo articles only
  objectPosition?: string;
  tone?: 'green' | 'navy' | 'amber'; // icon-card articles only (maps to .hl-tone-*)
  icon?: 'book' | 'award' | 'briefcase' | 'shield' | 'users' | 'chip';
  gallery?: string[];  // extra images shown after the cover (click-to-zoom)
  excerpt: string;
  body: string[];      // paragraphs
  scholarshipSlug?: string; // Structured scholarship terms.
  promotion?: {
    isExample: boolean;
    showOnHomepage: boolean;
    audience: string;
    periodLabel: string;
    tone: 'green' | 'cream';
  };
};

export type UpcomingEvent = {
  d: string;    // day-of-month display
  m: string;    // Thai month abbrev display
  t: string;    // title
  s: string;    // subtitle
  when: string; // display time/place line
  start: string; // 'YYYY-MM-DDTHH:mm' local (Asia/Bangkok) for .ics
  end: string;
  loc: string;
};


const showDrafts = import.meta.env.PUBLIC_PREVIEW === '1';
const scholarshipNews: NewsArticle[] = SCHOLARSHIPS.map((offer) => ({
  slug: offer.slug,
  scholarshipSlug: offer.slug,
  image: offer.image,
  gallery: offer.gallery,
  tag: offer.category,
  title: `${offer.title} ปีการศึกษา 2570`,
  date: '2026-09-30',
  dateLabel: '30 กันยายน 2569',
  tone: offer.category === 'ทุนการศึกษา' ? 'green' : 'amber',
  icon: 'award',
  excerpt: offer.excerpt,
  body: [offer.excerpt],
}));
export const NEWS: NewsArticle[] = [...scholarshipNews, ...(SITE_NEWS.news as NewsArticle[])]
  .filter(article => showDrafts || article.published !== false);
export const NEWS_LEAD_SLUG: string = NEWS.some(article => article.slug === SITE_NEWS.leadSlug)
  ? SITE_NEWS.leadSlug : NEWS[0]?.slug ?? '';
const requestedSideSlugs = SITE_NEWS.sideSlugs as string[];
const validSideSlugs = [...new Set(requestedSideSlugs)].filter(slug => slug !== NEWS_LEAD_SLUG && NEWS.some(article => article.slug === slug));
export const NEWS_SIDE_SLUGS: string[] = [...validSideSlugs, ...NEWS.map(article => article.slug).filter(slug => slug !== NEWS_LEAD_SLUG && !validSideSlugs.includes(slug))].slice(0, Math.min(2, requestedSideSlugs.length));
export const NEWS_UPCOMING: UpcomingEvent[] = SITE_NEWS.upcoming as UpcomingEvent[];
export const NEWS_SLUGS = NEWS.map(article => article.slug);
export const getNews = (slug: string) => NEWS.find(article => article.slug === slug);
