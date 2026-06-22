import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../../styles/homepage.css';
import '../../styles/subpages.css';
import '../news.css';
import { NEWS, NEWS_SLUGS, getNews } from '../news-data';
import NewsCover from '../NewsCover';

const SITE_URL = 'https://eec.example';
const COLLEGE = 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง';

export function generateStaticParams() {
  return NEWS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNews(slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    alternates: { canonical: `/news/${slug}` },
    openGraph: { type: 'article', title: n.title, description: n.excerpt, images: [n.image], locale: 'th_TH', url: `/news/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNews(slug);
  if (!n) notFound();

  const more = NEWS.filter((x) => x.slug !== slug).slice(0, 2);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    image: [`${SITE_URL}${n.image}`],
    datePublished: n.date,
    dateModified: n.date,
    articleSection: n.tag,
    publisher: { '@type': 'Organization', name: COLLEGE, logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/logo.png` } },
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'ข่าวสาร', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: n.title, item: `${SITE_URL}/news/${slug}` },
    ],
  };

  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <article className="news-article">
        <div className="container news-article-inner">
          <div className="crumbs">
            <a href="/">หน้าแรก</a> <span>/</span> <a href="/news">ข่าวสาร</a> <span>/</span> <span>{n.tag}</span>
          </div>
          <span className="news-tag">{n.tag}</span>
          <h1 className="news-title">{n.title}</h1>
          <time className="news-date" dateTime={n.date}>{n.dateLabel}</time>
          <NewsCover images={[n.image, ...(n.gallery ?? [])]} alt={n.title} objectPosition={n.objectPosition} />
          <p className="news-cover-hint">คลิกที่รูปเพื่อดูขนาดเต็ม</p>
          <div className="news-body">
            {n.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <a href="/news" className="news-back">← กลับไปหน้าข่าวสารทั้งหมด</a>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section news-more">
          <div className="container">
            <h2 className="news-more-head">ข่าวอื่น ๆ</h2>
            <div className="news-more-grid">
              {more.map((m) => (
                <a key={m.slug} href={`/news/${m.slug}`} className="news-card">
                  <div className="news-card-img"><img src={m.image} alt={m.title} loading="lazy" style={{ objectPosition: m.objectPosition }} /></div>
                  <div className="news-card-body">
                    <span className="news-card-tag">{m.tag} · {m.dateLabel}</span>
                    <h3>{m.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
