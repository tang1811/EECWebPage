import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import '../styles/personnel.css';
import PersonnelBody from './PersonnelBody';

export const metadata: Metadata = {
  title: 'บุคลากร',
  description:
    'ทำเนียบบุคลากรวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · คณะผู้บริหาร รองผู้อำนวยการ ครูผู้สอน 8 แผนกวิชา และบุคลากรสายสนับสนุน',
  keywords: ['บุคลากร วิทยาลัยแหลมฉบัง', 'ครูผู้สอน EEC Engineer', 'คณะผู้บริหาร อาชีวศึกษา ศรีราชา'],
  alternates: { canonical: '/personnel' },
};

export default function PersonnelPage() {
  return <PersonnelBody />;
}
