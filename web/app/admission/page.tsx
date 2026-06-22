import type { Metadata } from 'next';
import '../styles/admission.css';
import AdmissionApp from './AdmissionApp';

export const metadata: Metadata = {
  title: 'สมัครเรียนออนไลน์',
  description:
    'ระบบรับสมัครนักศึกษาใหม่ออนไลน์ ปวช. ปวส. ป.ตรี — ยืนยันตัวตน กรอกใบสมัคร แนบเอกสาร และติดตามสถานะได้ในที่เดียว',
  alternates: { canonical: '/admission' },
};

export default function AdmissionPage() {
  return <AdmissionApp />;
}
