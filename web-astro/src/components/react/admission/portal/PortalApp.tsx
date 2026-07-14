// ═══════════════════════════════════════════════════════════
// PortalApp.tsx — applicant portal shell (sidebar + routing)
// Ported from prototype portal-app.jsx.
//  · TweaksPanel / useTweaks dropped — default look baked in
//    (primary #026451, font 'Prompt').
//  · Mock login gate (client-side only) — demo button sets a flag
//    in localStorage; no real backend/auth.
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import { Icon } from '../../chrome-lite';
import { DobPicker, type AdmDob } from '../admission-data';
import {
  supabaseEnabled, signInOrUp, dobToISO, currentUserId, signOut,
  fetchApplication, saveApplication, uploadDoc,
} from '../../../../lib/admission/db';
import {
  PIcon,
  DashboardPage,
  ProfilePage,
  ProgramPage,
  EducationPage,
  AddressPage,
  DocumentsPage,
  PaymentPage,
  PrintPage,
  PortalStatusPage,
  type PortalForm,
  type PortalFiles,
  type PortalFile,
  type PortalCtx,
  type PayMethod,
} from './portal-pages';

// ── Baked design defaults (was TweaksPanel) ────────────────
const PT_PRIMARY = '#026451';
const PT_FONT = "'Prompt', system-ui, sans-serif";

type NavItem = { id: string; label: string; icon: string; crumb: string; badge?: 'ok' | 'todo' | 'dot' };
const PT_NAV: NavItem[] = [
  { id: 'overview', label: 'ภาพรวม', icon: 'chart', crumb: 'แดชบอร์ด' },
  { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: 'users', crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'program', label: 'เลือกสาขา', icon: 'book', crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'education', label: 'ประวัติการศึกษา', icon: 'award', crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'address', label: 'ที่อยู่ & ผู้ปกครอง', icon: 'pin', crumb: 'ใบสมัคร', badge: 'todo' },
  { id: 'documents', label: 'เอกสารแนบ', icon: 'briefcase', crumb: 'หลักฐาน', badge: 'todo' },
  { id: 'payment', label: 'ชำระเงิน', icon: 'cart', crumb: 'การเงิน', badge: 'dot' },
  { id: 'print', label: 'พิมพ์ใบสมัคร', icon: 'doc', crumb: 'เอกสาร' },
  { id: 'status', label: 'สถานะการสมัคร', icon: 'shield', crumb: 'ติดตาม' },
];

const PT_TITLES: Record<string, string> = {
  overview: 'ภาพรวมใบสมัคร', profile: 'ข้อมูลส่วนตัว', program: 'เลือกสาขาที่สมัคร',
  education: 'ประวัติการศึกษา', address: 'ที่อยู่ & ผู้ปกครอง', documents: 'เอกสารแนบ',
  payment: 'ชำระค่าสมัคร', print: 'พิมพ์ใบสมัคร', status: 'สถานะการสมัคร',
};

const PT_FORM: PortalForm = {
  level: 'ปวช.', round: 'รอบเช้า', major: 'ช่างไฟฟ้ากำลัง',
  title: 'นาย', firstName: 'สมชาย', lastName: 'ใจดี', firstNameEn: 'Somchai', lastNameEn: 'Jaidee',
  nationalId: '1-1007-01234-56-7', dobText: '15 มิถุนายน 2552',
  gender: 'ชาย', nationality: 'ไทย', religion: 'พุทธ', blood: 'O',
  phone: '081-234-5678', lineId: '@somchai', email: 'somchai@example.com',
  regAddress: '99/9 หมู่ 5 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230', sameAddr: true, curAddress: '',
  fatherName: 'นายสมหมาย ใจดี', fatherJob: 'พนักงานโรงงาน', fatherPhone: '081-111-2222',
  motherName: 'นางสมศรี ใจดี', motherJob: 'ค้าขาย', motherPhone: '081-333-4444',
  guardianName: 'นายสมหมาย ใจดี', guardianRel: 'บิดา', guardianPhone: '081-111-2222',
  prevSchool: 'โรงเรียนเทศบาลแหลมฉบัง', prevLevel: 'ม.3', gradYear: '2568', gpa: '3.45', schoolProvince: 'ชลบุรี',
  knew: 'Facebook / Social',
};

const PT_LS = 'eec_portal_state_v1';
const PT_AUTH = 'eec_portal_auth_v1';

type RestoredState = { page?: string; form?: Partial<PortalForm>; paid?: boolean; appNo?: string };

const fmtSize = (n: number) => (n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`);

// ── Mock login gate ─────────────────────────────────────────
function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [natId, setNatId] = useState('');
  const [dob, setDob] = useState<AdmDob>({ d: '', m: '', y: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!supabaseEnabled) { onLogin(); return; } // mock — any input enters
    setErr('');
    if (natId.length !== 13) { setErr('กรอกเลขบัตรประชาชน 13 หลัก'); return; }
    if (!dob.d || !dob.m || !dob.y) { setErr('เลือกวันเดือนปีเกิดให้ครบ'); return; }
    setLoading(true);
    try {
      const res = await signInOrUp(natId, dobToISO(dob.d, dob.m, dob.y));
      if (!res.ok) { setErr(res.error || 'เข้าสู่ระบบไม่สำเร็จ'); setLoading(false); return; }
      onLogin();
    } catch {
      setErr('เชื่อมต่อระบบไม่สำเร็จ ลองใหม่อีกครั้ง'); setLoading(false);
    }
  };
  const gateStyle: CSSProperties = {
    '--adm-primary': PT_PRIMARY,
    '--adm-font': PT_FONT,
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#eef3ef',
    padding: 20,
    fontFamily: PT_FONT,
  };
  return (
    <div className="adm pt" style={gateStyle}>
      <div className="pt-login" style={{ width: '100%', maxWidth: 420 }}>
        <div
          className="pt-login-card"
          style={{ background: '#fff', borderRadius: 20, padding: '34px 30px', boxShadow: '0 20px 60px rgba(2,100,81,.12)', border: '1px solid #e3ece7' }}
        >
          <div className="pt-login-brand" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <img src="/assets/logo.png" alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
              <b style={{ fontSize: 16, color: PT_PRIMARY }}>EEC Admission</b>
              <span style={{ fontSize: 12.5, color: '#66766c' }}>พอร์ทัลผู้สมัคร</span>
            </div>
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: '#15201b' }}>เข้าสู่ระบบพอร์ทัลผู้สมัคร</h1>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>เข้าสู่ระบบเพื่อกรอกใบสมัคร แนบเอกสาร และติดตามสถานะ</p>
          <form
            className="pt-login-form"
            style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
            onSubmit={(e) => { e.preventDefault(); submit(); }}
          >
            <div className="fld full">
              <label>เลขบัตรประชาชน</label>
              <input inputMode="numeric" maxLength={13} value={natId}
                onChange={(e) => setNatId(e.target.value.replace(/\D/g, '').slice(0, 13))}
                placeholder="เลขบัตรประชาชน 13 หลัก" style={{ letterSpacing: '.08em' }} />
            </div>
            <DobPicker value={dob} onChange={setDob} error={err && (!dob.d || !dob.m || !dob.y) ? ' ' : undefined} />
            {err && <div className="fld-err" style={{ marginTop: 2 }}><Icon name="close" />{err}</div>}
            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ…' : <>เข้าสู่ระบบ <Icon name="arrow" /></>}
            </button>
            {!supabaseEnabled && (
              <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 4 }} onClick={submit}>
                เข้าสู่ระบบ (เดโม)
              </button>
            )}
          </form>
          <p className="muted center" style={{ fontSize: 11.5, marginTop: 14 }}>
            {supabaseEnabled
              ? 'เข้าสู่ระบบด้วยเลขบัตรประชาชนและวันเกิดที่ใช้สมัคร'
              : 'ระบบสาธิต — กดปุ่มใดก็ได้เพื่อเข้าสู่พอร์ทัล'} · <a href="/admission/">กลับไปหน้าสมัครเรียน</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function NavButton({ n, page, go, paid }: { n: NavItem; page: string; go: (p: string) => void; paid: boolean }) {
  let badge = n.badge;
  if (n.id === 'payment' && paid) badge = 'ok';
  return (
    <button className={`pt-nav-item ${page === n.id ? 'on' : ''}`} onClick={() => go(n.id)}>
      <span className="pt-nav-ic"><Icon name={n.icon} /></span>
      {n.label}
      {badge === 'ok' && <span className="pt-nav-badge ok"><Icon name="check" style={{ width: 11, height: 11 }} /></span>}
      {badge === 'todo' && <span className="pt-nav-badge todo">ต้องกรอก</span>}
      {badge === 'dot' && <span className="pt-nav-badge dot" />}
    </button>
  );
}

export default function PortalApp() {
  // ── Mock auth state ──────────────────────────────────────
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    (async () => {
      if (supabaseEnabled) {
        const uid = await currentUserId();
        setAuthed(!!uid);
      } else {
        try { setAuthed(localStorage.getItem(PT_AUTH) === '1'); } catch { /* noop */ }
      }
      setReady(true);
    })();
  }, []);
  const login = () => {
    if (!supabaseEnabled) { try { localStorage.setItem(PT_AUTH, '1'); } catch { /* noop */ } }
    setAuthed(true); // when enabled, signInOrUp already established the session
  };
  const logout = async () => {
    if (supabaseEnabled) { await signOut(); }
    else { try { localStorage.removeItem(PT_AUTH); } catch { /* noop */ } }
    setAuthed(false);
  };

  // ── Portal state ─────────────────────────────────────────
  const restored = useMemo<RestoredState>(() => {
    try { return (JSON.parse(localStorage.getItem(PT_LS) || '{}') as RestoredState) || {}; } catch { return {}; }
  }, []);

  const [page, setPage] = useState<string>(restored.page || 'overview');
  const [form, setForm] = useState<PortalForm>({ ...PT_FORM, ...(restored.form || {}) });
  const [files, setFiles] = useState<PortalFiles>({});
  const [navOpen, setNavOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paid, setPaid] = useState<boolean>(restored.paid || false);
  const [payMethod, setPayMethod] = useState<PayMethod>('qr');
  const [appNo, setAppNo] = useState<string>(restored.appNo || 'EEC69-843967');

  useEffect(() => {
    try { localStorage.setItem(PT_LS, JSON.stringify({ page, form, paid, appNo })); } catch { /* noop */ }
  }, [page, form, paid, appNo]);

  // Load the applicant's real application once authenticated (enabled mode).
  useEffect(() => {
    if (!supabaseEnabled || !authed) return;
    (async () => {
      const row = await fetchApplication();
      if (!row) return;
      const fd = row.form_data as Partial<PortalForm> | undefined;
      if (fd && Object.keys(fd).length) setForm((f) => ({ ...f, ...fd }));
      if (row.app_no) setAppNo(row.app_no);
      setPaid(!!row.paid);
    })();
  }, [authed]);

  // Persist payment to the row when enabled.
  const handleSetPaid = (v: boolean) => {
    setPaid(v);
    if (v && supabaseEnabled) { void saveApplication(form, { paid: true }); }
  };

  const set = <K extends keyof PortalForm>(k: K, v: PortalForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };
  const go = (p: string) => {
    setPage(p);
    setNavOpen(false);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const onSave = async () => {
    if (supabaseEnabled) {
      const res = await saveApplication(form);
      if (!res.ok) return; // surface minimally — toast only on success
    }
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  };

  const onPick = async (id: string, file: File) => {
    if (supabaseEnabled) { await uploadDoc(id, file); }
    const url = file.type?.startsWith('image/') ? URL.createObjectURL(file) : null;
    const entry: PortalFile = { name: file.name, size: fmtSize(file.size), type: file.type, url };
    setFiles((f) => ({ ...f, [id]: entry }));
  };
  const onRemove = (id: string) => setFiles((f) => {
    const n = { ...f };
    if (n[id]?.url) URL.revokeObjectURL(n[id].url as string);
    delete n[id];
    return n;
  });

  if (!ready) return null;
  if (!authed) return <LoginGate onLogin={login} />;

  const ctx: PortalCtx = { form, set, onSave, saved, go, appNo, files, onPick, onRemove, paid, setPaid: handleSetPaid, payMethod, setPayMethod };
  const PAGES: Record<string, React.ReactNode> = {
    overview: <DashboardPage {...ctx} />,
    profile: <ProfilePage {...ctx} />,
    program: <ProgramPage {...ctx} />,
    education: <EducationPage {...ctx} />,
    address: <AddressPage {...ctx} />,
    documents: <DocumentsPage {...ctx} />,
    payment: <PaymentPage {...ctx} />,
    print: <PrintPage {...ctx} />,
    status: <PortalStatusPage {...ctx} />,
  };
  const nav = PT_NAV.find((n) => n.id === page) || PT_NAV[0];
  const shellStyle: CSSProperties = { '--adm-primary': PT_PRIMARY, '--adm-font': PT_FONT };

  return (
    <div className={`adm pt ${navOpen ? 'nav-open' : ''}`} style={shellStyle}>
      <div className="pt-scrim" onClick={() => setNavOpen(false)} />

      {/* Sidebar */}
      <aside className="pt-side">
        <div className="pt-side-brand">
          <img src="/assets/logo.png" alt="" />
          <div className="bt"><b>EEC Admission</b><span>พอร์ทัลผู้สมัคร</span></div>
        </div>
        <div className="pt-id">
          <div className="pt-id-top">
            <div className="pt-ava">{form.firstName.charAt(0)}</div>
            <div><div className="pt-id-name">{form.title} {form.firstName} {form.lastName}</div><div className="pt-id-sub">{form.level} · {form.major}</div></div>
          </div>
          <div className="pt-id-no"><span>เลขที่ใบสมัคร</span><b>{appNo}</b></div>
        </div>
        <nav className="pt-nav">
          <div className="pt-nav-label">เมนูหลัก</div>
          {PT_NAV.slice(0, 1).map((n) => <NavButton key={n.id} n={n} page={page} go={go} paid={paid} />)}
          <div className="pt-nav-label">ใบสมัคร</div>
          {PT_NAV.slice(1, 6).map((n) => <NavButton key={n.id} n={n} page={page} go={go} paid={paid} />)}
          <div className="pt-nav-label">การเงิน & เอกสาร</div>
          {PT_NAV.slice(6).map((n) => <NavButton key={n.id} n={n} page={page} go={go} paid={paid} />)}
        </nav>
        <div className="pt-side-foot">
          <button className="pt-logout" onClick={logout}><PIcon name="logout" /> ออกจากระบบ</button>
        </div>
      </aside>

      {/* Main */}
      <div className="pt-main">
        <header className="pt-top">
          <button className="pt-burger" onClick={() => setNavOpen(true)} aria-label="เปิดเมนู"><Icon name="menu" /></button>
          <div className="pt-top-tx">
            <div className="pt-crumb">พอร์ทัลผู้สมัคร · {nav.crumb}</div>
            <h1>{PT_TITLES[page]}</h1>
          </div>
          {saved && <span className="pt-save-pill"><Icon name="check" /> บันทึกแล้ว</span>}
          <div style={{ position: 'relative' }}>
            <button className="pt-bell" onClick={() => setNotifOpen((o) => !o)} aria-label="การแจ้งเตือน"><PIcon name="bell" /><span className="dot" /></button>
            {notifOpen && (
              <div className="pt-notif">
                <div className="pt-notif-h">การแจ้งเตือน</div>
                <div className="pt-notif-i"><span className="nd" /><div><b>กรุณาแนบเอกสารให้ครบ</b><p>ยังขาดเอกสารบังคับ 4 รายการ</p><span>1 ชม. ที่แล้ว</span></div></div>
                <div className="pt-notif-i"><span className="nd" /><div><b>ชำระค่าสมัครภายใน 30 มิ.ย.</b><p>ค่าสมัคร 300 บาท</p><span>วันนี้</span></div></div>
                <div className="pt-notif-i read"><span className="nd" /><div><b>ยืนยันตัวตนสำเร็จ</b><p>ยินดีต้อนรับเข้าสู่ระบบ</p><span>เมื่อวาน</span></div></div>
              </div>
            )}
          </div>
        </header>
        {PAGES[page]}
      </div>
    </div>
  );
}
