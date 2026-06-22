'use client';

// ─────────────────────────────────────────────────────────────
// admission-data.tsx — constants, helpers, reusable form atoms.
// Ported from prototype admission-data.jsx → Next.js / TypeScript.
// ─────────────────────────────────────────────────────────────

import { useRef, type ReactNode } from 'react';
import { Icon } from '../components/chrome';

// ── Shared types ────────────────────────────────────────────
export type AdmForm = {
  level: string;
  round: string;
  major: string;
  title: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  dobText: string;
  phone: string;
  email: string;
  address: string;
  guardianName: string;
  guardianRel: string;
  guardianPhone: string;
  prevSchool: string;
  prevLevel: string;
  gpa: string;
  knew: string;
};

export type AdmFile = { name: string; size: string; type: string; url: string | null };
export type AdmFiles = Record<string, AdmFile>;
export type AdmErrors = Record<string, string>;
export type AdmDob = { d: string; m: string; y: string };

export type AdmStep = { name: string; kicker: string; desc: string; blocks: string[] };

// Context passed down to step blocks.
export type AdmCtx = {
  form: AdmForm;
  set: (k: keyof AdmForm, v: string) => void;
  errors: AdmErrors;
  files: AdmFiles;
  onPick: (id: string, file: File) => void;
  onRemove: (id: string) => void;
};

// ── Domain data ────────────────────────────────────────────
export const ADM_LEVELS = [
  { id: 'ปวช.', name: 'ปวช.', desc: 'ประกาศนียบัตรวิชาชีพ · จบ ม.3' },
  { id: 'ปวส.', name: 'ปวส.', desc: 'ประกาศนียบัตรวิชาชีพชั้นสูง · จบ ปวช./ม.6' },
  { id: 'ป.ตรี', name: 'ป.ตรี', desc: 'เทคโนโลยีบัณฑิต · จบ ปวส.' },
];

export const ADM_MAJORS: Record<string, { n: string; c: string }[]> = {
  'ปวช.': [
    { n: 'ช่างยนต์', c: '#B12B25' }, { n: 'ช่างไฟฟ้ากำลัง', c: '#40ABE0' },
    { n: 'ช่างกลโรงงาน', c: '#E0A106' }, { n: 'อิเล็กทรอนิกส์', c: '#0aa183' },
    { n: 'เมคคาทรอนิกส์และหุ่นยนต์', c: '#C39B14' }, { n: 'ดิจิทัลกราฟิก', c: '#385BF3' },
    { n: 'เทคโนโลยีธุรกิจดิจิทัล', c: '#EB559F' }, { n: 'การบัญชี', c: '#7B5CA7' },
  ],
  'ปวส.': [
    { n: 'เทคนิคเครื่องกล', c: '#B12B25' }, { n: 'ไฟฟ้า', c: '#40ABE0' },
    { n: 'เทคนิคการผลิต', c: '#E0A106' }, { n: 'เมคคาทรอนิกส์และหุ่นยนต์', c: '#C39B14' },
    { n: 'เครือข่ายคอมฯ & ความปลอดภัย', c: '#EB559F' }, { n: 'ดิจิทัลกราฟิก', c: '#385BF3' },
    { n: 'การจัดการโลจิสติกส์', c: '#F26530' }, { n: 'การบัญชี', c: '#7B5CA7' },
  ],
  'ป.ตรี': [
    { n: 'เทคโนโลยีไฟฟ้า', c: '#40ABE0' },
  ],
};

export const ADM_ROUNDS = [
  { id: 'รอบเช้า', name: 'ภาคปกติ (รอบเช้า)', desc: 'จันทร์–ศุกร์ 08:00–16:00' },
  { id: 'รอบบ่าย', name: 'ภาคสมทบ (รอบบ่าย)', desc: 'จันทร์–ศุกร์ 13:00–20:00' },
  { id: 'เสาร์-อาทิตย์', name: 'ภาคเสาร์–อาทิตย์', desc: 'เหมาะกับผู้ทำงาน' },
];

export const ADM_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export const ADM_KNEW = ['Facebook / Social', 'เว็บไซต์วิทยาลัย', 'เพื่อน / รุ่นพี่', 'ครูแนะแนว', 'ป้าย / สื่อโฆษณา', 'งานเปิดบ้าน Open House', 'อื่น ๆ'];

export const ADM_RELATION = ['บิดา', 'มารดา', 'ผู้ปกครอง', 'ญาติ', 'อื่น ๆ'];

export const ADM_DOCS = [
  { id: 'idcard', name: 'สำเนาบัตรประชาชน', sub: 'ผู้สมัคร · พร้อมรับรองสำเนา', req: true },
  { id: 'house', name: 'สำเนาทะเบียนบ้าน', sub: 'ผู้สมัคร', req: true },
  { id: 'transcript', name: 'ใบ ปพ.1 / Transcript', sub: 'ใบแสดงผลการเรียน ฉบับล่าสุด', req: true },
  { id: 'photo', name: 'รูปถ่ายหน้าตรง 1 นิ้ว', sub: 'พื้นหลังสุภาพ · ถ่ายไม่เกิน 6 เดือน', req: true },
  { id: 'parent', name: 'สำเนาบัตรผู้ปกครอง', sub: 'กรณีผู้สมัครอายุต่ำกว่า 18 ปี', req: false },
];

// PDPA consent — concise original Thai text
export function AdmPdpaText() {
  return (
    <>
      <h4>1. วัตถุประสงค์ของการเก็บข้อมูล</h4>
      <p>วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของท่านเพื่อการพิจารณารับสมัคร การติดต่อกลับ การจัดทำทะเบียนนักศึกษา และการดำเนินการทางการศึกษาที่เกี่ยวข้องเท่านั้น</p>
      <h4>2. ข้อมูลที่จัดเก็บ</h4>
      <ul>
        <li>ข้อมูลระบุตัวตน — ชื่อ-สกุล เลขประจำตัวประชาชน วันเดือนปีเกิด</li>
        <li>ข้อมูลติดต่อ — ที่อยู่ เบอร์โทรศัพท์ อีเมล</li>
        <li>ข้อมูลการศึกษา — สถานศึกษาเดิม ผลการเรียน และเอกสารประกอบ</li>
        <li>ข้อมูลผู้ปกครอง — สำหรับผู้สมัครที่อายุต่ำกว่า 18 ปี</li>
      </ul>
      <h4>3. ระยะเวลาและความปลอดภัย</h4>
      <p>ข้อมูลจะถูกจัดเก็บอย่างปลอดภัยตามมาตรฐาน และเก็บไว้ตามระยะเวลาที่จำเป็นต่อการดำเนินการ หรือตามที่กฎหมายกำหนด</p>
      <h4>4. สิทธิของเจ้าของข้อมูล</h4>
      <p>ท่านมีสิทธิขอเข้าถึง แก้ไข ระงับการใช้ หรือขอให้ลบข้อมูลส่วนบุคคลของท่านได้ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 โดยติดต่อฝ่ายงานทะเบียนของวิทยาลัย</p>
    </>
  );
}

export const ADM_STATUS_STEPS = [
  { k: 'received', name: 'รับใบสมัครแล้ว', desc: 'ระบบบันทึกใบสมัครของท่านเรียบร้อย', date: 'วันนี้ · 14:32 น.' },
  { k: 'review', name: 'กำลังตรวจสอบเอกสาร', desc: 'เจ้าหน้าที่กำลังตรวจสอบข้อมูลและเอกสาร', date: 'ภายใน 24 ชม.' },
  { k: 'interview', name: 'นัดสัมภาษณ์', desc: 'ทีมงานจะติดต่อนัดวันสัมภาษณ์ที่วิทยาลัย', date: 'รอดำเนินการ' },
  { k: 'enroll', name: 'มอบตัว & ขึ้นทะเบียน', desc: 'ชำระค่าธรรมเนียม (ผ่อนได้) และรับชุดนักศึกษา', date: 'รอดำเนินการ' },
];

// ── Helpers ────────────────────────────────────────────────
export function admGenCaptcha(): string {
  const chars = 'ABCDEFGHJKLMNPQRTUVWXY346789';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
export function admFormatID(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 13);
  // 1-2345-67890-12-3
  const p = [d.slice(0, 1), d.slice(1, 5), d.slice(5, 10), d.slice(10, 12), d.slice(12, 13)].filter(Boolean);
  return p.join('-');
}
export function admFormatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 10);
  const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean);
  return p.join('-');
}
export function admGenAppNo(): string {
  return 'EEC69-' + Math.floor(100000 + Math.random() * 899999);
}

// ── Field ──────────────────────────────────────────────────
export function Field({
  label,
  required,
  hint,
  error,
  full,
  children,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  full?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`fld ${full ? 'full' : ''} ${error ? 'err' : ''}`}>
      {label && (
        <label>{label}{required && <span className="req">*</span>}
          {hint && <span className="hint">· {hint}</span>}
        </label>
      )}
      {children}
      {error && <span className="fld-err"><Icon name="close"/>{error}</span>}
    </div>
  );
}

type TextFieldProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  full?: boolean;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

export function TextField({ label, value, onChange, error, required, full, hint, ...rest }: TextFieldProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} full={full}>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...rest}/>
    </Field>
  );
}

type SelectOption = string | { value: string; label: string };

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required,
  full,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required} error={error} full={full}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Field>
  );
}

// ── DOB picker (Thai B.E.) ─────────────────────────────────
export function DobPicker({
  value,
  onChange,
  error,
}: {
  value?: AdmDob;
  onChange: (v: AdmDob) => void;
  error?: string;
}) {
  const v = value || { d: '', m: '', y: '' };
  const set = (k: keyof AdmDob, val: string) => onChange({ ...v, [k]: val });
  const thisYearBE = new Date().getFullYear() + 543;
  const years: number[] = [];
  for (let y = thisYearBE - 13; y >= thisYearBE - 45; y--) years.push(y);
  return (
    <Field label="วัน เดือน ปีเกิด" required error={error} full>
      <div className="dob-row">
        <select value={v.d} onChange={(e) => set('d', e.target.value)}>
          <option value="">วัน</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={v.m} onChange={(e) => set('m', e.target.value)}>
          <option value="">เดือน</option>
          {ADM_MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select value={v.y} onChange={(e) => set('y', e.target.value)}>
          <option value="">ปี (พ.ศ.)</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
    </Field>
  );
}

// ── Captcha ────────────────────────────────────────────────
export function Captcha({
  code,
  onRefresh,
  value,
  onChange,
  error,
}: {
  code: string;
  onRefresh: () => void;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const colors = ['#026451', '#1c2a4e', '#8a1f2b', '#0a6b5a', '#3a3a52'];
  return (
    <Field label="กรอกรหัสที่เห็นในภาพ" required error={error} full>
      <div className="captcha-row">
        <div className="captcha-box" aria-hidden="true">
          <div className="captcha-strike" style={{ transform: 'rotate(-4deg)' }}/>
          {code.split('').map((ch, i) => (
            <span key={i} className="captcha-ch" style={{
              color: colors[i % colors.length],
              transform: `rotate(${(i % 2 ? 1 : -1) * (6 + i * 2)}deg) translateY(${i % 2 ? 2 : -2}px)`,
            }}>{ch}</span>
          ))}
        </div>
        <button type="button" className="captcha-refresh" onClick={onRefresh} aria-label="สุ่มรหัสใหม่" title="สุ่มรหัสใหม่">
          <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-3-6.7M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </button>
        <input style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '.15em', fontWeight: 700 }}
               value={value} maxLength={5} placeholder="รหัส 5 ตัว"
               onChange={(e) => onChange(e.target.value.toUpperCase())}/>
      </div>
    </Field>
  );
}

// ── Choice card ────────────────────────────────────────────
export function ChoiceCard({
  title,
  desc,
  on,
  onClick,
}: {
  title: string;
  desc?: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`choice ${on ? 'on' : ''}`} onClick={onClick}>
      <span className="choice-tick"><Icon name="check"/></span>
      <span className="choice-t">{title}</span>
      {desc && <span className="choice-d">{desc}</span>}
    </button>
  );
}

// ── Document row (real file input, optional image preview) ──
export function DocRow({
  doc,
  file,
  onPick,
  onRemove,
}: {
  doc: { id: string; name: string; sub: string; req: boolean };
  file?: AdmFile;
  onPick: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isImg = file && file.type && file.type.startsWith('image/');
  return (
    <div className={`doc-row ${file ? 'filled' : ''}`}>
      <input ref={inputRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
             onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(doc.id, f); }}/>
      {isImg && file?.url
        ? <img className="doc-thumb" src={file.url} alt=""/>
        : <span className="doc-ic"><Icon name={file ? 'check' : 'book'}/></span>}
      <div className="doc-main">
        <div className="doc-name">{doc.name}{doc.req && !file && <span className="doc-req"> *</span>}</div>
        <div className="doc-sub">{file ? `${file.name} · ${file.size}` : doc.sub}</div>
      </div>
      {file
        ? <button className="doc-remove" onClick={() => onRemove(doc.id)} aria-label="ลบไฟล์"><Icon name="close"/></button>
        : <button className="doc-act" onClick={() => inputRef.current?.click()}><Icon name="arrowDown"/>เลือกไฟล์</button>}
    </div>
  );
}

// ── Summary group ──────────────────────────────────────────
export function SummaryGroup({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit?: () => void;
  rows: ([string, string] | false | null | undefined)[];
}) {
  return (
    <div className="sum">
      <div className="sum-head">
        <h4>{title}</h4>
        {onEdit && <button className="sum-edit" onClick={onEdit}><Icon name="arrow" style={{ transform: 'rotate(180deg)' }}/>แก้ไข</button>}
      </div>
      <div className="sum-body">
        {rows.filter((r): r is [string, string] => Boolean(r)).map(([k, v], i) => (
          <div className="sum-row" key={i}>
            <span className="sum-k">{k}</span>
            <span className="sum-v">{v || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
