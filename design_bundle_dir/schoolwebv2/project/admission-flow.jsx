// ═══════════════════════════════════════════════════════════
// admission-flow.jsx — screens, step blocks, validation, layouts
// Relies on Icon (chrome.jsx) + atoms (admission-data.jsx).
// ═══════════════════════════════════════════════════════════
const { useState: useStateF, useRef: useRefF, useEffect: useEffectF } = React;

// ── Step blocks (content fragments of the wizard) ──────────
function BlockChoose({ form, set, errors }) {
  const majors = ADM_MAJORS[form.level] || [];
  return (
    <>
      <div className="wz-section-label">ระดับการศึกษา</div>
      <div className="choices c3" style={{ marginBottom: 22 }}>
        {ADM_LEVELS.map((l) => (
          <ChoiceCard key={l.id} title={l.name} desc={l.desc} on={form.level === l.id}
            onClick={() => { set('level', l.id); set('major', ''); }}/>
        ))}
      </div>
      <div className="wz-section-label">รอบ / ภาคการเรียน</div>
      <div className="choices c3" style={{ marginBottom: 22 }}>
        {ADM_ROUNDS.map((r) => (
          <ChoiceCard key={r.id} title={r.name} desc={r.desc} on={form.round === r.id}
            onClick={() => set('round', r.id)}/>
        ))}
      </div>
      <div className="wz-section-label">สาขาวิชาที่สนใจ {errors.major && <span style={{ color: 'var(--danger)', fontWeight: 600 }}>· {errors.major}</span>}</div>
      <div className="major-grid">
        {majors.map((m) => (
          <button key={m.n} type="button" className={`major-chip ${form.major === m.n ? 'on' : ''}`} onClick={() => set('major', m.n)}>
            <span className="major-dot" style={{ background: m.c }}/>
            <span>{m.n}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function BlockPersonal({ form, set, errors }) {
  return (
    <div className="fgrid">
      <TextField label="ชื่อจริง" required value={form.firstName} error={errors.firstName}
        onChange={(v) => set('firstName', v)} placeholder="เช่น สมชาย"/>
      <TextField label="นามสกุล" required value={form.lastName} error={errors.lastName}
        onChange={(v) => set('lastName', v)} placeholder="เช่น ใจดี"/>
      <Field label="เลขประจำตัวประชาชน" full>
        <input value={form.nationalId} readOnly style={{ background: 'var(--p-l)', color: 'var(--ink-3)', letterSpacing: '.12em' }}/>
      </Field>
      <Field label="วันเกิด" >
        <input value={form.dobText} readOnly style={{ background: 'var(--p-l)', color: 'var(--ink-3)' }}/>
      </Field>
      <SelectField label="คำนำหน้า" value={form.title} onChange={(v) => set('title', v)}
        options={['นาย', 'นางสาว', 'นาง']}/>
      <TextField label="เบอร์โทรศัพท์" required value={form.phone} error={errors.phone}
        onChange={(v) => set('phone', admFormatPhone(v))} placeholder="08X-XXX-XXXX" inputMode="numeric"/>
      <TextField label="อีเมล" required value={form.email} error={errors.email} full
        onChange={(v) => set('email', v)} placeholder="you@example.com" type="email"/>
    </div>
  );
}

function BlockAddress({ form, set, errors }) {
  return (
    <>
      <Field label="ที่อยู่ปัจจุบัน" required error={errors.address} full>
        <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
          placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"/>
      </Field>
      <div className="wz-section-label" style={{ marginTop: 20 }}>ข้อมูลผู้ปกครอง</div>
      <div className="fgrid">
        <TextField label="ชื่อ-สกุล ผู้ปกครอง" required value={form.guardianName} error={errors.guardianName}
          onChange={(v) => set('guardianName', v)} placeholder="ชื่อ-นามสกุล"/>
        <SelectField label="ความสัมพันธ์" value={form.guardianRel} onChange={(v) => set('guardianRel', v)} options={ADM_RELATION}/>
        <TextField label="เบอร์ผู้ปกครอง" required value={form.guardianPhone} error={errors.guardianPhone} full
          onChange={(v) => set('guardianPhone', admFormatPhone(v))} placeholder="08X-XXX-XXXX" inputMode="numeric"/>
      </div>
    </>
  );
}

function BlockEducation({ form, set, errors }) {
  return (
    <div className="fgrid">
      <TextField label="โรงเรียน / สถานศึกษาเดิม" required value={form.prevSchool} error={errors.prevSchool} full
        onChange={(v) => set('prevSchool', v)} placeholder="ชื่อสถานศึกษา"/>
      <TextField label="วุฒิการศึกษาเดิม" value={form.prevLevel}
        onChange={(v) => set('prevLevel', v)} placeholder="เช่น ม.3 / ม.6 / ปวช."/>
      <TextField label="เกรดเฉลี่ยสะสม (GPAX)" value={form.gpa}
        onChange={(v) => set('gpa', v)} placeholder="0.00 – 4.00" hint="ไม่บังคับ" inputMode="decimal"/>
      <SelectField label="ทราบข่าวการรับสมัครจาก" value={form.knew} onChange={(v) => set('knew', v)} options={ADM_KNEW} full/>
    </div>
  );
}

function BlockDocs({ files, onPick, onRemove }) {
  const done = ADM_DOCS.filter((d) => d.req && files[d.id]).length;
  const total = ADM_DOCS.filter((d) => d.req).length;
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <span className="muted" style={{ fontSize: 13.5 }}>แนบไฟล์ภาพหรือ PDF · ขนาดไม่เกิน 10 MB ต่อไฟล์</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: done === total ? 'var(--p-d)' : 'var(--ink-3)' }}>{done}/{total} เอกสารบังคับ</span>
      </div>
      <div className="docs">
        {ADM_DOCS.map((d) => <DocRow key={d.id} doc={d} file={files[d.id]} onPick={onPick} onRemove={onRemove}/>)}
      </div>
    </>
  );
}

const ADM_BLOCKS = {
  choose: BlockChoose, personal: BlockPersonal, address: BlockAddress,
  education: BlockEducation, docs: BlockDocs,
};

// ── Step configurations (tweakable count) ──────────────────
const ADM_STEP_CONFIGS = {
  detailed: [
    { name: 'เลือกหลักสูตร', kicker: 'สาขาที่สมัคร', desc: 'เลือกระดับ รอบเรียน และสาขาวิชาที่สนใจ', blocks: ['choose'] },
    { name: 'ข้อมูลส่วนตัว', kicker: 'ผู้สมัคร', desc: 'กรอกข้อมูลให้ตรงกับบัตรประชาชน', blocks: ['personal'] },
    { name: 'ที่อยู่ & ผู้ปกครอง', kicker: 'การติดต่อ', desc: 'ที่อยู่สำหรับติดต่อและข้อมูลผู้ปกครอง', blocks: ['address'] },
    { name: 'ประวัติการศึกษา', kicker: 'พื้นฐาน', desc: 'สถานศึกษาเดิมและผลการเรียน', blocks: ['education'] },
    { name: 'แนบเอกสาร', kicker: 'หลักฐาน', desc: 'อัปโหลดเอกสารประกอบการสมัคร', blocks: ['docs'] },
  ],
  standard: [
    { name: 'เลือกหลักสูตร', kicker: 'สาขาที่สมัคร', desc: 'เลือกระดับ รอบเรียน และสาขาวิชา', blocks: ['choose'] },
    { name: 'ข้อมูลส่วนตัว', kicker: 'ผู้สมัคร', desc: 'กรอกข้อมูลให้ตรงกับบัตรประชาชน', blocks: ['personal'] },
    { name: 'ที่อยู่ & การศึกษา', kicker: 'รายละเอียด', desc: 'ที่อยู่ ผู้ปกครอง และประวัติการศึกษา', blocks: ['address', 'education'] },
    { name: 'แนบเอกสาร', kicker: 'หลักฐาน', desc: 'อัปโหลดเอกสารประกอบการสมัคร', blocks: ['docs'] },
  ],
  compact: [
    { name: 'เลือกหลักสูตร', kicker: 'สาขาที่สมัคร', desc: 'เลือกระดับ รอบเรียน และสาขาวิชา', blocks: ['choose'] },
    { name: 'ข้อมูลผู้สมัคร', kicker: 'รายละเอียด', desc: 'ข้อมูลส่วนตัว ที่อยู่ และการศึกษา', blocks: ['personal', 'address', 'education'] },
    { name: 'แนบเอกสาร', kicker: 'หลักฐาน', desc: 'อัปโหลดเอกสารประกอบการสมัคร', blocks: ['docs'] },
  ],
};

// ── Validation ─────────────────────────────────────────────
function admValidateBlock(block, form, files) {
  const e = {};
  const digits = (s) => (s || '').replace(/\D/g, '');
  if (block === 'choose') {
    if (!form.major) e.major = 'กรุณาเลือกสาขา';
  }
  if (block === 'personal') {
    if (!form.firstName.trim()) e.firstName = 'กรุณากรอกชื่อ';
    if (!form.lastName.trim()) e.lastName = 'กรุณากรอกนามสกุล';
    if (digits(form.phone).length < 9) e.phone = 'เบอร์ไม่ถูกต้อง';
    if (!form.email.includes('@') || !form.email.includes('.')) e.email = 'อีเมลไม่ถูกต้อง';
  }
  if (block === 'address') {
    if (!form.address.trim()) e.address = 'กรุณากรอกที่อยู่';
    if (!form.guardianName.trim()) e.guardianName = 'กรุณากรอกชื่อผู้ปกครอง';
    if (digits(form.guardianPhone).length < 9) e.guardianPhone = 'เบอร์ไม่ถูกต้อง';
  }
  if (block === 'education') {
    if (!form.prevSchool.trim()) e.prevSchool = 'กรุณากรอกสถานศึกษาเดิม';
  }
  if (block === 'docs') {
    const missing = ADM_DOCS.some((d) => d.req && !files[d.id]);
    if (missing) e._docs = 'กรุณาแนบเอกสารบังคับให้ครบ';
  }
  return e;
}
function admValidateStep(step, form, files) {
  let e = {};
  step.blocks.forEach((b) => { e = { ...e, ...admValidateBlock(b, form, files) }; });
  return e;
}

// ════════════════════════════════════════════════════════════
// Step indicators
// ════════════════════════════════════════════════════════════
function Rail({ steps, current, onJump }) {
  return (
    <div className="rail">
      {steps.map((s, i) => {
        const st = i < current ? 'done' : i === current ? 'active' : '';
        return (
          <button key={i} type="button" className={`rail-item ${st}`} onClick={() => i < current && onJump(i)}>
            <span className="rail-mark">
              <span className="rail-dot">{i < current ? <Icon name="check"/> : i + 1}</span>
              <span className="rail-line"/>
            </span>
            <span className="rail-tx">
              <span className="rt-step">ขั้นที่ {i + 1}</span>
              <span className="rt-name">{s.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Linbar({ steps, current }) {
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <div className="linbar">
      <div className="linbar-meta">
        <span className="lb-name">{steps[current].name}</span>
        <span className="lb-count">ขั้นที่ {current + 1} จาก {steps.length}</span>
      </div>
      <div className="linbar-track"><div className="linbar-fill" style={{ width: pct + '%' }}/></div>
      <div className="linbar-dots">{steps.map((_, i) => <i key={i} className={i <= current ? 'done' : ''}/>)}</div>
    </div>
  );
}

function BrandSteps({ steps, current }) {
  return (
    <div className="brand-steps">
      {steps.map((s, i) => {
        const st = i < current ? 'done' : i === current ? 'active' : '';
        return (
          <div key={i} className={`bs-item ${st}`}>
            <span className="bs-mark">
              <span className="bs-dot">{i < current ? <Icon name="check"/> : i + 1}</span>
              <span className="bs-line"/>
            </span>
            <span className="bs-tx">{s.name}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Wizard layout (dir-aware shell around panel content) ───
function WizardLayout({ dir, steps, current, onJump, children }) {
  const panel = <div className="lay-panel wz-panel">{children}</div>;

  if (dir === 'b') {
    return (
      <div className="lay-b">
        <div className="lay-top"><Linbar steps={steps} current={current}/></div>
        <div className="card">{panel}</div>
      </div>
    );
  }
  if (dir === 'c') {
    return (
      <div className="card lay-c">
        <aside className="lay-brand">
          <div className="brand-crest">
            <img src="assets/logo.png" alt=""/>
            <div>
              <span className="bc-th">EEC Engineer</span>
              <span className="bc-en">Laemchabang</span>
            </div>
          </div>
          <div className="brand-head">
            <h3>เริ่มต้นเส้นทาง<br/>สายอาชีพของคุณ</h3>
            <p>กรอกใบสมัครออนไลน์ให้ครบทุกขั้นตอน ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</p>
          </div>
          <BrandSteps steps={steps} current={current}/>
          <div className="brand-foot"><Icon name="phone"/> สอบถาม 038-494-066</div>
        </aside>
        {panel}
      </div>
    );
  }
  // dir A — rail sidebar
  return (
    <div className="card lay-a">
      <aside className="lay-aside">
        <div className="aside-title">ขั้นตอนการสมัคร</div>
        <Rail steps={steps} current={current} onJump={onJump}/>
        <div className="aside-help">
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--p-d)', marginBottom: 8 }}>ต้องการความช่วยเหลือ?</div>
          <a href="tel:038494066" style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-d)', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <Icon name="phone" style={{ width: 15, height: 15 }}/> 038-494-066
          </a>
        </div>
      </aside>
      {panel}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GUIDE screen
// ════════════════════════════════════════════════════════════
const ADM_GUIDE_STEPS = [
  { ic: 'shield',  t: 'ยืนยันตัวตน',   d: 'กรอกเลขบัตรประชาชนและวันเกิดเพื่อเริ่มต้น' },
  { ic: 'book',    t: 'ยินยอมข้อมูล',  d: 'อ่านและยอมรับนโยบายความเป็นส่วนตัว (PDPA)' },
  { ic: 'users',   t: 'กรอกใบสมัคร',   d: 'เลือกสาขา กรอกข้อมูลส่วนตัวและการศึกษา' },
  { ic: 'briefcase', t: 'แนบเอกสาร',  d: 'อัปโหลดบัตร ปชช. ปพ.1 และรูปถ่าย' },
  { ic: 'check',   t: 'รอติดต่อกลับ',  d: 'รับเลขใบสมัครและติดตามสถานะได้ทันที' },
];
function GuideScreen({ onStart, onStatus }) {
  return (
    <div className="adm-wrap adm-fade">
      <div className="guide-hero">
        <span className="adm-eyebrow"><Icon name="sparkle"/> รับสมัครนักศึกษาใหม่ ปีการศึกษา 2569</span>
        <h1>สมัครเรียน<span className="g">ออนไลน์</span><br/>ง่าย ครบ จบใน 5 นาที</h1>
        <p>ระบบรับสมัคร ปวช. ปวส. และปริญญาตรี ของวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — กรอกได้ทุกที่ทุกเวลา</p>
        <div className="guide-cta">
          <button className="btn btn-primary btn-lg" onClick={onStart}>เริ่มสมัครเรียน <Icon name="arrow"/></button>
          <button className="btn btn-ghost btn-lg" onClick={onStatus}><Icon name="chart"/> ติดตามสถานะใบสมัคร</button>
        </div>
      </div>

      <div className="steps-grid">
        {ADM_GUIDE_STEPS.map((s, i) => (
          <div className="step-card" key={i}>
            <span className="step-ic"><Icon name={s.ic}/></span>
            <div className="step-num">{i + 1}</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="guide-meta">
        <div className="meta-card"><span className="meta-ic"><Icon name="bolt"/></span><div><b>5 นาที</b><span>ใช้เวลากรอกใบสมัคร</span></div></div>
        <div className="meta-card"><span className="meta-ic"><Icon name="phone"/></span><div><b>24 ชม.</b><span>ทีมงานติดต่อกลับ</span></div></div>
        <div className="meta-card"><span className="meta-ic"><Icon name="award"/></span><div><b>ผ่อนได้</b><span>ค่าธรรมเนียมแบ่งชำระ</span></div></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// VERIFY screen (identity gate)
// ════════════════════════════════════════════════════════════
function VerifyScreen({ onBack, onVerified }) {
  const [nid, setNid] = useStateF('');
  const [dob, setDob] = useStateF({ d: '', m: '', y: '' });
  const [captcha, setCaptcha] = useStateF(admGenCaptcha);
  const [cap, setCap] = useStateF('');
  const [err, setErr] = useStateF({});
  const [loading, setLoading] = useStateF(false);

  const submit = () => {
    const e = {};
    if (nid.replace(/\D/g, '').length !== 13) e.nid = 'เลขบัตรต้องมี 13 หลัก';
    if (!dob.d || !dob.m || !dob.y) e.dob = 'กรุณาเลือกวันเกิดให้ครบ';
    if (cap !== captcha) e.cap = 'รหัสไม่ถูกต้อง';
    setErr(e);
    if (Object.keys(e).length) { if (e.cap) { setCaptcha(admGenCaptcha()); setCap(''); } return; }
    setLoading(true);
    setTimeout(() => {
      const dobText = `${dob.d} ${ADM_MONTHS[dob.m - 1]} ${dob.y}`;
      onVerified({ nationalId: admFormatID(nid), dobText });
    }, 850);
  };

  return (
    <div className="adm-wrap narrow adm-fade">
      <div className="card gate">
        <div className="gate-ic"><Icon name="shield"/></div>
        <h2>ยืนยันตัวตนผู้สมัคร</h2>
        <p className="gate-sub">กรอกเลขประจำตัวประชาชนและวันเดือนปีเกิดของผู้สมัคร เพื่อเริ่มกรอกใบสมัครหรือดึงข้อมูลเดิม</p>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <TextField label="เลขประจำตัวประชาชน" required value={nid} error={err.nid}
            onChange={(v) => setNid(admFormatID(v))} placeholder="X-XXXX-XXXXX-XX-X" inputMode="numeric"
            style={{ letterSpacing: '.12em', fontSize: 17 }}/>
          <DobPicker value={dob} onChange={setDob} error={err.dob}/>
          <Captcha code={captcha} onRefresh={() => { setCaptcha(admGenCaptcha()); setCap(''); }}
            value={cap} onChange={setCap} error={err.cap}/>
        </div>

        <div className="gate-foot">
          <button className="btn btn-ghost" onClick={onBack}>ย้อนกลับ</button>
          <button className="btn btn-primary flex-grow" onClick={submit} disabled={loading}>
            {loading ? 'กำลังตรวจสอบ…' : <>ยืนยันและไปต่อ <Icon name="arrow"/></>}
          </button>
        </div>
        <div className="gate-secure"><Icon name="shield"/> ข้อมูลของท่านถูกเข้ารหัสและคุ้มครองตาม พ.ร.บ. PDPA</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PDPA consent screen
// ════════════════════════════════════════════════════════════
function PdpaScreen({ onBack, onAccept }) {
  const [agree, setAgree] = useStateF(false);
  const [agree2, setAgree2] = useStateF(false);
  return (
    <div className="adm-wrap mid adm-fade">
      <div className="card gate">
        <div className="gate-ic"><Icon name="book"/></div>
        <h2>นโยบายความเป็นส่วนตัว</h2>
        <p className="gate-sub">โปรดอ่านและให้ความยินยอมในการเก็บและใช้ข้อมูลส่วนบุคคล ก่อนเริ่มกรอกใบสมัคร</p>

        <div className="pdpa-box"><AdmPdpaText/></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label className={`consent ${agree ? 'on' : ''}`}>
            <span className="consent-box"><Icon name="check"/></span>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ display: 'none' }}/>
            <span className="consent-tx"><strong>ข้าพเจ้ายินยอม</strong>ให้วิทยาลัยเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลเพื่อการพิจารณารับสมัครและการดำเนินการทางการศึกษา</span>
          </label>
          <label className={`consent ${agree2 ? 'on' : ''}`}>
            <span className="consent-box"><Icon name="check"/></span>
            <input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} style={{ display: 'none' }}/>
            <span className="consent-tx">ยินยอมให้ติดต่อกลับผ่านโทรศัพท์ อีเมล หรือช่องทางออนไลน์ เพื่อแจ้งผลและข่าวสารการรับสมัคร</span>
          </label>
        </div>

        <div className="gate-foot">
          <button className="btn btn-ghost" onClick={onBack}>ย้อนกลับ</button>
          <button className="btn btn-primary flex-grow" onClick={onAccept} disabled={!agree}>
            ยอมรับและเริ่มกรอกใบสมัคร <Icon name="arrow"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// REVIEW screen
// ════════════════════════════════════════════════════════════
function ReviewScreen({ dir, form, files, note, setNote, onEdit, onBack, onSubmit, submitting }) {
  const fileList = ADM_DOCS.filter((d) => files[d.id]).map((d) => files[d.id].name).join(', ') || '—';
  const body = (
    <>
      <div className="wz-head">
        <div className="wz-kicker">ขั้นสุดท้าย</div>
        <h2>ตรวจสอบและยืนยันใบสมัคร</h2>
        <p>โปรดตรวจสอบความถูกต้องของข้อมูลก่อนส่งใบสมัคร</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SummaryGroup title="หลักสูตรที่สมัคร" onEdit={() => onEdit(0)} rows={[
          ['ระดับ', form.level], ['สาขาวิชา', form.major], ['รอบเรียน', form.round],
        ]}/>
        <SummaryGroup title="ข้อมูลส่วนตัว" onEdit={() => onEdit(1)} rows={[
          ['ชื่อ-สกุล', `${form.title} ${form.firstName} ${form.lastName}`.trim()],
          ['เลขบัตร ปชช.', form.nationalId], ['วันเกิด', form.dobText],
          ['โทรศัพท์', form.phone], ['อีเมล', form.email],
        ]}/>
        <SummaryGroup title="ที่อยู่ & ผู้ปกครอง" onEdit={() => onEdit(2)} rows={[
          ['ที่อยู่', form.address],
          ['ผู้ปกครอง', `${form.guardianName} (${form.guardianRel})`],
          ['เบอร์ผู้ปกครอง', form.guardianPhone],
        ]}/>
        <SummaryGroup title="ประวัติการศึกษา" onEdit={() => onEdit(2)} rows={[
          ['สถานศึกษาเดิม', form.prevSchool], ['วุฒิเดิม', form.prevLevel],
          ['GPAX', form.gpa], ['ทราบข่าวจาก', form.knew],
        ]}/>
        <SummaryGroup title="เอกสารแนบ" onEdit={() => onEdit(-1)} rows={[
          ['ไฟล์ที่แนบ', fileList],
        ]}/>
      </div>

      <Field label="หมายเหตุเพิ่มเติม (ถ้ามี)" full>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="ข้อมูลเพิ่มเติมที่อยากให้วิทยาลัยทราบ" style={{ marginTop: 16 }}/>
      </Field>

      <div className="wz-actions">
        <button className="btn btn-ghost" onClick={onBack}><Icon name="arrow" style={{ transform: 'rotate(180deg)' }}/> ย้อนกลับ</button>
        <button className="btn btn-primary btn-lg" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'กำลังส่ง…' : <>ส่งใบสมัคร <Icon name="check"/></>}
        </button>
      </div>
    </>
  );
  // Review uses the simple wide card (no rail) for clarity
  return <div className="adm-wrap mid adm-fade"><div className="card wz-panel">{body}</div></div>;
}

// ════════════════════════════════════════════════════════════
// SUCCESS screen
// ════════════════════════════════════════════════════════════
function SuccessScreen({ form, appNo, onStatus, onHome }) {
  return (
    <div className="adm-wrap narrow adm-fade">
      <div className="card gate center">
        <div className="ok-burst"><Icon name="check"/></div>
        <h2>ส่งใบสมัครเรียบร้อย!</h2>
        <p className="gate-sub">ทีมงานได้รับใบสมัครของ <strong style={{ color: 'var(--ink)' }}>{form.firstName} {form.lastName}</strong> แล้ว และจะติดต่อกลับที่เบอร์ {form.phone} ภายใน 24 ชั่วโมง</p>
        <div className="ok-code">
          <span>เลขที่ใบสมัครของคุณ</span>
          <b>{appNo}</b>
        </div>
        <ul className="info-list center" style={{ textAlign: 'left', maxWidth: 340, margin: '4px auto 0' }}>
          <li><Icon name="check"/> บันทึกเลขใบสมัครไว้เพื่อติดตามสถานะ</li>
          <li><Icon name="check"/> เตรียมเอกสารตัวจริงไว้สำหรับวันสัมภาษณ์</li>
          <li><Icon name="check"/> ทีมงานจะโทรหรือส่งข้อความยืนยันนัดหมาย</li>
        </ul>
        <div className="gate-foot" style={{ justifyContent: 'center' }}>
          <a className="btn btn-primary" href="admission-portal.html"><Icon name="users"/> เข้าสู่พอร์ทัลผู้สมัคร</a>
          <button className="btn btn-ghost" onClick={onStatus}><Icon name="chart"/> ติดตามสถานะ</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STATUS tracking screen
// ════════════════════════════════════════════════════════════
function StatusScreen({ presetNo, onBack }) {
  const [q, setQ] = useStateF(presetNo || '');
  const [shown, setShown] = useStateF(!!presetNo);
  const activeIdx = 1; // currently "กำลังตรวจสอบเอกสาร"
  return (
    <div className="adm-wrap narrow adm-fade">
      <div className="card gate">
        <div className="gate-ic"><Icon name="chart"/></div>
        <h2>ติดตามสถานะใบสมัคร</h2>
        <p className="gate-sub">กรอกเลขที่ใบสมัครเพื่อตรวจสอบความคืบหน้า</p>

        <div className="captcha-row" style={{ marginTop: 22 }}>
          <input className="flex-grow" style={{ fontFamily: 'inherit', fontSize: 15, padding: '12px 14px', borderRadius: 'var(--r-s)', border: '1.5px solid var(--line-2)', letterSpacing: '.06em' }}
            value={q} onChange={(e) => setQ(e.target.value.toUpperCase())} placeholder="เช่น EEC69-123456"/>
          <button className="btn btn-primary" onClick={() => setShown(true)} disabled={q.length < 6}>ตรวจสอบ</button>
        </div>

        {shown && (
          <div className="adm-fade" style={{ marginTop: 26 }}>
            <div className="row" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'var(--p-l)', borderRadius: 'var(--r-s)', marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>เลขที่ใบสมัคร</span>
              <strong style={{ color: 'var(--p-d)', fontVariantNumeric: 'tabular-nums' }}>{q}</strong>
            </div>
            <div className="timeline">
              {ADM_STATUS_STEPS.map((s, i) => {
                const st = i < activeIdx ? 'done' : i === activeIdx ? 'active' : '';
                return (
                  <div key={s.k} className={`tl-item ${st}`}>
                    <div className="tl-mark">
                      <div className="tl-dot">{i < activeIdx ? <Icon name="check"/> : i === activeIdx ? <Icon name="bolt"/> : i + 1}</div>
                      {i < ADM_STATUS_STEPS.length - 1 && <div className="tl-line"/>}
                    </div>
                    <div className="tl-body">
                      <h4>{s.name}</h4>
                      <p>{s.desc}</p>
                      <div className="tl-date">{s.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="gate-foot">
          <button className="btn btn-ghost flex-grow" onClick={onBack}><Icon name="arrow" style={{ transform: 'rotate(180deg)' }}/> กลับหน้าแรก</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ADM_BLOCKS, ADM_STEP_CONFIGS, admValidateStep,
  Rail, Linbar, BrandSteps, WizardLayout,
  GuideScreen, VerifyScreen, PdpaScreen, ReviewScreen, SuccessScreen, StatusScreen,
});
