'use client';

// ─────────────────────────────────────────────────────────────
// Courses listing page body.
// Ported from prototype courses.html (inline babel) + the COURSES
// data / Courses / CourseCard / CTABanner from homepage-sections.jsx.
// Internal links use clean routes; assets served from /assets.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Icon, Reveal, useReveal } from '../components/chrome';

// ── Course data ─────────────────────────────────────────────
type Course = { code: string; slug?: string; name: string; icon: string; cat: string; hot?: boolean; img?: string; color?: string };

const COURSES: Course[] = [
  { code: 'ปวช.', slug: 'yon', name: 'ช่างยนต์', icon: 'car', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/yon.webp', color: '#B12B25' },
  { code: 'ปวช.', slug: 'faifaa', name: 'ช่างไฟฟ้ากำลัง', icon: 'bolt', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/faifaa.webp', color: '#40ABE0' },
  { code: 'ปวช.', slug: 'gear', name: 'ช่างกลโรงงาน', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/gear.webp', color: '#FBD609' },
  { code: 'ปวช.', slug: 'electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: '/assets/courses/electronic.webp' },
  { code: 'ปวช.', slug: 'mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/mecha.webp', color: '#FBDC6B' },
  { code: 'ปวช.', slug: 'graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/digital-graphic.webp', color: '#385BF3' },
  { code: 'ปวช.', slug: 'biz-digital', name: 'เทคโนโลยีธุรกิจดิจิทัล', icon: 'chart', cat: 'บริหาร', img: '/assets/courses/digital-business.webp', color: '#EB559F' },
  { code: 'ปวช.', slug: 'accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-mech', name: 'เทคนิคเครื่องกล', icon: 'car', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mechanical.webp', color: '#B12B25' },
  { code: 'ปวส.', slug: 'ps-electrical', name: 'ไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-electrical.webp', color: '#40ABE0' },
  { code: 'ปวส.', slug: 'ps-production', name: 'เทคนิคการผลิต', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-production.webp', color: '#FBD609' },
  { code: 'ปวส.', slug: 'ps-mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mecha.webp', color: '#FBDC6B' },
  { code: 'ปวส.', slug: 'ps-network', name: 'เครือข่ายคอมฯ & ความปลอดภัย', icon: 'network', cat: 'ดิจิทัล', img: '/assets/courses/ps-network.webp', color: '#EB559F' },
  { code: 'ปวส.', slug: 'ps-graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/ps-graphic.webp', color: '#385BF3' },
  { code: 'ปวส.', slug: 'ps-logistics', name: 'การจัดการโลจิสติกส์', icon: 'truck', cat: 'บริหาร', hot: true, img: '/assets/courses/ps-logistics.webp', color: '#F26530' },
  { code: 'ปวส.', slug: 'ps-accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/ps-accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-electronic.webp' },
  { code: 'ปวส.', slug: 'ps-industrial', name: 'เทคนิคอุตสาหกรรม', icon: 'shield', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-industrial.webp' },
];

// ── Course card (lift) ──────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const c = course;
  const href = c.slug ? `/courses/${c.slug}` : '/courses';
  return (
    <a href={href} className="course-card cc-lift" style={c.color ? { '--dept': c.color } : undefined}>
      {c.img &&
        <div className="cc-photo">
          <img src={c.img} alt="" loading="lazy" />
          {c.hot && <span className="cc-hot">HOT</span>}
          {c.color && <div className="cc-color-bar" style={{ background: c.color }} />}
        </div>
      }
      {!c.img && c.hot && <span className="cc-hot">HOT</span>}
      <div className="cc-body">
        <div className="cc-code">{c.code} · {c.cat}</div>
        <h3 className="cc-name">{c.name}</h3>
        <div className="cc-foot">
          <span style={{ height: '20px', fontSize: '16px' }}>ดูรายละเอียด</span>
          <Icon name="arrow" style={{ width: 18, height: 18 }} />
        </div>
      </div>
    </a>
  );
}

// ── Courses (lift cards grid) ───────────────────────────────
function Courses() {
  const [filter, setFilter] = useState('ทั้งหมด');
  const cats = ['ทั้งหมด', 'อุตสาหกรรม', 'ดิจิทัล', 'บริหาร'];
  const shown = filter === 'ทั้งหมด' ? COURSES : COURSES.filter((c) => c.cat === filter);
  return (
    <section className="section" id="courses">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">หลักสูตรของเรา</span>
          <h2 className="section-title">
            18 สาขาวิชา <span className="grad">ครอบคลุมทุกสายอาชีพ</span>
          </h2>
          <p className="section-sub">เรียนกับอาจารย์ที่มีประสบการณ์จริงในอุตสาหกรรม พร้อมห้องปฏิบัติการมาตรฐาน และเครื่องมือทันสมัย</p>
        </Reveal>
        <Reveal className="course-filters" delay={0.1}>
          {cats.map((c) =>
            <button key={c} className={`chip ${filter === c ? 'chip-active' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          )}
        </Reveal>
        <div className="course-grid card-lift">
          {shown.map((c, i) =>
            <Reveal key={`${c.code}-${c.name}`} delay={Math.min(i * 0.04, 0.4)} dir="scale">
              <CourseCard course={c} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── CTA banner ──────────────────────────────────────────────
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

// ── Courses page body ───────────────────────────────────────
export default function CoursesBody() {
  useReveal();
  const [level, setLevel] = useState('ทั้งหมด');
  const levels = ['ทั้งหมด', 'ปวช.', 'ปวส.', 'ป.ตรี'];
  const PT: Course[] = [{ code: 'ป.ตรี', name: 'เทคโนโลยีบัณฑิต สาขาเทคโนโลยีไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม' }];
  const ALL: Course[] = [...COURSES, ...PT];
  const shown = level === 'ทั้งหมด' ? ALL : ALL.filter((c) => c.code === level);

  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs">
            <a href="/">หน้าแรก</a>
            <Icon name="chevronRight" style={{ width: 12, height: 12 }} />
            <span>หลักสูตร</span>
          </div>
          <span className="eyebrow">หลักสูตรปีการศึกษา 2567</span>
          <h1>18 สาขาวิชา <span className="grad">ครบทุกสายอาชีพ</span></h1>
          <p>เลือกเรียนตามที่สนใจ ปวช. 3 ปี · ปวส. 2 ปี · ปริญญาตรี — ทุกหลักสูตรอัปเดตตามมาตรฐาน 2567 พร้อมระบบทวิภาคีร่วมกับสถานประกอบการ</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div className="tabs">
              {levels.map((l) => (
                <button key={l} className={`tab ${level === l ? 'on' : ''}`} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-500)' }}>
              แสดง <strong style={{ color: 'var(--ink-900)' }}>{shown.length}</strong> สาขา
            </div>
          </div>

          <Reveal>
            <table className="course-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }}></th>
                  <th>ชื่อสาขา</th>
                  <th>ระดับ</th>
                  <th>ระยะเวลา</th>
                  <th>ทวิภาคี</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c, i) => (
                  <tr key={i}>
                    <td><div className="row-icon"><Icon name={c.icon} style={{ width: 20, height: 20 }} /></div></td>
                    <td>
                      <div className="row-name">{c.name}</div>
                      <div className="row-cat">{c.cat}</div>
                    </td>
                    <td>
                      <span className="cc-code-pill" style={{ background: c.code === 'ปวช.' ? 'var(--green-700)' : c.code === 'ปวส.' ? 'var(--crest-navy)' : 'var(--crest-red)' }}>{c.code}</span>
                    </td>
                    <td>{c.code === 'ปวช.' ? '3 ปี' : c.code === 'ปวส.' ? '2 ปี' : '2 ปี'}</td>
                    <td>{c.hot ? <span style={{ color: 'var(--green-700)', fontWeight: 700 }}>✓ รองรับ</span> : <span style={{ color: 'var(--ink-400)' }}>—</span>}</td>
                    <td style={{ textAlign: 'right' }}>
                      <a href={c.slug ? `/courses/${c.slug}` : '/courses'} className="row-cta">รายละเอียด <Icon name="arrow" style={{ width: 14, height: 14 }} /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div style={{ marginTop: 56 }}>
            <Courses />
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
