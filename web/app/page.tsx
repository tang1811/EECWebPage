import './styles/homepage.css';
import HomepageBody from './components/homepage';
import { FAQS } from './components/faq-data';

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
      {/* Preload the LCP hero image (first slide) for faster largest-contentful-paint. */}
      <link rel="preload" as="image" href="/assets/slide-1-apply.webp" fetchPriority="high" />
      {/* Visually-hidden H1 for SEO crawlers; visible headings rendered by the slideshow hero. */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — เปิดรับสมัครนักศึกษาใหม่ ปวช. ปวส. ป.ตรี ปีการศึกษา 2569
      </h1>
      <HomepageBody />
    </>
  );
}
