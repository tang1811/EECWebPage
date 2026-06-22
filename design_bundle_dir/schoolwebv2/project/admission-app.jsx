// ═══════════════════════════════════════════════════════════
// admission-app.jsx — shell, state machine, dir switcher, Tweaks
// ═══════════════════════════════════════════════════════════
const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#026451",
  "fontFamily": "'Prompt', system-ui, sans-serif",
  "stepMode": "detailed",
  "direction": "a"
}/*EDITMODE-END*/;

const COLOR_OPTIONS = ['#026451', '#0a7d52', '#1c2a4e', '#3a4db5', '#8a1f2b'];
const FONT_OPTIONS = [
  { value: "'Prompt', system-ui, sans-serif", label: 'Prompt' },
  { value: "'Noto Sans Thai', system-ui, sans-serif", label: 'Noto Sans Thai' },
  { value: "'IBM Plex Sans Thai', system-ui, sans-serif", label: 'IBM Plex Thai' },
  { value: "'Anuphan', system-ui, sans-serif", label: 'Anuphan' },
  { value: "'Sarabun', system-ui, sans-serif", label: 'Sarabun' },
];
const STEP_MODE_OPTS = [
  { value: 'detailed', label: 'ละเอียด' },
  { value: 'standard', label: 'มาตรฐาน' },
  { value: 'compact', label: 'กระชับ' },
];
const DIR_OPTS = [
  { id: 'a', label: 'ไซด์บาร์' },
  { id: 'b', label: 'โฟกัส' },
  { id: 'c', label: 'แยกแบรนด์' },
];

const EMPTY_FORM = {
  level: 'ปวช.', round: 'รอบเช้า', major: '',
  title: 'นาย', firstName: '', lastName: '', nationalId: '', dobText: '',
  phone: '', email: '',
  address: '', guardianName: '', guardianRel: 'บิดา', guardianPhone: '',
  prevSchool: '', prevLevel: '', gpa: '', knew: 'Facebook / Social',
};

const LS_KEY = 'eec_admission_state_v1';

function AdmissionApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dir = t.direction || 'a';
  const steps = ADM_STEP_CONFIGS[t.stepMode] || ADM_STEP_CONFIGS.detailed;

  // ── restore persisted runtime state ──
  const restored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
  }, []);

  const [screen, setScreen] = useState(restored.screen || 'guide'); // guide|verify|pdpa|form|review|success|status
  const [step, setStep] = useState(restored.step || 0);
  const [form, setForm] = useState({ ...EMPTY_FORM, ...(restored.form || {}) });
  const [files, setFiles] = useState({});       // not persisted (Blob URLs)
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState('');
  const [appNo, setAppNo] = useState(restored.appNo || '');
  const [submitting, setSubmitting] = useState(false);

  // persist light state
  useEffect(() => {
    const data = { screen: screen === 'success' || screen === 'status' ? screen : screen, step, form, appNo };
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }, [screen, step, form, appNo]);

  // apply theme tokens
  const themeStyle = { '--adm-primary': t.primaryColor, '--adm-font': t.fontFamily };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const goScreen = (s) => { setErrors({}); setScreen(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const setDir = (d) => setTweak('direction', d);

  // ── file handlers ──
  const fmtSize = (n) => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`;
  const onPick = (id, file) => {
    const url = file.type && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setFiles((f) => ({ ...f, [id]: { name: file.name, size: fmtSize(file.size), type: file.type, url } }));
  };
  const onRemove = (id) => setFiles((f) => { const n = { ...f }; if (n[id]?.url) URL.revokeObjectURL(n[id].url); delete n[id]; return n; });

  // ── wizard nav ──
  const docsIdx = steps.length - 1;
  const next = () => {
    const e = admValidateStep(steps[step], form, files);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step >= steps.length - 1) goScreen('review');
    else { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  const prev = () => {
    if (step === 0) { goScreen('pdpa'); return; }
    setStep((s) => s - 1); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const jump = (i) => { if (i < step) { setStep(i); setErrors({}); } };

  const startFresh = () => { setForm({ ...EMPTY_FORM }); setFiles({}); setStep(0); goScreen('verify'); };

  const submitApp = () => {
    setSubmitting(true);
    setTimeout(() => {
      setAppNo(admGenAppNo());
      setSubmitting(false);
      goScreen('success');
    }, 1100);
  };

  // ── render current screen ──
  let view;
  if (screen === 'guide') {
    view = <GuideScreen onStart={startFresh} onStatus={() => goScreen('status')}/>;
  } else if (screen === 'verify') {
    view = <VerifyScreen onBack={() => goScreen('guide')}
      onVerified={({ nationalId, dobText }) => { set('nationalId', nationalId); set('dobText', dobText); goScreen('pdpa'); }}/>;
  } else if (screen === 'pdpa') {
    view = <PdpaScreen onBack={() => goScreen('verify')} onAccept={() => { setStep(0); goScreen('form'); }}/>;
  } else if (screen === 'form') {
    const ctx = { form, set, errors, files, onPick, onRemove };
    const cur = steps[step];
    const panel = (
      <>
        <div className="wz-head">
          <div className="wz-kicker">{cur.kicker} · ขั้นที่ {step + 1}/{steps.length}</div>
          <h2>{cur.name}</h2>
          <p>{cur.desc}</p>
        </div>
        {cur.blocks.map((b, i) => {
          const Block = ADM_BLOCKS[b];
          return <div key={b} style={{ marginTop: i ? 26 : 0 }}><Block {...ctx}/></div>;
        })}
        {errors._docs && <div className="fld-err" style={{ marginTop: 14 }}><Icon name="close"/>{errors._docs}</div>}
        <div className="wz-actions">
          <button className="btn btn-ghost" onClick={prev}>
            <Icon name="arrow" style={{ transform: 'rotate(180deg)' }}/> {step === 0 ? 'ย้อนกลับ' : 'ก่อนหน้า'}
          </button>
          <button className="btn btn-primary" onClick={next}>
            {step >= steps.length - 1 ? 'ตรวจสอบข้อมูล' : 'ถัดไป'} <Icon name="arrow"/>
          </button>
        </div>
      </>
    );
    view = (
      <div className={`adm-wrap adm-fade ${dir === 'b' ? 'narrow' : ''}`} key={dir + step}>
        <WizardLayout dir={dir} steps={steps} current={step} onJump={jump}>{panel}</WizardLayout>
      </div>
    );
  } else if (screen === 'review') {
    view = <ReviewScreen dir={dir} form={form} files={files} note={note} setNote={setNote}
      onEdit={(i) => { setStep(i < 0 ? docsIdx : i); goScreen('form'); }}
      onBack={() => { setStep(steps.length - 1); goScreen('form'); }}
      onSubmit={submitApp} submitting={submitting}/>;
  } else if (screen === 'success') {
    view = <SuccessScreen form={form} appNo={appNo} onStatus={() => goScreen('status')} onHome={() => goScreen('guide')}/>;
  } else if (screen === 'status') {
    view = <StatusScreen presetNo={appNo} onBack={() => goScreen('guide')}/>;
  }

  return (
    <div className="adm" data-dir={dir} style={themeStyle}>
      <header className="adm-top">
        <a className="adm-brand" href="index.html" aria-label="หน้าแรกวิทยาลัย">
          <img src="assets/logo.png" alt=""/>
          <span className="adm-brand-tx">
            <span className="adm-brand-th">วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย</span>
            <span className="adm-brand-en">Admission · รับสมัครออนไลน์ 2569</span>
          </span>
        </a>

        <div className="adm-dir" role="tablist" aria-label="ทิศทางดีไซน์">
          <span className="adm-dir-label">ดีไซน์</span>
          {DIR_OPTS.map((d) => (
            <button key={d.id} className={dir === d.id ? 'on' : ''} onClick={() => setDir(d.id)} role="tab" aria-selected={dir === d.id}>{d.label}</button>
          ))}
        </div>

        {screen !== 'status' && (
          <button className="adm-top-link" onClick={() => goScreen('status')}>
            <Icon name="chart"/> ติดตามสถานะ
          </button>
        )}
      </header>

      <div className="adm-stage">{view}</div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="ทิศทางดีไซน์"/>
        <TweakRadio label="เลย์เอาต์" value={dir}
          options={DIR_OPTS.map((d) => ({ value: d.id, label: d.label }))}
          onChange={(v) => setTweak('direction', v)}/>
        <TweakRadio label="จำนวนขั้นตอน" value={t.stepMode} options={STEP_MODE_OPTS}
          onChange={(v) => { setTweak('stepMode', v); setStep(0); }}/>

        <TweakSection label="แบรนด์"/>
        <TweakColor label="สีหลัก" value={t.primaryColor} options={COLOR_OPTIONS}
          onChange={(v) => setTweak('primaryColor', v)}/>
        <TweakSelect label="ฟอนต์" value={t.fontFamily} options={FONT_OPTIONS}
          onChange={(v) => setTweak('fontFamily', v)}/>

        <TweakSection label="ทดลองใช้งาน"/>
        <TweakButton label="ไปหน้ากรอกใบสมัคร" onClick={() => { setStep(0); setScreen('form'); }}/>
        <TweakButton label="ดูหน้าสำเร็จ + เลขใบสมัคร" secondary onClick={() => { setAppNo(appNo || admGenAppNo()); setScreen('success'); }}/>
        <TweakButton label="รีเซ็ตข้อมูลทั้งหมด" secondary onClick={() => { try { localStorage.removeItem(LS_KEY); } catch {}; setForm({ ...EMPTY_FORM }); setFiles({}); setStep(0); setScreen('guide'); }}/>
      </TweaksPanel>
    </div>
  );
}

const mountAdm = () => {
  if (!window.WizardLayout || !window.useTweaks || !window.Icon || !window.GuideScreen) return setTimeout(mountAdm, 40);
  ReactDOM.createRoot(document.getElementById('app')).render(<AdmissionApp/>);
};
mountAdm();
