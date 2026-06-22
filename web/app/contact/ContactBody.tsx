'use client';

// ─────────────────────────────────────────────────────────────
// Contact page body — ติดต่อเรา.
// Ported from prototype contact.html inline <script type="text/babel">.
// Features: office-hours live status (client-only), tap-to-copy,
// save-to-Contacts vCard, embedded map + directions quick-bar.
// ─────────────────────────────────────────────────────────────

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { Icon, Reveal } from '../components/chrome';

// ── Geo for the college (for map deep-links) ─────────────
const GEO = { lat: 13.086485, lng: 100.936589 };
const GEO_STR = `${GEO.lat},${GEO.lng}`;

// ── Office-hours live status ─────────────────────────────
// Mon-Fri 08:00-17:00, Sun 09:00-16:00, Sat closed
type OfficeStatus = { open: boolean; label: string; next: string };

function getOfficeStatus(now = new Date()): OfficeStatus {
  const day = now.getDay(); // 0=Sun..6=Sat
  const mins = now.getHours() * 60 + now.getMinutes();
  const sched: Record<number, [number, number] | null> = {
    0: [9 * 60, 16 * 60],
    1: [8 * 60, 17 * 60],
    2: [8 * 60, 17 * 60],
    3: [8 * 60, 17 * 60],
    4: [8 * 60, 17 * 60],
    5: [8 * 60, 17 * 60],
    6: null,
  };
  const today = sched[day];
  const fmtDur = (m: number) => {
    const h = Math.floor(m / 60),
      mm = m % 60;
    if (h === 0) return `${mm} นาที`;
    if (mm === 0) return `${h} ชั่วโมง`;
    return `${h} ชม. ${mm} น.`;
  };
  // Find next opening
  const nextOpenLabel = () => {
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      const s = sched[d];
      if (s) {
        const dayName = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'][d];
        const h = Math.floor(s[0] / 60),
          mm = s[0] % 60;
        const prefix = i === 1 ? 'พรุ่งนี้' : dayName;
        return `เปิด ${prefix} ${h}:${String(mm).padStart(2, '0')}`;
      }
    }
    return '';
  };
  if (!today) return { open: false, label: 'วันนี้ปิดทำการ', next: nextOpenLabel() };
  const [open, close] = today;
  if (mins < open) return { open: false, label: 'ยังไม่เปิดทำการ', next: `เปิดอีก ${fmtDur(open - mins)}` };
  if (mins >= close) return { open: false, label: 'ปิดทำการแล้ว', next: nextOpenLabel() };
  return { open: true, label: 'เปิดอยู่ตอนนี้', next: `ปิดอีก ${fmtDur(close - mins)}` };
}

function LiveStatus() {
  // Compute on the client only to avoid hydration mismatch.
  const [status, setStatus] = useState<OfficeStatus | null>(null);
  useEffect(() => {
    setStatus(getOfficeStatus());
    const id = setInterval(() => setStatus(getOfficeStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (!status) return null;
  return (
    <div className={`live-status ${status.open ? 'open' : 'closed'}`} role="status" aria-live="polite">
      <span className="dot" aria-hidden="true" />
      <span>{status.label}</span>
      {status.next && <span className="next">{status.next}</span>}
    </div>
  );
}

// ── Toast context (light) ────────────────────────────────
type ToastFn = (text: string) => void;
const ToastCtx = createContext<ToastFn>(() => {});

function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback<ToastFn>((text) => {
    setMsg(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 1800);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={`copy-toast ${msg ? 'show' : ''}`} aria-live="polite">
        {msg && (
          <>
            <Icon name="check" />
            {msg}
          </>
        )}
      </div>
    </ToastCtx.Provider>
  );
}

// ── Tap-to-copy button ───────────────────────────────────
function Copyable({
  value,
  label,
  copyText,
  children,
  href,
}: {
  value: string;
  label: string;
  copyText?: string;
  children?: ReactNode;
  href?: string;
}) {
  const toast = useContext(ToastCtx);
  const [copied, setCopied] = useState(false);
  const onCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(copyText ?? value);
      setCopied(true);
      toast(`คัดลอก${label}แล้ว`);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast('คัดลอกไม่สำเร็จ');
    }
  };
  const onDoubleClick = () => {
    if (href) window.location.href = href;
  };
  return (
    <button
      type="button"
      className={`copyable ${copied ? 'copied' : ''}`}
      onClick={onCopy}
      onDoubleClick={onDoubleClick}
      aria-label={`คัดลอก${label}: ${value}`}
      title={href ? `กดเพื่อคัดลอก · ดับเบิลคลิกเพื่อเปิด` : 'กดเพื่อคัดลอก'}
    >
      {children ?? value}
      {copied ? (
        <Icon name="check" className="copy-ic" />
      ) : (
        <svg viewBox="0 0 24 24" className="copy-ic" aria-hidden="true">
          <path
            d="M8 4h10a2 2 0 012 2v10M16 8H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-10a2 2 0 00-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}

// ── Map + directions quick-bar ───────────────────────────
type Direction = {
  label: string;
  sub: string;
  href?: string;
  icon: ReactNode;
  onClick?: (toast: ToastFn) => void | Promise<void>;
};

function ContactMap() {
  const toast = useContext(ToastCtx);
  const dirs: Direction[] = [
    {
      label: 'Google Maps',
      sub: 'นำทาง',
      href: `https://www.google.com/maps/dir/?api=1&destination=${GEO_STR}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11l18-8-8 18-2-8-8-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </svg>
      ),
    },
    {
      label: 'Apple Maps',
      sub: 'iPhone',
      href: `https://maps.apple.com/?daddr=${GEO_STR}&dirflg=d`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
    {
      label: 'แชร์ตำแหน่ง',
      sub: 'ส่งให้เพื่อน',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      onClick: async (toastFn) => {
        const url = `https://www.google.com/maps?q=${GEO_STR}`;
        const data = {
          title: 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง',
          text: '75/2 หมู่ 10 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230',
          url,
        };
        try {
          if (navigator.share) await navigator.share(data);
          else {
            await navigator.clipboard.writeText(url);
            toastFn('คัดลอกลิงก์แผนที่แล้ว');
          }
        } catch {
          /* user cancelled share */
        }
      },
    },
  ];
  return (
    <div className="contact-map">
      <iframe
        title="แผนที่วิทยาลัย"
        src={`https://www.google.com/maps?q=${GEO_STR}&hl=th&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="directions-bar">
        {dirs.map((d, i) => {
          const inner = (
            <>
              {d.icon}
              <span>{d.label}</span>
              <small>{d.sub}</small>
            </>
          );
          return d.onClick ? (
            <button key={i} className="dir-btn" type="button" onClick={() => d.onClick!(toast)}>
              {inner}
            </button>
          ) : (
            <a key={i} className="dir-btn" href={d.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Department contacts data ─────────────────────────────
const DEPARTMENTS: { t: string; s: string; tel: string; icon: string }[] = [
  { t: 'งานธุรการ', s: 'รับสมัครเรียน เอกสาร', tel: '038-494-066', icon: 'briefcase' },
  { t: 'งานวิชาการ', s: 'หลักสูตร ตารางเรียน', tel: '038-494-066 ต่อ 2', icon: 'book' },
  { t: 'งานการเงิน', s: 'ค่าเทอม กยศ.', tel: '038-494-066 ต่อ 3', icon: 'chart' },
  { t: 'งานกิจการนักเรียน', s: 'กิจกรรม วินัย ทุน', tel: '038-494-066 ต่อ 4', icon: 'users' },
];

// ── Contact page body ────────────────────────────────────
function ContactMain() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div className="crumbs">
            <a href="/">หน้าแรก</a>
            <Icon name="chevronRight" style={{ width: 12, height: 12 }} />
            <span>ติดต่อเรา</span>
          </div>
          <span className="eyebrow">เรายินดีต้อนรับ</span>
          <h1>
            ติดต่อ<span className="grad">วิทยาลัย</span> หรือเยี่ยมชมได้ทุกวัน
          </h1>
          <p>ฝ่ายงานธุรการพร้อมตอบทุกคำถาม ทั้งทางโทรศัพท์ อีเมล หรือเข้าพบที่วิทยาลัยโดยตรง</p>
          <div style={{ marginTop: 20 }}>
            <LiveStatus />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <Reveal dir="left" className="contact-info">
              <div className="contact-row">
                <div className="icon">
                  <Icon name="pin" style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>ที่อยู่</h3>
                  <Copyable value="75/2 หมู่ 10 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230" label="ที่อยู่">
                    75/2 หมู่ 10 ต.ทุ่งสุขลา
                    <br />
                    อ.ศรีราชา จ.ชลบุรี 20230
                  </Copyable>
                </div>
              </div>
              <div className="contact-row">
                <div className="icon">
                  <Icon name="phone" style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>โทรศัพท์</h3>
                  <Copyable value="038-494-066" copyText="0384940 66" label="เบอร์โทร" href="tel:038494066" />
                  <br />
                  <Copyable value="038-494-064" copyText="0384940 64" label="เบอร์โทร" href="tel:038494064" />
                  <br />
                  <Copyable value="095-070-6600" copyText="0950706600" label="เบอร์โทร" href="tel:0950706600" />
                </div>
              </div>
              <div className="contact-row">
                <div className="icon">
                  <Icon name="mail" style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>อีเมล</h3>
                  <Copyable
                    value="technologylaemchabang@gmail.com"
                    label="อีเมล"
                    href="mailto:technologylaemchabang@gmail.com"
                  />
                </div>
              </div>
              <div className="contact-row">
                <div className="icon" style={{ background: '#1c2a4e15', color: '#1c2a4e' }}>
                  <Icon name="users" style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>เวลาทำการ</h3>
                  <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink-700)' }}>
                    จันทร์ - ศุกร์: <strong>8:00 - 17:00 น.</strong>
                    <br />
                    อาทิตย์: <strong>9:00 - 16:00 น.</strong>
                    <br />
                    เสาร์: ปิดทำการ
                  </p>
                </div>
              </div>
              <div className="contact-row">
                <div className="icon" style={{ background: '#1877f215', color: '#1877f2' }}>
                  <Icon name="facebook" style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>โซเชียลมีเดีย</h3>
                  <a href="https://www.facebook.com/eec.engineer.laemchabang" target="_blank" rel="noopener">
                    facebook.com/eec.engineer.laemchabang
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal dir="right">
              <ContactMap />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="section section-sm"
        style={{ background: 'var(--bg-alt)', paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="container">
          <Reveal className="section-head" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
            <span className="eyebrow">ฝ่ายงานต่างๆ</span>
            <h2 className="section-title">ติดต่อตรงตามฝ่าย</h2>
          </Reveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {DEPARTMENTS.map((d, i) => (
              <Reveal key={i} delay={i * 0.06} className="contact-row" style={{ background: 'white' }}>
                <div className="icon">
                  <Icon name={d.icon} style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3>{d.t}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-500)', fontWeight: 500, marginBottom: 4 }}>{d.s}</p>
                  <Copyable
                    value={d.tel}
                    copyText={d.tel.replace(/[^0-9]/g, '')}
                    label="เบอร์โทร"
                    href={`tel:${d.tel.replace(/[^0-9]/g, '')}`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactBody() {
  return (
    <ToastProvider>
      <ContactMain />
    </ToastProvider>
  );
}
