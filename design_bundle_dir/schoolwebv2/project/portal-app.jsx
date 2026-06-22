// ═══════════════════════════════════════════════════════════
// portal-app.jsx — applicant portal shell (sidebar + routing)
// ═══════════════════════════════════════════════════════════
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const PT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#026451",
  "fontFamily": "'Prompt', system-ui, sans-serif"
}/*EDITMODE-END*/;

const PT_COLORS = ['#026451', '#0a7d52', '#1c2a4e', '#3a4db5', '#8a1f2b'];
const PT_FONTS = [
  { value: "'Prompt', system-ui, sans-serif", label: 'Prompt' },
  { value: "'Noto Sans Thai', system-ui, sans-serif", label: 'Noto Sans Thai' },
  { value: "'IBM Plex Sans Thai', system-ui, sans-serif", label: 'IBM Plex Thai' },
  { value: "'Anuphan', system-ui, sans-serif", label: 'Anuphan' },
  { value: "'Sarabun', system-ui, sans-serif", label: 'Sarabun' },
];

const PT_NAV = [
  { id: 'overview',  label: 'ภาพรวม',          icon: 'chart',     crumb: 'แดชบอร์ด' },
  { id: 'profile',   label: 'ข้อมูลส่วนตัว',    icon: 'users',     crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'program',   label: 'เลือกสาขา',        icon: 'book',      crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'education', label: 'ประวัติการศึกษา',  icon: 'award',     crumb: 'ใบสมัคร', badge: 'ok' },
  { id: 'address',   label: 'ที่อยู่ & ผู้ปกครอง', icon: 'pin',    crumb: 'ใบสมัคร', badge: 'todo' },
  { id: 'documents', label: 'เอกสารแนบ',        icon: 'briefcase', crumb: 'หลักฐาน', badge: 'todo' },
  { id: 'payment',   label: 'ชำระเงิน',         icon: 'cart',      crumb: 'การเงิน', badge: 'dot' },
  { id: 'print',     label: 'พิมพ์ใบสมัคร',     icon: 'doc',       crumb: 'เอกสาร' },
  { id: 'status',    label: 'สถานะการสมัคร',    icon: 'shield',    crumb: 'ติดตาม' },
];
const PT_TITLES = {
  overview: 'ภาพรวมใบสมัคร', profile: 'ข้อมูลส่วนตัว', program: 'เลือกสาขาที่สมัคร',
  education: 'ประวัติการศึกษา', address: 'ที่อยู่ & ผู้ปกครอง', documents: 'เอกสารแนบ',
  payment: 'ชำระค่าสมัคร', print: 'พิมพ์ใบสมัคร', status: 'สถานะการสมัคร',
};

const PT_FORM = {
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

function PortalApp() {
  const [t, setTweak] = useTweaks(PT_TWEAK_DEFAULTS);
  const restored = useMemoA(() => { try { return JSON.parse(localStorage.getItem(PT_LS)) || {}; } catch { return {}; } }, []);

  const [page, setPage] = useStateA(restored.page || 'overview');
  const [form, setForm] = useStateA({ ...PT_FORM, ...(restored.form || {}) });
  const [files, setFiles] = useStateA({});
  const [navOpen, setNavOpen] = useStateA(false);
  const [saved, setSaved] = useStateA(false);
  const [notifOpen, setNotifOpen] = useStateA(false);
  const [paid, setPaid] = useStateA(restored.paid || false);
  const [payMethod, setPayMethod] = useStateA('qr');
  const appNo = restored.appNo || 'EEC69-843967';

  useEffectA(() => { try { localStorage.setItem(PT_LS, JSON.stringify({ page, form, paid, appNo })); } catch {} }, [page, form, paid]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };
  const go = (p) => { setPage(p); setNavOpen(false); setSaved(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const onSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const fmtSize = (n) => n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`;
  const onPick = (id, file) => { const url = file.type?.startsWith('image/') ? URL.createObjectURL(file) : null; setFiles((f) => ({ ...f, [id]: { name: file.name, size: fmtSize(file.size), type: file.type, url } })); };
  const onRemove = (id) => setFiles((f) => { const n = { ...f }; if (n[id]?.url) URL.revokeObjectURL(n[id].url); delete n[id]; return n; });

  const ctx = { form, set, onSave, saved, go, appNo, files, onPick, onRemove, paid, setPaid, payMethod, setPayMethod };
  const PAGES = {
    overview:  <DashboardPage {...ctx}/>,
    profile:   <ProfilePage {...ctx}/>,
    program:   <ProgramPage {...ctx}/>,
    education: <EducationPage {...ctx}/>,
    address:   <AddressPage {...ctx}/>,
    documents: <DocumentsPage {...ctx}/>,
    payment:   <PaymentPage {...ctx}/>,
    print:     <PrintPage {...ctx}/>,
    status:    <PortalStatusPage {...ctx}/>,
  };
  const nav = PT_NAV.find((n) => n.id === page) || PT_NAV[0];

  return (
    <div className={`adm pt ${navOpen ? 'nav-open' : ''}`} style={{ '--adm-primary': t.primaryColor, '--adm-font': t.fontFamily }}>
      <div className="pt-scrim" onClick={() => setNavOpen(false)}/>

      {/* Sidebar */}
      <aside className="pt-side">
        <div className="pt-side-brand">
          <img src="assets/logo.png" alt=""/>
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
          {PT_NAV.slice(0, 1).map((n) => navItem(n, page, go))}
          <div className="pt-nav-label">ใบสมัคร</div>
          {PT_NAV.slice(1, 6).map((n) => navItem(n, page, go, paid))}
          <div className="pt-nav-label">การเงิน & เอกสาร</div>
          {PT_NAV.slice(6).map((n) => navItem(n, page, go, paid))}
        </nav>
        <div className="pt-side-foot">
          <button className="pt-logout" onClick={() => { window.location.href = 'admission.html'; }}><PIcon name="logout"/> ออกจากระบบ</button>
        </div>
      </aside>

      {/* Main */}
      <div className="pt-main">
        <header className="pt-top">
          <button className="pt-burger" onClick={() => setNavOpen(true)} aria-label="เปิดเมนู"><Icon name="menu"/></button>
          <div className="pt-top-tx">
            <div className="pt-crumb">พอร์ทัลผู้สมัคร · {nav.crumb}</div>
            <h1>{PT_TITLES[page]}</h1>
          </div>
          {saved && <span className="pt-save-pill"><Icon name="check"/> บันทึกแล้ว</span>}
          <div style={{ position: 'relative' }}>
            <button className="pt-bell" onClick={() => setNotifOpen((o) => !o)} aria-label="การแจ้งเตือน"><PIcon name="bell"/><span className="dot"/></button>
            {notifOpen && (
              <div className="pt-notif">
                <div className="pt-notif-h">การแจ้งเตือน</div>
                <div className="pt-notif-i"><span className="nd"/><div><b>กรุณาแนบเอกสารให้ครบ</b><p>ยังขาดเอกสารบังคับ 4 รายการ</p><span>1 ชม. ที่แล้ว</span></div></div>
                <div className="pt-notif-i"><span className="nd"/><div><b>ชำระค่าสมัครภายใน 30 มิ.ย.</b><p>ค่าสมัคร 300 บาท</p><span>วันนี้</span></div></div>
                <div className="pt-notif-i read"><span className="nd"/><div><b>ยืนยันตัวตนสำเร็จ</b><p>ยินดีต้อนรับเข้าสู่ระบบ</p><span>เมื่อวาน</span></div></div>
              </div>
            )}
          </div>
        </header>
        {PAGES[page]}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="แบรนด์"/>
        <TweakColor label="สีหลัก" value={t.primaryColor} options={PT_COLORS} onChange={(v) => setTweak('primaryColor', v)}/>
        <TweakSelect label="ฟอนต์" value={t.fontFamily} options={PT_FONTS} onChange={(v) => setTweak('fontFamily', v)}/>
        <TweakSection label="ไปยังหน้า"/>
        <TweakSelect label="หน้า" value={page} options={PT_NAV.map((n) => ({ value: n.id, label: n.label }))} onChange={go}/>
        <TweakSection label="สถานะชำระเงิน"/>
        <TweakToggle label="ชำระเงินแล้ว" value={paid} onChange={setPaid}/>
      </TweaksPanel>
    </div>
  );
}

function navItem(n, page, go, paid) {
  let badge = n.badge;
  if (n.id === 'payment' && paid) badge = 'ok';
  return (
    <button key={n.id} className={`pt-nav-item ${page === n.id ? 'on' : ''}`} onClick={() => go(n.id)}>
      <span className="pt-nav-ic"><Icon name={n.icon}/></span>
      {n.label}
      {badge === 'ok' && <span className="pt-nav-badge ok"><Icon name="check" style={{ width: 11, height: 11 }}/></span>}
      {badge === 'todo' && <span className="pt-nav-badge todo">ต้องกรอก</span>}
      {badge === 'dot' && <span className="pt-nav-badge dot"/>}
    </button>
  );
}

const mountPortal = () => {
  if (!window.DashboardPage || !window.useTweaks || !window.Icon || !window.Field) return setTimeout(mountPortal, 40);
  ReactDOM.createRoot(document.getElementById('app')).render(<PortalApp/>);
};
mountPortal();
