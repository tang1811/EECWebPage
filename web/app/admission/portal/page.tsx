import type { Metadata } from 'next';
import '../../styles/admission.css';
import '../../styles/portal.css';
import PortalApp from './PortalApp';

export const metadata: Metadata = {
  title: 'พอร์ทัลผู้สมัคร',
  description:
    'พอร์ทัลผู้สมัครหลังล็อกอิน — แดชบอร์ด กรอกใบสมัคร แนบเอกสาร ชำระเงิน พิมพ์ใบสมัคร และติดตามสถานะ · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  alternates: { canonical: '/admission/portal' },
};

export default function PortalPage() {
  return <PortalApp />;
}
