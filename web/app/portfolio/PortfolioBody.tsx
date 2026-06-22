'use client';

// ─────────────────────────────────────────────────────────────
// Portfolio page body — ported from prototype portfolio.html.
// Internal links use clean routes; assets served from /assets.
// Nav / Footer / StickyCTA are rendered globally (layout.tsx).
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Icon, Reveal } from '../components/chrome';
import INNOV from '../../public/assets/portfolio/innovation/innovation.json';

type Project = { id: string; type: string; title: string; titleEn: string; desc: string; cover: string; photos: string[] };
const PROJECTS = INNOV as Project[];

// รายการผลงาน 24 รายการ (จาก SAR 2568) ยังไม่แสดง — รอจับคู่รูปจริงก่อน
const SHOW_WORKS_LIST = false;

type Work = {
  t: string;
  dept: string;
  author: string;
  tone: string;
  icon: string;
  cat: string;
  year: string;
};

// ผลงานนวัตกรรม สิ่งประดิษฐ์ งานสร้างสรรค์ และงานวิจัย — ปีการศึกษา 2568 (ระดับสถานศึกษา)
// ข้อมูลจริงจากรายงานประกันคุณภาพ มาตรฐานที่ 3.2 ด้านนวัตกรรม (SAR 2568)
const WORKS: Work[] = [
  { t: 'ออกแบบและสร้างโครงโต๊ะชุดฝึกระบบนิวเมติกส์', dept: 'เมคคาทรอนิกส์', author: 'ผลงานนักศึกษา 2568', tone: 'navy', icon: 'gear', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'ออกแบบและสร้างชุดฝึกนิวเมติกส์', dept: 'เมคคาทรอนิกส์', author: 'ผลงานนักศึกษา 2568', tone: 'green', icon: 'gear', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'การออกแบบติดตั้งระบบไฟฟ้าห้องปฏิบัติการนิวเมติกส์', dept: 'ช่างไฟฟ้ากำลัง', author: 'ผลงานนักศึกษา 2568', tone: 'amber', icon: 'bolt', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'ชุดฝึกควบคุมนิวเมติกส์ด้วย PLC', dept: 'เมคคาทรอนิกส์', author: 'ผลงานนักศึกษา 2568', tone: 'red', icon: 'robot', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'ชุดฝึกนิวเมติกส์ไฟฟ้า', dept: 'ช่างไฟฟ้ากำลัง', author: 'ผลงานนักศึกษา 2568', tone: 'navy', icon: 'bolt', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'ชุดฝึกนิวเมติกส์ควบคุมด้วยรีเลย์', dept: 'ช่างไฟฟ้ากำลัง', author: 'ผลงานนักศึกษา 2568', tone: 'green', icon: 'bolt', cat: 'สิ่งประดิษฐ์', year: '2568' },
  { t: 'โมเดลการขนส่งทางราง — กิจกรรมขนส่งทางรางเร็วทันใจ', dept: 'โลจิสติกส์', author: 'ผลงานนักศึกษา 2568', tone: 'amber', icon: 'truck', cat: 'นวัตกรรม', year: '2568' },
  { t: 'โมเดลการจัดการคลังสินค้า — กิจกรรมวงล้อคลังสินค้า', dept: 'โลจิสติกส์', author: 'ผลงานนักศึกษา 2568', tone: 'teal', icon: 'truck', cat: 'นวัตกรรม', year: '2568' },
  { t: 'โมเดลการขนส่งทางท่อ — กิจกรรมเส้นทางท่อวัดดวง', dept: 'โลจิสติกส์', author: 'ผลงานนักศึกษา 2568', tone: 'navy', icon: 'truck', cat: 'นวัตกรรม', year: '2568' },
  { t: 'สื่อการเรียนการสอนผ่านระบบ E-learning', dept: 'สื่อการเรียนการสอน', author: 'ผลงานนักศึกษา 2568', tone: 'green', icon: 'chip', cat: 'นวัตกรรม', year: '2568' },
  { t: 'สื่อการเรียนออนไลน์ การจัดการเทคโนโลยีในงานโลจิสติกส์', dept: 'โลจิสติกส์', author: 'ผลงานนักศึกษา 2568', tone: 'purple', icon: 'chip', cat: 'นวัตกรรม', year: '2568' },
  { t: 'บทเรียนออนไลน์ รายวิชาโลจิสติกส์เบื้องต้น E-learning', dept: 'โลจิสติกส์', author: 'ผลงานนักศึกษา 2568', tone: 'amber', icon: 'chip', cat: 'นวัตกรรม', year: '2568' },
  { t: 'Ignite SPIRIT Kickball — บ.สยามคอมเพรสเซอร์อุตสาหกรรม', dept: 'โลจิสติกส์', author: 'งานทวิภาคี 2568', tone: 'red', icon: 'users', cat: 'นวัตกรรม', year: '2568' },
  { t: 'สำรวจการจัดทำบัญชีของร้านค้ารอบวิทยาลัย', dept: 'การบัญชี', author: 'ผลงานนักศึกษา 2568', tone: 'teal', icon: 'chart', cat: 'งานวิจัย', year: '2568' },
  { t: 'สำรวจการใช้โปรแกรมบัญชีออนไลน์ในธุรกิจ SMEs', dept: 'การบัญชี', author: 'ผลงานนักศึกษา 2568', tone: 'navy', icon: 'chart', cat: 'งานวิจัย', year: '2568' },
  { t: 'สำรวจความเข้าใจภาษีมูลค่าเพิ่มของผู้ประกอบการรายย่อย', dept: 'การบัญชี', author: 'ผลงานนักศึกษา 2568', tone: 'green', icon: 'chart', cat: 'งานวิจัย', year: '2568' },
  { t: 'ลดระยะเส้นทางขนส่งแผนกแพ็คกิ้ง — บ.สยามคอมเพรสเซอร์', dept: 'โลจิสติกส์', author: 'งานทวิภาคี 2568', tone: 'amber', icon: 'truck', cat: 'งานวิจัย', year: '2568' },
  { t: 'ลดต้นทุนของเสียในกระบวนการผลิต — บ.ทาคายาม่า พรีซิชั่น', dept: 'เทคนิคการผลิต', author: 'งานทวิภาคี 2568', tone: 'navy', icon: 'gear', cat: 'งานวิจัย', year: '2568' },
  { t: 'ลดต้นทุนการนำเข้า-ส่งออก — บ.กู๊ดเฟรท ทรานสปอร์ต', dept: 'โลจิสติกส์', author: 'งานทวิภาคี 2568', tone: 'red', icon: 'truck', cat: 'งานวิจัย', year: '2568' },
  { t: 'ลดต้นทุนการขนส่งทางบก — บ.สุมนยาสระบุรี ขนส่ง', dept: 'โลจิสติกส์', author: 'งานทวิภาคี 2568', tone: 'teal', icon: 'truck', cat: 'งานวิจัย', year: '2568' },
  { t: 'สื่อ E-Learning การผลิตแอนิเมชัน 2 มิติ', dept: 'ดิจิทัลกราฟิก', author: 'ผลงานนักศึกษา 2568', tone: 'purple', icon: 'palette', cat: 'งานสร้างสรรค์', year: '2568' },
  { t: 'สื่อ E-Learning การถ่ายภาพดิจิทัล', dept: 'ดิจิทัลกราฟิก', author: 'ผลงานนักศึกษา 2568', tone: 'navy', icon: 'palette', cat: 'งานสร้างสรรค์', year: '2568' },
  { t: 'สื่อ E-learning การออกแบบสื่อสิ่งพิมพ์', dept: 'ดิจิทัลกราฟิก', author: 'ผลงานนักศึกษา 2568', tone: 'green', icon: 'palette', cat: 'งานสร้างสรรค์', year: '2568' },
  { t: 'สื่อ E-learning แนวคิดและการสร้างสรรค์ศิลปกรรม', dept: 'ดิจิทัลกราฟิก', author: 'ผลงานนักศึกษา 2568', tone: 'amber', icon: 'palette', cat: 'งานสร้างสรรค์', year: '2568' },
];

// ── Awards (national skills competition) ────────────────────
// Source: การแข่งขันฝีมือแรงงานแห่งชาติ ครั้งที่ 29 (share). Names published per user OK.
function AwardsBlock() {
  return (
    <section className="section pf-awards-section">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">รางวัลระดับชาติ</span>
          <h2 className="section-title">ฝีมือที่ <span className="grad">พิสูจน์บนเวทีจริง</span></h2>
        </Reveal>
        <Reveal className="pf-award-hero" dir="scale">
          <div className="pf-award-medal">🥇</div>
          <div className="pf-award-body">
            <span className="pf-award-rank">ชนะเลิศ อันดับ 1 ระดับภาค</span>
            <h3 className="pf-award-event">การแข่งขันฝีมือแรงงานแห่งชาติ ครั้งที่ 29</h3>
            <p className="pf-award-field">สาขาเทคโนโลยีระบบไฟฟ้าภายในอาคาร · กลุ่มจังหวัดภาคกลาง</p>
            <div className="pf-award-meta">
              <span><strong>นายอชิรวิทย์ มีทอง</strong> · 77.99 คะแนน</span>
              <span>3 สิงหาคม 2565 · สถาบันพัฒนาฝีมือแรงงาน 3 ชลบุรี</span>
            </div>
            <p className="pf-award-note">เอาชนะวิทยาลัยเทคนิคชลบุรี · ปัญญาภิวัฒน์ · โรงเรียนช่างฝีมือทหาร และอีกหลายสถาบัน</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Skill-standard test center (สพร.) ───────────────────────
function AccreditationBlock() {
  const trades = [
    { t: 'ช่างไฟฟ้าภายในอาคาร', lvl: 'ระดับ 1', lic: 'ชบ 0007.1/2563', pass: 'ผ่าน 33 จาก 35 คน' },
    { t: 'ช่างเครื่องปรับอากาศในบ้านฯ', lvl: 'ระดับ 1', lic: 'ชบ 0009.1/2565', pass: 'ผ่าน 28 จาก 28 คน (100%)' },
    { t: 'ช่างควบคุมด้วยระบบ PLC', lvl: 'ระดับ 1–2', lic: 'รับรองโดยกรมพัฒนาฝีมือแรงงาน', pass: 'เปิดทดสอบต่อเนื่อง' },
    { t: 'พนักงานการใช้คอมพิวเตอร์', lvl: 'ระดับ 1', lic: 'รับรองโดยกรมพัฒนาฝีมือแรงงาน', pass: 'เปิดทดสอบต่อเนื่อง' },
  ];
  return (
    <section className="section pf-accred-section">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">การรับรอง</span>
          <h2 className="section-title">ศูนย์ทดสอบมาตรฐาน<span className="grad">ฝีมือแรงงานแห่งชาติ</span></h2>
          <p className="section-sub">ได้รับอนุญาตจากกรมพัฒนาฝีมือแรงงาน · สถาบันพัฒนาฝีมือแรงงาน 3 ชลบุรี — นักศึกษาสอบมาตรฐานวิชาชีพได้ในสถานศึกษา</p>
        </Reveal>
        <div className="pf-accred-grid">
          {trades.map((t, i) =>
            <Reveal key={t.t} delay={i * 0.06} className="pf-accred-card">
              <div className="pf-accred-check"><Icon name="check" style={{ width: 18, height: 18 }} /></div>
              <h3>{t.t}</h3>
              <span className="pf-accred-lvl">{t.lvl}</span>
              <span className="pf-accred-lic">{t.lic}</span>
              <span className="pf-accred-pass">{t.pass}</span>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Featured projects (only works that have REAL photos from the path) ──
// Click a card → detail modal with the project's full photo set + description.
function ProjectsShowcase() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const proj = PROJECTS.find((p) => p.id === openId) || null;

  const open = (id: string) => { setOpenId(id); setPhotoIdx(0); };
  const close = () => setOpenId(null);
  const step = (d: number) => { if (proj) setPhotoIdx((n) => (n + d + proj.photos.length) % proj.photos.length); };

  useEffect(() => {
    if (!proj) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [proj?.id]);

  return (
    <section className="section pf-proj-section">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">ผลงานเด่น · มีภาพจริง</span>
          <h2 className="section-title">นวัตกรรม &amp; สิ่งประดิษฐ์ <span className="grad">ลงมือทำจริง</span></h2>
          <p className="section-sub">ผลงานและกิจกรรมจริงของนักศึกษา ปีการศึกษา 2568 — คลิกที่การ์ดเพื่อดูภาพและรายละเอียด</p>
        </Reveal>
        <div className="pf-proj-grid">
          {PROJECTS.map((p) => (
            <Reveal key={p.id} dir="scale">
              <button type="button" className="pf-proj-card" onClick={() => open(p.id)} aria-label={`ดูรายละเอียด ${p.title}`}>
                <div className="pf-proj-cover">
                  <img src={p.cover} alt={p.title} loading="lazy" />
                  <span className="pf-proj-type">{p.type}</span>
                  <span className="pf-proj-count"><Icon name="plus" style={{ width: 14, height: 14 }} /> {p.photos.length} ภาพ</span>
                </div>
                <div className="pf-proj-meta">
                  <h3>{p.title}</h3>
                  <span className="pf-proj-en">{p.titleEn}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {proj && (
        <div className="pf-lb pf-modal" role="dialog" aria-modal="true" aria-label={proj.title} onClick={close}>
          <button className="pf-lb-close" onClick={close} aria-label="ปิด">✕</button>
          <div className="pf-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-stage">
              {proj.photos.length > 1 && <button className="pf-lb-nav pf-lb-prev" onClick={() => step(-1)} aria-label="ก่อนหน้า">‹</button>}
              <img src={proj.photos[photoIdx]} alt={`${proj.title} ${photoIdx + 1}`} />
              {proj.photos.length > 1 && <button className="pf-lb-nav pf-lb-next" onClick={() => step(1)} aria-label="ถัดไป">›</button>}
            </div>
            <div className="pf-modal-info">
              <span className="pf-modal-type">{proj.type} · ปีการศึกษา 2568</span>
              <h3>{proj.title}</h3>
              <span className="pf-modal-en">{proj.titleEn}</span>
              <p>{proj.desc}</p>
              <div className="pf-modal-thumbs">
                {proj.photos.map((src, i) => (
                  <button key={src} type="button" className={`pf-modal-thumb ${i === photoIdx ? 'on' : ''}`} onClick={() => setPhotoIdx(i)} aria-label={`ภาพ ${i + 1}`}>
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <span className="pf-modal-counter">{photoIdx + 1} / {proj.photos.length}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── CTA banner (re-created locally from prototype homepage-sections.jsx) ──
function CTABanner() {
  return (
    <section className="section cta-section">
      <div className="container">
        <Reveal className="cta-banner" dir="scale">
          <div className="cta-bg-mesh" />
          <div className="cta-content">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>เปิดรับสมัคร</span>
            <h2 className="cta-title">พร้อมเริ่มต้นเส้นทาง<br /><span className="grad-light">อาชีพที่ใช่</span>หรือยัง?</h2>
            <p className="cta-sub">สมัครออนไลน์ใช้เวลาเพียง 5 นาที — ทีมงานติดต่อกลับภายใน 24 ชม.</p>
            <div className="cta-actions">
              <a href="/admission" className="btn btn-white btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
              <a href="tel:038494066" className="btn btn-ghost btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Icon name="phone" style={{ width: 16, height: 16 }} /> 038-494-066
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function PortfolioBody() {
  const [cat, setCat] = useState('ทั้งหมด');
  const cats = ['ทั้งหมด', 'สิ่งประดิษฐ์', 'นวัตกรรม', 'งานวิจัย', 'งานสร้างสรรค์'];
  const shown = cat === 'ทั้งหมด' ? WORKS : WORKS.filter((w) => w.cat === cat);

  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs">
            <a href="/">หน้าแรก</a>
            <Icon name="chevronRight" style={{ width: 12, height: 12 }} />
            <span>ผลงานวิทยาลัย</span>
          </div>
          <span className="eyebrow">นวัตกรรม · สิ่งประดิษฐ์ · งานวิจัย</span>
          <h1>ผลงาน<span className="grad">ฝีมือเยี่ยม</span> จากครูและนักศึกษา</h1>
          <p>รวมผลงานนวัตกรรม สิ่งประดิษฐ์ งานสร้างสรรค์ และงานวิจัยของนักศึกษา ปีการศึกษา 2568 — รวมงานวิจัยกรณีศึกษาจากสถานประกอบการจริงในเขต EEC</p>
        </div>
      </section>

      <ProjectsShowcase />

      {/* รายการผลงาน 24 รายการ (จากตาราง SAR 2568) — เก็บ data ไว้ ยังไม่แสดง
          รอจับคู่รูปจริงก่อน. เปลี่ยน SHOW_WORKS_LIST = true เพื่อเปิดแสดง. */}
      {SHOW_WORKS_LIST && (
        <section className="section pf-list-section">
          <div className="container">
            <Reveal className="section-head" style={{ textAlign: 'center' }}>
              <span className="eyebrow">รายการผลงานทั้งหมด</span>
              <h2 className="section-title">ผลงาน <span className="grad">ปีการศึกษา 2568</span></h2>
              <p className="section-sub">นวัตกรรม สิ่งประดิษฐ์ งานสร้างสรรค์ และงานวิจัยของนักศึกษา (ระดับสถานศึกษา {WORKS.length} ผลงาน)</p>
            </Reveal>
            <Reveal style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', margin: '8px 0 32px' }}>
              {cats.map((c) => (
                <button key={c} className={`chip ${cat === c ? 'chip-active' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </Reveal>
            <div className="pf-list">
              {shown.map((w, i) => (
                <div key={`${w.t}-${i}`} className={`pf-list-row tone-${w.tone}`}>
                  <span className="pf-list-cat">{w.cat}</span>
                  <span className="pf-list-title">{w.t}</span>
                  <span className="pf-list-dept">{w.dept}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <AwardsBlock />
      <AccreditationBlock />
      <CTABanner />
    </main>
  );
}
