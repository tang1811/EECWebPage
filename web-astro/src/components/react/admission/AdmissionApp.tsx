// ─────────────────────────────────────────────────────────────
// AdmissionApp.tsx — admission shell state machine.
// Ported from prototype admission-app.jsx → Next.js / TypeScript.
// Production bake: NO tweaks panel / design-switcher; fixed
// direction='a' (rail sidebar) and stepMode='detailed'. Theme
// tokens are baked on the .adm container. Mock behaviour kept:
// localStorage persistence + setTimeout fake verify/submit.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, type CSSProperties } from 'react';
import { Icon } from '../chrome-lite';
import {
  admGenAppNo,
  type AdmForm, type AdmFiles, type AdmErrors,
} from './admission-data';
import {
  ADM_STEP_CONFIGS, ADM_BLOCKS, admValidateStep, WizardLayout,
  GuideScreen, VerifyScreen, PdpaScreen, ReviewScreen, SuccessScreen, StatusScreen,
} from './admission-flow';
import { supabaseEnabled, signInOrUp, fetchApplication, saveApplication } from '../../../lib/admission/db';
import { track } from '../../../lib/analytics';

type Screen = 'guide' | 'verify' | 'pdpa' | 'form' | 'review' | 'success' | 'status';

const EMPTY_FORM: AdmForm = {
  level: 'ปวช.', round: 'รอบเช้า', major: '',
  title: 'นาย', firstName: '', lastName: '', nationalId: '', dobText: '',
  phone: '', email: '',
  address: '', guardianName: '', guardianRel: 'บิดา', guardianPhone: '',
  prevSchool: '', prevLevel: '', gpa: '', knew: 'Facebook / Social',
};

const LS_KEY = 'eec_admission_state_v1';

type Persisted = { screen?: Screen; step?: number; form?: Partial<AdmForm>; appNo?: string };

export default function AdmissionApp() {
  const steps = ADM_STEP_CONFIGS.detailed;

  // Start from defaults so server and first client render match (avoids hydration
  // mismatch); restore the persisted state from localStorage AFTER mount.
  const [screen, setScreen] = useState<Screen>('guide'); // guide|verify|pdpa|form|review|success|status
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<AdmForm>(EMPTY_FORM);
  const [files, setFiles] = useState<AdmFiles>({}); // not persisted (Blob URLs)
  const [errors, setErrors] = useState<AdmErrors>({});
  const [note, setNote] = useState('');
  const [appNo, setAppNo] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // ── restore persisted runtime state (client-only, after hydration) ──
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(LS_KEY) || 'null') as Persisted | null;
      if (r) {
        if (r.screen) setScreen(r.screen);
        if (typeof r.step === 'number') setStep(r.step);
        if (r.form) setForm({ ...EMPTY_FORM, ...r.form });
        if (r.appNo) setAppNo(r.appNo);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // persist light state (only after restore, so we don't overwrite saved data on mount)
  useEffect(() => {
    if (!hydrated) return;
    const data: Persisted = { screen, step, form, appNo };
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }, [hydrated, screen, step, form, appNo]);

  // baked theme tokens
  const themeStyle: CSSProperties = { '--adm-primary': '#026451', '--adm-font': "'Prompt', system-ui, sans-serif" };

  const set = (k: keyof AdmForm, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const goScreen = (s: Screen) => { setErrors({}); setScreen(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── file handlers ──
  const fmtSize = (n: number) => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`;
  const onPick = (id: string, file: File) => {
    const url = file.type && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setFiles((f) => ({ ...f, [id]: { name: file.name, size: fmtSize(file.size), type: file.type, url } }));
  };
  const onRemove = (id: string) => setFiles((f) => { const n = { ...f }; if (n[id]?.url) URL.revokeObjectURL(n[id].url as string); delete n[id]; return n; });

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
  const jump = (i: number) => { if (i < step) { setStep(i); setErrors({}); } };

  const startFresh = () => { setForm({ ...EMPTY_FORM }); setFiles({}); setStep(0); goScreen('verify'); };

  const submitApp = async () => {
    setSubmitting(true);
    setSubmitErr('');
    if (supabaseEnabled) {
      const res = await saveApplication({ ...form, note }, { submit: true });
      if (!res.ok) { setSubmitErr(res.error || 'ส่งใบสมัครไม่สำเร็จ'); setSubmitting(false); return; }
      const row = await fetchApplication();
      if (row?.app_no) setAppNo(row.app_no);
      setSubmitting(false);
      track('Submit_Lead', { method: 'supabase' });
      goScreen('success');
    } else {
      setTimeout(() => {
        setAppNo(admGenAppNo());
        setSubmitting(false);
        track('Submit_Lead', { method: 'mock' });
        goScreen('success');
      }, 1100);
    }
  };

  // ── render current screen ──
  let view: React.ReactNode = null;
  if (screen === 'guide') {
    view = <GuideScreen onStart={startFresh} onStatus={() => goScreen('status')}/>;
  } else if (screen === 'verify') {
    view = <VerifyScreen onBack={() => goScreen('guide')}
      onVerified={async ({ nationalId, dobText, dobISO }) => {
        set('nationalId', nationalId); set('dobText', dobText);
        if (supabaseEnabled) {
          const res = await signInOrUp(nationalId, dobISO);
          if (!res.ok) return res;
          // prefill from an existing application, if any
          const row = await fetchApplication();
          const fd = row?.form_data as Partial<AdmForm> | undefined;
          if (fd && Object.keys(fd).length) setForm((f) => ({ ...f, ...fd }));
        }
        goScreen('pdpa');
        return { ok: true };
      }}/>;
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
      <div className="adm-wrap adm-fade" key={'a' + step}>
        <WizardLayout steps={steps} current={step} onJump={jump}>{panel}</WizardLayout>
      </div>
    );
  } else if (screen === 'review') {
    view = <ReviewScreen form={form} files={files} note={note} setNote={setNote}
      onEdit={(i) => { setStep(i < 0 ? docsIdx : i); goScreen('form'); }}
      onBack={() => { setStep(steps.length - 1); goScreen('form'); }}
      onSubmit={submitApp} submitting={submitting} error={submitErr}/>;
  } else if (screen === 'success') {
    view = <SuccessScreen form={form} appNo={appNo} onStatus={() => goScreen('status')} onHome={() => goScreen('guide')}/>;
  } else if (screen === 'status') {
    view = <StatusScreen presetId={form.nationalId} onBack={() => goScreen('guide')}/>;
  }

  return (
    <div className="adm" data-dir="a" style={themeStyle}>
      <header className="adm-top">
        <a className="adm-brand" href="/" aria-label="หน้าแรกวิทยาลัย">
          <img src="/assets/logo.png" alt=""/>
          <span className="adm-brand-tx">
            <span className="adm-brand-th">วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย</span>
            <span className="adm-brand-en">Admission · รับสมัครออนไลน์ 2569</span>
          </span>
        </a>

        {screen !== 'status' && (
          <button className="adm-top-link" onClick={() => goScreen('status')}>
            <Icon name="chart"/> ติดตามสถานะ
          </button>
        )}
      </header>

      <div className="adm-stage">{view}</div>
    </div>
  );
}
