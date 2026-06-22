import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import PortfolioBody from './PortfolioBody';

export const metadata: Metadata = {
  title: 'ผลงานวิทยาลัย · นวัตกรรมและสิ่งประดิษฐ์',
  description:
    'รวมผลงานนักศึกษาและอาจารย์ — นวัตกรรม สิ่งประดิษฐ์ งานวิจัย จากการแข่งขันทักษะวิชาชีพและการประกวดระดับชาติ ปีการศึกษา 2567 และ 2568',
  keywords: [
    'ผลงานนักศึกษา ปวส',
    'นวัตกรรมอาชีวศึกษา',
    'สิ่งประดิษฐ์ ปวช',
    'ผลงานวิทยาลัยแหลมฉบัง',
  ],
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return <PortfolioBody />;
}
