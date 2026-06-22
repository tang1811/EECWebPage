import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import '../styles/money.css';

export const metadata: Metadata = {
  title: 'เรียนอาชีวะ ปวช./ปวส. ที่ไหนดี ชลบุรี ศรีราชา แหลมฉบัง',
  description:
    'มองหาที่เรียน ปวช./ปวส. ใกล้บ้านในชลบุรี? วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — สมศ. ระดับดีเลิศ ศูนย์ทดสอบฝีมือแรงงาน จบแล้วมีงานทำในนิคม EEC ผ่อนค่าเทอมได้ กยศ. ได้',
  keywords: ['เรียนอาชีวะ ชลบุรี', 'วิทยาลัยอาชีวะ ศรีราชา', 'เรียน ปวช ชลบุรี', 'ปวส แหลมฉบัง', 'อาชีวะเอกชน ชลบุรี'],
  alternates: { canonical: '/study-vocational-chonburi' },
};

export default function Page() {
  return (
    <main className="mp-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs"><a href="/">หน้าแรก</a> <span>/</span> <span>เรียนอาชีวะ ชลบุรี</span></div>
          <span className="eyebrow">ศรีราชา · แหลมฉบัง · ชลบุรี</span>
          <h1>เรียนอาชีวะ ปวช./ปวส. <span className="grad">ที่ไหนดีในชลบุรี?</span></h1>
          <p>
            วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — สถาบันอาชีวศึกษาเอกชนใจกลางนิคมอุตสาหกรรมตะวันออก
            เรียนกับเครื่องมือจริง อาจารย์มีประสบการณ์ จบแล้วมีงานรองรับในเขต EEC
          </p>
          <div className="cta-actions" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/admission" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn btn-ghost btn-lg">โทร 038-494-066</a>
          </div>
          <div className="mp-trust">
            <span>✅ สมศ. รับรองระดับ “ดีเลิศ”</span>
            <span>🥇 ชนะเลิศภาค แข่งฝีมือแรงงาน</span>
            <span>🛠️ ศูนย์ทดสอบมาตรฐานฝีมือแรงงาน</span>
          </div>
        </div>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ทำไมเลือกเรียนที่นี่</h2>
        <div className="mp-cards">
          <div className="mp-card"><h3>ใกล้บ้าน เดินทางสะดวก</h3><p>ตั้งอยู่ ต.ทุ่งสุขลา อ.ศรีราชา ใจกลางแหลมฉบัง ใกล้นิคมอุตสาหกรรม เดินทางง่ายจากทั่วชลบุรี</p></div>
          <div className="mp-card"><h3>จบแล้วมีงานทำ</h3><p>ผู้สำเร็จการศึกษา ปวส. ที่ติดตามได้ มีงานทำกว่า 83% ในโรงงานและบริษัทเขต EEC</p></div>
          <div className="mp-card"><h3>18 สาขา ครบสายอาชีพ</h3><p>ช่างยนต์ ไฟฟ้า เมคคาทรอนิกส์ โลจิสติกส์ บัญชี ดิจิทัลกราฟิก และอีกมาก ทั้ง ปวช. และ ปวส.</p></div>
        </div>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ค่าเทอมเริ่มต้นที่จับต้องได้ · ผ่อนได้ · กยศ. ได้</h2>
        <p className="mp-lead">อัตราค่าเล่าเรียน ปีการศึกษา 2569 (ต่อภาคเรียน) — ชำระงวดแรกในวันสมัคร ผ่อนได้</p>
        <table className="mp-fee">
          <thead><tr><th>หลักสูตร</th><th>ค่าเทอม/ภาคเรียน</th><th>ผ่อน</th></tr></thead>
          <tbody>
            <tr><td>ปวช. บริหารธุรกิจ (รอบบ่าย)</td><td className="mp-fee-num">10,300 ฿</td><td>2,060 × 5 งวด</td></tr>
            <tr><td>ปวช. ช่างอุตสาหกรรม (รอบเช้า)</td><td className="mp-fee-num">19,000 ฿</td><td>3,800 × 5 งวด</td></tr>
            <tr><td>ปวส. บริหารธุรกิจ (รอบบ่าย)</td><td className="mp-fee-num">18,300 ฿</td><td>3,660 × 5 งวด</td></tr>
          </tbody>
        </table>
        <p className="mp-internal">ดูค่าเทอมครบทุกหลักสูตร → <a href="/tuition">หน้าค่าเทอม &amp; ทุน</a></p>
      </section>

      <section className="container mp-section">
        <div className="mp-cta">
          <div>
            <h2>พร้อมเริ่มเรียนสายอาชีพในชลบุรีแล้ว?</h2>
            <p>สมัครออนไลน์ไม่กี่นาที หรือโทรปรึกษาทีมแนะแนวได้เลย</p>
          </div>
          <div className="mp-cta-actions">
            <a href="/admission" className="btn-primary">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn-ghost">โทร 038-494-066</a>
          </div>
        </div>
        <p className="mp-internal">ดูเพิ่ม: <a href="/courses">หลักสูตรทั้งหมด</a> · <a href="/job-outcomes">จบแล้วทำงานที่ไหน</a> · <a href="/admission-no-exam">สมัครไม่ใช้คะแนน</a></p>
      </section>
    </main>
  );
}
