// ═══════════════════════════════════════════════════════════
// portal-pages.jsx — every post-login page of the applicant portal
// Reuses Icon (chrome.jsx), atoms (admission-data.jsx), .adm CSS.
// ═══════════════════════════════════════════════════════════
const { useState: useStateP, useRef: useRefP } = React;

// extra icons not in chrome.jsx
const PIcon = ({ name, style }) => {
  const p = {
    print:    <><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    logout:   <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    bell:     <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    edit:     <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    bank:     <path d="M3 21h18M4 21V10m4 11V10m4 11V10m4 11V10m4 11V10M2 8l10-5 10 5H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    card:     <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></>,
    qr:       <><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M14 14h3v3M21 14v7h-7M17 21h.01M21 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    clock:    <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    download: <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    home:     <path d="M3 11l9-8 9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    doc:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M14 2v6h6M8 13h8M8 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  };
  return <svg viewBox="0 0 24 24" style={style} aria-hidden="true">{p[name]}</svg>;
};

// fake QR pattern
function FakeQR() {
  const cells = [];
  const seed = [0,1,1,0,1,0,1, 1,0,1,1,0,1,0, 1,1,0,0,1,1,0, 0,1,1,1,0,0,1, 1,0,0,1,1,0,1, 0,1,1,0,0,1,1, 1,0,1,1,0,1,0];
  const n = 7; const size = 100 / n;
  for (let i = 0; i < n * n; i++) {
    const on = (seed[i % seed.length] + Math.floor(i / 3)) % 2 === 0;
    if (on) cells.push(<rect key={i} x={(i % n) * size} y={Math.floor(i / n) * size} width={size} height={size} fill="#0c1a14"/>);
  }
  return <svg viewBox="0 0 100 100">{cells}<rect x="0" y="0" width="22" height="22" fill="none" stroke="#0c1a14" strokeWidth="6"/><rect x="78" y="0" width="22" height="22" fill="none" stroke="#0c1a14" strokeWidth="6"/><rect x="0" y="78" width="22" height="22" fill="none" stroke="#0c1a14" strokeWidth="6"/></svg>;
}

// ── Panel wrapper ──────────────────────────────────────────
function Panel({ icon, title, desc, tag, children }) {
  return (
    <div className="pt-panel">
      <div className="pt-panel-h">
        {icon && <span className="ic"><Icon name={icon}/></span>}
        <div><h2>{title}</h2>{desc && <p>{desc}</p>}</div>
        {tag && <span className="pt-step-tag">{tag}</span>}
      </div>
      {children}
    </div>
  );
}

function SaveBar({ onSave, saved, extra }) {
  return (
    <div className="pt-actions">
      {extra}
      <button className="btn btn-ghost" onClick={onSave}>{saved ? <><Icon name="check"/> บันทึกแล้ว</> : 'บันทึกร่าง'}</button>
      <button className="btn btn-primary" onClick={onSave}>บันทึกข้อมูล <Icon name="check"/></button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 1. DASHBOARD
// ════════════════════════════════════════════════════════════
const PT_CHECK = [
  { k: 'profile',   t: 'ข้อมูลส่วนตัว',       s: 'ชื่อ-สกุล วันเกิด เพศ สัญชาติ',     done: true },
  { k: 'program',   t: 'เลือกสาขาที่สมัคร',     s: 'ระดับ สาขาวิชา และรอบเรียน',        done: true },
  { k: 'education', t: 'ประวัติการศึกษา',       s: 'สถานศึกษาเดิมและผลการเรียน',         done: true },
  { k: 'address',   t: 'ที่อยู่ & ผู้ปกครอง',   s: 'ที่อยู่ติดต่อและข้อมูลบิดามารดา',     done: false },
  { k: 'documents', t: 'แนบเอกสาร',            s: 'บัตร ปชช. · ปพ.1 · รูปถ่าย',         done: false },
  { k: 'payment',   t: 'ชำระค่าสมัคร',         s: 'ค่าธรรมเนียม 300 บาท',              done: false },
];
function DashboardPage({ go, form, appNo }) {
  const doneCount = PT_CHECK.filter((c) => c.done).length;
  const pct = Math.round((doneCount / PT_CHECK.length) * 100);
  const R = 55, C = 2 * Math.PI * R, off = C * (1 - pct / 100);
  return (
    <div className="pt-body wide adm-fade">
      <div className="pt-hero">
        <div className="pt-hero-row">
          <div className="pt-hero-tx">
            <div className="greet">สวัสดี ยินดีต้อนรับกลับมา 👋</div>
            <h2>{form.title} {form.firstName} {form.lastName}</h2>
            <p>ใบสมัครของคุณกรอกไปแล้ว {pct}% — กรอกส่วนที่เหลือและชำระค่าสมัครให้ครบ เพื่อให้เจ้าหน้าที่เริ่มตรวจสอบใบสมัครของคุณ</p>
            <span className="pt-hero-badge"><Icon name="bolt"/> เลขที่ใบสมัคร {appNo}</span>
          </div>
          <div className="pt-ring">
            <svg><circle className="pt-ring-bg" cx="66" cy="66" r={R}/><circle className="pt-ring-fg" cx="66" cy="66" r={R} strokeDasharray={C} strokeDashoffset={off}/></svg>
            <div className="pt-ring-tx"><b>{pct}%</b><span>ความคืบหน้า</span></div>
          </div>
        </div>
      </div>

      <div className="pt-grid c2">
        <div className="pt-panel">
          <div className="pt-panel-h"><span className="ic"><Icon name="check"/></span><div><h2>ขั้นตอนการสมัคร</h2><p>ทำให้ครบทุกขั้นเพื่อส่งใบสมัคร</p></div><span className="pt-step-tag">{doneCount}/{PT_CHECK.length}</span></div>
          <ul className="pt-check">
            {PT_CHECK.map((c) => (
              <li key={c.k} className={c.done ? 'is-done' : ''}>
                <span className={`ck ${c.done ? 'done' : 'todo'}`}>{c.done ? <Icon name="check"/> : ''}</span>
                <span className="ct"><b>{c.t}</b><span>{c.s}</span></span>
                <button className="go" onClick={() => go(c.k)}>{c.done ? 'แก้ไข' : 'กรอก'} <Icon name="arrow"/></button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="pt-panel">
            <div className="pt-panel-h"><span className="ic"><PIcon name="calendar"/></span><div><h2>กำหนดการสำคัญ</h2></div></div>
            <div className="pt-dates">
              <div className="pt-date"><div className="d"><b>30</b><span>มิ.ย.</span></div><div className="dt"><b>ปิดรับสมัครรอบที่ 1</b><span>ส่งใบสมัคร + ชำระเงินภายในวันนี้</span></div></div>
              <div className="pt-date"><div className="d"><b>5</b><span>ก.ค.</span></div><div className="dt"><b>นัดสัมภาษณ์</b><span>ทีมงานจะติดต่อยืนยันเวลา</span></div></div>
              <div className="pt-date"><div className="d"><b>20</b><span>ก.ค.</span></div><div className="dt"><b>มอบตัว & ปฐมนิเทศ</b><span>ณ วิทยาลัย แหลมฉบัง</span></div></div>
            </div>
          </div>
          <div className="pt-announce">
            <span className="ic"><Icon name="sparkle"/></span>
            <div><b>ทุนเรียนดี & ผ่อนชำระ 0%</b><p>ผู้สมัครรอบแรกมีสิทธิ์รับส่วนลดค่าเทอมและผ่อนชำระได้ สอบถามเพิ่มเติม 038-494-066</p></div>
          </div>
        </div>
      </div>

      <div className="pt-panel" style={{ marginTop: 18 }}>
        <div className="pt-panel-h"><span className="ic"><Icon name="bolt"/></span><div><h2>ทางลัด</h2></div></div>
        <div className="pt-quick">
          <button className="pt-qa" onClick={() => go('documents')}><span className="ic"><Icon name="briefcase"/></span><div><b>แนบเอกสาร</b><span>อัปโหลดหลักฐานการสมัคร</span></div></button>
          <button className="pt-qa" onClick={() => go('payment')}><span className="ic"><Icon name="cart"/></span><div><b>ชำระค่าสมัคร</b><span>300 บาท · ยังไม่ชำระ</span></div></button>
          <button className="pt-qa" onClick={() => go('print')}><span className="ic"><PIcon name="print"/></span><div><b>พิมพ์ใบสมัคร</b><span>ดาวน์โหลด PDF</span></div></button>
          <button className="pt-qa" onClick={() => go('status')}><span className="ic"><Icon name="chart"/></span><div><b>ติดตามสถานะ</b><span>ดูความคืบหน้าใบสมัคร</span></div></button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2. PROFILE
// ════════════════════════════════════════════════════════════
function ProfilePage({ form, set, onSave, saved }) {
  return (
    <div className="pt-body adm-fade">
      <Panel icon="users" title="ข้อมูลส่วนตัว" desc="กรอกข้อมูลให้ตรงกับบัตรประชาชน" tag="ขั้นที่ 1">
        <SelectField label="คำนำหน้า" value={form.title} onChange={(v) => set('title', v)} options={['นาย', 'นางสาว', 'นาง']}/>
        <div className="fgrid" style={{ marginTop: 18 }}>
          <TextField label="ชื่อจริง (ภาษาไทย)" required value={form.firstName} onChange={(v) => set('firstName', v)}/>
          <TextField label="นามสกุล (ภาษาไทย)" required value={form.lastName} onChange={(v) => set('lastName', v)}/>
          <TextField label="ชื่อจริง (ภาษาอังกฤษ)" value={form.firstNameEn} onChange={(v) => set('firstNameEn', v)} placeholder="Somchai"/>
          <TextField label="นามสกุล (ภาษาอังกฤษ)" value={form.lastNameEn} onChange={(v) => set('lastNameEn', v)} placeholder="Jaidee"/>
          <Field label="เลขประจำตัวประชาชน"><input value={form.nationalId} readOnly style={{ background: 'var(--p-l)', color: 'var(--ink-3)', letterSpacing: '.12em' }}/></Field>
          <Field label="วันเกิด"><input value={form.dobText} readOnly style={{ background: 'var(--p-l)', color: 'var(--ink-3)' }}/></Field>
          <SelectField label="เพศ" value={form.gender} onChange={(v) => set('gender', v)} options={['ชาย', 'หญิง', 'ไม่ระบุ']}/>
          <SelectField label="สัญชาติ" value={form.nationality} onChange={(v) => set('nationality', v)} options={['ไทย', 'อื่น ๆ']}/>
          <SelectField label="ศาสนา" value={form.religion} onChange={(v) => set('religion', v)} options={['พุทธ', 'อิสลาม', 'คริสต์', 'อื่น ๆ']}/>
          <SelectField label="หมู่เลือด" value={form.blood} onChange={(v) => set('blood', v)} options={['A', 'B', 'AB', 'O', 'ไม่ทราบ']}/>
        </div>
      </Panel>
      <Panel icon="phone" title="ช่องทางติดต่อ" desc="เพื่อให้เจ้าหน้าที่ติดต่อกลับ">
        <div className="fgrid">
          <TextField label="เบอร์โทรศัพท์" required value={form.phone} onChange={(v) => set('phone', admFormatPhone(v))} inputMode="numeric"/>
          <TextField label="LINE ID" value={form.lineId} onChange={(v) => set('lineId', v)} placeholder="@lineid"/>
          <TextField label="อีเมล" required full value={form.email} onChange={(v) => set('email', v)} type="email"/>
        </div>
      </Panel>
      <SaveBar onSave={onSave} saved={saved}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3. PROGRAM
// ════════════════════════════════════════════════════════════
function ProgramPage({ form, set, onSave, saved }) {
  const majors = ADM_MAJORS[form.level] || [];
  return (
    <div className="pt-body adm-fade">
      <Panel icon="book" title="เลือกสาขาที่สมัคร" desc="เลือกระดับ รอบเรียน และสาขาวิชา" tag="ขั้นที่ 2">
        <div className="wz-section-label">ระดับการศึกษา</div>
        <div className="choices c3" style={{ marginBottom: 22 }}>
          {ADM_LEVELS.map((l) => <ChoiceCard key={l.id} title={l.name} desc={l.desc} on={form.level === l.id} onClick={() => { set('level', l.id); set('major', ''); }}/>)}
        </div>
        <div className="wz-section-label">รอบ / ภาคการเรียน</div>
        <div className="choices c3" style={{ marginBottom: 22 }}>
          {ADM_ROUNDS.map((r) => <ChoiceCard key={r.id} title={r.name} desc={r.desc} on={form.round === r.id} onClick={() => set('round', r.id)}/>)}
        </div>
        <div className="wz-section-label">สาขาวิชา</div>
        <div className="major-grid">
          {majors.map((m) => (
            <button key={m.n} type="button" className={`major-chip ${form.major === m.n ? 'on' : ''}`} onClick={() => set('major', m.n)}>
              <span className="major-dot" style={{ background: m.c }}/><span>{m.n}</span>
            </button>
          ))}
        </div>
      </Panel>
      <SaveBar onSave={onSave} saved={saved}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. EDUCATION
// ════════════════════════════════════════════════════════════
function EducationPage({ form, set, onSave, saved }) {
  return (
    <div className="pt-body adm-fade">
      <Panel icon="award" title="ประวัติการศึกษา" desc="ข้อมูลสถานศึกษาเดิมและผลการเรียน" tag="ขั้นที่ 3">
        <div className="fgrid">
          <TextField label="โรงเรียน / สถานศึกษาเดิม" required full value={form.prevSchool} onChange={(v) => set('prevSchool', v)}/>
          <SelectField label="วุฒิการศึกษาเดิม" value={form.prevLevel} onChange={(v) => set('prevLevel', v)} options={['ม.3', 'ม.6', 'ปวช.', 'ปวส.', 'กศน.', 'อื่น ๆ']}/>
          <TextField label="ปีที่จบ (พ.ศ.)" value={form.gradYear} onChange={(v) => set('gradYear', v)} placeholder="2568" inputMode="numeric"/>
          <TextField label="เกรดเฉลี่ยสะสม (GPAX)" value={form.gpa} onChange={(v) => set('gpa', v)} placeholder="0.00 – 4.00" inputMode="decimal"/>
          <TextField label="จังหวัดของสถานศึกษา" value={form.schoolProvince} onChange={(v) => set('schoolProvince', v)} placeholder="ชลบุรี"/>
          <SelectField label="ทราบข่าวการรับสมัครจาก" full value={form.knew} onChange={(v) => set('knew', v)} options={ADM_KNEW}/>
        </div>
      </Panel>
      <SaveBar onSave={onSave} saved={saved}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. ADDRESS & PARENTS
// ════════════════════════════════════════════════════════════
function AddressPage({ form, set, onSave, saved }) {
  return (
    <div className="pt-body adm-fade">
      <Panel icon="pin" title="ที่อยู่" desc="ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน" tag="ขั้นที่ 4">
        <Field label="ที่อยู่ตามทะเบียนบ้าน" required full>
          <textarea value={form.regAddress} onChange={(e) => set('regAddress', e.target.value)} placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"/>
        </Field>
        <label className={`consent ${form.sameAddr ? 'on' : ''}`} style={{ margin: '14px 0' }}>
          <span className="consent-box"><Icon name="check"/></span>
          <input type="checkbox" checked={form.sameAddr} onChange={(e) => set('sameAddr', e.target.checked)} style={{ display: 'none' }}/>
          <span className="consent-tx">ที่อยู่ปัจจุบันเหมือนที่อยู่ตามทะเบียนบ้าน</span>
        </label>
        {!form.sameAddr && (
          <Field label="ที่อยู่ปัจจุบัน" full>
            <textarea value={form.curAddress} onChange={(e) => set('curAddress', e.target.value)} placeholder="ที่อยู่ที่สามารถติดต่อได้"/>
          </Field>
        )}
      </Panel>
      <Panel icon="users" title="ข้อมูลผู้ปกครอง / บิดามารดา" desc="สำหรับการติดต่อและกรณีอายุต่ำกว่า 18 ปี">
        <div className="wz-section-label">บิดา</div>
        <div className="fgrid" style={{ marginBottom: 20 }}>
          <TextField label="ชื่อ-สกุล บิดา" value={form.fatherName} onChange={(v) => set('fatherName', v)}/>
          <TextField label="อาชีพ" value={form.fatherJob} onChange={(v) => set('fatherJob', v)}/>
          <TextField label="เบอร์โทรบิดา" full value={form.fatherPhone} onChange={(v) => set('fatherPhone', admFormatPhone(v))} inputMode="numeric"/>
        </div>
        <div className="wz-section-label">มารดา</div>
        <div className="fgrid" style={{ marginBottom: 20 }}>
          <TextField label="ชื่อ-สกุล มารดา" value={form.motherName} onChange={(v) => set('motherName', v)}/>
          <TextField label="อาชีพ" value={form.motherJob} onChange={(v) => set('motherJob', v)}/>
          <TextField label="เบอร์โทรมารดา" full value={form.motherPhone} onChange={(v) => set('motherPhone', admFormatPhone(v))} inputMode="numeric"/>
        </div>
        <div className="wz-section-label">ผู้ปกครองหลัก (ผู้ติดต่อกรณีฉุกเฉิน)</div>
        <div className="fgrid">
          <TextField label="ชื่อ-สกุล ผู้ปกครอง" required value={form.guardianName} onChange={(v) => set('guardianName', v)}/>
          <SelectField label="ความสัมพันธ์" value={form.guardianRel} onChange={(v) => set('guardianRel', v)} options={ADM_RELATION}/>
          <TextField label="เบอร์โทรผู้ปกครอง" required full value={form.guardianPhone} onChange={(v) => set('guardianPhone', admFormatPhone(v))} inputMode="numeric"/>
        </div>
      </Panel>
      <SaveBar onSave={onSave} saved={saved}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 6. DOCUMENTS
// ════════════════════════════════════════════════════════════
function DocumentsPage({ files, onPick, onRemove }) {
  const inputRefs = useRefP({});
  const STATUS = { idcard: 'verified', house: 'pending' }; // demo verification states
  return (
    <div className="pt-body adm-fade">
      <Panel icon="briefcase" title="เอกสารแนบ" desc="อัปโหลดหลักฐานการสมัคร (รูปภาพหรือ PDF ไม่เกิน 10 MB)" tag="ขั้นที่ 5">
        {ADM_DOCS.map((d) => {
          const f = files[d.id];
          const st = f ? (STATUS[d.id] || 'verified') : 'empty';
          const label = { verified: 'ตรวจสอบแล้ว', pending: 'รอตรวจสอบ', reject: 'ต้องแก้ไข', empty: d.req ? 'ยังไม่แนบ' : 'ไม่บังคับ' }[st];
          const isImg = f && f.type && f.type.startsWith('image/');
          return (
            <div className="pt-doc" key={d.id}>
              <input ref={(el) => inputRefs.current[d.id] = el} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                onChange={(e) => { const file = e.target.files[0]; if (file) onPick(d.id, file); }}/>
              {isImg ? <img className="th" src={f.url} alt=""/> : <span className="ic"><PIcon name="doc"/></span>}
              <div className="m">
                <b>{d.name}{d.req && <span style={{ color: 'var(--danger)' }}> *</span>}</b>
                <span>{f ? `${f.name} · ${f.size}` : d.sub}</span>
              </div>
              <span className={`pt-tag ${st}`}>{label}</span>
              {f
                ? <button className="doc-remove" onClick={() => onRemove(d.id)} aria-label="ลบ"><Icon name="close"/></button>
                : <button className="doc-act" onClick={() => inputRefs.current[d.id]?.click()}><Icon name="arrowDown"/>เลือกไฟล์</button>}
            </div>
          );
        })}
        <div className="pt-announce" style={{ marginTop: 18 }}>
          <span className="ic"><Icon name="shield"/></span>
          <div><b>เคล็ดลับการอัปโหลด</b><p>ถ่ายเอกสารให้ชัด ตรง ไม่มีเงา · เซ็นรับรองสำเนาถูกต้องทุกฉบับ · ไฟล์รูปแนะนำ JPG/PNG, เอกสารแนะนำ PDF</p></div>
        </div>
      </Panel>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 7. PAYMENT
// ════════════════════════════════════════════════════════════
function PaymentPage({ paid, setPaid, payMethod, setPayMethod, appNo }) {
  const [slip, setSlip] = useStateP(null);
  const slipRef = useRefP(null);
  if (paid) {
    return (
      <div className="pt-body adm-fade">
        <Panel icon="check" title="ชำระเงินเรียบร้อย" desc="ระบบได้รับการชำระค่าสมัครของคุณแล้ว">
          <div className="center" style={{ padding: '12px 0 8px' }}>
            <div className="ok-burst" style={{ animation: 'none' }}><Icon name="check"/></div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>ชำระค่าสมัคร 300 บาท สำเร็จ</h2>
            <p className="muted" style={{ marginTop: 8 }}>เลขที่ใบสมัคร {appNo} · ช่องทาง {payMethod === 'qr' ? 'พร้อมเพย์ QR' : payMethod === 'bank' ? 'โอนผ่านธนาคาร' : 'บัตรเครดิต'}</p>
            <div className="ok-code"><span>เลขอ้างอิงการชำระเงิน</span><b>PAY-{appNo.replace('EEC69-', '')}</b></div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <button className="btn btn-primary"><PIcon name="download" style={{ width: 17, height: 17 }}/> ดาวน์โหลดใบเสร็จ</button>
              <button className="btn btn-ghost" onClick={() => setPaid(false)}>ดูรายละเอียด</button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }
  return (
    <div className="pt-body adm-fade">
      <div className="pt-grid c2">
        <div>
          <Panel icon="cart" title="เลือกช่องทางชำระเงิน" desc="ค่าสมัคร 300 บาท · ชำระภายใน 30 มิ.ย.">
            <div className="pt-pay-methods">
              <button className={`pt-pm ${payMethod === 'qr' ? 'on' : ''}`} onClick={() => setPayMethod('qr')}><span className="ic"><PIcon name="qr"/></span><b>พร้อมเพย์</b><span>สแกน QR</span></button>
              <button className={`pt-pm ${payMethod === 'bank' ? 'on' : ''}`} onClick={() => setPayMethod('bank')}><span className="ic"><PIcon name="bank"/></span><b>โอนธนาคาร</b><span>แนบสลิป</span></button>
              <button className={`pt-pm ${payMethod === 'card' ? 'on' : ''}`} onClick={() => setPayMethod('card')}><span className="ic"><PIcon name="card"/></span><b>บัตรเครดิต</b><span>Visa / MC</span></button>
            </div>

            {payMethod === 'qr' && (
              <div className="pt-qr" style={{ marginTop: 20 }}>
                <div className="pt-qr-img"><FakeQR/></div>
                <div><b style={{ fontSize: 15 }}>สแกนเพื่อชำระ 300.00 บาท</b><p className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>พร้อมเพย์ · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย</p></div>
              </div>
            )}
            {payMethod === 'bank' && (
              <div style={{ marginTop: 20 }}>
                <div className="pt-fee" style={{ marginBottom: 16 }}>
                  <div className="pt-fee-row"><span className="k">ธนาคาร</span><span className="v">กสิกรไทย</span></div>
                  <div className="pt-fee-row"><span className="k">เลขที่บัญชี</span><span className="v">123-4-56789-0</span></div>
                  <div className="pt-fee-row"><span className="k">ชื่อบัญชี</span><span className="v">วิทยาลัยเทคโนโลยีอีอีซีฯ</span></div>
                </div>
                <input ref={slipRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files[0]; if (f) setSlip(f.name); }}/>
                <button className="btn btn-ghost btn-block" onClick={() => slipRef.current?.click()}><PIcon name="download" style={{ width: 16, height: 16 }}/> {slip ? `แนบแล้ว: ${slip}` : 'แนบสลิปการโอน'}</button>
              </div>
            )}
            {payMethod === 'card' && (
              <div className="fgrid" style={{ marginTop: 20 }}>
                <TextField label="หมายเลขบัตร" full value="" onChange={() => {}} placeholder="0000 0000 0000 0000"/>
                <TextField label="วันหมดอายุ" value="" onChange={() => {}} placeholder="MM/YY"/>
                <TextField label="CVV" value="" onChange={() => {}} placeholder="123"/>
              </div>
            )}
          </Panel>
        </div>

        <div>
          <Panel icon="doc" title="สรุปค่าธรรมเนียม">
            <div className="pt-fee">
              <div className="pt-fee-row"><span className="k">ค่าสมัครสอบคัดเลือก</span><span className="v">300.00</span></div>
              <div className="pt-fee-row"><span className="k">ส่วนลดรอบแรก</span><span className="v">0.00</span></div>
              <div className="pt-fee-row total"><span className="k">ยอดชำระทั้งสิ้น</span><span className="v">฿300.00</span></div>
            </div>
            <span className="pt-badge warn" style={{ marginTop: 16 }}><PIcon name="clock" style={{ width: 14, height: 14 }}/> ยังไม่ได้ชำระเงิน</span>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }} onClick={() => setPaid(true)}>ยืนยันการชำระเงิน <Icon name="arrow"/></button>
            <p className="muted center" style={{ fontSize: 11.5, marginTop: 12 }}>ค่าสมัครไม่สามารถขอคืนได้ทุกกรณี</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 8. PRINT — application sheet
// ════════════════════════════════════════════════════════════
function PrintPage({ form, appNo, files }) {
  const SF = ({ k, v, full }) => <div className="pt-sf" style={full ? { gridColumn: '1 / -1' } : null}><span className="k">{k}</span><span className="v">{v || '—'}</span></div>;
  return (
    <div className="pt-body wide adm-fade">
      <div className="pt-actions" style={{ marginTop: 0, marginBottom: 18, paddingTop: 0, borderTop: 0, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={() => window.print()}><PIcon name="print" style={{ width: 16, height: 16 }}/> พิมพ์</button>
        <button className="btn btn-primary" onClick={() => window.print()}><PIcon name="download" style={{ width: 16, height: 16 }}/> บันทึกเป็น PDF</button>
      </div>
      <div className="pt-sheet">
        <div className="pt-sheet-head">
          <img src="assets/logo.png" alt=""/>
          <div><h2>ใบสมัครเข้าศึกษา</h2><p>วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง · ปีการศึกษา 2569</p></div>
          <div className="pt-sheet-no"><span>เลขที่ใบสมัคร</span><b>{appNo}</b></div>
        </div>

        <div className="pt-sheet-sec">
          <h3>หลักสูตรที่สมัคร</h3>
          <div className="pt-sheet-grid">
            <SF k="ระดับ" v={form.level}/><SF k="รอบเรียน" v={form.round}/>
            <SF k="สาขาวิชา" v={form.major} full/>
          </div>
        </div>
        <div className="pt-sheet-sec">
          <h3>ข้อมูลส่วนตัว</h3>
          <div className="pt-sheet-grid">
            <SF k="ชื่อ-สกุล" v={`${form.title} ${form.firstName} ${form.lastName}`}/>
            <SF k="Name" v={`${form.firstNameEn} ${form.lastNameEn}`}/>
            <SF k="เลขบัตร ปชช." v={form.nationalId}/><SF k="วันเกิด" v={form.dobText}/>
            <SF k="เพศ" v={form.gender}/><SF k="สัญชาติ / ศาสนา" v={`${form.nationality} / ${form.religion}`}/>
            <SF k="โทรศัพท์" v={form.phone}/><SF k="อีเมล" v={form.email}/>
          </div>
        </div>
        <div className="pt-sheet-sec">
          <h3>ประวัติการศึกษา</h3>
          <div className="pt-sheet-grid">
            <SF k="สถานศึกษาเดิม" v={form.prevSchool} full/>
            <SF k="วุฒิเดิม" v={form.prevLevel}/><SF k="ปีที่จบ" v={form.gradYear}/>
            <SF k="GPAX" v={form.gpa}/><SF k="จังหวัด" v={form.schoolProvince}/>
          </div>
        </div>
        <div className="pt-sheet-sec">
          <h3>ที่อยู่ & ผู้ปกครอง</h3>
          <div className="pt-sheet-grid">
            <SF k="ที่อยู่" v={form.regAddress} full/>
            <SF k="ผู้ปกครอง" v={`${form.guardianName} (${form.guardianRel})`}/><SF k="เบอร์ผู้ปกครอง" v={form.guardianPhone}/>
          </div>
        </div>
        <div className="pt-sheet-foot">
          <div className="pt-sign">ลงชื่อผู้สมัคร<br/>( {form.firstName} {form.lastName} )</div>
          <div className="pt-sign">ลงชื่อเจ้าหน้าที่รับสมัคร<br/>( ........................................... )</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 9. STATUS
// ════════════════════════════════════════════════════════════
function PortalStatusPage({ appNo }) {
  const activeIdx = 1;
  return (
    <div className="pt-body adm-fade">
      <Panel icon="chart" title="สถานะการสมัคร" desc={`เลขที่ใบสมัคร ${appNo}`}>
        <div className="row" style={{ gap: 10, marginBottom: 22 }}>
          <span className="pt-badge warn"><PIcon name="clock" style={{ width: 14, height: 14 }}/> กำลังตรวจสอบเอกสาร</span>
          <span className="muted" style={{ fontSize: 12.5 }}>อัปเดตล่าสุด วันนี้ 14:32 น.</span>
        </div>
        <div className="timeline">
          {ADM_STATUS_STEPS.map((s, i) => {
            const st = i < activeIdx ? 'done' : i === activeIdx ? 'active' : '';
            return (
              <div key={s.k} className={`tl-item ${st}`}>
                <div className="tl-mark"><div className="tl-dot">{i < activeIdx ? <Icon name="check"/> : i === activeIdx ? <Icon name="bolt"/> : i + 1}</div>{i < ADM_STATUS_STEPS.length - 1 && <div className="tl-line"/>}</div>
                <div className="tl-body"><h4>{s.name}</h4><p>{s.desc}</p><div className="tl-date">{s.date}</div></div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, {
  PIcon, FakeQR, Panel,
  DashboardPage, ProfilePage, ProgramPage, EducationPage, AddressPage,
  DocumentsPage, PaymentPage, PrintPage, PortalStatusPage,
});
