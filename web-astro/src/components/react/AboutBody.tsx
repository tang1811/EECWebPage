import type { ReactNode } from 'react';
import { SITE_NAME } from '../../config';
import { COURSES, type CoursePhoto } from '../../data/course-data';
import { TIMELINE, PHILOSOPHY, PRINCIPALS, DEPUTIES, type Leader } from '../../data/about-college-data';
import { ABOUT_LEVELS, ABOUT_DEPARTMENTS, CANVA_SOURCE, COLLEGE_PHOTO, PRACTICE_PHOTO, BACHELOR_COURSE, BACHELOR_DETAIL, BACHELOR_PHOTO } from '../../data/about-canva-data';
import { Icon } from './chrome-lite';

function Heading({ label, children }: { label: string; children: ReactNode }) {
  return <header className="ab-heading"><p className="ab-eyebrow">{label}</p><h2>{children}</h2></header>;
}

function Photo({ photo, caption = photo.alt, priority = false, cutout = false }: { photo: CoursePhoto; caption?: string; priority?: boolean; cutout?: boolean }) {
  return <figure className={`ab-photo${cutout ? ' ab-photo-cutout' : ''}`}>
    <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`ดูภาพเต็มในแท็บใหม่: ${photo.alt}`}>
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
      <span className="ab-photo-expand" aria-hidden="true">↗</span>
    </a>
    <figcaption>{caption}</figcaption>
  </figure>;
}

function Opening() {
  return <section className="ab-section ab-hero cine-opening" id="about-college">
    <div className="ab-container ab-split">
      <div className="ab-hero-copy">
        <nav className="ab-crumbs" aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a><span aria-hidden="true">/</span><span aria-current="page">เกี่ยวกับเรา</span></nav>
        <p className="ab-eyebrow">EEC ENGINEER LAEMCHABANG</p>
        <h1>รู้จัก<br /><em>เทคโนแหลมฉบัง</em></h1>
        <p className="ab-college-name">{SITE_NAME}</p>
        <p className="ab-lead">เรียนรู้วิชาชีพผ่านทฤษฎีและการลงมือทำ ควบคู่กับระเบียบวินัยและคุณธรรม ในสายช่างอุตสาหกรรม พาณิชยกรรม และศิลปกรรม</p>
        <p className="ab-location"><Icon name="pin" style={{ width: 18, height: 18 }} />ทุ่งสุขลา · ศรีราชา · ชลบุรี</p>
        <div className="ab-actions"><a className="ab-button ab-button-primary" href="#about-learning">รู้จักการเรียนที่นี่ <span aria-hidden="true">↓</span></a><a className="ab-button ab-button-outline" href="/courses/">สำรวจหลักสูตร <span aria-hidden="true">→</span></a></div>
      </div>
      <Photo photo={COLLEGE_PHOTO} priority caption="อาคารวิทยาลัยและบริเวณด้านหน้า · ทุ่งสุขลา ศรีราชา" />
    </div>
  </section>;
}

function StudyPaths() {
  return <section className="ab-section ab-study cine-stats" id="about-study">
    <div className="ab-container">
      <Heading label="เส้นทางการศึกษา">เลือกเรียนให้เหมาะกับ<em>จุดเริ่มต้นของคุณ</em></Heading>
      <div className="ab-level-grid">{ABOUT_LEVELS.map((level) => <article className="ab-level" key={level.code}>
        <div className="ab-level-top"><h3>{level.code}</h3><span>{level.duration}</span></div>
        <p className="ab-level-name">{level.name}</p><p className="ab-level-admission">{level.admission}</p><p className="ab-muted">{level.description}</p>
      </article>)}</div>
      <p className="ab-study-link"><a href="/courses/">สำรวจรายละเอียด {COURSES.length} หลักสูตรบนเว็บไซต์ <span aria-hidden="true">→</span></a></p>
    </div>
  </section>;
}

function Philosophy() {
  return <section className="ab-section ab-values cine-philo-wrap" id="our-values">
    <div className="ab-container">
      <Heading label="ปรัชญาวิทยาลัย">ความรู้คู่ทักษะ<em>เติบโตพร้อมคุณธรรม</em></Heading>
      <blockquote className="ab-motto">“มุ่งสร้างคนดี มีระเบียบวินัย<br />ก้าวไกลเทคโนโลยี ฝีมือเยี่ยม เปี่ยมคุณธรรม”</blockquote>
      <ol className="ab-value-grid">{PHILOSOPHY.map((value) => <li key={value.num}><span className="ab-value-number" aria-hidden="true">{value.num}</span><h3>{value.th}</h3><p>{value.d}</p></li>)}</ol>
    </div>
  </section>;
}

function Learning() {
  return <section className="ab-section ab-learning" id="about-learning">
    <div className="ab-container ab-split">
      <Photo photo={PRACTICE_PHOTO} />
      <div><Heading label="การเรียนที่นี่เป็นอย่างไร">เข้าใจหลักการ<em>แล้วฝึกกับงานปฏิบัติ</em></Heading>
        <p className="ab-lead">การเรียนของแต่ละแผนกเชื่อมความรู้ในห้องเรียนเข้ากับทักษะวิชาชีพ ตั้งแต่งานซ่อมบำรุงและการควบคุมเครื่องจักร ไปจนถึงงานบัญชี การจัดการ และการสร้างสื่อดิจิทัล</p>
        <ol className="ab-learning-steps">
          <li><span aria-hidden="true">01</span><div><h3>เรียนรู้หลักการและเครื่องมือ</h3><p>ศึกษาทฤษฎีและวิธีการทำงานในสาขา เพื่อเข้าใจสิ่งที่จะนำไปใช้จริง</p></div></li>
          <li><span aria-hidden="true">02</span><div><h3>ฝึกทักษะในงานของแผนก</h3><p>ลงมือปฏิบัติกับเครื่องมือ ชุดฝึก หรือโครงงานที่เกี่ยวข้องกับวิชาชีพ</p></div></li>
          <li><span aria-hidden="true">03</span><div><h3>นำความรู้ไปประยุกต์ใช้</h3><p>เชื่อมโยงความรู้กับการแก้ปัญหาและการทำงานในสายอาชีพที่สนใจ</p></div></li>
        </ol>
      </div>
    </div>
  </section>;
}

function Departments() {
  return <section className="ab-section ab-departments" id="about-departments">
    <div className="ab-container">
      <Heading label="ช่างอุตสาหกรรม · พาณิชยกรรม · ศิลปกรรม">ห้องปฏิบัติการและชุดฝึก<em>ของแต่ละแผนก</em></Heading>
      <p className="ab-section-intro">รู้จักงานที่ได้ฝึกและพื้นที่การเรียนรู้ของแต่ละสาขา พร้อมดูรายละเอียดหลักสูตรในระดับที่สนใจ</p>
      <div className="ab-department-grid">{ABOUT_DEPARTMENTS.map((department) => <article key={department.name} className="ab-department-card">
        <Photo photo={department.photo} cutout={department.photo.kind === 'cutout'} caption={`${department.photo.alt}${department.illustration ? ' · ภาพประกอบแผนกจากเอกสาร' : ''}`} />
        <div className="ab-department-copy"><span className="ab-department-group">{department.group}</span><h3>{department.name}</h3>
          <ul>{department.labs.slice(0, 3).map((lab) => <li key={lab}>{lab}</li>)}</ul>
          <div className="ab-course-links">{department.courses.map((course) => <a key={course.slug} href={`/courses/${course.slug}/`} aria-label={`ดูหลักสูตร ${course.code} ${course.name}`}>{course.code} <span aria-hidden="true">→</span></a>)}</div>
        </div>
      </article>)}</div>
    </div>
  </section>;
}

function ContinuingStudy() {
  if (!BACHELOR_COURSE || !BACHELOR_DETAIL) return null;
  return <section className="ab-section ab-continuing" id="about-continuing">
    <div className="ab-container ab-split"><div>
      <Heading label="เรียนต่อสำหรับผู้มีงานประจำ">ต่อยอดสู่วุฒิปริญญาตรี<em>เทคโนโลยีไฟฟ้า</em></Heading>
      <div className="ab-study-badges"><span>ต่อเนื่อง 2 ปี</span><span>เรียน{BACHELOR_DETAIL.schedule}</span></div>
      <p className="ab-lead">{BACHELOR_DETAIL.admission} สามารถต่อยอดความรู้ด้านระบบไฟฟ้าอุตสาหกรรม ระบบควบคุม และการจัดการพลังงาน</p>
      <ol className="ab-bachelor-plan">{BACHELOR_DETAIL.learningPlan?.map((stage) => <li key={stage.t}><h3>{stage.t}</h3><p>{stage.d}</p></li>)}</ol>
      <a className="ab-button ab-button-gold" href={`/courses/${BACHELOR_COURSE.slug}/`}>ดูหลักสูตรและค่าใช้จ่าย <span aria-hidden="true">→</span></a>
      <p className="ab-small">สอบถามตารางเรียนและเงื่อนไขของรอบที่สมัครกับวิทยาลัย</p>
    </div><Photo photo={BACHELOR_PHOTO} /></div>
  </section>;
}

function CollegeHistory() {
  return <section className="ab-section ab-history cine-tl-wrap" id="our-story"><div className="ab-container">
    <Heading label="ประวัติวิทยาลัย">เส้นทางของ<em>เทคโนแหลมฉบัง</em></Heading>
    <ol className="ab-timeline">{TIMELINE.map((milestone) => <li key={milestone.y}><span className="ab-timeline-year">พ.ศ. {milestone.y}</span><div><h3>{milestone.t}</h3><p>{milestone.d}</p></div></li>)}</ol>
  </div></section>;
}

function Vision() {
  return <section className="ab-section ab-vision cine-vision" id="our-vision"><div className="ab-container ab-vision-grid">
    <div><Heading label="วิสัยทัศน์">สถานศึกษาคุณธรรม<em>ที่มีคุณภาพ</em></Heading>
      <p className="ab-lead">เป็นสถานศึกษาคุณธรรมที่มีคุณภาพตามมาตรฐานอาชีวศึกษา ผู้เรียนมีความรู้และทักษะวิชาชีพตามนโยบายประเทศไทย 4.0 เป็นที่ต้องการของสถานประกอบการ</p>
      <dl className="ab-identity"><div><dt>เอกลักษณ์</dt><dd>เทคโนโลยีดี ฝีมือเยี่ยม เปี่ยมคุณธรรม</dd></div><div><dt>อัตลักษณ์</dt><dd>ทักษะเทคโนโลยีดี มีคุณธรรม</dd></div></dl>
    </div>
    <div><h3 className="ab-mission-title">พันธกิจของวิทยาลัย</h3><ol className="ab-missions">
      <li><strong>พัฒนาสมรรถนะวิชาชีพ</strong> ตรงความต้องการสถานประกอบการ</li>
      <li><strong>ทักษะศตวรรษที่ 21</strong> (3R8C) ตามหลักเศรษฐกิจพอเพียง</li>
      <li><strong>ปลูกฝังคุณธรรม</strong> จริยธรรม และจิตสำนึกอนุรักษ์</li>
      <li><strong>หลักสูตรฐานสมรรถนะ</strong> ตรงความต้องการตลาดแรงงาน</li>
      <li><strong>สรรหาและพัฒนาครู</strong> ให้มีคุณธรรมและความรู้</li>
      <li><strong>พัฒนาอาคารและห้องปฏิบัติการ</strong> สื่อ เทคโนโลยี ตามไทยแลนด์ 4.0</li>
      <li><strong>บริหารตามหลักธรรมาภิบาล</strong></li>
      <li><strong>ความร่วมมือระบบทวิภาคี</strong> กับสถานประกอบการ</li>
      <li><strong>ส่งเสริมนวัตกรรม</strong> สิ่งประดิษฐ์ งานวิจัย เผยแพร่สู่สาธารณะ</li>
      <li><strong>ศูนย์บ่มเพาะ</strong> ผู้ประกอบการอาชีวศึกษา</li>
    </ol></div>
  </div></section>;
}

function LeaderCard({ leader }: { leader: Leader }) {
  return <article className="ab-leader"><div className="ab-leader-photo"><img src={leader.img} alt={leader.n} loading="lazy" /></div><h3>{leader.n}</h3><p>{leader.r}</p></article>;
}

function Leadership() {
  return <section className="ab-section ab-leadership cine-leaders" id="our-people"><div className="ab-container">
    <Heading label="ทีมผู้บริหาร">ผู้ขับเคลื่อน<em>การเรียนรู้ของวิทยาลัย</em></Heading>
    <h3 className="ab-tier">ผู้บริหารระดับสูง</h3><div className="ab-leader-grid ab-principals">{PRINCIPALS.map((leader) => <LeaderCard key={leader.n} leader={leader} />)}</div>
    <h3 className="ab-tier">รองผู้อำนวยการ · 6 ฝ่าย</h3><div className="ab-leader-grid ab-deputies">{DEPUTIES.map((leader) => <LeaderCard key={leader.n} leader={leader} />)}</div>
    <p className="ab-study-link"><a href="/personnel/">ดูบุคลากรทั้งหมด <span aria-hidden="true">→</span></a></p>
  </div></section>;
}

function Contact() {
  return <section className="ab-section ab-contact" id="about-contact"><div className="ab-container ab-contact-inner">
    <Heading label="ติดต่อวิทยาลัย">มารู้จักเรา<em>ให้มากขึ้น</em></Heading>
    <p className="ab-lead">{SITE_NAME}<br />ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230</p>
    <div className="ab-actions"><a className="ab-button ab-button-gold" href="tel:038494066">โทร 038 494 066</a><a className="ab-button ab-button-outline" href="/contact/">ที่ตั้งและช่องทางติดต่อ <span aria-hidden="true">→</span></a></div>
  </div></section>;
}

// Rendered as HTML by Astro. Nothing depends on hydration or scroll animation.
export default function AboutBody() {
  return <main className="about-page">
    <Opening /><StudyPaths /><Philosophy /><Learning /><Departments /><ContinuingStudy />
    <aside className="ab-source"><div className="ab-container"><p>ข้อมูลการเรียน ปรัชญา ห้องปฏิบัติการ และภาพประกอบด้านบน มาจากเอกสารแนะนำแผนกของวิทยาลัย</p><a href={`${CANVA_SOURCE}#2`} target="_blank" rel="noopener noreferrer">ดูเอกสารแนะนำวิทยาลัยและแผนก ↗</a></div></aside>
    <CollegeHistory /><Vision /><Leadership /><Contact />
  </main>;
}
