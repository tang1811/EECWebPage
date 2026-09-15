// Existing college history, vision and leadership. These records predate the
// Canva import and are not claimed to be verified by that presentation.
const EXEC = '/assets/staff/executives/';
export type Leader = { n: string; r: string; img: string; c: string };

export const TIMELINE = [
  { y: '2538', t: 'จุดเริ่มต้น', d: 'ก่อตั้ง 1 มี.ค. 2538 ในชื่อ "โรงเรียนเทคโนโลยีศรีราชาช่างอุตสาหกรรม" โดย ดร.สัมภาษณ์ บุญจี๊ด', img: '/assets/slide-2-eec.webp' },
  { y: '2539', t: 'เปลี่ยนชื่อ', d: 'เปลี่ยนชื่อเป็น "โรงเรียนเทคโนโลยีแหลมฉบัง"', img: '/assets/courses/yon.webp' },
  { y: '2554', t: 'ยกระดับ', d: 'ปรับฐานะเป็น "วิทยาลัยเทคโนโลยีแหลมฉบัง" เปิดสอน ปวส.', img: '/assets/courses/faifaa.webp' },
  { y: '2563', t: 'เพิ่มหลักสูตร', d: 'เปิดสาขาคอมพิวเตอร์กราฟิก ประเภทวิชาศิลปกรรม', img: '/assets/courses/digital-graphic.webp' },
  { y: '2564', t: 'ชื่อปัจจุบัน', d: 'เปลี่ยนชื่อเป็น "วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง"', img: '/assets/courses/ps-mecha.webp' },
];

export const PHILOSOPHY = [
  { num: '01', th: 'มุ่งสร้างคนดี', en: 'Be Good', d: 'ทั้งต่อตนเองและสังคม', img: '/assets/slide-1-apply.webp', accent: '#F26530' },
  { num: '02', th: 'มีระเบียบวินัย', en: 'Discipline', d: 'แบบแผนการปฏิบัติตน', img: '/assets/news-3-military.webp', accent: '#40ABE0' },
  { num: '03', th: 'ก้าวไกลเทคโนโลยี', en: 'Future-Ready', d: 'พัฒนาเทคโนโลยีให้เจริญก้าวหน้าทันยุคทันสมัย', img: '/assets/courses/ps-mecha.webp', accent: '#FBD609' },
  { num: '04', th: 'ฝีมือเยี่ยม', en: 'Master Craft', d: 'ทักษะวิชาชีพระดับสูง พร้อมปฏิบัติงานจริง', img: '/assets/courses/ps-mechanical.webp', accent: '#B12B25' },
  { num: '05', th: 'เปี่ยมคุณธรรม', en: 'Virtuous Mind', d: 'มีคุณธรรม จริยธรรม ค่านิยมที่ดี', img: '/assets/slide-4-community.webp', accent: '#7B5CA7' },
];

export const PRINCIPALS: Leader[] = [
  { n: 'ดร.ยงลักษณ์ บุญจี๊ด', r: 'ผู้รับใบอนุญาต', img: EXEC + 'license-yonglak.webp', c: '#026451' },
  { n: 'อ.ภาตะวัน บุญจี๊ด', r: 'ผู้อำนวยการ', img: EXEC + 'director-phatawan.webp', c: '#1c2a4e' },
  { n: 'อ.ภาคภูมิ บุญจี๊ด', r: 'ผู้จัดการ', img: EXEC + 'manager-phakphum.webp', c: '#8a1f2b' },
];

export const DEPUTIES: Leader[] = [
  { n: 'นายมานิต หอดขุนทด', r: 'ฝ่ายวิชาการและประกันคุณภาพ', img: EXEC + 'deputy-academic-manit.webp', c: '#026451' },
  { n: 'นายทรงพล แม้นชล', r: 'ฝ่ายกิจการนักเรียนนักศึกษา', img: EXEC + 'deputy-student-songphon.webp', c: '#385BF3' },
  { n: 'นางสาวจิดาภา เพ็ชรรัตน์', r: 'ฝ่ายบริหาร', img: EXEC + 'deputy-admin-jidapha.webp', c: '#D6418A' },
  { n: 'นายกอบศักดิ์ เจนวิถี', r: 'ฝ่ายปกครอง', img: EXEC + 'deputy-discipline-kobsak.webp', c: '#B12B25' },
  { n: 'นายพงษ์ศักดิ์ ไสตะภาพ', r: 'ฝ่ายวิจัยและพัฒนาสื่อ', img: EXEC + 'deputy-research-pongsak.webp', c: '#C28A05' },
  { n: 'นายพันธ์จิต อิ่มรอ', r: 'ฝ่ายอาคารสถานที่', img: EXEC + 'deputy-building-phanchit.webp', c: '#2D8FBF' },
];
