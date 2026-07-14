// Central site constants — the ONLY place SITE_URL lives (the old Next app
// duplicated it across 6 files). Swap for the real domain when one exists.
export const SITE_URL = 'https://eec.example';

export const SITE_NAME = 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง';

export const DEFAULT_TITLE =
  'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · เปิดรับสมัคร ปวช. ปวส. ป.ตรี ปีการศึกษา 2569';

export const DEFAULT_DESCRIPTION =
  'เรียน ปวช. ปวส. ป.ตรี ที่แหลมฉบัง ศรีราชา ชลบุรี — 18 สาขา ช่างยนต์ ไฟฟ้า เมคคาทรอนิกส์ โลจิสติกส์ พร้อมทวิภาคีกับ EEC สมัครออนไลน์ภายใน 5 นาที';

export const DEFAULT_KEYWORDS = [
  'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  'เรียน ปวช แหลมฉบัง',
  'เรียน ปวส ศรีราชา',
  'สมัครเรียน ปวส โลจิสติกส์ ศรีราชา',
  'วิทยาลัยเทคโนโลยี ชลบุรี',
  'เทคโนแหลม',
  'อาชีวศึกษาเอกชน ชลบุรี',
  'ทวิภาคี EEC',
];

// OG defaults emitted on every page that does not override og (matches the old
// Next root-layout openGraph exactly — og:url stays "/" on non-override pages).
export const DEFAULT_OG = {
  title: 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — เปิดรับสมัคร 2569',
  description: 'ปวช. ปวส. ป.ตรี 18 สาขา ครอบคลุมช่าง ดิจิทัล โลจิสติกส์ พร้อมทวิภาคีนิคม EEC',
};

export const GA_ID: string | undefined = import.meta.env.PUBLIC_GA_ID;

// Verbatim from web/app/layout.tsx ORG_JSONLD.
export const ORG_JSONLD = {
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
