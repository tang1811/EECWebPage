import documents from './quality-documents.json';

// Source inventory checked against the original public PDFs on 11 September 2026.
export const QUALITY_REVIEWED_DATE = '11 กันยายน 2569';
export const QUALITY_CATEGORIES = [
  { id: 'sar', label: 'รายงานการประเมินตนเอง', shortLabel: 'รายงาน SAR', description: 'รายงานผลการประเมินตนเอง (SAR) และหนังสือรับรองการประกันคุณภาพภายนอก' },
  { id: 'publication', label: 'เผยแพร่รายงานการประเมินตนเอง', shortLabel: 'เอกสารเผยแพร่ SAR', description: 'เอกสารเผยแพร่รายงานผลการประเมินตนเองของสถานศึกษา' },
  { id: 'plans', label: 'แผนปฏิบัติงานประจำปี', shortLabel: 'แผนปฏิบัติงาน', description: 'แผนการดำเนินงานของวิทยาลัย แยกตามปีการศึกษา' },
  { id: 'standards', label: 'มาตรฐานการศึกษาของสถานศึกษา', shortLabel: 'มาตรฐานสถานศึกษา', description: 'ประกาศให้ใช้มาตรฐานการศึกษาและประกาศให้ใช้แผนฯ ของวิทยาลัย' },
  { id: 'guides', label: 'คู่มือและแนวปฏิบัติ', shortLabel: 'คู่มือและแนวปฏิบัติ', description: 'หลักเกณฑ์ แนวทางการประเมิน และคู่มือสำหรับงานประกันคุณภาพ' },
  { id: 'innovation', label: 'นวัตกรรมและงานวิจัย', shortLabel: 'นวัตกรรมและงานวิจัย', description: 'เผยแพร่นวัตกรรม สิ่งประดิษฐ์ งานสร้างสรรค์ หรืองานวิจัย' },
] as const;

export type QualityCategory = typeof QUALITY_CATEGORIES[number]['id'];
export interface QualityDocument {
  id: string;
  category: QualityCategory;
  title: string;
  year: number | null;
  url: string;
  sourcePage: string;
  bytes: number;
  pages: number;
}

export const QUALITY_DOCUMENTS = (documents as QualityDocument[]).sort(
  (a, b) => (b.year ?? 0) - (a.year ?? 0),
);
export const QUALITY_YEARS = [...new Set(QUALITY_DOCUMENTS.flatMap((doc) => doc.year ? [doc.year] : []))].sort((a, b) => b - a);
export const getQualityDocument = (id: string) => QUALITY_DOCUMENTS.find((doc) => doc.id === id)!;
export const formatFileSize = (bytes: number) => bytes < 1_000_000
  ? `${Math.round(bytes / 1_000)} KB`
  : `${(bytes / 1_000_000).toFixed(1)} MB`;
