import type { NewsArticle } from './news-data';

// Visual examples only. Replace image/title/body here once the college supplies
// the artwork and confirmed terms. The homepage and news share these entries.
// Store images in public/assets/promotions/ and use /assets/promotions/file.webp.
// Set isExample to false only after the text and conditions are confirmed.
export const PROMOTION_ARTICLES: NewsArticle[] = [
  {
    slug: 'new-student-privileges',
    tag: 'โปรโมชั่น',
    title: 'สิทธิพิเศษสำหรับผู้สมัครใหม่',
    date: '2026-09-11',
    dateLabel: '11 กันยายน 2569',
    image: undefined,
    excerpt: 'ติดตามสิทธิพิเศษและข้อมูลสำหรับก้าวแรกของการเรียนที่ EEC',
    body: [
      'หน้านี้เป็นตัวอย่างการแสดงโปรโมชั่น ยังไม่ใช่ประกาศสิทธิพิเศษที่เปิดให้รับสิทธิ์',
      'เมื่อมีประกาศจริง จะแสดงภาพโปรโมชั่น รายละเอียดสิทธิพิเศษ คุณสมบัติผู้สมัคร ช่วงเวลา และเงื่อนไขไว้ในหน้านี้',
      'สอบถามข้อมูลการศึกษาต่อและการสมัครเรียนได้ที่วิทยาลัย',
    ],
    promotion: {
      isExample: true,
      showOnHomepage: true,
      audience: 'ผู้สนใจสมัครเรียน',
      periodLabel: 'รอประกาศช่วงเวลา',
      tone: 'green',
    },
  },
  {
    slug: 'education-opportunities',
    tag: 'โปรโมชั่น',
    title: 'ทุนและโอกาสทางการศึกษา',
    date: '2026-09-11',
    dateLabel: '11 กันยายน 2569',
    image: undefined,
    excerpt: 'รวมข่าวดีและโอกาสสนับสนุนการเรียนรู้ เพื่อวางแผนอนาคตไปด้วยกัน',
    body: [
      'หน้านี้เป็นตัวอย่างพื้นที่ประชาสัมพันธ์ ยังไม่ใช่ประกาศเปิดรับสมัครทุนหรือยืนยันสิทธิประโยชน์',
      'เมื่อมีข้อมูลที่ยืนยันแล้ว จะแสดงประเภททุน คุณสมบัติ เอกสารที่ใช้ และกำหนดการให้ครบถ้วน พร้อมภาพประกาศฉบับเต็ม',
      'ติดต่อวิทยาลัยเพื่อสอบถามแนวทางการศึกษาต่อและข้อมูลเพิ่มเติม',
    ],
    promotion: {
      isExample: true,
      showOnHomepage: true,
      audience: 'นักเรียนและผู้ปกครอง',
      periodLabel: 'รอประกาศช่วงเวลา',
      tone: 'cream',
    },
  },
];
