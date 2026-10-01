// Transcribed from the two college PDFs supplied on 30 September 2026.
// Promotion seats and deadline follow the poster, confirmed by the user on 1 October 2026.
// Source PDFs are retained outside public assets; publish the supplied artwork instead.
export type Scholarship = {
  slug: string;
  title: string;
  category: 'ทุนการศึกษา' | 'โปรโมชั่น';
  badge: string;
  audience: string;
  benefit: string;
  excerpt: string;
  startDate: string;
  endDate: string;
  period: string;
  deadline: string;
  seats: number;
  eligibility: string[];
  fees: { course: string; full: number; discount: number; payable: number }[];
  conditions: string[];
  continuation?: string;
  image?: string;
  gallery?: string[];
};

const COMMON_CONDITIONS = [
  'ชำระเงินครั้งเดียวให้ครบตามกำหนด หากชำระไม่ครบ จะปรับตามโปรโมชั่นในเดือนที่ชำระครบ',
  'ต้องเรียนให้ครบ 1 ปีการศึกษา หากเรียนไม่ครบ ต้องชำระคืนส่วนลดที่ได้รับตามตาราง',
  'ส่งวุฒิการศึกษาฉบับจริงภายในวันที่ 20 เมษายน 2570',
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    slug: 'dream-career-scholarship-2570',
    title: 'โควตาทุนเติมฝัน ปั้นอาชีพ',
    image: '/assets/scholarships/dream-career-scholarship-2570.webp',
    category: 'ทุนการศึกษา',
    badge: 'ทุนต่อเนื่องตามเงื่อนไข',
    audience: 'ผู้จบ ม.3 · สมัคร ปวช. รอบเช้า',
    benefit: 'ส่วนลด 13,500–14,500 บาท',
    excerpt: 'ทุนสำหรับผู้จบ ม.3 เข้าศึกษา ปวช. รอบเช้า รับ 100 คน ยอดชำระตามประกาศ 3,500–4,500 บาท พร้อมเงื่อนไขผลการเรียนสำหรับรับทุนต่อเนื่อง',
    startDate: '2026-09-01',
    endDate: '2027-01-31',
    period: '1 กันยายน 2569 – 31 มกราคม 2570',
    deadline: '31 มกราคม 2570',
    seats: 100,
    eligibility: [
      'เป็นนักเรียนที่จบ ม.3 และสมัครเรียนภายในช่วงเวลาที่กำหนด',
      'เกณฑ์ผลการเรียนตามเอกสาร: “ต้องมีผลการเรียน 2.5 ในเทอม 4 ของ ม.2” โปรดสอบถามวิทยาลัยเพื่อยืนยันวิธีคำนวณผลการเรียน',
    ],
    fees: [
      { course: 'ปวช. บริหารธุรกิจ', full: 17000, discount: 13500, payable: 3500 },
      { course: 'ปวช. ช่างอุตสาหกรรม', full: 19000, discount: 14500, payable: 4500 },
    ],
    conditions: [...COMMON_CONDITIONS, 'ชำระเงินตามโปรโมชั่นภายในวันที่ 31 มกราคม 2570'],
    continuation: 'เป็นทุนต่อเนื่อง โดยเอกสารระบุว่าต้องทำผลการเรียนในเทอมต่อไปได้ 3.25 จึงจะชำระตามยอดที่กำหนด สอบถามวิทยาลัยเพื่อยืนยันเกณฑ์การรักษาทุน',
  },
  {
    slug: 'early-admission-discount-2570',
    title: 'สมัครก่อน มีสิทธิ์ก่อน ลด 80%',
    image: '/assets/scholarships/early-admission-discount-2570.jpg',
    gallery: [
      '/assets/scholarships/early-admission-detail-01.jpg',
      '/assets/scholarships/early-admission-detail-02.jpg',
      '/assets/scholarships/early-admission-detail-03.jpg',
      '/assets/scholarships/early-admission-detail-04.jpg',
      '/assets/scholarships/early-admission-detail-05.jpg',
      '/assets/scholarships/early-admission-detail-06.jpg',
      '/assets/scholarships/early-admission-detail-07.jpg',
      '/assets/scholarships/early-admission-detail-08.jpg',
    ],
    category: 'โปรโมชั่น',
    badge: 'ส่วนลดสมัครเรียน',
    audience: 'ผู้จบ ม.3 / ม.6 · ปวช. / ปวส. รอบเช้า',
    benefit: 'ส่วนลด 80% ตามตาราง',
    excerpt: 'โปรโมชั่นสมัครเรียน ปวช. และ ปวส. รอบเช้า ปี 2570 ไม่จำกัดผลการเรียน รับ 200 คน ยอดชำระตามประกาศ 3,400–5,200 บาท สมัครและชำระครบภายใน 31 มกราคม 2570',
    startDate: '2026-09-01',
    endDate: '2027-01-31',
    period: '1 กันยายน 2569 – 31 มกราคม 2570',
    deadline: '31 มกราคม 2570',
    seats: 200,
    eligibility: [
      'เป็นนักเรียนที่จบ ม.3 / ม.6 ตามคุณสมบัติที่ระบุในเอกสาร และสมัครภายในช่วงเวลาที่กำหนด',
      'ไม่จำกัดผลการเรียน',
    ],
    fees: [
      { course: 'ปวช. บริหารธุรกิจ', full: 17000, discount: 13600, payable: 3400 },
      { course: 'ปวช. ช่างอุตสาหกรรม', full: 19000, discount: 15200, payable: 3800 },
      { course: 'ปวส. บริหารธุรกิจ', full: 21000, discount: 16800, payable: 4200 },
      { course: 'ปวส. ช่างอุตสาหกรรม', full: 26000, discount: 20800, payable: 5200 },
    ],
    conditions: [
      ...COMMON_CONDITIONS,
      'ชำระเงินตามโปรโมชั่นภายในวันที่ 31 มกราคม 2570',
      'กรณีเรียนไม่จบ ให้ปรับเป็นพักการศึกษาไว้เท่านั้น ไม่มีการคืนเงิน',
    ],
  },
];

export const SCHOLARSHIP_DOCUMENTS = [
  'เอกสารตามระเบียบสมัครเรียนของวิทยาลัย',
  'ใบผลการเรียน 4 ภาคเรียน',
];

export const scholarshipHref = (offer: Scholarship) => `/news/${offer.slug}/`;
