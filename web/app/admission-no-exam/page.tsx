import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import '../styles/money.css';

export const metadata: Metadata = {
  title: 'สมัครเรียน ปวช./ปวส. รับตรง ไม่ใช้คะแนนสอบ — ชลบุรี',
  description:
    'สมัครเรียน ปวช./ปวส. ที่ชลบุรี ง่ายๆ ไม่ต้องใช้คะแนนสอบแข่งขัน — รับตรงทุกสาขา ผ่อนค่าเทอมได้ กู้ กยศ. ได้ สมัครออนไลน์ใน 5 นาที ที่วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
  keywords: ['สมัครเรียน ปวช ไม่ใช้คะแนน', 'รับตรง ปวส ชลบุรี', 'สมัครอาชีวะ ศรีราชา', 'สมัคร ปวช ออนไลน์ ชลบุรี', 'เรียนต่อ ม.3 ม.6 ชลบุรี'],
  alternates: { canonical: '/admission-no-exam' },
};

export default function Page() {
  return (
    <main className="mp-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs"><a href="/">หน้าแรก</a> <span>/</span> <span>สมัครไม่ใช้คะแนน</span></div>
          <span className="eyebrow">เปิดรับสมัคร ปีการศึกษา 2569</span>
          <h1>สมัคร ปวช./ปวส. <span className="grad">รับตรง ไม่ใช้คะแนนสอบ</span></h1>
          <p>
            จบ ม.3 หรือ ม.6 อยากเรียนสายอาชีพแต่กังวลเรื่องคะแนนสอบ? ที่ EEC Engineer แหลมฉบัง
            <strong> รับตรงทุกสาขา ไม่ต้องสอบแข่งขัน</strong> สมัครออนไลน์ได้เลยใน 5 นาที
          </p>
          <div className="cta-actions" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/admission" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn btn-ghost btn-lg">โทร 038-494-066</a>
          </div>
          <div className="mp-trust">
            <span>✅ รับตรง ไม่ใช้คะแนนสอบ</span>
            <span>💳 ผ่อนค่าเทอมได้</span>
            <span>🎓 กู้ กยศ. ได้</span>
          </div>
        </div>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">สมัครง่ายใน 4 ขั้นตอน</h2>
        <ol className="mp-steps">
          <li><b>1</b><span>เลือกสาขาและระดับที่ต้องการ (ปวช. / ปวส.)</span></li>
          <li><b>2</b><span>กรอกใบสมัครออนไลน์ พร้อมเอกสาร (ใช้เวลา ~5 นาที)</span></li>
          <li><b>3</b><span>ทีมงานติดต่อกลับ นัดมอบตัว — ตรวจสอบสิทธิทุน/กยศ./ผ่อน</span></li>
          <li><b>4</b><span>ชำระค่าลงทะเบียนงวดแรก เริ่มเรียนได้เลย</span></li>
        </ol>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ค่าเทอมผ่อนได้ · กยศ. ได้</h2>
        <p className="mp-lead">ชำระเต็มจำนวนหรืองวดแรกในวันสมัคร · ผ่อนไม่เกินวันที่ 15 ของทุกเดือน</p>
        <table className="mp-fee">
          <thead><tr><th>หลักสูตร</th><th>ค่าเทอม/ภาคเรียน</th><th>ผ่อน</th></tr></thead>
          <tbody>
            <tr><td>ปวช. บริหารธุรกิจ (รอบบ่าย)</td><td className="mp-fee-num">10,300 ฿</td><td>2,060 × 5 งวด</td></tr>
            <tr><td>ปวช. ช่างอุตสาหกรรม (รอบบ่าย)</td><td className="mp-fee-num">12,300 ฿</td><td>2,460 × 5 งวด</td></tr>
            <tr><td>ปวส. บริหารธุรกิจ (รอบบ่าย)</td><td className="mp-fee-num">18,300 ฿</td><td>3,660 × 5 งวด</td></tr>
          </tbody>
        </table>
        <p className="mp-internal">ดูค่าเทอมครบทุกหลักสูตร → <a href="/tuition">หน้าค่าเทอม &amp; ทุน</a></p>
      </section>

      <section className="container mp-section">
        <div className="mp-cta">
          <div>
            <h2>สมัครเลยวันนี้ — ที่นั่งมีจำกัด</h2>
            <p>ไม่ต้องใช้คะแนนสอบ สมัครออนไลน์ใน 5 นาที หรือโทรปรึกษาได้เลย</p>
          </div>
          <div className="mp-cta-actions">
            <a href="/admission" className="btn-primary">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn-ghost">โทร 038-494-066</a>
          </div>
        </div>
        <p className="mp-internal">ดูเพิ่ม: <a href="/courses">หลักสูตรทั้งหมด</a> · <a href="/job-outcomes">จบแล้วทำงานที่ไหน</a> · <a href="/study-vocational-chonburi">เรียนอาชีวะ ชลบุรี</a></p>
      </section>
    </main>
  );
}
