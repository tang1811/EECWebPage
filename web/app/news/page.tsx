import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import './news.css';
import { NEWS } from './news-data';

export const metadata: Metadata = {
  title: 'ข่าวสาร & กิจกรรม',
  description: 'ข่าวสาร กิจกรรม และความเคลื่อนไหวล่าสุดของวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  keywords: ['ข่าวสารวิทยาลัย', 'กิจกรรมอาชีวะ ชลบุรี', 'EEC Engineer ข่าว'],
  alternates: { canonical: '/news' },
};

export default function NewsListPage() {
  return (
    <main className="news-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs"><a href="/">หน้าแรก</a> <span>/</span> <span>ข่าวสาร</span></div>
          <span className="eyebrow">ข่าวสาร · กิจกรรม</span>
          <h1>ข่าวสาร &amp; <span className="grad">กิจกรรมล่าสุด</span></h1>
          <p>ความเคลื่อนไหว กิจกรรม และข่าวสารล่าสุดของวิทยาลัย</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="news-list-grid">
            {NEWS.map((n) => (
              <a key={n.slug} href={`/news/${n.slug}`} className="news-card">
                <div className="news-card-img"><img src={n.image} alt={n.title} loading="lazy" style={{ objectPosition: n.objectPosition }} /></div>
                <div className="news-card-body">
                  <span className="news-card-tag">{n.tag} · {n.dateLabel}</span>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                  <span className="news-card-more">อ่านต่อ →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
