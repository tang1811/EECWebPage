import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import './tuition.css';
import TuitionGallery from './TuitionGallery';

export const metadata: Metadata = {
  title: 'ค่าเทอม & ทุนการศึกษา',
  description:
    'ค่าเล่าเรียน ปวช. ปวส. และปริญญาตรี วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · ทุนการศึกษา กยศ. ผ่อนชำระ และสิทธิเรียนฟรี 15 ปี',
  keywords: [
    'ค่าเทอม อาชีวศึกษา',
    'ค่าเล่าเรียน ปวช ปวส',
    'ทุนการศึกษา วิทยาลัยแหลมฉบัง',
    'กยศ อาชีวะ',
  ],
  alternates: { canonical: '/tuition' },
};

// ─────────────────────────────────────────────────────────────
// ค่าเทอม & ทุน — โครงหน้าพร้อมใช้.
// ตัวเลขค่าเทอมด้านล่างเป็น "ตัวอย่างโครงร่าง" — รอข้อมูลจริงจากวิทยาลัย
// แทนที่ค่าใน TUITION_ROWS แล้วลบ <PendingNotice/> เมื่อใส่เลขจริงครบ.
// ─────────────────────────────────────────────────────────────

type Row = { level: string; sub: string; perTerm: string; installment: string; perYear: string };

// อัตราค่าเล่าเรียน ปีการศึกษา 2569 (จากประกาศวิทยาลัย) — ต่อภาคเรียน
const TUITION_ROWS: Row[] = [
  { level: 'ปวช. บริหารธุรกิจ', sub: 'รอบเช้า', perTerm: '17,000', installment: '3,400 × 5 งวด', perYear: '34,000' },
  { level: 'ปวช. บริหารธุรกิจ', sub: 'รอบบ่าย', perTerm: '10,300', installment: '2,060 × 5 งวด', perYear: '20,600' },
  { level: 'ปวช. ช่างอุตสาหกรรม', sub: 'รอบเช้า', perTerm: '19,000', installment: '3,800 × 5 งวด', perYear: '38,000' },
  { level: 'ปวช. ช่างอุตสาหกรรม', sub: 'รอบบ่าย', perTerm: '12,300', installment: '2,460 × 5 งวด', perYear: '24,600' },
  { level: 'ปวช. (อายุเกิน 25 ปี)', sub: 'รอบบ่าย', perTerm: '19,000', installment: '3,800 × 5 งวด', perYear: '38,000' },
  { level: 'ปวส. บริหารธุรกิจ', sub: 'รอบเช้า', perTerm: '21,000', installment: '4,200 × 5 งวด', perYear: '42,000' },
  { level: 'ปวส. บริหารธุรกิจ', sub: 'รอบบ่าย', perTerm: '18,300', installment: '3,660 × 5 งวด', perYear: '36,600' },
  { level: 'ปวส. ช่างอุตสาหกรรม', sub: 'รอบเช้า', perTerm: '26,000', installment: '5,200 × 5 งวด', perYear: '52,000' },
  { level: 'ปวส. ช่างอุตสาหกรรม', sub: 'รอบบ่าย', perTerm: '20,300', installment: '4,060 × 5 งวด', perYear: '40,600' },
];

const AID = [
  {
    title: 'กองทุน กยศ.',
    desc: 'กู้ยืมเพื่อการศึกษา ครอบคลุมค่าเล่าเรียน + ค่าครองชีพ เริ่มผ่อนคืนหลังจบ',
  },
  {
    title: 'ทุนเรียนดี / ทุนความสามารถ',
    desc: 'ทุนสำหรับนักศึกษาผลการเรียนเด่น และทุนกีฬา/ทักษะวิชาชีพ',
  },
  {
    title: 'เรียนฟรี 15 ปี',
    desc: 'สิทธิรัฐสนับสนุนค่าเล่าเรียนระดับ ปวช. ตามนโยบายเรียนฟรี',
  },
  {
    title: 'ผ่อนชำระรายงวด',
    desc: 'แบ่งจ่ายค่าเทอมเป็นงวดได้ ลดภาระผู้ปกครองช่วงเปิดเทอม',
  },
];

const STEPS = [
  'เลือกสาขาและระดับที่ต้องการสมัคร',
  'ยื่นสมัครออนไลน์หรือที่วิทยาลัย พร้อมเอกสาร',
  'ตรวจสอบสิทธิทุน / กยศ. / ผ่อนชำระ กับฝ่ายการเงิน',
  'ชำระค่าลงทะเบียนตามงวดที่เลือก',
];

export default function TuitionPage() {
  return (
    <main className="tuition-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs">
            <a href="/">หน้าแรก</a> <span>/</span> <span>ค่าเทอม &amp; ทุน</span>
          </div>
          <span className="eyebrow">การเงิน · ปีการศึกษา 2569</span>
          <h1>ค่าเทอม &amp; <span className="grad">ทุนการศึกษา</span></h1>
          <p>
            โปร่งใส ตรวจสอบได้ — ค่าเล่าเรียนทุกระดับ พร้อมทางเลือกทุน กยศ. ผ่อนชำระ
            และสิทธิเรียนฟรี 15 ปี เพื่อให้ทุกคนเข้าถึงการเรียนสายอาชีพได้จริง
          </p>
        </div>
      </section>

      <section className="container tu-section">
        <div className="contentcard tu-table-card">
          <h2>อัตราค่าเล่าเรียน ปีการศึกษา 2569</h2>
          <div className="tu-table-wrap">
            <table className="tu-table">
              <thead>
                <tr>
                  <th>หลักสูตร</th>
                  <th>ค่าเทอม / ภาคเรียน</th>
                  <th>ผ่อนชำระ</th>
                  <th>ต่อปี (2 ภาคเรียน)</th>
                </tr>
              </thead>
              <tbody>
                {TUITION_ROWS.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{r.level}</strong>
                      <span className="tu-sub">{r.sub}</span>
                    </td>
                    <td className="tu-num">{r.perTerm} ฿</td>
                    <td className="tu-note">{r.installment}</td>
                    <td className="tu-num">{r.perYear} ฿</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tu-fine">
            * ชำระค่าเทอมเต็มจำนวน หรือชำระงวดแรกในวันสมัคร · ผ่อนชำระไม่เกินวันที่ 15 ของทุกเดือน · ผ่อนได้ · กู้ กยศ. ได้ — สอบถามฝ่ายการเงิน 038-494-066
          </p>
        </div>

        <TuitionGallery />

        <h2 className="tu-h2">ทุน &amp; ทางเลือกชำระเงิน</h2>
        <div className="tu-aid-grid">
          {AID.map((a) => (
            <div key={a.title} className="contentcard tu-aid">
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="tu-h2">ขั้นตอนสมัคร &amp; ชำระเงิน</h2>
        <ol className="tu-steps">
          {STEPS.map((s, i) => (
            <li key={i}>
              <span className="tu-step-n">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="tu-cta">
          <div>
            <h3>พร้อมเริ่มเรียนสายอาชีพแล้ว?</h3>
            <p>สมัครออนไลน์ใช้เวลาไม่กี่นาที ทีมงานพร้อมช่วยเรื่องทุนและการผ่อนชำระ</p>
          </div>
          <div className="tu-cta-actions">
            <a href="/admission" className="btn-primary">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn-ghost">โทรถามฝ่ายการเงิน</a>
          </div>
        </div>
      </section>
    </main>
  );
}
