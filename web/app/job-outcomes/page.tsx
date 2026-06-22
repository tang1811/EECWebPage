import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import '../styles/money.css';

export const metadata: Metadata = {
  title: 'เรียนช่าง จบแล้วมีงานทำ — ในนิคม EEC ชลบุรี',
  description:
    'เรียน ปวช./ปวส. แล้วได้งานจริงไหม? ผู้สำเร็จการศึกษา ปวส. ที่ติดตามได้ มีงานทำกว่า 83% เงินเดือนเริ่มต้นเฉลี่ย ~12,500 บาท ในโรงงานและบริษัทชั้นนำเขต EEC — ฝึกงานทวิภาคีกับสถานประกอบการจริง',
  keywords: ['เรียนช่าง จบแล้วมีงานทำ', 'อาชีวะ ได้งาน ชลบุรี', 'ปวส โควตาโรงงาน EEC', 'ทวิภาคี ชลบุรี', 'จบ ปวส ทำงานที่ไหน'],
  alternates: { canonical: '/job-outcomes' },
};

export default function Page() {
  const employers = ['ปตท.', 'Mitsubishi', 'Caterpillar', 'เคียวเดน', 'ซูมิเดน สตีล', 'AGC', 'ซัมมิท ออโต้บอดี้', 'อีสเทิร์น คอนทรานส์'];
  return (
    <main className="mp-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs"><a href="/">หน้าแรก</a> <span>/</span> <span>จบแล้วมีงานทำ</span></div>
          <span className="eyebrow">นิคมอุตสาหกรรมตะวันออก · EEC</span>
          <h1>เรียนช่าง <span className="grad">จบแล้วมีงานทำจริง</span></h1>
          <p>
            จุดเด่นของสายอาชีพคือ “จบแล้วทำงานได้ทันที” — ที่ EEC Engineer แหลมฉบัง นักศึกษาฝึกงานทวิภาคีกับโรงงานจริง
            จบมาพร้อมทำงานในเขตพัฒนาพิเศษภาคตะวันออก
          </p>
          <div className="cta-actions" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/admission" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn btn-ghost btn-lg">โทร 038-494-066</a>
          </div>
        </div>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ตัวเลขที่พิสูจน์ได้</h2>
        <div className="mp-stats">
          <div className="mp-stat"><b>83%</b><span>ปวส. มีงานทำ</span></div>
          <div className="mp-stat"><b>16%</b><span>ปวส. ศึกษาต่อ</span></div>
          <div className="mp-stat"><b>89%</b><span>ปวช. ศึกษาต่อ</span></div>
          <div className="mp-stat"><b>12,500฿</b><span>เงินเดือนเริ่มต้นเฉลี่ย (ปวส.)</span></div>
        </div>
        <p className="mp-internal">* ข้อมูลผู้สำเร็จการศึกษา ปีการศึกษา 2565 จากการสำรวจที่ติดตามได้ 268 คน (ปวช. 138 · ปวส. 130)</p>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ศิษย์เก่าทำงานที่</h2>
        <p className="mp-lead">บริษัทและโรงงานชั้นนำในเขต EEC ที่รับนักศึกษาของเราเข้าทำงาน</p>
        <div className="mp-emp">{employers.map((e) => <span key={e}>{e}</span>)}<span>และอีกหลายแห่ง</span></div>
      </section>

      <section className="container mp-section">
        <h2 className="mp-h2">ทำไมจบแล้วได้งาน</h2>
        <div className="mp-cards">
          <div className="mp-card"><h3>ระบบทวิภาคี (DVE)</h3><p>เรียนคู่กับการฝึกงานในสถานประกอบการจริง เช่น ฮอนด้า สยามคอมเมอร์เชียลซีพอร์ท — ได้ประสบการณ์ก่อนจบ</p></div>
          <div className="mp-card"><h3>ทักษะตรงอุตสาหกรรม</h3><p>หลักสูตรฐานสมรรถนะ เรียนกับเครื่องมือจริง ตรงความต้องการโรงงานในนิคม EEC</p></div>
          <div className="mp-card"><h3>ศูนย์ทดสอบฝีมือแรงงาน</h3><p>สอบมาตรฐานฝีมือแรงงานแห่งชาติได้ในวิทยาลัย เพิ่มโอกาสและฐานเงินเดือน</p></div>
        </div>
      </section>

      <section className="container mp-section">
        <div className="mp-cta">
          <div>
            <h2>อยากจบมามีงานทำ? เริ่มที่นี่</h2>
            <p>สมัครเรียนสายอาชีพที่ตลาด EEC ต้องการ — ทีมงานพร้อมให้คำปรึกษา</p>
          </div>
          <div className="mp-cta-actions">
            <a href="/admission" className="btn-primary">สมัครเรียนออนไลน์</a>
            <a href="tel:038494066" className="btn-ghost">โทร 038-494-066</a>
          </div>
        </div>
        <p className="mp-internal">ดูเพิ่ม: <a href="/courses">หลักสูตรทั้งหมด</a> · <a href="/tuition">ค่าเทอม &amp; ทุน</a> · <a href="/study-vocational-chonburi">เรียนอาชีวะ ชลบุรี</a></p>
      </section>
    </main>
  );
}
