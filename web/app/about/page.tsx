import type { Metadata } from 'next';
import '../styles/about-cinematic.css';
import AboutBody from './AboutBody';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา',
  description:
    'ประวัติ ปรัชญา และพันธกิจของวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — กว่า 30 ปีแห่งการสร้างช่างฝีมือป้อนสู่นิคมอุตสาหกรรม EEC',
  keywords: [
    'เกี่ยวกับ วิทยาลัยแหลมฉบัง',
    'ประวัติ EEC Engineer',
    'ปรัชญา วิทยาลัยเทคโนโลยี ชลบุรี',
    'พันธกิจ อาชีวศึกษา ศรีราชา',
  ],
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      {/* Cinematic scenes use JetBrains Mono for years/labels; load alongside the global Prompt font. */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Visually-hidden H1 — the visible hero title is rendered inside the opening scene. */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        เกี่ยวกับวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — ประวัติ ปรัชญา พันธกิจ และทีมผู้บริหาร
      </h1>
      <AboutBody />
    </>
  );
}
