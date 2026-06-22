import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import CoursesBody from './CoursesBody';
import { COURSES } from './[slug]/course-data';

const SITE_URL = 'https://eec.example';

export const metadata: Metadata = {
  title: 'หลักสูตร 18 สาขา · ปวช. ปวส. ป.ตรี',
  description:
    'หลักสูตร ปวช. ปวส. และ ป.ตรี 18 สาขาวิชา ครอบคลุมช่างยนต์ ไฟฟ้า เมคคาทรอนิกส์ โลจิสติกส์ ดิจิทัล และบริหาร ที่แหลมฉบัง ศรีราชา ชลบุรี',
  keywords: [
    'หลักสูตร ปวช',
    'หลักสูตร ปวส',
    'ปริญญาตรี อาชีวศึกษา',
    'สาขาช่างยนต์',
    'สาขาไฟฟ้า',
    'เมคคาทรอนิกส์',
    'โลจิสติกส์',
  ],
  alternates: { canonical: '/courses' },
};

export default function CoursesPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'หลักสูตรทั้งหมด · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
    numberOfItems: COURSES.length,
    itemListElement: COURSES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${c.code} ${c.name}`,
      url: `${SITE_URL}/courses/${c.slug}`,
    })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'หลักสูตร', item: `${SITE_URL}/courses` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CoursesBody />
    </>
  );
}
