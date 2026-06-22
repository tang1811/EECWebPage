// ─────────────────────────────────────────────────────────────
// Course data — ported from prototype course-data.jsx + the COURSES
// list (homepage-sections.jsx). Typed TS module.
//   • COURSES      — base course records (18 slugs)
//   • getCourse    — look up a base course by slug
//   • getCourseDetail — merge per-course rich data with category defaults
//   • COURSE_SLUGS — list of every valid slug (for generateStaticParams)
// Image paths are served from /assets.
// ─────────────────────────────────────────────────────────────

export type CourseCat = 'อุตสาหกรรม' | 'ดิจิทัล' | 'บริหาร';

export type Course = {
  code: string;
  slug: string;
  name: string;
  icon: string;
  cat: CourseCat;
  hot?: boolean;
  img?: string;
  color?: string;
};

export type Skill = { t: string; d: string };

export type CourseDetail = {
  overview: string;
  skills: Skill[];
  careers: string[];
};

// ── Base course records ─────────────────────────────────────
export const COURSES: Course[] = [
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
  { code: 'ป.ตรี', slug: 'pt-electrical', name: 'เทคโนโลยีไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', color: '#40ABE0' },
];

// ── Category-level defaults (fallbacks for missing course fields) ──
const CAT_DEFAULTS: Record<CourseCat, Omit<CourseDetail, 'overview'>> = {
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

// ── Per-course rich data ────────────────────────────────────
const COURSE_DETAILS: Record<string, Partial<CourseDetail>> = {
  // ── ปวช. ────────────────────────────────────────────────
  'yon': {
    overview: 'ฝึกฝนเป็นช่างซ่อมและบำรุงรักษายานยนต์ครบทุกระบบ ตั้งแต่เครื่องยนต์ ระบบไฟฟ้า ระบบส่งกำลัง ไปจนถึงระบบ EV และเครื่องยนต์ดีเซลในรถพาณิชย์',
    skills: [
      { t: 'การวินิจฉัยเครื่องยนต์', d: 'Diagnostic scan tool + ทักษะการแก้ปัญหา' },
      { t: 'ระบบไฟฟ้ารถยนต์', d: 'ECU, sensor, ระบบจุดระเบิด' },
      { t: 'ระบบส่งกำลังและช่วงล่าง', d: 'เกียร์ คลัตช์ เบรค ระบบบังคับเลี้ยว' },
      { t: 'ยานยนต์ไฟฟ้า (EV)', d: 'แบตเตอรี่และมอเตอร์ขับเคลื่อน' },
    ],
    careers: ['ช่างซ่อมรถยนต์', 'ช่างศูนย์บริการ', 'พนักงานประกอบรถยนต์', 'หัวหน้าช่างซ่อม', 'ช่าง EV', 'ผู้ประกอบการอู่ซ่อมรถ'],
  },
  'faifaa': {
    overview: 'เรียนรู้การออกแบบ ติดตั้ง ตรวจสอบ และซ่อมบำรุงระบบไฟฟ้าทั้งในอาคารพาณิชย์ บ้านพักอาศัย และโรงงานอุตสาหกรรม พร้อมระบบพลังงานทดแทน',
    skills: [
      { t: 'การออกแบบและติดตั้งระบบไฟฟ้า', d: 'ตามมาตรฐาน วสท. และ IEC' },
      { t: 'ระบบควบคุมอัตโนมัติ', d: 'PLC, contactor, relay control' },
      { t: 'พลังงานทดแทน', d: 'Solar PV, Inverter, Energy Storage' },
      { t: 'การวินิจฉัยและซ่อมแซม', d: 'เครื่องมือวัด, multimeter, oscilloscope' },
    ],
    careers: ['ช่างไฟฟ้าโรงงาน', 'ช่างติดตั้ง Solar', 'ช่างบำรุงรักษาระบบ HVAC', 'หัวหน้าทีมงานไฟฟ้า', 'พนักงานการไฟฟ้า', 'ผู้รับเหมา'],
  },
  'gear': {
    overview: 'เรียนรู้งานช่างกลโรงงานครบวงจร — กลึง กัด เจาะ เชื่อม ขึ้นรูปโลหะ ตลอดจนการใช้เครื่อง CNC สำหรับการผลิตชิ้นส่วนคุณภาพสูงในอุตสาหกรรม',
    skills: [
      { t: 'การใช้เครื่องกลึง / เครื่องกัด', d: 'งานกลึง CNC และเครื่องจักรพื้นฐาน' },
      { t: 'การเชื่อมโลหะ', d: 'TIG, MIG, MAG, Arc welding' },
      { t: 'อ่านแบบและเขียนแบบ', d: 'GD&T และ AutoCAD/SolidWorks' },
      { t: 'การประกัน QC', d: 'การวัดความละเอียดสูงและตรวจสอบงาน' },
    ],
    careers: ['ช่างกลึง CNC', 'ช่างเชื่อม', 'หัวหน้าทีมการผลิต', 'พนักงานควบคุมเครื่องจักร', 'ผู้ประกอบการ', 'ช่างต่อเรือ'],
  },
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
  'mecha': {
    overview: 'หลักสูตรล้ำสมัยผสมผสานกลศาสตร์ ไฟฟ้า อิเล็กทรอนิกส์ และโปรแกรมมิ่ง สำหรับสร้างระบบหุ่นยนต์และเครื่องจักรอัตโนมัติแห่งอุตสาหกรรม 4.0',
    skills: [
      { t: 'PLC และระบบควบคุม', d: 'Mitsubishi, Siemens, Omron' },
      { t: 'หุ่นยนต์อุตสาหกรรม', d: 'การโปรแกรมแขนกล AGV, Cobot' },
      { t: 'CAD/CAM/3D Printing', d: 'SolidWorks, Fusion 360' },
      { t: 'การทำ Smart Factory', d: 'IoT, SCADA, MES integration' },
    ],
    careers: ['Robotics Engineer', 'Automation Technician', 'PLC Programmer', 'Maintenance Engineer', 'R&D Specialist', 'System Integrator'],
  },
  'graphic': {
    overview: 'สร้างสรรค์งานออกแบบกราฟิก สื่อสิ่งพิมพ์ มัลติมีเดีย และสื่อดิจิทัลครบทุกรูปแบบ — ตอบโจทย์อุตสาหกรรมโฆษณาและการตลาดยุคใหม่',
    skills: [
      { t: 'Adobe Creative Suite', d: 'Photoshop, Illustrator, InDesign, Premiere' },
      { t: 'การออกแบบสื่อสาร', d: 'Typography, layout, color theory' },
      { t: 'Motion Graphics', d: 'After Effects + พื้นฐาน 2D animation' },
      { t: 'การถ่ายภาพและตัดต่อ', d: 'DSLR, lighting, editing workflow' },
    ],
    careers: ['Graphic Designer', 'Content Creator', 'Social Media Designer', 'Brand Designer', 'Video Editor', 'Freelance Designer'],
  },
  'biz-digital': {
    overview: 'ผสมผสานความรู้ด้านธุรกิจสมัยใหม่กับเทคโนโลยีดิจิทัล — เรียนรู้การตลาดดิจิทัล e-Commerce การวิเคราะห์ข้อมูล และการบริหารองค์กรในยุคดิจิทัล',
    skills: [
      { t: 'Digital Marketing', d: 'Google Ads, FB Ads, SEO, content' },
      { t: 'e-Commerce และระบบ POS', d: 'Shopee/Lazada, Shopify, Square' },
      { t: 'การวิเคราะห์ข้อมูล', d: 'Excel, Power BI, Google Analytics' },
      { t: 'การสื่อสารและบริหารทีม', d: 'Project management, Notion, Trello' },
    ],
    careers: ['Digital Marketer', 'e-Commerce Manager', 'Data Analyst', 'Online Sales', 'Business Development', 'ผู้ประกอบการออนไลน์'],
  },
  'accounting': {
    overview: 'หลักสูตรการบัญชีที่ครอบคลุมตั้งแต่บัญชีพื้นฐาน บัญชีต้นทุน บัญชีภาษีอากร ไปจนถึงระบบสารสนเทศทางบัญชีและการตรวจสอบ',
    skills: [
      { t: 'บัญชีคู่ + งบการเงิน', d: 'การบันทึก การปรับปรุง และปิดบัญชี' },
      { t: 'บัญชีภาษีอากร', d: 'VAT, ภาษีเงินได้, ภงด.50/51/3/53' },
      { t: 'ระบบสารสนเทศบัญชี', d: 'Express, ExpressAccount, SAP B1' },
      { t: 'การสอบบัญชีและการควบคุม', d: 'การควบคุมภายในและการตรวจสอบ' },
    ],
    careers: ['พนักงานบัญชี', 'นักวิเคราะห์การเงิน', 'พนักงานภาษี', 'ผู้ช่วยผู้สอบบัญชี', 'ที่ปรึกษาบัญชีอิสระ', 'ผู้ประกอบการ'],
  },
  // ── ปวส. ────────────────────────────────────────────────
  'ps-mech': {
    overview: 'พัฒนาทักษะช่างเทคนิคเครื่องกลในระดับสูง — งานยานยนต์ขั้นสูง ระบบไฮดรอลิก-นิวเมติก ระบบ EV และการบำรุงรักษาเครื่องจักรในนิคมอุตสาหกรรม',
    skills: [
      { t: 'การวินิจฉัยเครื่องยนต์ขั้นสูง', d: 'OBD-II, scan tool, ECU mapping' },
      { t: 'ระบบไฮดรอลิก / นิวเมติก', d: 'การออกแบบและซ่อมบำรุง' },
      { t: 'รถ EV และ Hybrid', d: 'ระบบแบตเตอรี่ มอเตอร์ และความปลอดภัย' },
      { t: 'การบริหารงานช่าง', d: 'การวางแผนซ่อมบำรุงเชิงป้องกัน' },
    ],
    careers: ['Senior Technician', 'EV Specialist', 'หัวหน้าศูนย์บริการ', 'Maintenance Supervisor', 'Service Advisor', 'ผู้ประกอบการ'],
  },
  'ps-electrical': {
    overview: 'ออกแบบและบริหารงานระบบไฟฟ้าและพลังงานในระดับสูง รวมถึง Smart Grid, Energy Management และโครงการพลังงานทดแทนเชิงพาณิชย์',
    skills: [
      { t: 'ออกแบบระบบไฟฟ้าโรงงาน', d: 'Load calculation, single-line diagram' },
      { t: 'ระบบควบคุม PLC + SCADA', d: 'Industrial automation networks' },
      { t: 'Solar PV + ESS', d: 'การออกแบบและติดตั้งเชิงพาณิชย์' },
      { t: 'การประหยัดพลังงาน', d: 'Energy audit, ISO 50001' },
    ],
    careers: ['Electrical Engineer ผู้ช่วย', 'หัวหน้าทีมไฟฟ้า', 'Solar Engineer', 'Energy Auditor', 'พนักงานการไฟฟ้า', 'ผู้รับเหมา'],
  },
  'ps-production': {
    overview: 'ผู้ผลิตชิ้นงานคุณภาพในนิคมอุตสาหกรรม — ใช้เครื่อง CNC ระดับอุตสาหกรรม CAD/CAM และระบบการผลิตแบบ Lean เพื่อตอบโจทย์การผลิตขั้นสูง',
    skills: [
      { t: 'CNC Programming', d: 'G-code, Mastercam, Fusion 360 CAM' },
      { t: 'Lean Manufacturing + 5S', d: 'Kaizen และ Six Sigma เบื้องต้น' },
      { t: 'การวัดและ QC ขั้นสูง', d: 'CMM, Surface Roughness, Hardness' },
      { t: 'การบริหารทีมผลิต', d: 'Production Planning + KPI' },
    ],
    careers: ['CNC Operator', 'Production Supervisor', 'QC Inspector', 'CAM Programmer', 'Process Engineer', 'หัวหน้าทีมผลิต'],
  },
  'ps-mecha': {
    overview: 'ระดับสูงของเมคคาทรอนิกส์ — ออกแบบและบูรณาการระบบหุ่นยนต์ ระบบควบคุมอัตโนมัติ และ Industrial IoT สำหรับ Smart Factory ในยุคอุตสาหกรรม 4.0',
    skills: [
      { t: 'การออกแบบระบบควบคุม', d: 'PLC, HMI, SCADA, motion control' },
      { t: 'หุ่นยนต์ขั้นสูง', d: 'Industrial robots, AGV, Cobots' },
      { t: 'IIoT + Data Analytics', d: 'MQTT, Edge computing, dashboards' },
      { t: 'System Integration', d: 'รวมระบบจากหลายผู้ผลิตเข้าด้วยกัน' },
    ],
    careers: ['Robotics Technician', 'Automation Engineer ผู้ช่วย', 'System Integrator', 'IIoT Specialist', 'R&D Engineer', 'Smart Factory Consultant'],
  },
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
  'ps-graphic': {
    overview: 'ระดับสูงของงานออกแบบ — UX/UI Design, Motion Graphics, 3D และการผลิตสื่อโฆษณาเชิงพาณิชย์ พร้อมทักษะการทำงานเป็นทีม Designer',
    skills: [
      { t: 'UX/UI Design', d: 'Figma, prototyping, design systems' },
      { t: 'Motion + Video Production', d: 'After Effects, Premiere Pro, DaVinci' },
      { t: '3D Modeling', d: 'Blender, Cinema 4D basics' },
      { t: 'Brand & Identity Design', d: 'Logo system, brand book, packaging' },
    ],
    careers: ['UI/UX Designer', 'Motion Designer', 'Art Director ผู้ช่วย', 'Brand Designer', '3D Artist', 'Freelance Senior Designer'],
  },
  'ps-logistics': {
    overview: 'หลักสูตรอันดับ 1 ในพื้นที่ — ผลิตบุคลากรป้อนสู่ท่าเรือแหลมฉบังและนิคม EEC ที่ต้องการบุคลากรปีละหลายพันคน ด้วยทักษะ Supply Chain ระดับสากล',
    skills: [
      { t: 'การขนส่งและกระจายสินค้า', d: 'การวางแผนเส้นทางและจัดการขนส่ง' },
      { t: 'การจัดการคลังสินค้า', d: 'WMS, การจัดเก็บ ตรวจนับ กระจาย' },
      { t: 'การวิเคราะห์ Supply Chain', d: 'Optimization, KPI dashboards' },
      { t: 'ระบบ ERP อุตสาหกรรม', d: 'SAP, Oracle, ระบบศุลกากร' },
    ],
    careers: ['เจ้าหน้าที่คลังสินค้า', 'Logistics Coordinator', 'Warehouse Supervisor', 'Import-Export Officer', 'พนักงานท่าเรือ', 'ตัวแทนขนส่งระหว่างประเทศ'],
  },
  'ps-accounting': {
    overview: 'ระดับสูงของวิชาชีพบัญชี — เน้นบัญชีต้นทุน บัญชีภาษีขั้นสูง ระบบ ERP และการเตรียมตัวสอบ CPA สำหรับผู้ที่จะเป็นนักบัญชีมืออาชีพ',
    skills: [
      { t: 'บัญชีต้นทุนและการบริหาร', d: 'Activity-based costing + budgeting' },
      { t: 'บัญชีภาษีอากรขั้นสูง', d: 'ภาษีนิติบุคคล + ภาษีระหว่างประเทศ' },
      { t: 'ระบบ ERP สำหรับบัญชี', d: 'SAP FI/CO, Oracle, NetSuite' },
      { t: 'การวิเคราะห์งบการเงิน', d: 'Ratio, valuation, forecasting' },
    ],
    careers: ['Senior Accountant', 'Tax Specialist', 'ผู้ช่วยผู้สอบบัญชี (Audit)', 'Financial Analyst', 'Cost Accountant', 'ที่ปรึกษาภาษี'],
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
  // ── ป.ตรี (เทคโนโลยีบัณฑิต) ─────────────────────────────
  'pt-electrical': {
    overview: 'หลักสูตรเทคโนโลยีบัณฑิต สาขาเทคโนโลยีไฟฟ้า (ต่อเนื่อง) — ยกระดับช่างเทคนิคสู่นักเทคโนโลยีไฟฟ้ามืออาชีพ ครอบคลุมการออกแบบระบบไฟฟ้ากำลัง ระบบควบคุมอัตโนมัติ พลังงานทดแทน และการบริหารงานวิศวกรรม',
    skills: [
      { t: 'ออกแบบระบบไฟฟ้ากำลัง', d: 'Load flow, protection, single-line ระดับวิชาชีพ' },
      { t: 'ระบบควบคุมอัตโนมัติขั้นสูง', d: 'PLC, SCADA, motion & process control' },
      { t: 'พลังงานทดแทนเชิงระบบ', d: 'Solar PV, ESS, microgrid, ISO 50001' },
      { t: 'การบริหารโครงการวิศวกรรม', d: 'การวางแผน งบประมาณ และความปลอดภัย' },
    ],
    careers: ['นักเทคโนโลยีไฟฟ้า', 'หัวหน้าวิศวกรรมไฟฟ้า', 'Solar/Energy Engineer', 'Automation Engineer', 'ผู้จัดการโครงการไฟฟ้า', 'ผู้รับเหมางานระบบ'],
  },
};

// ── List of every valid slug (for generateStaticParams) ─────
export const COURSE_SLUGS: string[] = COURSES.map((c) => c.slug);

// ── Look up a base course by slug ───────────────────────────
export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

// ── Merge per-course rich data with category defaults ───────
export function getCourseDetail(slug: string, course?: Course): CourseDetail {
  const det = COURSE_DETAILS[slug] || {};
  const cat = (course && CAT_DEFAULTS[course.cat]) || undefined;
  return {
    overview: det.overview || 'หลักสูตรคุณภาพที่ผสมผสานทั้งภาคทฤษฎีและภาคปฏิบัติ พร้อมระบบทวิภาคีกับสถานประกอบการชั้นนำ',
    skills: det.skills || cat?.skills || [],
    careers: det.careers || cat?.careers || [],
  };
}
