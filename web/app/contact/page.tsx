import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import ContactBody from './ContactBody';

export const metadata: Metadata = {
  title: 'ติดต่อเรา',
  description:
    'ติดต่อวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · 75/2 หมู่ 10 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230 · โทร 038-494-066, 095-070-6600',
  keywords: ['ติดต่อ วิทยาลัยแหลมฉบัง', 'ที่อยู่ EEC Engineer', 'เบอร์โทร อาชีวศึกษา ศรีราชา'],
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactBody />;
}
