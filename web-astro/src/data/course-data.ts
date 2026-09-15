// ─────────────────────────────────────────────────────────────
// Course data — ported from prototype course-data.jsx + the COURSES
// list (homepage-sections.jsx). Typed TS module.
//   • COURSES      — enabled course records for every public listing
//   • getCourse    — look up a base course by slug
//   • getCourseDetail — merge per-course rich data with category defaults
//   • COURSE_SLUGS — list of every valid slug (for generateStaticParams)
// Image paths are served from /assets.
// ─────────────────────────────────────────────────────────────

import { getDepartmentContent } from './course-departments';

export type CourseCat = 'อุตสาหกรรม' | 'ดิจิทัล' | 'บริหาร';

export type Course = {
  code: string;
  slug: string;
  name: string;
  icon: string;
  cat: CourseCat;
  hot?: boolean;
  /** False disables the public page and excludes it from listings and navigation. */
  enabled?: boolean;
  /** Existing catalog flags; pt-electrical is additionally documented on Canva page 20. */
  dualVocational?: boolean;
  img?: string;
  color?: string;
};

export type Skill = { t: string; d: string };

export type CoursePhoto = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  kind?: 'photo' | 'cutout';
  sourcePages?: number[];
};

export type CourseDetail = {
  overview: string;
  skills: Skill[];
  careers: string[];
  /** YouTube id for the department review video; '' when none is published yet. */
  video: string;
  hero?: CoursePhoto;
  gallery?: CoursePhoto[];
  labs?: string[];
  learningPlan?: Skill[];
  admission?: string;
  schedule?: string;
  sourceName?: string;
  source?: { url: string; pages: number[] };
  fees?: { total: number; installments: number; foundation: number; note: string };
};

// ── Base course records ─────────────────────────────────────
const COURSE_RECORDS: Course[] = [
  { code: 'ปวช.', slug: 'yon', name: 'ช่างยนต์', icon: 'car', cat: 'อุตสาหกรรม', hot: true, dualVocational: true, img: '/assets/courses/yon.webp', color: '#B12B25' },
  { code: 'ปวช.', slug: 'faifaa', name: 'ช่างไฟฟ้ากำลัง', icon: 'bolt', cat: 'อุตสาหกรรม', hot: true, dualVocational: true, img: '/assets/courses/faifaa.webp', color: '#40ABE0' },
  { code: 'ปวช.', slug: 'gear', name: 'ช่างกลโรงงาน', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/gear.webp', color: '#FBD609' },
  { code: 'ปวช.', slug: 'electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', enabled: false, img: '/assets/courses/electronic.webp' },
  { code: 'ปวช.', slug: 'mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', hot: true, dualVocational: true, img: '/assets/courses/mecha.webp', color: '#FBDC6B' },
  { code: 'ปวช.', slug: 'graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/digital-graphic.webp', color: '#385BF3' },
  { code: 'ปวช.', slug: 'biz-digital', name: 'เทคโนโลยีธุรกิจดิจิทัล', icon: 'chart', cat: 'บริหาร', img: '/assets/courses/digital-business.webp', color: '#EB559F' },
  { code: 'ปวช.', slug: 'accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-mech', name: 'เทคนิคเครื่องกล', icon: 'car', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mechanical.webp', color: '#B12B25' },
  { code: 'ปวส.', slug: 'ps-electrical', name: 'ไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-electrical.webp', color: '#40ABE0' },
  { code: 'ปวส.', slug: 'ps-production', name: 'เทคนิคการผลิต', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-production.webp', color: '#FBD609' },
  { code: 'ปวส.', slug: 'ps-mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mecha.webp', color: '#FBDC6B' },
  { code: 'ปวส.', slug: 'ps-network', name: 'เครือข่ายคอมฯ & ความปลอดภัย', icon: 'network', cat: 'ดิจิทัล', enabled: false, img: '/assets/courses/ps-network.webp', color: '#EB559F' },
  { code: 'ปวส.', slug: 'ps-graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/ps-graphic.webp', color: '#385BF3' },
  { code: 'ปวส.', slug: 'ps-logistics', name: 'การจัดการโลจิสติกส์', icon: 'truck', cat: 'บริหาร', hot: true, dualVocational: true, img: '/assets/courses/ps-logistics.webp', color: '#F26530' },
  { code: 'ปวส.', slug: 'ps-accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/ps-accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', enabled: false, img: '/assets/courses/ps-electronic.webp' },
  { code: 'ปวส.', slug: 'ps-industrial', name: 'เทคนิคอุตสาหกรรม', icon: 'shield', cat: 'อุตสาหกรรม', enabled: false, img: '/assets/courses/ps-industrial.webp' },
  { code: 'ป.ตรี', slug: 'pt-electrical', name: 'เทคโนโลยีไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', dualVocational: true, img: '/assets/courses/canva/bachelor-electrical/electrical-control-panel.jpg', color: '#40ABE0' },
];

// Keep disabled records and their content for later reactivation. Public routes,
// course counts, cards, related courses and sitemap all derive from this list.
export const COURSES: Course[] = COURSE_RECORDS.filter((course) => course.enabled !== false);

// ── Category-level defaults (fallbacks for missing course fields) ──
const CAT_DEFAULTS: Record<CourseCat, Pick<CourseDetail, 'skills' | 'careers'>> = {
  'อุตสาหกรรม': {
    skills: [
      { t: 'การใช้เครื่องจักรอย่างปลอดภัย', d: 'มาตรฐาน ISO + ความปลอดภัยในงาน' },
      { t: 'อ่านแบบ-เขียนแบบเทคนิค', d: 'พิมพ์เขียวงานช่างและ CAD พื้นฐาน' },
      { t: 'การวัดและตรวจสอบ', d: 'เครื่องมือวัดและการควบคุมคุณภาพ' },
      { t: 'ทักษะภาษาอังกฤษเฉพาะอาชีพ', d: 'ศัพท์เทคนิคและเอกสารช่าง' },
    ],
    careers: ['ช่างประจำโรงงาน', 'พนักงานควบคุมเครื่องจักร', 'หัวหน้าทีมการผลิต', 'วิศวกรผู้ช่วย', 'เจ้าหน้าที่บำรุงรักษา', 'ผู้ประกอบการ'],
  },
  'ดิจิทัล': {
    skills: [
      { t: 'การออกแบบและสื่อสารด้วยภาพ', d: 'Adobe Suite, Figma, Canva ระดับมืออาชีพ' },
      { t: 'การคิดแบบ Systems Thinking', d: 'วิเคราะห์ปัญหาและออกแบบโซลูชั่น' },
      { t: 'การทำงานเป็นทีมแบบ Agile', d: 'Kanban, Scrum และเครื่องมือทำงานทีม' },
      { t: 'ภาษาอังกฤษเพื่อดิจิทัล', d: 'ศัพท์เฉพาะและเอกสารเทคนิค' },
    ],
    careers: ['Graphic Designer', 'UI/UX Designer', 'Content Creator', 'Network Admin', 'Digital Marketer', 'Web Developer', 'IT Support', 'Freelancer'],
  },
  'บริหาร': {
    skills: [
      { t: 'การคิดเชิงระบบและวิเคราะห์', d: 'แยกแยะปัญหาและการตัดสินใจ' },
      { t: 'การใช้ MS Office + ระบบ ERP', d: 'Excel, SAP, Oracle, Workday' },
      { t: 'การสื่อสารและทำงานร่วม', d: 'ในทีมข้ามวัฒนธรรม ภาษาอังกฤษพื้นฐาน' },
      { t: 'การเจรจาและบริการ', d: 'การจัดการลูกค้าและคู่ค้า' },
    ],
    careers: ['เจ้าหน้าที่ฝ่ายธุรการ', 'พนักงานบัญชี', 'Logistics Officer', 'Sales / Account Executive', 'พนักงานคลังสินค้า', 'ผู้ประกอบการ SME'],
  },
};

// Legacy content for the four courses not covered by the Canva presentation.
const COURSE_DETAILS: Record<string, Partial<CourseDetail>> = {
  // ── ปวช. ────────────────────────────────────────────────
  'electronic': {
    overview: 'ออกแบบ ประกอบ และซ่อมบำรุงวงจรอิเล็กทรอนิกส์ตั้งแต่ระดับพื้นฐานไปจนถึง IoT และระบบควบคุมอัตโนมัติในอุตสาหกรรม',
    skills: [
      { t: 'การออกแบบวงจร', d: 'Schematic, PCB layout, simulation' },
      { t: 'Microcontroller + IoT', d: 'Arduino, ESP32, sensors, MQTT' },
      { t: 'การวัดและทดสอบ', d: 'Oscilloscope, function generator' },
      { t: 'ระบบควบคุมและสื่อสาร', d: 'Serial, I2C, wireless protocols' },
    ],
    careers: ['ช่างอิเล็กทรอนิกส์โรงงาน', 'นักพัฒนา IoT', 'ช่างซ่อมเครื่องใช้ไฟฟ้า', 'เทคนิคควบคุมการผลิต', 'พนักงานสายการประกอบ'],
  },
  // ── ปวส. ────────────────────────────────────────────────
  'ps-network': {
    overview: 'หลักสูตรเครือข่ายคอมพิวเตอร์และความปลอดภัยไซเบอร์ — เรียนรู้การออกแบบ ติดตั้ง บริหารระบบเครือข่ายและป้องกันภัยคุกคามทางไซเบอร์',
    skills: [
      { t: 'Network Administration', d: 'Cisco, MikroTik, routing & switching' },
      { t: 'Cybersecurity', d: 'Firewall, IDS/IPS, vulnerability scan' },
      { t: 'Cloud & Virtualization', d: 'AWS, Azure, Docker, Kubernetes พื้นฐาน' },
      { t: 'ความปลอดภัยเซิร์ฟเวอร์', d: 'Linux/Windows server hardening' },
    ],
    careers: ['Network Administrator', 'Security Analyst', 'System Administrator', 'IT Support Engineer', 'Cloud Operations', 'Penetration Tester ผู้ช่วย'],
  },
  'ps-electronic': {
    overview: 'หลักสูตรอิเล็กทรอนิกส์ระดับสูง — ออกแบบและซ่อมบำรุงระบบอิเล็กทรอนิกส์ในอุตสาหกรรม รวมถึง IoT, embedded systems และการพัฒนาฮาร์ดแวร์',
    skills: [
      { t: 'Embedded Systems', d: 'ARM, STM32, RTOS basics' },
      { t: 'PCB Design + SMT', d: 'Altium, KiCad, hand assembly' },
      { t: 'Industrial Sensors', d: 'การเลือกและ calibration sensor' },
      { t: 'Test & Validation', d: 'EMC, ESD, environmental testing' },
    ],
    careers: ['Electronic Technician', 'Hardware Developer', 'Test Engineer', 'Service Engineer', 'R&D Technician', 'IoT Solution Specialist'],
  },
  'ps-industrial': {
    overview: 'หลักสูตรเทคนิคอุตสาหกรรม — บริหารและบูรณาการการผลิตในโรงงาน เน้นการเพิ่มประสิทธิภาพ ความปลอดภัย และการพัฒนาอย่างต่อเนื่อง',
    skills: [
      { t: 'Industrial Engineering', d: 'Time study, motion study, ergonomics' },
      { t: 'ความปลอดภัยและสิ่งแวดล้อม', d: 'จป.วิชาชีพ, ISO 14001, OHS' },
      { t: 'การบริหารโครงการ', d: 'PM, Gantt, risk management' },
      { t: 'Quality Management', d: 'ISO 9001, TQM, Six Sigma' },
    ],
    careers: ['Production Supervisor', 'Safety Officer (จป.)', 'Quality Engineer ผู้ช่วย', 'Industrial Engineer ผู้ช่วย', 'Project Coordinator', 'Lean Specialist'],
  },
};

// ── List of every valid slug (for generateStaticParams) ─────
export const COURSE_SLUGS: string[] = COURSES.map((c) => c.slug);

// ── Look up a base course by slug ───────────────────────────
export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

// ── วีดิโอแนะนำแผนก (YouTube) ─────────────────────────────
// ใส่ได้ทั้ง video ID (เช่น 'dQw4w9WgXcQ') หรือลิงก์ YouTube เต็ม
// ปล่อยว่าง = หน้าสาขาจะถอยไปใช้คลิป mp4 ใน public/assets/courses/videos/
// (videos.json) ถ้าไม่มีทั้งคู่จะไม่แสดงส่วนวิดีโอ
export const COURSE_VIDEOS: Record<string, string> = {
  yon: '', faifaa: '', gear: '', electronic: '', mecha: '',
  graphic: '', 'biz-digital': '', accounting: '',
  'ps-mech': '', 'ps-electrical': '', 'ps-production': '', 'ps-electronic': '',
  'ps-mecha': '', 'ps-industrial': '', 'ps-network': '', 'ps-graphic': '',
  'ps-logistics': '', 'ps-accounting': '',
  'pt-electrical': '',
};

// วีดิโอสำรอง (แนะนำวิทยาลัยรวม) ใช้เมื่อแผนกยังไม่มีวีดิโอของตัวเอง
export const FALLBACK_VIDEO = '';

/** Accepts a bare id, a watch/short/shorts/embed URL, or ''. Returns the id or ''. */
export function ytId(v: string | undefined | null): string {
  if (!v) return '';
  const s = String(v).trim();
  if (!/[/?=]/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : '';
}

// ── Merge per-course rich data with category defaults ───────
export function getCourseDetail(slug: string, course?: Course): CourseDetail {
  const det = COURSE_DETAILS[slug] || {};
  const cat = (course && CAT_DEFAULTS[course.cat]) || undefined;
  return {
    video: ytId(COURSE_VIDEOS[slug] || FALLBACK_VIDEO),
    overview: det.overview || 'หลักสูตรที่ผสมผสานการเรียนภาคทฤษฎีและการฝึกปฏิบัติในสายวิชาชีพ',
    skills: det.skills || cat?.skills || [],
    careers: det.careers || cat?.careers || [],
    ...getDepartmentContent(slug),
  };
}
