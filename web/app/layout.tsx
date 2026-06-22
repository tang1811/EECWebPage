import type { Metadata } from 'next';
import './globals.css';
import './styles/styles.css';
import './styles/mobile.css';
import { Nav, Footer, StickyCTA, RevealInit } from './components/chrome';
import Analytics from './components/Analytics';

const SITE_URL = 'https://eec.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · เปิดรับสมัคร ปวช. ปวส. ป.ตรี ปีการศึกษา 2569',
    template: '%s · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  },
  description:
    'เรียน ปวช. ปวส. ป.ตรี ที่แหลมฉบัง ศรีราชา ชลบุรี — 18 สาขา ช่างยนต์ ไฟฟ้า เมคคาทรอนิกส์ โลจิสติกส์ พร้อมทวิภาคีกับ EEC สมัครออนไลน์ภายใน 5 นาที',
  keywords: [
    'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
    'เรียน ปวช แหลมฉบัง',
    'เรียน ปวส ศรีราชา',
    'สมัครเรียน ปวส โลจิสติกส์ ศรีราชา',
    'วิทยาลัยเทคโนโลยี ชลบุรี',
    'เทคโนแหลม',
    'อาชีวศึกษาเอกชน ชลบุรี',
    'ทวิภาคี EEC',
  ],
  alternates: { canonical: '/' },
  icons: { icon: '/assets/logo.png' },
  openGraph: {
    type: 'website',
    title: 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — เปิดรับสมัคร 2569',
    description: 'ปวช. ปวส. ป.ตรี 18 สาขา ครอบคลุมช่าง ดิจิทัล โลจิสติกส์ พร้อมทวิภาคีนิคม EEC',
    images: ['/assets/logo.png'],
    locale: 'th_TH',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': ['CollegeOrUniversity', 'LocalBusiness'],
  '@id': SITE_URL + '/#organization',
  name: 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  alternateName: 'EEC Engineer Laemchabang Technological College',
  url: SITE_URL + '/',
  logo: SITE_URL + '/assets/logo.png',
  image: SITE_URL + '/assets/logo.png',
  telephone: '+66-38-494-066',
  email: 'technologylaemchabang@gmail.com',
  foundingDate: '1995-03-01',
  priceRange: '฿฿',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '75/2 หมู่ 10 ต.ทุ่งสุขลา',
    addressLocality: 'ศรีราชา',
    addressRegion: 'ชลบุรี',
    postalCode: '20230',
    addressCountry: 'TH',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 13.086485, longitude: 100.936589 },
  areaServed: ['ชลบุรี', 'ศรีราชา', 'แหลมฉบัง', 'บ่อวิน', 'เขตพัฒนาพิเศษภาคตะวันออก (EEC)'],
  hasMap: 'https://www.google.com/maps?q=13.086485,100.936589',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '16:00' },
  ],
  sameAs: ['https://www.facebook.com/eec.engineer.laemchabang'],
  review: [
    { '@type': 'Review', author: { '@type': 'Person', name: 'บงกช สินฉาย' }, reviewBody: 'เรียนที่นี่เหมือนเรียนกับครอบครัว เพื่อนและอาจารย์ทุกท่านเป็นกันเอง สงสัยอะไรให้คำตอบได้เสมอ' },
    { '@type': 'Review', author: { '@type': 'Person', name: 'ฉัตรชัย สุขภักดี' }, reviewBody: 'ได้ความรู้ที่แน่นและเป็นประโยชน์ต่อการใช้ในอาชีพได้จริง และมีความสุขทุกครั้งที่เรียน' },
    { '@type': 'Review', author: { '@type': 'Person', name: 'ปุณณภา พรมชาติ' }, reviewBody: 'เป็นสถาบันที่ให้ความรู้และความเข้าใจดีมาก นำไปใช้ในที่ทำงานจริงและชีวิตจริงได้ดี' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        {/* React hoists these stylesheet/preconnect links into <head>.
            Real 'Prompt' family name is required (referenced literally in CSS + SVG text). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <Analytics />
        <Nav />
        {children}
        <Footer />
        <StickyCTA />
        <RevealInit />
      </body>
    </html>
  );
}
