// ─────────────────────────────────────────────────────────────
// Personnel page — บุคลากร
// Executives · Teaching staff by department · Support staff
// Loaded after chrome.jsx (uses Nav, Footer, Icon, Reveal, useReveal, StickyCTA)
// ─────────────────────────────────────────────────────────────

const { useState, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// REAL PERSONNEL DATA — แก้ไขชื่อ/ตำแหน่ง/รูป ได้ที่นี่
// รูปภาพแยกโฟลเดอร์: assets/staff/{executives,teachers,support}/
// การเพิ่ม/เปลี่ยนรูป: วางไฟล์ในโฟลเดอร์ แล้วแก้ค่า photo ให้ตรงชื่อไฟล์
// ─────────────────────────────────────────────────────────────
const EX = 'assets/staff/executives/';
const TC = 'assets/staff/teachers/';
const SP = 'assets/staff/support/';

// ── ผู้บริหารระดับสูง ──────────────────────────────────────
const PRINCIPALS = [
  { name: 'ดร.ยงลักษณ์ บุญจี๊ด', role: 'ผู้รับใบอนุญาต', photo: EX + 'license-yonglak.webp' },
  { name: 'อ.ภาคภูมิ บุญจี๊ด',   role: 'ผู้จัดการ',      photo: EX + 'manager-phakphum.webp' },
  { name: 'อ.ภาตะวัน บุญจี๊ด',   role: 'ผู้อำนวยการ',    photo: EX + 'director-phatawan.webp' },
];

// ── รองผู้อำนวยการ ────────────────────────────────────────
const DEPUTIES = [
  { name: 'นายมานิต หอดขุนทด',       role: 'รองผู้อำนวยการ', dept: 'ฝ่ายวิชาการและประกันคุณภาพ', photo: EX + 'deputy-academic-manit.webp',  color: '#026451' },
  { name: 'นายทรงพล แม้นชล',         role: 'รองผู้อำนวยการ', dept: 'ฝ่ายกิจการนักเรียนนักศึกษา', photo: EX + 'deputy-student-songphon.webp', color: '#385BF3' },
  { name: 'นางสาวจิดาภา เพ็ชรรัตน์', role: 'รองผู้อำนวยการ', dept: 'ฝ่ายบริหาร',                 photo: EX + 'deputy-admin-jidapha.webp',   color: '#D6418A' },
  { name: 'นายกอบศักดิ์ เจนวิถี',     role: 'รองผู้อำนวยการ', dept: 'ฝ่ายปกครอง',                 photo: EX + 'deputy-discipline-kobsak.webp', color: '#B12B25' },
  { name: 'นายพงษ์ศักดิ์ ไสตะภาพ',   role: 'รองผู้อำนวยการ', dept: 'ฝ่ายวิจัยและพัฒนาสื่อ',       photo: EX + 'deputy-research-pongsak.webp', color: '#C28A05' },
  { name: 'นายพันธ์จิต อิ่มรอ',       role: 'รองผู้อำนวยการ', dept: 'ฝ่ายอาคารสถานที่',           photo: EX + 'deputy-building-phanchit.webp', color: '#2D8FBF' },
];

// ── ครูผู้สอนแยกตามแผนก ──────────────────────────────────
const TEACHERS = [
  { id: 'yon', name: 'ช่างยนต์', color: '#B12B25', members: [
    { name: 'นายกอบศักดิ์ เจนวิถี', role: 'หัวหน้าแผนกช่างยนต์', head: 'section', photo: EX + 'deputy-discipline-kobsak.webp' },
    { name: 'นายศุภวิชญ์ ทวีการไถ', role: 'ครูประจำแผนก', photo: TC + 'yon-supawit.webp' },
  ]},
  { id: 'faifaa', name: 'ช่างไฟฟ้ากำลัง', color: '#2D8FBF', members: [
    { name: 'นายปิยะ ยิ้มเจริญ',  role: 'หัวหน้าภาคช่างไฟฟ้า', head: 'faculty', photo: TC + 'elec-faculty-piya.webp' },
    { name: 'นายสุขใจ วงษ์คต',    role: 'หัวหน้าแผนกช่างไฟ', head: 'section', photo: TC + 'elec-head-sukjai.webp' },
    { name: 'นายเอนก คณฑา',       role: 'ครูประจำแผนก', photo: TC + 'elec-anek.webp' },
    { name: 'นายธนกฤต ทองสุข',    role: 'ครูประจำแผนก', photo: TC + 'elec-thanakrit.webp' },
  ]},
  { id: 'gear', name: 'ช่างกลโรงงาน', color: '#C28A05', members: [
    { name: 'นายวัฒนา คงประเสริฐ',  role: 'หัวหน้าภาคเครื่องกล', head: 'faculty', photo: TC + 'gear-head-wattana.webp' },
    { name: 'นายไพศาล จุ้ยเคน',     role: 'ครูประจำแผนก', photo: TC + 'gear-phaisan.webp' },
    { name: 'นายพงษ์พัฒน์ สาธุพันธ์', role: 'ครูประจำแผนก', photo: TC + 'gear-pongphat.webp' },
    { name: 'นายสุภวัฒน์ ลีลาด',     role: 'ครูประจำแผนก', photo: TC + 'gear-supawat.webp' },
  ]},
  { id: 'mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', color: '#C9911F', members: [
    { name: 'นายนัฐสิทธิ์ เสาะขุนทด', role: 'หัวหน้าแผนก', head: 'section', photo: TC + 'mecha-head-natthasit.webp' },
    { name: 'นายอรรณพ แซ่เฮง',       role: 'ครูประจำแผนก', photo: TC + 'mecha-annop.webp' },
  ]},
  { id: 'logis', name: 'โลจิสติกส์', color: '#0a9d80', members: [
    { name: 'นายประยูร พินิจเจริญ',    role: 'หัวหน้าแผนก', head: 'section', photo: TC + 'logis-head-prayoon.webp' },
    { name: 'นางสาวจุฑามาศ จันทร์พวง', role: 'ครูประจำแผนก', photo: TC + 'logis-juthamas.webp' },
    { name: 'นายณัฐพล มีเดช',          role: 'ครูประจำแผนก', photo: TC + 'logis-nattapon.webp' },
  ]},
  { id: 'com', name: 'คอมพิวเตอร์ธุรกิจ / คอมกราฟฟิก', color: '#385BF3', members: [
    { name: 'นายฆหชาร์นนท์ ยิ้มฉ่ำ',     role: 'หัวหน้าแผนก', head: 'section', photo: TC + 'com-head-kahachan.webp' },
    { name: 'นางสาวจีรารัตน์ รินสาร',    role: 'ครูประจำแผนก', photo: TC + 'com-jeerarat.webp' },
    { name: 'นางสาวพลอยเพทาย ปัสสายะ', role: 'ครูประจำแผนก', photo: TC + 'com-ploypethai.webp' },
    { name: 'นางสาวสุทธิพร หารลือชัย',   role: 'ครูประจำแผนก', photo: TC + 'com-sutthiporn.webp' },
    { name: 'นายทินภัทร วงค์ใหญ่',       role: 'ครูประจำแผนก', photo: TC + 'com-tinnaphat.webp' },
    { name: 'นายบุญไทย เพชรพระรักษา',   role: 'ครูประจำแผนก', photo: TC + 'com-bunthai.webp' },
  ]},
  { id: 'account', name: 'การบัญชี', color: '#7B5CA7', members: [
    { name: 'นางสาวอุมาพร เกยเลื่อน', role: 'หัวหน้าภาคบริหาร', head: 'faculty', photo: TC + 'account-faculty-umaporn.webp' },
    { name: 'นางสาวสุมาลี หดคำ',      role: 'หัวหน้าแผนกบัญชี', head: 'section', photo: TC + 'account-head-sumalee.webp' },
    { name: 'นางสาวนิตชญาภร ใจคง',   role: 'ครูประจำแผนก', photo: TC + 'account-nitchayaphon.webp' },
  ]},
  { id: 'general', name: 'สามัญสัมพันธ์', color: '#048269', members: [
    { name: 'นายเอกชัย แก้วทรัพย์',      role: 'หัวหน้าสายสามัญ', head: 'faculty', photo: TC + 'general-head-ekkachai.webp' },
    { name: 'นางสาวศรสวรรค์ วงศ์ศรีกุล', role: 'ครูสายสามัญ', photo: TC + 'general-sornsawan.webp' },
  ]},
];

// ── สายสนับสนุน ──────────────────────────────────────────
const SUPPORT = [
  { name: 'นางสาวพรสุดา ผาลี',        role: 'หัวหน้างานกิจกรรม',   photo: SP + 'activity-phonsuda.webp', color: '#D6418A' },
  { name: 'นางกัลยา เรืองฤทธิ์',       role: 'เจ้าหน้าที่การเงิน',    photo: SP + 'finance-kanlaya.webp',   color: '#7B5CA7' },
  { name: 'นางสาวสุพัฒน์ ชุ่มมุณีรัตน์', role: 'เจ้าหน้าที่นายทะเบียน', photo: SP + 'registrar-suphat.webp',  color: '#026451' },
];

const totalTeachers = TEACHERS.reduce((s, d) => s + d.members.length, 0);
const totalStaff = totalTeachers + DEPUTIES.length + PRINCIPALS.length + SUPPORT.length;

// ── Avatar ──────────────────────────────────────────────────
// Pass a `photo` path to show a real photo; otherwise a colored
// monogram (the person's initial) is shown as a placeholder.
function Avatar({ color, initial, photo, name }) {
  if (photo) {
    return (
      <div className="staff-avatar has-photo" style={{ '--dc': color }}>
        <img src={photo} alt={name || ''}/>
      </div>
    );
  }
  return <div className="staff-avatar" style={{ '--dc': color }}>{initial}</div>;
}

// Highlight query inside a name
function Highlight({ text, q }) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

// ── Search / filter toolbar ─────────────────────────────────
function Toolbar({ dept, setDept, query, setQuery, counts }) {
  return (
    <div className="staff-toolbar">
      <div className="staff-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <input
          type="text"
          placeholder="ค้นหาชื่อบุคลากร…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="ค้นหาบุคลากร"
        />
        {query && (
          <button className="clear" onClick={() => setQuery('')} aria-label="ล้างคำค้นหา">
            <Icon name="close" style={{ width: 14, height: 14 }}/>
          </button>
        )}
      </div>
      <div className="chip-row" role="tablist" aria-label="กรองตามแผนก">
        <button className={`chip ${dept === 'all' ? 'active' : ''}`} onClick={() => setDept('all')} role="tab" aria-selected={dept === 'all'}>
          ทั้งหมด
          <span className="ct">{totalTeachers}</span>
        </button>
        {TEACHERS.map((d) => (
          <button
            key={d.id}
            className={`chip ${dept === d.id ? 'active' : ''}`}
            style={{ '--cc': d.color }}
            onClick={() => setDept(d.id)}
            role="tab" aria-selected={dept === d.id}
          >
            <span className="dot"/>
            {d.name}
            <span className="ct">{d.members.length}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Staff card ──────────────────────────────────────────────
function StaffCard({ p, color, q }) {
  const headLabel = p.head === 'faculty' ? 'หัวหน้าภาค' : p.head === 'section' ? 'หัวหน้าแผนก' : null;
  return (
    <div className={`staff-card ${p.head ? 'is-head is-' + p.head : ''}`} style={{ '--dc': color }}>
      {headLabel && (
        <span className={`head-flag head-${p.head}`}>
          {p.head === 'faculty' && <Icon name="star"/>}
          {headLabel}
        </span>
      )}
      <Avatar color={color} initial={p.initial} photo={p.photo} name={p.name}/>
      <div className="name"><Highlight text={p.name} q={q}/></div>
      <div className="role">{p.role}</div>
    </div>
  );
}

// ── Main app ────────────────────────────────────────────────
function PersonnelApp() {
  useReveal();
  const [dept, setDept] = useState('all');
  const [query, setQuery] = useState('');
  const q = query.trim();

  const filteredDepts = useMemo(() => {
    return TEACHERS
      .filter((d) => dept === 'all' || d.id === dept)
      .map((d) => ({
        ...d,
        list: d.members.filter((m) => !q || m.name.includes(q)),
      }))
      .filter((d) => d.list.length > 0);
  }, [dept, q]);

  const filteredSupport = useMemo(
    () => SUPPORT.filter((m) => !q || m.name.includes(q)),
    [q]
  );

  const showSupport = dept === 'all';
  const noTeacherMatches = filteredDepts.length === 0;
  const nothingAtAll = noTeacherMatches && (!showSupport || filteredSupport.length === 0);

  return (
    <>
      <Nav active="personnel"/>
      <main>
        {/* Hero */}
        <section className="page-hero ppl-hero">
          <div className="container page-hero-inner">
            <div className="crumbs">
              <a href="index.html">หน้าแรก</a>
              <Icon name="chevronRight" style={{ width: 12, height: 12 }}/>
              <span>บุคลากร</span>
            </div>
            <span className="eyebrow">ทำเนียบบุคลากร</span>
            <h1>ทีมงานเบื้องหลัง<span className="grad">ช่างฝีมือ</span>ทุกคน</h1>
            <p>คณะผู้บริหาร ครูผู้สอนทุกแผนกวิชา และบุคลากรสายสนับสนุน ที่ทุ่มเทพัฒนานักศึกษาให้พร้อมสู่โลกการทำงานจริง</p>
            <div className="ppl-stats">
              {[
                { num: String(PRINCIPALS.length), lbl: 'ผู้บริหารระดับสูง' },
                { num: String(DEPUTIES.length), lbl: 'รองผู้อำนวยการ' },
                { num: String(totalTeachers), plus: true, lbl: 'ครูผู้สอน 8 แผนก' },
                { num: String(SUPPORT.length), lbl: 'สายสนับสนุน' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.07} className="ppl-stat">
                  <div className="num">{s.num}{s.plus && <span className="plus">+</span>}</div>
                  <div className="lbl">{s.lbl}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Executives */}
        <section className="section section-sm">
          <div className="container">
            <Reveal className="section-head" style={{ marginBottom: 32 }}>
              <span className="eyebrow">คณะผู้บริหาร</span>
              <h2 className="section-title">ผู้นำองค์กร</h2>
            </Reveal>
            <div className="principal-grid">
              {PRINCIPALS.map((p, i) => (
                <Reveal key={i} delay={i * 0.08} className="principal-card">
                  <div className="pc-photo"><img src={p.photo} alt={p.name}/></div>
                  <div className="pc-role">{p.role}</div>
                  <div className="pc-name">{p.name}</div>
                </Reveal>
              ))}
            </div>

            <Reveal className="exec-subhead">
              <span className="bar"/>
              <h3>รองผู้อำนวยการ</h3>
              <span className="ct">{DEPUTIES.length} ฝ่าย</span>
            </Reveal>
            <div className="exec-deputies">
              {DEPUTIES.map((d, i) => (
                <Reveal key={i} delay={i * 0.06} className="exec-card" style={{ '--dc': d.color }}>
                  <Avatar color={d.color} initial={d.initial} photo={d.photo} name={d.name}/>
                  <div>
                    <div className="name">{d.name}</div>
                    <div className="role">{d.role}</div>
                    <div className="dept">{d.dept}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Teaching staff */}
        <section className="section section-sm" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <Reveal className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">คณะครู</span>
              <h2 className="section-title">ครูผู้สอนแยกตามแผนก</h2>
            </Reveal>
            <Toolbar dept={dept} setDept={setDept} query={query} setQuery={setQuery}/>

            {filteredDepts.map((d) => (
              <div key={d.id} className="dept-block">
                <div className="dept-head" style={{ '--dc': d.color }}>
                  <span className="bar"/>
                  <h3>{d.name}</h3>
                  <span className="ct">{d.list.length} ท่าน</span>
                </div>
                <div className="staff-grid">
                  {d.list.map((p, i) => (
                    <Reveal key={i} delay={Math.min(i * 0.04, 0.24)}>
                      <StaffCard p={p} color={d.color} q={q}/>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}

            {noTeacherMatches && (
              <div className="staff-empty">
                <Icon name="users"/>
                <h3>ไม่พบบุคลากรที่ค้นหา</h3>
                <p>ลองค้นด้วยชื่ออื่น หรือเลือกแผนก “ทั้งหมด”</p>
              </div>
            )}
          </div>
        </section>

        {/* Support staff */}
        {showSupport && (
          <section className="section section-sm">
            <div className="container">
              <Reveal className="section-head" style={{ marginBottom: 24 }}>
                <span className="eyebrow">สายสนับสนุน</span>
                <h2 className="section-title">บุคลากรสายสนับสนุน</h2>
              </Reveal>
              {filteredSupport.length > 0 ? (
                <div className="support-grid">
                  {filteredSupport.map((m, i) => (
                    <Reveal key={i} delay={Math.min(i * 0.04, 0.24)} className="support-card" style={{ '--dc': m.color }}>
                      <Avatar color={m.color} initial={m.initial} photo={m.photo} name={m.name}/>
                      <div>
                        <div className="name"><Highlight text={m.name} q={q}/></div>
                        <div className="role">{m.role}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                !nothingAtAll && (
                  <p style={{ color: 'var(--ink-500)' }}>— ไม่มีรายชื่อสายสนับสนุนที่ตรงกับคำค้นหา —</p>
                )
              )}
              <div style={{ marginTop: 32 }}>
                <span className="ppl-note">
                  <Icon name="sparkle" style={{ width: 14, height: 14 }}/>
                  ทำเนียบบุคลากร · ปีการศึกษา 2568
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer/>
      <StickyCTA/>
    </>
  );
}

const mount = () => {
  if (!window.Nav) return setTimeout(mount, 50);
  ReactDOM.createRoot(document.getElementById('app')).render(<PersonnelApp/>);
};
mount();
