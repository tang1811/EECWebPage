// ─────────────────────────────────────────────────────────────
// Homepage sections — Hero, Stats, Courses, About, Portfolio,
//                     Testimonials, FAQ, CTA banner
// ─────────────────────────────────────────────────────────────

// ── HERO ────────────────────────────────────────────────────
function Hero({ layout = 'parallax' }) {
  // layout: 'parallax' | 'split' | 'spotlight' | 'minimal'
  const heroRef = useRef(null);
  const [py, setPy] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const t = -rect.top * 0.3;
      setPy(t);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (layout === 'split') return <HeroSplit />;
  if (layout === 'spotlight') return <HeroSpotlight />;
  if (layout === 'minimal') return <HeroMinimal />;
  if (layout === 'video') return <HeroVideo />;
  if (layout === 'slideshow') return <HeroSlideshow />;
  // default: parallax
  return (
    <section className="hero hero-parallax" ref={heroRef}>
      <div className="hero-bg" style={{ transform: `translateY(${py * 0.5}px)` }}>
        <div className="hero-mesh" />
        <div className="hero-grid-bg" />
        <FloatingShapes py={py} />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow reveal in">
            <span className="hero-eyebrow-dot" />
            เปิดรับสมัครแล้ว · ปีการศึกษา 2569
          </div>
          <h1 className="hero-title">
            <span className="hero-line line-1">เริ่มต้นอาชีพ</span>
            <span className="hero-line line-2">ในสายเทคโนโลยี</span>
            <span className="hero-line line-3 grad">ที่นี่ ที่แหลมฉบัง</span>
          </h1>
          <p className="hero-sub">
            ปวช. · ปวส. · ป.ตรี — กว่า <strong>30 ปี</strong> สร้างช่างฝีมือป้อนสู่นิคมอุตสาหกรรมตะวันออก พร้อมโครงการทวิภาคีกับองค์กรชั้นนำ มีงานทำ 100% หลังเรียนจบ
          </p>
          <div className="hero-cta">
            <a href="apply.html" className="btn btn-primary btn-lg">
              สมัครเรียนออนไลน์
              <Icon name="arrow" className="btn-icon" />
            </a>
            <a href="video.html" className="btn btn-ghost btn-lg hero-play-btn">
              <span className="hero-play-icon"><Icon name="play" style={{ width: 12, height: 12, color: 'white' }} /></span>
              ดูทัวร์ 1 นาที
            </a>
          </div>
          <div className="hero-trust">
            <HeroAvatars />
            <div>
              <div className="hero-trust-line"><strong>4.8</strong> <Icon name="star" style={{ width: 14, height: 14, color: 'var(--accent-amber)', display: 'inline', verticalAlign: '-2px' }} /> <Icon name="star" style={{ width: 14, height: 14, color: 'var(--accent-amber)', display: 'inline', verticalAlign: '-2px' }} /> <Icon name="star" style={{ width: 14, height: 14, color: 'var(--accent-amber)', display: 'inline', verticalAlign: '-2px' }} /> <Icon name="star" style={{ width: 14, height: 14, color: 'var(--accent-amber)', display: 'inline', verticalAlign: '-2px' }} /> <Icon name="star" style={{ width: 14, height: 14, color: 'var(--accent-amber)', display: 'inline', verticalAlign: '-2px' }} /></div>
              <div className="hero-trust-sub">จากศิษย์เก่ากว่า 12,000 คน</div>
            </div>
          </div>
        </div>
        <HeroCrest py={py} />
      </div>
      <a href="#highlights" className="hero-scroll" aria-label="เลื่อนลง">
        <span>SCROLL</span>
        <Icon name="arrowDown" style={{ width: 14, height: 14 }} />
      </a>
    </section>);

}

function FloatingShapes({ py }) {
  return (
    <div className="hero-shapes" aria-hidden="true">
      <div className="shape s1" style={{ transform: `translate(${py * -0.1}px, ${py * 0.2}px) rotate(${py * 0.05}deg)` }} />
      <div className="shape s2" style={{ transform: `translate(${py * 0.15}px, ${py * -0.1}px)` }} />
      <div className="shape s3" style={{ transform: `translate(${py * -0.05}px, ${py * 0.15}px) rotate(${py * -0.08}deg)` }} />
      <div className="shape s4" style={{ transform: `translate(${py * 0.2}px, ${py * 0.05}px)` }} />
    </div>);

}

function HeroCrest({ py }) {
  return (
    <div className="hero-crest" style={{ transform: `translateY(${py * -0.15}px)` }}>
      <div className="crest-glow" />
      <div className="crest-ring r1" />
      <div className="crest-ring r2" />
      <div className="crest-ring r3" />
      <img src="assets/logo.png" alt="EEC Engineer Laemchabang crest" className="crest-logo" />
      <div className="crest-badge b1"><Icon name="award" style={{ width: 16, height: 16 }} /> 30+ ปี</div>
      <div className="crest-badge b2"><Icon name="users" style={{ width: 16, height: 16 }} /> 12,000+ ศิษย์เก่า</div>
      <div className="crest-badge b3"><Icon name="briefcase" style={{ width: 16, height: 16 }} /> 100% มีงานทำ</div>
      <div className="crest-badge b4"><Icon name="shield" style={{ width: 16, height: 16 }} /> สอศ. รับรอง</div>
    </div>);

}

function HeroAvatars() {
  const colors = ['#0f7a3e', '#22a85a', '#1c2a4e', '#8a1f2b', '#f5b800'];
  const initials = ['ก', 'น', 'ป', 'ส', 'ว'];
  return (
    <div className="hero-avatars">
      {initials.map((c, i) =>
      <div key={i} className="hero-avatar" style={{ background: colors[i], zIndex: 5 - i }}>{c}</div>
      )}
    </div>);

}

// Alt hero layouts -------------------------------------------
function HeroSplit() {
  return (
    <section className="hero hero-split">
      <div className="hero-split-left">
        <div className="container hero-split-copy">
          <div className="hero-eyebrow"><span className="hero-eyebrow-dot" />รับสมัครนักศึกษาใหม่ 2569</div>
          <h1 className="hero-title">
            <span className="hero-line">อนาคต<span className="grad">เริ่มต้นที่นี่</span></span>
            <span className="hero-line">ปวช. ปวส. ป.ตรี</span>
          </h1>
          <p className="hero-sub">เรียนกับช่างมืออาชีพ ฝึกงานจริงในนิคม EEC พร้อมเส้นทางสู่อาชีพชัดเจน</p>
          <div className="hero-cta">
            <a href="apply.html" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
            <a href="courses.html" className="btn btn-ghost btn-lg">ดูหลักสูตร</a>
          </div>
        </div>
      </div>
      <div className="hero-split-right">
        <div className="hero-split-img">
          <div className="ph-frame ph-frame-lg">
            <Icon name="users" style={{ width: 96, height: 96, color: 'rgba(255,255,255,0.9)' }} />
            <div className="ph-label">รูปบรรยากาศวิทยาลัย</div>
          </div>
        </div>
      </div>
    </section>);

}

function HeroSpotlight() {
  return (
    <section className="hero hero-spotlight">
      <div className="spotlight-bg" />
      <div className="container hero-center">
        <div className="hero-eyebrow"><span className="hero-eyebrow-dot" />OPEN HOUSE 2569</div>
        <h1 className="hero-title hero-title-xl">
          <span className="hero-line">สร้างช่างมืออาชีพ</span>
          <span className="hero-line grad">ป้อนนิคม EEC</span>
        </h1>
        <p className="hero-sub" style={{ margin: '20px auto 0', textAlign: 'center' }}>
          18 สาขา ครอบคลุมตั้งแต่ช่างยนต์ ไฟฟ้า เมคคาทรอนิกส์ ไปจนถึงโลจิสติกส์และดิจิทัล
        </p>
        <div className="hero-cta" style={{ justifyContent: 'center' }}>
          <a href="apply.html" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
          <a href="courses.html" className="btn btn-ghost btn-lg">ดูหลักสูตรทั้งหมด</a>
        </div>
      </div>
    </section>);

}

// ── Hero with video highlight loop ──────────────────────────
function HeroVideo() {
  return (
    <section className="hero hero-video-layout">
      <div className="hero-bg">
        <div className="hero-mesh" />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="hero-eyebrow-dot" />เปิดรับสมัครแล้ว · ปีการศึกษา 2569</div>
          <h1 className="hero-title">
            <span className="hero-line line-1">เริ่มต้นอาชีพ</span>
            <span className="hero-line line-2">ในสายเทคโนโลยี</span>
            <span className="hero-line line-3 grad">ที่นี่ ที่แหลมฉบัง</span>
          </h1>
          <p className="hero-sub">ปวช. · ปวส. · ป.ตรี — 30+ ปี สร้างช่างฝีมือป้อนสู่นิคม EEC พร้อมโครงการทวิภาคีกับองค์กรชั้นนำ มีงานทำ 100%</p>
          <div className="hero-cta">
            <a href="apply.html" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
            <a href="video.html" className="btn btn-ghost btn-lg hero-play-btn">
              <span className="hero-play-icon"><Icon name="play" style={{ width: 12, height: 12, color: 'white' }} /></span>
              ดูเวอร์ชั่นเต็ม 1 นาที
            </a>
          </div>
        </div>
        <HeroVideoCard />
      </div>
    </section>);

}

function HeroVideoCard() {
  const [scene, setScene] = useState(0);
  const SCENES = 4;
  const DURATION = 2400;
  useEffect(() => {
    const t = setInterval(() => setScene((s) => (s + 1) % SCENES), DURATION);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-video-card">
      <div className="hvc-frame">
        <div className="hvc-chrome">
          <span className="hvc-dot live" />
          <span className="hvc-meta">LIVE · ทัวร์วิทยาลัย</span>
          <span className="hvc-mute"><Icon name="play" style={{ width: 10, height: 10, color: 'currentColor' }} /> MUTED</span>
        </div>
        <div className="hvc-stage">
          {[0, 1, 2, 3].map((i) =>
          <div key={i} className={`hvc-scene ${scene === i ? 'on' : ''}`}>
              {i === 0 && <HVCSceneA />}
              {i === 1 && <HVCSceneB />}
              {i === 2 && <HVCSceneC />}
              {i === 3 && <HVCSceneD />}
            </div>
          )}
          <div className="hvc-progress">
            {[0, 1, 2, 3].map((i) =>
            <span key={i} className={`hvc-bar ${i === scene ? 'on' : ''} ${i < scene ? 'done' : ''}`} />
            )}
          </div>
        </div>
        <a href="video.html" className="hvc-cta">
          <span className="hvc-cta-icon"><Icon name="play" style={{ width: 14, height: 14 }} /></span>
          ดูเวอร์ชั่นเต็ม
          <Icon name="arrow" style={{ width: 14, height: 14 }} />
        </a>
      </div>
    </div>);

}

function HVCSceneA() {
  return (
    <svg viewBox="0 0 480 320" className="hvc-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="hvcRadA" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#0f7a3e" stopOpacity="0.7" />
          <stop offset="1" stopColor="#0a4d28" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="480" height="320" fill="url(#hvcRadA)" />
      <g transform="translate(240, 130)">
        <g className="hvc-ring-rotate">
          <circle r="80" fill="none" stroke="#86dba6" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" />
        </g>
        <circle r="64" fill="#1c2a4e" />
        <circle r="64" fill="none" stroke="#86dba6" strokeWidth="2" />
        <text textAnchor="middle" y="-6" fill="white" fontSize="22" fontFamily="Prompt" fontWeight="800">EEC</text>
        <text textAnchor="middle" y="14" fill="#86dba6" fontSize="9" fontFamily="Prompt" fontWeight="600">LAEMCHABANG</text>
      </g>
      <text textAnchor="middle" x="240" y="240" fill="white" fontSize="20" fontFamily="Prompt" fontWeight="800" letterSpacing="-0.02em">วิทยาลัยเทคโนโลยี อีอีซี เอ็นจิเนีย</text>
      <text textAnchor="middle" x="240" y="262" fill="#86dba6" fontSize="12" fontFamily="Prompt" fontWeight="500">แหลมฉบัง · ศรีราชา · ชลบุรี</text>
      <text textAnchor="middle" x="240" y="294" fill="#f5b800" fontSize="11" fontFamily="Prompt" fontWeight="700" letterSpacing="0.1em">รับสมัคร 2569</text>
    </svg>);

}

function HVCSceneB() {
  const trades = [
  { x: 100, y: 180, icon: 'M -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0', dot: true, label: 'ช่างยนต์' },
  { x: 200, y: 180, icon: 'M -4 -20 L 4 -2 L -4 -2 L 4 20', label: 'ไฟฟ้า' },
  { x: 300, y: 180, icon: 'M -16 6 h 32 v 12 h -32 z M -2 -10 a 4 4 0 1 1 4 0', label: 'เมคคา' },
  { x: 400, y: 180, icon: 'M -16 8 h 32 M -10 -4 v 12 M 10 -4 v 12 M -16 -4 h 22 v 12', label: 'โลจิสติกส์' }];

  return (
    <svg viewBox="0 0 480 320" className="hvc-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hvcGradB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14924b" />
          <stop offset="1" stopColor="#0a4d28" />
        </linearGradient>
      </defs>
      <rect width="480" height="320" fill="url(#hvcGradB)" />
      <text textAnchor="middle" x="240" y="56" fill="#c3edd2" fontSize="11" fontFamily="Prompt" fontWeight="700" letterSpacing="0.16em">18 PROGRAMS</text>
      <text textAnchor="middle" x="240" y="84" fill="white" fontSize="20" fontFamily="Prompt" fontWeight="800">หลักสูตรครบทุกสายอาชีพ</text>
      {trades.map((t, i) =>
      <g key={i} transform={`translate(${t.x}, ${t.y})`} className="hvc-pop" style={{ animationDelay: `${i * 0.12}s` }}>
          <circle r="34" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <path d={t.icon} fill="none" stroke="#86dba6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text textAnchor="middle" y="58" fill="white" fontSize="11" fontFamily="Prompt" fontWeight="600">{t.label}</text>
        </g>
      )}
      <text textAnchor="middle" x="240" y="290" fill="#c3edd2" fontSize="11" fontFamily="Prompt">+ อีก 12 สาขา · ปวช. ปวส. ป.ตรี</text>
    </svg>);

}

function HVCSceneC() {
  const partners = [
  { x: 120, y: 110, name: 'Watsons', d: 0 },
  { x: 360, y: 100, name: 'Toyota', d: 0.2 },
  { x: 100, y: 220, name: 'Honda', d: 0.4 },
  { x: 380, y: 230, name: 'WHA', d: 0.6 }];

  return (
    <svg viewBox="0 0 480 320" className="hvc-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="hvcRadC" cx="0.5" cy="0.5">
          <stop offset="0" stopColor="#1c2a4e" stopOpacity="0.6" />
          <stop offset="1" stopColor="#0a4d28" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="480" height="320" fill="url(#hvcRadC)" />
      <path d="M 40 40 C 200 50 280 100 320 180 C 360 240 380 280 440 290 L 440 320 L 40 320 Z" fill="rgba(15,122,62,0.25)" stroke="rgba(134,219,166,0.4)" strokeWidth="1" />
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 4" fill="none">
        <path d="M 60 80 L 240 170 L 420 250" />
        <path d="M 80 240 L 220 170 L 400 90" />
      </g>
      <text textAnchor="middle" x="240" y="40" fill="#c3edd2" fontSize="11" fontFamily="Prompt" fontWeight="700" letterSpacing="0.16em">50+ INDUSTRY PARTNERS</text>
      <g transform="translate(240, 170)">
        <circle r="22" fill="#f5b800" opacity="0.3" className="hvc-pulse" />
        <circle r="11" fill="#f5b800" />
        <circle r="4" fill="#0a4d28" />
        <text textAnchor="middle" y="-22" fill="#f5b800" fontSize="11" fontFamily="Prompt" fontWeight="700">วิทยาลัย EEC</text>
      </g>
      {partners.map((p, i) =>
      <g key={i} transform={`translate(${p.x}, ${p.y})`} className="hvc-ping-grp" style={{ animationDelay: `${p.d}s` }}>
          <circle r="14" fill="#22a85a" opacity="0" className="hvc-ping" />
          <circle r="7" fill="#0f7a3e" />
          <circle r="7" fill="none" stroke="white" strokeWidth="1.5" />
          <rect x="-32" y="-26" width="64" height="16" rx="8" fill="rgba(0,0,0,0.7)" />
          <text textAnchor="middle" y="-15" fill="white" fontSize="10" fontFamily="Prompt" fontWeight="600">{p.name}</text>
        </g>
      )}
    </svg>);

}

function HVCSceneD() {
  const stats = [
  { x: 120, y: 175, v: '30+', l: 'ปี' },
  { x: 240, y: 175, v: '16', l: 'สาขา' },
  { x: 360, y: 175, v: '12K+', l: 'ศิษย์เก่า' }];

  return (
    <svg viewBox="0 0 480 320" className="hvc-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="hvcRadD" cx="0.3" cy="0.4">
          <stop offset="0" stopColor="#22a85a" stopOpacity="0.4" />
          <stop offset="1" stopColor="#0a4d28" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="480" height="320" fill="url(#hvcRadD)" />
      <text textAnchor="middle" x="240" y="56" fill="#c3edd2" fontSize="11" fontFamily="Prompt" fontWeight="700" letterSpacing="0.16em">BY THE NUMBERS</text>
      <text textAnchor="middle" x="240" y="84" fill="white" fontSize="18" fontFamily="Prompt" fontWeight="800">พิสูจน์แล้วด้วยตัวเลข</text>
      {stats.map((s, i) =>
      <g key={i} className="hvc-pop" style={{ animationDelay: `${i * 0.12}s` }}>
          <text textAnchor="middle" x={s.x} y={s.y} fill="white" fontSize="44" fontFamily="Prompt" fontWeight="800" letterSpacing="-0.03em">{s.v}</text>
          <text textAnchor="middle" x={s.x} y={s.y + 22} fill="#86dba6" fontSize="11" fontFamily="Prompt" fontWeight="500">{s.l}</text>
        </g>
      )}
      <g transform="translate(240, 260)" className="hvc-pop" style={{ animationDelay: '0.4s' }}>
        <rect x="-78" y="-18" width="156" height="36" rx="18" fill="#f5b800" />
        <text textAnchor="middle" y="6" fill="#0a4d28" fontSize="15" fontFamily="Prompt" fontWeight="800">100% มีงานทำ</text>
      </g>
    </svg>);

}

// ── Hero Slideshow (image carousel + caption overlay) ───────
const SLIDES = [
{
  key: 'apply',
  img: 'assets/slide-1-apply.webp',
  eyebrow: 'รับสมัครนักศึกษาใหม่',
  title: 'ปีการศึกษา 2569 เปิดรับแล้ว',
  sub: 'ปวช. ปวส. ป.ตรี · 18 สาขา · ฟอร์มสมัครออนไลน์ 5 นาที',
  cta: { href: 'apply.html', label: 'สมัครเรียนออนไลน์' },
  tint: 'linear-gradient(135deg, rgba(1,35,28,0.22) 0%, rgba(2,100,81,0.12) 50%, rgba(4,130,105,0.05) 100%)',
  accent: 'var(--accent-amber)'
},
{
  key: 'eec',
  img: 'assets/slide-2-eec.webp',
  eyebrow: 'ครอบครัวเทคโน EEC',
  title: 'ทีมงานคุณภาพ · 30 ปี แห่งความเชี่ยวชาญ',
  sub: 'อาจารย์มืออาชีพ + พันธมิตรนิคม EEC 50+ องค์กร · ฝึกงานจริง มีงานทำ',
  cta: { href: 'about.html', label: 'รู้จักวิทยาลัย' },
  tint: 'linear-gradient(135deg, rgba(1,61,51,0.25) 0%, rgba(2,100,81,0.12) 60%, rgba(10,161,131,0.05) 100%)',
  accent: 'var(--accent-amber)'
},
{
  key: 'innovation',
  img: 'assets/slide-3-innovation.webp',
  eyebrow: 'นวัตกรรมและสิ่งประดิษฐ์',
  title: 'ฝีมือเยี่ยมระดับชาติ',
  sub: 'ผลงาน Smart Farm · AGV · ระบบไฟฟ้าอัจฉริยะ จากนักศึกษาและอาจารย์',
  cta: { href: 'portfolio.html', label: 'ดูผลงานทั้งหมด' },
  tint: 'linear-gradient(135deg, rgba(28,42,78,0.22) 0%, rgba(1,61,51,0.15) 50%, rgba(4,130,105,0.05) 100%)',
  accent: '#f5b800'
},
{
  key: 'community',
  img: 'assets/slide-4-community.webp',
  eyebrow: '12,000+ ศิษย์เก่า',
  title: 'ยินดีด้วยกับบัณฑิต EEC',
  sub: 'ปลูกฝังคุณธรรมและฝีมือควบคู่กัน · เปี่ยมคุณธรรม มุ่งสร้างคนดี',
  cta: { href: 'about.html', label: 'ปรัชญาวิทยาลัย' },
  tint: 'linear-gradient(135deg, rgba(2,100,81,0.15) 0%, rgba(1,35,28,0.1) 60%, rgba(4,130,105,0.05) 100%)',
  accent: '#fff'
}];


function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState({ active: false, startX: 0, dx: 0 });
  const stageRef = useRef(null);
  const DURATION = 6500;
  const SWIPE_THRESHOLD = 60;
  useEffect(() => {
    if (paused || drag.active) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), DURATION);
    return () => clearInterval(t);
  }, [paused, drag.active]);
  const go = (n) => setIdx((n + SLIDES.length) % SLIDES.length);

  // Unified pointer handlers — works for mouse + touch
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    // Don't start a drag when the pointer is on an interactive control —
    // capturing the pointer here would prevent the button's click event from firing.
    if (e.target.closest('button, a, [role="tab"]')) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDrag({ active: true, startX: x, dx: 0 });
    if (stageRef.current && e.pointerId !== undefined) {
      try {stageRef.current.setPointerCapture(e.pointerId);} catch {}
    }
  };
  const onPointerMove = (e) => {
    if (!drag.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDrag((d) => ({ ...d, dx: x - d.startX }));
  };
  const onPointerUp = (e) => {
    if (!drag.active) return;
    const dx = drag.dx;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? idx + 1 : idx - 1);
    }
    setDrag({ active: false, startX: 0, dx: 0 });
  };

  // Drag offset applied to whole stage for feedback (clamped)
  const dragOffset = drag.active ? Math.max(-120, Math.min(120, drag.dx)) : 0;

  return (
    <section
      ref={stageRef}
      className={`hero hero-slideshow ${drag.active ? 'is-dragging' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {setPaused(false);if (drag.active) onPointerUp();}}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y', userSelect: 'none' }}>
      
      <div className="hss-stage" style={{ transform: dragOffset ? `translateX(${dragOffset * 0.3}px)` : 'none' }}>
        {SLIDES.map((s, i) =>
        <div key={s.key} className={`hss-slide ${idx === i ? 'on' : ''} ${idx === i - 1 || idx === SLIDES.length - 1 && i === 0 ? 'next' : ''}`} aria-hidden={idx !== i}>
            <div className="hss-bg">
              <img src={s.img} alt="" className="hss-img" loading={i === 0 ? 'eager' : 'lazy'} draggable="false" />
              <div className="hss-tint" style={{ background: s.tint }} />
              <div className="hss-vignette" />
            </div>
          </div>
        )}
      </div>
      <div className="container hss-inner">
        <div className="hss-content">
          {SLIDES.map((s, i) =>
          <div key={s.key} className={`hss-copy ${idx === i ? 'on' : ''}`} aria-hidden={idx !== i}>
              <div className="hero-eyebrow hss-eyebrow"><span className="hero-eyebrow-dot" />{s.eyebrow}</div>
              <h1 className="hero-title hss-title">{s.title}</h1>
              <p className="hero-sub hss-sub">{s.sub}</p>
              <div className="hero-cta hss-cta">
                <a href={s.cta.href} className="btn btn-white btn-lg" onClick={(e) => {if (Math.abs(drag.dx) > 8) e.preventDefault();}}>{s.cta.label}<Icon name="arrow" className="btn-icon" /></a>
              </div>
            </div>
          )}
        </div>
        <div className="hss-controls">
          <button className="hss-nav" onClick={() => go(idx - 1)} aria-label="สไลด์ก่อนหน้า">
            <Icon name="chevronRight" style={{ width: 22, height: 22, transform: 'rotate(180deg)' }} />
          </button>
          <div className="hss-progress" role="tablist">
            {SLIDES.map((s, i) =>
            <button key={s.key} className={`hss-prog-bar ${i === idx ? 'on' : ''} ${i < idx ? 'done' : ''}`} onClick={() => go(i)} aria-label={`ไปสไลด์ ${i + 1}`} role="tab">
                <span className="hss-prog-fill" key={`${idx}-${i}`} />
              </button>
            )}
          </div>
          <button className="hss-nav" onClick={() => go(idx + 1)} aria-label="สไลด์ถัดไป">
            <Icon name="chevronRight" style={{ width: 22, height: 22 }} />
          </button>
        </div>
      </div>
      <div className="hss-counter">
        <strong>{String(idx + 1).padStart(2, '0')}</strong>
        <span>/</span>
        <em>{String(SLIDES.length).padStart(2, '0')}</em>
      </div>
    </section>);

}

// SVG art for each slide
function HSSArt({ kind, accent }) {
  if (kind === 'apply') return (
    <svg viewBox="0 0 1200 800" className="hss-art" preserveAspectRatio="xMidYMid slice">
      {/* Floating documents + signature */}
      <g opacity="0.18">
        {[...Array(8)].map((_, i) => {
          const x = 150 + i % 4 * 240;
          const y = 120 + Math.floor(i / 4) * 360;
          const r = (i % 3 - 1) * 8;
          return (
            <g key={i} transform={`translate(${x}, ${y}) rotate(${r})`}>
              <rect x="-60" y="-78" width="120" height="156" rx="6" fill="white" stroke="white" strokeWidth="2" />
              <line x1="-44" y1="-50" x2="44" y2="-50" stroke={accent} strokeWidth="3" />
              <line x1="-44" y1="-30" x2="20" y2="-30" stroke="white" strokeWidth="2" />
              <line x1="-44" y1="-10" x2="40" y2="-10" stroke="white" strokeWidth="2" />
              <line x1="-44" y1="10" x2="28" y2="10" stroke="white" strokeWidth="2" />
              <circle cx="-30" cy="50" r="14" fill={accent} opacity="0.8" />
              <path d="M -36 48 L -32 52 L -22 44" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>);

        })}
      </g>
      {/* Big checkmark medal */}
      <g transform="translate(950, 200)" className="hss-pop">
        <circle r="80" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <circle r="60" fill={accent} opacity="0.95" />
        <path d="M -22 0 L -8 14 L 22 -16" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>);

  if (kind === 'eec') return (
    <svg viewBox="0 0 1200 800" className="hss-art" preserveAspectRatio="xMidYMid slice">
      {/* Industrial silhouette */}
      <g opacity="0.2" fill="white">
        <rect x="700" y="500" width="120" height="280" />
        <rect x="830" y="430" width="80" height="350" />
        <rect x="920" y="540" width="100" height="240" />
        <rect x="1030" y="480" width="70" height="300" />
        {/* Smokestacks */}
        <rect x="740" y="370" width="20" height="160" />
        <rect x="870" y="320" width="20" height="120" />
        {/* Crane */}
        <line x1="600" y1="200" x2="600" y2="600" stroke="white" strokeWidth="4" />
        <line x1="540" y1="240" x2="700" y2="240" stroke="white" strokeWidth="4" />
        <line x1="600" y1="240" x2="660" y2="320" stroke="white" strokeWidth="2" />
        <rect x="650" y="320" width="20" height="40" />
      </g>
      {/* Ship + waves (bottom) */}
      <g opacity="0.3" fill="white">
        <path d="M 0 700 L 250 700 L 230 740 L 20 740 Z" />
        <rect x="80" y="660" width="100" height="40" />
        <rect x="100" y="630" width="20" height="40" />
      </g>
      <path d="M 0 760 Q 200 745 400 760 T 800 760 T 1200 760 L 1200 800 L 0 800 Z" fill="rgba(255,255,255,0.1)" />
      {/* Connection dots / partners */}
      {[
      { x: 250, y: 180, n: 'Watsons' },
      { x: 450, y: 260, n: 'Toyota' },
      { x: 380, y: 420, n: 'Honda' },
      { x: 200, y: 340, n: 'WHA' }].
      map((p, i) =>
      <g key={i} transform={`translate(${p.x}, ${p.y})`} className="hss-ping-group" style={{ animationDelay: `${i * 0.3}s` }}>
          <circle r="30" fill="white" opacity="0" className="hss-ping" />
          <circle r="14" fill={accent} />
          <circle r="14" fill="none" stroke="white" strokeWidth="2" />
        </g>
      )}
    </svg>);

  if (kind === 'innovation') return (
    <svg viewBox="0 0 1200 800" className="hss-art" preserveAspectRatio="xMidYMid slice">
      {/* Floating gears */}
      <g opacity="0.18" fill="white" stroke="white" strokeWidth="2">
        <g transform="translate(220, 200)" className="hss-rot">
          <circle r="80" fill="none" strokeWidth="6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="-8" y="-94" width="16" height="20" transform={`rotate(${a})`} />)}
          <circle r="20" fill="white" />
        </g>
        <g transform="translate(900, 580)" className="hss-rot-rev">
          <circle r="100" fill="none" strokeWidth="8" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a) => <rect key={a} x="-10" y="-114" width="20" height="24" transform={`rotate(${a})`} />)}
          <circle r="28" fill="white" />
        </g>
        <g transform="translate(1050, 200)" className="hss-rot">
          <circle r="50" fill="none" strokeWidth="4" />
          {[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x="-6" y="-60" width="12" height="14" transform={`rotate(${a})`} />)}
          <circle r="14" fill="white" />
        </g>
      </g>
      {/* Light bulb in center */}
      <g transform="translate(600, 400)" className="hss-pop">
        <g opacity="0.7">
          {[...Array(8)].map((_, i) => {
            const a = i * 45 * Math.PI / 180;
            return <line key={i} x1={Math.cos(a) * 110} y1={Math.sin(a) * 110} x2={Math.cos(a) * 150} y2={Math.sin(a) * 150} stroke={accent} strokeWidth="4" strokeLinecap="round" />;
          })}
        </g>
        <circle r="90" fill={accent} />
        <circle r="90" fill="none" stroke="white" strokeWidth="3" />
        <path d="M -28 -34 Q -28 -60 0 -60 Q 28 -60 28 -34 Q 28 -12 14 0 L 14 22 L -14 22 L -14 0 Q -28 -12 -28 -34 Z" fill="white" />
        <rect x="-12" y="28" width="24" height="6" rx="2" fill="white" />
        <rect x="-8" y="38" width="16" height="4" rx="2" fill="white" />
      </g>
    </svg>);

  if (kind === 'community') return (
    <svg viewBox="0 0 1200 800" className="hss-art" preserveAspectRatio="xMidYMid slice">
      {/* Diploma + mortarboard */}
      <g transform="translate(880, 220)" className="hss-pop">
        <g transform="rotate(-12)">
          <rect x="-100" y="-60" width="200" height="40" rx="4" fill="white" opacity="0.9" />
          <rect x="-100" y="-20" width="200" height="60" rx="4" fill={accent} opacity="0.8" />
          <circle cx="-70" cy="20" r="14" fill="white" />
          <path d="M -76 20 L -72 24 L -64 16" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="-40" y1="0" x2="80" y2="0" stroke="white" strokeWidth="2" />
          <line x1="-40" y1="14" x2="60" y2="14" stroke="white" strokeWidth="2" />
          <line x1="-40" y1="28" x2="70" y2="28" stroke="white" strokeWidth="2" />
        </g>
      </g>
      {/* Mortarboard */}
      <g transform="translate(900, 100)">
        <g transform="rotate(8)" opacity="0.9">
          <path d="M -90 -10 L 0 -40 L 90 -10 L 0 20 Z" fill="white" />
          <path d="M -60 14 L -60 50 Q 0 80 60 50 L 60 14" fill={accent} stroke="white" strokeWidth="2" />
          <line x1="80" y1="-10" x2="100" y2="60" stroke="white" strokeWidth="3" />
          <circle cx="100" cy="64" r="8" fill={accent} />
        </g>
      </g>
      {/* Group avatars (people silhouettes) */}
      <g opacity="0.85">
        {[
        { x: 200, y: 460, c: 'white' },
        { x: 320, y: 480, c: accent },
        { x: 440, y: 460, c: 'white' },
        { x: 560, y: 480, c: accent }].
        map((p, i) =>
        <g key={i} transform={`translate(${p.x}, ${p.y})`} className="hss-pop" style={{ animationDelay: `${i * 0.1}s` }}>
            <circle cy="-40" r="30" fill={p.c} />
            <path d={`M -45 30 Q -45 -10 0 -10 Q 45 -10 45 30 Z`} fill={p.c} />
          </g>
        )}
      </g>
      <text x="200" y="600" fill="white" fontSize="42" fontWeight="800" fontFamily="Prompt" opacity="0.85" letterSpacing="-0.02em">12,000+ ศิษย์เก่า</text>
    </svg>);

  return null;
}

function HeroMinimal() {
  return (
    <section className="hero hero-minimal">
      <div className="container">
        <div className="hero-eyebrow"><span className="hero-eyebrow-dot" />รับสมัครปีการศึกษา 2569</div>
        <h1 className="hero-title" style={{ maxWidth: 800 }}>
          เรียนช่างที่<span className="grad">ใช่</span> เริ่มต้นอาชีพที่<span className="grad">มั่นคง</span>
        </h1>
        <p className="hero-sub" style={{ maxWidth: 700 }}>
          วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — สถาบันอาชีวศึกษาเอกชน สังกัด สอศ. เปิดสอน ปวช. ปวส. ป.ตรี
        </p>
        <div className="hero-cta">
          <a href="apply.html" className="btn btn-primary btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
          <a href="courses.html" className="btn btn-ghost btn-lg">ดูหลักสูตร</a>
        </div>
      </div>
    </section>);

}

// ── STATS / Marquee ─────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) setStarted(true);});
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);else
      setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

function StatsBar() {
  const stats = [
  { v: 30, s: '+', l: 'ปีแห่งประสบการณ์' },
  { v: 16, s: '', l: 'สาขาวิชา' },
  { v: 12000, s: '+', l: 'ศิษย์เก่า' },
  { v: 100, s: '%', l: 'อัตรามีงานทำ' },
  { v: 50, s: '+', l: 'พันธมิตรองค์กร' }];

  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) =>
          <Reveal key={i} delay={i * 0.06} className="stat-item">
              <div className="stat-v"><AnimatedCounter target={s.v} suffix={s.s} duration={1500 + i * 100} /></div>
              <div className="stat-l">{s.l}</div>
            </Reveal>
          )}
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, k) =>
            ['Watsons', 'Toyota', 'Honda', 'PTT', 'SCG', 'WHA', 'Amata', 'EEC', 'Sahaviriya', 'Mitsubishi', 'IRPC', 'GPSC'].map((b, i) =>
            <span key={`${k}-${i}`} className="marquee-item">
                  <span className="marquee-dot" /> {b}
                </span>
            )
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ── COURSES ─────────────────────────────────────────────────
const COURSES = [
{ code: 'ปวช.', slug: 'yon', name: 'ช่างยนต์', icon: 'car', cat: 'อุตสาหกรรม', hot: true, img: 'assets/courses/yon.webp', color: '#B12B25' },
{ code: 'ปวช.', slug: 'faifaa', name: 'ช่างไฟฟ้ากำลัง', icon: 'bolt', cat: 'อุตสาหกรรม', hot: true, img: 'assets/courses/faifaa.webp', color: '#40ABE0' },
{ code: 'ปวช.', slug: 'gear', name: 'ช่างกลโรงงาน', icon: 'gear', cat: 'อุตสาหกรรม', img: 'assets/courses/gear.webp', color: '#FBD609' },
{ code: 'ปวช.', slug: 'electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: 'assets/courses/electronic.webp' },
{ code: 'ปวช.', slug: 'mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', hot: true, img: 'assets/courses/mecha.webp', color: '#FBDC6B' },
{ code: 'ปวช.', slug: 'graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: 'assets/courses/digital-graphic.webp', color: '#385BF3' },
{ code: 'ปวช.', slug: 'biz-digital', name: 'เทคโนโลยีธุรกิจดิจิทัล', icon: 'chart', cat: 'บริหาร', img: 'assets/courses/digital-business.webp', color: '#EB559F' },
{ code: 'ปวช.', slug: 'accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: 'assets/courses/accounting.webp', color: '#7B5CA7' },
{ code: 'ปวส.', slug: 'ps-mech', name: 'เทคนิคเครื่องกล', icon: 'car', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-mechanical.webp', color: '#B12B25' },
{ code: 'ปวส.', slug: 'ps-electrical', name: 'ไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-electrical.webp', color: '#40ABE0' },
{ code: 'ปวส.', slug: 'ps-production', name: 'เทคนิคการผลิต', icon: 'gear', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-production.webp', color: '#FBD609' },
{ code: 'ปวส.', slug: 'ps-mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-mecha.webp', color: '#FBDC6B' },
{ code: 'ปวส.', slug: 'ps-network', name: 'เครือข่ายคอมฯ & ความปลอดภัย', icon: 'network', cat: 'ดิจิทัล', img: 'assets/courses/ps-network.webp', color: '#EB559F' },
{ code: 'ปวส.', slug: 'ps-graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: 'assets/courses/ps-graphic.webp', color: '#385BF3' },
{ code: 'ปวส.', slug: 'ps-logistics', name: 'การจัดการโลจิสติกส์', icon: 'truck', cat: 'บริหาร', hot: true, img: 'assets/courses/ps-logistics.webp', color: '#F26530' },
{ code: 'ปวส.', slug: 'ps-accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: 'assets/courses/ps-accounting.webp', color: '#7B5CA7' },
{ code: 'ปวส.', slug: 'ps-electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-electronic.webp' },
{ code: 'ปวส.', slug: 'ps-industrial', name: 'เทคนิคอุตสาหกรรม', icon: 'shield', cat: 'อุตสาหกรรม', img: 'assets/courses/ps-industrial.webp' }];


function Courses({ cardStyle = 'lift' }) {
  // cardStyle: 'lift' | 'flip' | 'outline' | 'gradient'
  const [filter, setFilter] = useState('ทั้งหมด');
  const cats = ['ทั้งหมด', 'อุตสาหกรรม', 'ดิจิทัล', 'บริหาร'];
  const shown = filter === 'ทั้งหมด' ? COURSES : COURSES.filter((c) => c.cat === filter);
  return (
    <section className="section" id="courses">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">หลักสูตรของเรา</span>
          <h2 className="section-title">
            18 สาขาวิชา <span className="grad">ครอบคลุมทุกสายอาชีพ</span>
          </h2>
          <p className="section-sub">เรียนกับอาจารย์ที่มีประสบการณ์จริงในอุตสาหกรรม พร้อมห้องปฏิบัติการมาตรฐาน และเครื่องมือทันสมัย</p>
        </Reveal>
        <Reveal className="course-filters" delay={0.1}>
          {cats.map((c) =>
          <button key={c} className={`chip ${filter === c ? 'chip-active' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          )}
        </Reveal>
        <div className={`course-grid card-${cardStyle}`}>
          {shown.map((c, i) =>
          <Reveal key={`${c.code}-${c.name}`} delay={Math.min(i * 0.04, 0.4)} dir="scale">
              <CourseCard course={c} style={cardStyle} />
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function CourseCard({ course, style }) {
  const c = course;
  if (style === 'flip') {
    return (
      <a href={`course-detail.html?slug=${c.slug}`} className="course-card cc-flip">
        <div className="cc-flip-inner">
          <div className="cc-front">
            <div className="cc-icon"><Icon name={c.icon} style={{ width: 30, height: 30 }} /></div>
            <div className="cc-code">{c.code}</div>
            <h3 className="cc-name">{c.name}</h3>
            {c.hot && <span className="cc-hot">HOT</span>}
          </div>
          <div className="cc-back">
            <h3 className="cc-name" style={{ color: 'white' }}>{c.name}</h3>
            <p>เปิดสอน {c.code} 2567 · เรียน 3 ปี</p>
            <span className="cc-back-cta">ดูรายละเอียด <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
          </div>
        </div>
      </a>);

  }
  if (style === 'outline') {
    return (
      <a href={`course-detail.html?slug=${c.slug}`} className="course-card cc-outline">
        <div className="cc-icon"><Icon name={c.icon} style={{ width: 28, height: 28 }} /></div>
        <div className="cc-meta">
          <span className="cc-code-pill">{c.code}</span>
          {c.hot && <span className="cc-hot-pill">รับสมัครเร่งด่วน</span>}
        </div>
        <h3 className="cc-name">{c.name}</h3>
        <div className="cc-foot">
          <span>{c.cat}</span>
          <Icon name="arrow" style={{ width: 18, height: 18 }} />
        </div>
      </a>);

  }
  if (style === 'gradient') {
    return (
      <a href={`course-detail.html?slug=${c.slug}`} className="course-card cc-gradient">
        <div className="cc-grad-overlay" />
        <div className="cc-icon"><Icon name={c.icon} style={{ width: 32, height: 32, color: 'white' }} /></div>
        {c.hot && <span className="cc-hot">HOT</span>}
        <div className="cc-code" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.code} · {c.cat}</div>
        <h3 className="cc-name" style={{ color: 'white' }}>{c.name}</h3>
        <span className="cc-back-cta">ดูรายละเอียด <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
      </a>);

  }
  // default 'lift'
  return (
    <a href={`course-detail.html?slug=${c.slug}`} className="course-card cc-lift" style={c.color ? { '--dept': c.color } : null}>
      {c.img &&
      <div className="cc-photo">
          <img src={c.img} alt="" loading="lazy" />
          {c.hot && <span className="cc-hot">HOT</span>}
          {c.color && <div className="cc-color-bar" style={{ background: c.color }} />}
        </div>
      }
      {!c.img &&
      <>
          {c.hot && <span className="cc-hot">HOT</span>}
        </>
      }
      <div className="cc-body">
        <div className="cc-code">{c.code} · {c.cat}</div>
        <h3 className="cc-name">{c.name}</h3>
        <div className="cc-foot">
          <span style={{ height: "20px", fontSize: "16px" }}>ดูรายละเอียด</span>
          <Icon name="arrow" style={{ width: 18, height: 18 }} />
        </div>
      </div>
    </a>);

}

// pick black or white text for a given hex bg based on luminance
function pickInkOn(hex) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#0b1a13' : '#ffffff';
}

// ── ABOUT / Philosophy ──────────────────────────────────────
function About() {
  const philosophy = [
  { t: 'มุ่งสร้างคนดี', d: 'มุ่งหวังที่จะสร้างนักศึกษาให้เป็นคนดีทั้งต่อตนเองและสังคม', icon: 'users' },
  { t: 'มีระเบียบวินัย', d: 'ความมีระเบียบแบบแผนและวินัย เป็นแนวทางการปฏิบัติตน', icon: 'check' },
  { t: 'ก้าวไกลเทคโนโลยี', d: 'พัฒนาเทคโนโลยีให้เจริญก้าวหน้าทันยุคทันสมัย', icon: 'chip' },
  { t: 'ฝีมือเยี่ยม', d: 'มีฝีมือและทักษะทางวิชาชีพระดับสูง พร้อมปฏิบัติงานจริง', icon: 'award' },
  { t: 'เปี่ยมคุณธรรม', d: 'มีคุณธรรม จริยธรรม ค่านิยมที่ดี ยึดถือวัฒนธรรมและประเพณีอันดีงาม', icon: 'shield' }];

  return (
    <section className="section about-section">
      <div className="container about-grid">
        <Reveal dir="left" className="about-copy">
          <span className="eyebrow">ปรัชญาวิทยาลัย</span>
          <h2 className="section-title">
            เปี่ยมคุณธรรม <br /><span className="grad">มุ่งสร้างคนดี</span>
          </h2>
          <p className="section-sub">
            ตั้งแต่ปี พ.ศ. 2538 วิทยาลัยฯ ได้ผลิตช่างฝีมือคุณภาพให้แก่นิคมอุตสาหกรรมตะวันออก ปลูกฝังทั้งวิชาชีพและจริยธรรมควบคู่กัน
          </p>
          <div className="about-stats">
            <div><strong>30+</strong><span>ปี</span></div>
            <div><strong>1995</strong><span>ก่อตั้ง</span></div>
            <div><strong>5</strong><span>หลักธรรม</span></div>
          </div>
          <a href="about.html" className="btn btn-primary">เรียนรู้เพิ่มเติม<Icon name="arrow" className="btn-icon" /></a>
        </Reveal>
        <Reveal dir="right" className="philosophy-stack">
          {philosophy.map((p, i) =>
          <div key={i} className="philo-row" style={{ '--i': i }}>
              <div className="philo-icon"><Icon name={p.icon} style={{ width: 22, height: 22 }} /></div>
              <div>
                <h3 className="philo-t">{p.t}</h3>
                <p className="philo-d">{p.d}</p>
              </div>
              <div className="philo-num">0{i + 1}</div>
            </div>
          )}
        </Reveal>
      </div>
    </section>);

}

// ── EEC PARTNERS MAP (with pings) ───────────────────────────
function PartnersMap() {
  const partners = [
  { name: 'Watsons', x: 70, y: 28, delay: 0.0 },
  { name: 'Toyota', x: 22, y: 38, delay: 0.5 },
  { name: 'Honda', x: 78, y: 62, delay: 1.0 },
  { name: 'PTT', x: 14, y: 56, delay: 1.5 },
  { name: 'SCG', x: 60, y: 80, delay: 2.0 },
  { name: 'WHA', x: 30, y: 18, delay: 2.5 },
  { name: 'Amata', x: 88, y: 44, delay: 3.0 },
  { name: 'Mitsubishi', x: 12, y: 76, delay: 3.5 }];

  return (
    <section className="section partners-section">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
          <span className="eyebrow">พันธมิตรอุตสาหกรรม</span>
          <h2 className="section-title">
            <span className="grad">50+ องค์กร</span> ในเขตพัฒนาพิเศษ EEC
          </h2>
          <p className="section-sub" style={{ margin: '14px auto 0' }}>นักศึกษาทวิภาคีได้ฝึกงานจริง มีรายได้ระหว่างเรียน และโอกาสบรรจุงานในนิคมอุตสาหกรรมระดับนานาชาติ</p>
        </Reveal>
        <Reveal dir="scale" className="partners-map">
          <svg viewBox="0 0 600 400" className="partners-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="seaGrad" cx="0.5" cy="0.5"><stop offset="0" stopColor="#1c2a4e" stopOpacity="0.18" /><stop offset="1" stopColor="#1c2a4e" stopOpacity="0.05" /></radialGradient>
              <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--green-100)" /><stop offset="1" stopColor="var(--green-200)" /></linearGradient>
            </defs>
            {/* Sea */}
            <rect x="0" y="0" width="600" height="400" fill="url(#seaGrad)" />
            {/* Land mass (Chonburi region simplified) */}
            <path d="M 0 0 L 480 0 C 490 80 470 140 510 200 C 540 260 510 320 470 380 C 470 400 0 400 0 400 Z" fill="url(#landGrad)" stroke="var(--green-300)" strokeWidth="1" />
            {/* Coastline highlight */}
            <path d="M 480 0 C 490 80 470 140 510 200 C 540 260 510 320 470 380" fill="none" stroke="var(--green-700)" strokeWidth="2" opacity="0.4" />
            {/* Roads */}
            <g stroke="var(--ink-400)" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.5">
              <path d="M 50 100 L 300 200 L 480 280" />
              <path d="M 80 280 L 280 200 L 470 80" />
              <path d="M 200 50 L 280 200 L 220 380" />
            </g>
            {/* Labels */}
            <text x="380" y="60" fill="var(--ink-500)" fontSize="11" fontFamily="Prompt" letterSpacing="2">CHONBURI</text>
            <text x="370" y="220" fill="var(--ink-500)" fontSize="11" fontFamily="Prompt" letterSpacing="2">SRIRACHA</text>
            <text x="350" y="360" fill="var(--ink-500)" fontSize="11" fontFamily="Prompt" letterSpacing="2">LAEMCHABANG</text>
            <text x="540" y="200" fill="var(--ink-400)" fontSize="10" fontFamily="Prompt" letterSpacing="1" textAnchor="middle">GULF OF{'\n'}THAILAND</text>
            {/* College pin (center) */}
            <g transform="translate(280, 200)" className="map-college">
              <circle r="36" fill="var(--green-100)" className="college-ring-1" />
              <circle r="24" fill="var(--green-200)" className="college-ring-2" />
              <circle r="16" fill="var(--green-700)" />
              <circle r="6" fill="white" />
              <text y="-50" textAnchor="middle" fill="var(--green-800)" fontSize="13" fontFamily="Prompt" fontWeight="700">วิทยาลัย EEC Engineer</text>
              <text y="-36" textAnchor="middle" fill="var(--ink-600)" fontSize="10" fontFamily="Prompt">A.Sriracha, Chonburi</text>
            </g>
            {/* Partner pings */}
            {partners.map((p, i) =>
            <g key={p.name} transform={`translate(${p.x * 6}, ${p.y * 4})`} className="map-ping" style={{ animationDelay: `${p.delay}s` }}>
                <circle r="14" fill="var(--green-500)" opacity="0" className="ping-pulse" />
                <circle r="7" fill="var(--green-700)" />
                <circle r="7" fill="none" stroke="white" strokeWidth="1.5" />
                <g className="ping-label">
                  <rect x="-30" y="-26" width="60" height="18" rx="9" fill="var(--ink-900)" />
                  <text x="0" y="-14" textAnchor="middle" fill="white" fontSize="10" fontFamily="Prompt" fontWeight="600">{p.name}</text>
                </g>
              </g>
            )}
          </svg>
          {/* Partner logos strip below */}
          <div className="partners-strip">
            {[
            { v: 30, suf: '+', label: 'ปี ทวิภาคี' },
            { v: 8500, suf: '+', label: 'ตำแหน่งงาน/ปี' },
            { v: 100, suf: '%', label: 'มีงานทำ' },
            { v: 18000, suf: '', pre: '฿', label: 'รายได้เฉลี่ยเริ่มต้น' }].
            map((p, i) =>
            <div key={i} className="partners-stat">
                <div className="ps-v">
                  {p.pre}<AnimatedCounter target={p.v} suffix={p.suf} duration={1500 + i * 100} />
                </div>
                <div className="ps-l">{p.label}</div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>);

}
function PortfolioPreview() {
  const works = [
  { t: 'Mini Smart Farms', dept: 'ปวส. ไฟฟ้า', tone: 'green' },
  { t: 'ระบบติดตามไฟฟ้า IoT', dept: 'ปวส. อิเล็กทรอนิกส์', tone: 'navy' },
  { t: 'งานนวัตกรรมระดับชาติ', dept: 'อาชีวศึกษาเอกชน', tone: 'amber' },
  { t: 'หุ่นยนต์ขนส่ง AGV', dept: 'ปวส. เมคคาทรอนิกส์', tone: 'red' },
  { t: 'แอปตรวจสอบโลจิสติกส์', dept: 'ปวส. โลจิสติกส์', tone: 'green' },
  { t: 'รถยนต์ไฟฟ้าจำลอง EV', dept: 'ปวช. ช่างยนต์', tone: 'navy' }];

  return (
    <section className="section portfolio-section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">ผลงานวิทยาลัย</span>
          <h2 className="section-title">
            นวัตกรรม สิ่งประดิษฐ์ <span className="grad">ฝีมือเยี่ยมระดับชาติ</span>
          </h2>
          <p className="section-sub">รวมผลงานล่าสุดของนักศึกษาและอาจารย์ จากการแข่งขันทักษะวิชาชีพและการประกวดนวัตกรรม</p>
        </Reveal>
        <div className="portfolio-grid">
          {works.map((w, i) =>
          <Reveal key={i} delay={i * 0.06} className={`port-card port-tone-${w.tone}`} dir={i % 2 ? 'right' : 'left'}>
              <a href="portfolio.html" className="port-link">
                <div className="port-img">
                  <Icon name={['robot', 'chip', 'award', 'gear', 'truck', 'car'][i]} style={{ width: 64, height: 64, color: 'rgba(255,255,255,0.85)' }} />
                </div>
                <div className="port-meta">
                  <span className="port-dept">{w.dept}</span>
                  <h3 className="port-t">{w.t}</h3>
                  <span className="port-arrow"><Icon name="arrow" style={{ width: 16, height: 16 }} /></span>
                </div>
              </a>
            </Reveal>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="portfolio.html" className="btn btn-ghost btn-lg">ดูผลงานทั้งหมด <Icon name="arrow" className="btn-icon" /></a>
        </div>
      </div>
    </section>);

}

// ── TESTIMONIALS ────────────────────────────────────────────
const TESTIMONIALS = [
{ name: 'นางสาว บงกช สินฉาย', dept: 'สาขา การจัดการโลจิสติกส์', text: 'เรียนที่นี่เหมือนเรียนกับครอบครัวค่ะ ทุกคนเพื่อนและอาจารย์ทุกท่านให้ความเป็นกันเอง สงสัยอะไรเมื่อไหร่ให้คำตอบได้เสมอ', avatar: 'บ', color: '#0f7a3e' },
{ name: 'นาย ฉัตรชัย สุขภักดี', dept: 'สาขา โลจิสติกส์ ปวส.2', text: 'ได้ความรู้ที่แน่นและเป็นประโยชน์ต่อการใช้ในอาชีพได้จริง และมีความสุขทุกครั้งที่เรียนครับ', avatar: 'ฉ', color: '#1c2a4e' },
{ name: 'นางสาว ปุณณภา พรมชาติ', dept: 'สาขา โลจิสติกส์', text: 'เป็นสถาบันที่ให้ความรู้และความเข้าใจดีมาก สามารถนำไปใช้ในที่ทำงานจริงและชีวิตจริงได้ดี การเรียนการสอนของอาจารย์ทุกท่านเข้าใจง่ายและเป็นกันเอง', avatar: 'ป', color: '#8a1f2b' },
{ name: 'นาย แหวนเพชร จุพิมาย', dept: 'แผนก โลจิสติกส์ ปวส.2', text: 'ผมมีความสุขที่ได้เรียนรู้ ได้พบเพื่อนใหม่ ได้รับความห่วงใย จากอาจารย์ทุกท่าน', avatar: 'ห', color: '#22a85a' }];


function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="section testimonials-section">
      <div className="testi-bg" aria-hidden="true" />
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--green-200)' }}>เสียงจากนักศึกษา</span>
          <h2 className="section-title" style={{ color: 'white' }}>
            ครอบครัวที่ <span className="grad-light">ส่งเสริมให้คุณเติบโต</span>
          </h2>
        </Reveal>
        <div className="testi-carousel">
          <div className="testi-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {TESTIMONIALS.map((t, i) =>
            <div key={i} className="testi-slide">
                <div className="testi-card">
                  <Icon name="quote" style={{ width: 48, height: 48, color: 'var(--green-300)' }} />
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">
                    <div className="testi-avatar" style={{ background: t.color }}>{t.avatar}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-dept">{t.dept}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="testi-dots">
            {TESTIMONIALS.map((_, i) =>
            <button key={i} className={`testi-dot ${idx === i ? 'on' : ''}`} onClick={() => setIdx(i)} aria-label={`testimonial ${i + 1}`} />
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ── FAQ ─────────────────────────────────────────────────────
const FAQS = [
{ q: 'มีรอบเรียนอะไรบ้าง?', a: 'ทางวิทยาลัยมี 2 รอบ คือ รอบเช้าและรอบบ่าย บางครั้งจะมีวิทยาพิเศษกรณีไปดูงานในสถานประกอบการในวันเสาร์ จะมีการแจ้งล่วงหน้า (ปล. รอบบ่ายต้องมีงานทำทุกคน ไม่มีฝึกงาน จบ ปวส. 2 ปี และ ปวช. 3 ปี เท่ากับรอบเช้า)' },
{ q: 'เรียนสาขาไหนดี?', a: 'ทางวิทยาลัยแนะนำสายช่างทั้งชายและหญิง เนื่องจากโรงงานในนิคม EEC มีความต้องการบุคลากรสายช่างเป็นจำนวนมาก แต่หากสนใจสายบริหารหรือดิจิทัลก็เปิดสอนครบถ้วน' },
{ q: 'ผ่อนชำระค่าเทอมได้ไหม?', a: 'ผ่อนชำระได้ แต่อาจารย์แนะนำว่าในเทอมแรกควรจ่ายให้ครบก่อน แล้วเทอมที่สองค่อยผ่อนชำระ เพราะถ้าผ่อนเทอมแรกจะไม่ได้รับส่วนลด แต่ถ้าจำเป็นต้องผ่อนตั้งแต่แรกก็สามารถทำได้' },
{ q: 'มีโครงการทวิภาคีร่วมกับองค์กรไหนบ้าง?', a: 'มีโครงการความร่วมมือ (MOU) กับองค์กรชั้นนำมากมาย เช่น Watsons ประเทศไทย, โรงงานในนิคม EEC, แหลมฉบัง ฯลฯ นักศึกษาทวิภาคีจะได้ฝึกงานจริง มีรายได้ระหว่างเรียน และมีโอกาสบรรจุงานหลังเรียนจบ' },
{ q: 'มีหอพักหรือรถรับ-ส่งไหม?', a: 'ทางวิทยาลัยมีบริการรถรับ-ส่งในเส้นทางหลักของอำเภอศรีราชา-แหลมฉบัง และมีหอพักใกล้เคียงให้คำแนะนำ สามารถสอบถามฝ่ายธุรการได้ที่ 038-494-066' },
{ q: 'ใช้กองทุน กยศ. ได้ไหม?', a: 'ได้ค่ะ วิทยาลัยฯ เป็นสถานศึกษาที่เข้าร่วมโครงการกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) สามารถยื่นกู้ได้ทุกหลักสูตรตามเงื่อนไขของกองทุน' }];


function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <Reveal dir="left" className="faq-side">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">คำถามที่ <span className="grad">พบบ่อย</span></h2>
          <p className="section-sub">รวบรวมคำถามที่ผู้ปกครองและนักศึกษาสอบถามเข้ามาบ่อยที่สุด หากยังไม่พบคำตอบ ติดต่อเราได้ทันที</p>
          <a href="contact.html" className="btn btn-primary" style={{ marginTop: 24 }}>
            <Icon name="phone" style={{ width: 16, height: 16 }} /> สอบถามเพิ่มเติม
          </a>
        </Reveal>
        <Reveal dir="right" className="faq-list">
          {FAQS.map((f, i) =>
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span className="faq-num">0{i + 1}</span>
                <span className="faq-q-text">{f.q}</span>
                <Icon name={open === i ? 'minus' : 'plus'} style={{ width: 20, height: 20, color: 'var(--green-700)' }} />
              </div>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          )}
        </Reveal>
      </div>
    </section>);

}

// ── CTA banner ──────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="section cta-section">
      <div className="container">
        <Reveal className="cta-banner" dir="scale">
          <div className="cta-bg-mesh" />
          <div className="cta-content">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>เปิดรับสมัคร</span>
            <h2 className="cta-title">พร้อมเริ่มต้นเส้นทาง<br /><span className="grad-light">อาชีพที่ใช่</span>หรือยัง?</h2>
            <p className="cta-sub">สมัครออนไลน์ใช้เวลาเพียง 5 นาที — ทีมงานติดต่อกลับภายใน 24 ชม.</p>
            <div className="cta-actions">
              <a href="apply.html" className="btn btn-white btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
              <a href="tel:038494066" className="btn btn-ghost btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Icon name="phone" style={{ width: 16, height: 16 }} /> 038-494-066
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

// ── HIGHLIGHTS / News strip ─────────────────────────────────
function Highlights() {
  const news = [
  { tag: 'กิจกรรม', t: 'กิจกรรมสานสัมพันธ์ 69 (รอบเช้า)', d: 'วันที่ 20 พฤษภาคม 2569 ต้อนรับนักศึกษาใหม่', img: 'assets/news-1-sansamphan-morning.webp', objectPosition: 'center 28%' },
  { tag: 'กิจกรรม', t: 'กิจกรรมสานสัมพันธ์ 69 (รอบบ่าย)', d: 'มิตรภาพดีด้วยรอยยิ้มและเสียงหัวเราะ', img: 'assets/news-2-sansamphan-afternoon.webp', objectPosition: 'center 50%' },
  { tag: 'นศท.', t: 'ทดสอบสมรรถภาพทางกาย นศท.', d: 'นักศึกษาวิชาทหาร ปีที่ 1 ประจำปีการศึกษา 2569', img: 'assets/news-3-military.webp', objectPosition: 'center 18%' }];

  return (
    <section className="section section-sm highlights-section" id="highlights">
      <div className="container">
        <Reveal className="highlights-head">
          <span className="eyebrow">ข่าวสารล่าสุด</span>
          <a href="#" className="highlights-all">ดูทั้งหมด <Icon name="arrow" style={{ width: 16, height: 16 }} /></a>
        </Reveal>
        <div className="highlights-grid">
          {news.map((n, i) =>
          <Reveal key={i} delay={i * 0.08}>
              <a href="#" className="hl-card">
                <div className="hl-img hl-img-photo">
                  <img src={n.img} alt="" loading="lazy" style={{ objectPosition: n.objectPosition }} />
                </div>
                <div className="hl-body">
                  <span className="hl-tag" style={{ fontSize: "16px" }}>{n.tag}</span>
                  <h3 className="hl-t">{n.t}</h3>
                  <p className="hl-d">{n.d}</p>
                  <span className="hl-arrow">อ่านต่อ <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
                </div>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, { Hero, StatsBar, Courses, About, PortfolioPreview, Testimonials, FAQ, CTABanner, Highlights, PartnersMap, AnimatedCounter, COURSES, TESTIMONIALS, FAQS });