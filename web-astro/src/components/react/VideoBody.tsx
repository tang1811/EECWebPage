// ─────────────────────────────────────────────────────────────
// Video — Cinematic 1-minute tour (SVG, time-driven playback)
// Ported from prototype:
//   animations.jsx          → Stage / Sprite / PlaybackBar / easing
//   video-illustrations.jsx → animated SVG trades, maps, crest, counters
//   video-scenes.jsx        → 7 scenes composed on a 60s timeline
// The prototype mounted React into a #stage-host inside a fixed shell with
// a top "video-bar". We reproduce that shell as <main>; Nav/Footer/StickyCTA
// are NOT rendered here (the global layout supplies them site-wide).
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

// ── Easing functions (hand-rolled, Popmotion-style) ─────────
type EaseFn = (t: number) => number;

const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic,
}: {
  from?: number;
  to?: number;
  start?: number;
  end?: number;
  ease?: EaseFn;
}): (t: number) => number {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────
type TimelineCtx = {
  time: number;
  duration: number;
  playing: boolean;
  setTime?: React.Dispatch<React.SetStateAction<number>>;
  setPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
};
const TimelineContext = createContext<TimelineCtx>({ time: 0, duration: 10, playing: false });
const useTime = () => useContext(TimelineContext).time;
const useTimeline = () => useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────
type SpriteValue = { localTime: number; progress: number; duration: number; visible?: boolean };
const SpriteContext = createContext<SpriteValue>({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => useContext(SpriteContext);

function Sprite({
  start = 0,
  end = Infinity,
  children,
  keepMounted = false,
}: {
  start?: number;
  end?: number;
  children?: ReactNode | ((v: SpriteValue) => ReactNode);
  keepMounted?: boolean;
}) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value: SpriteValue = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Illustrations (ported from video-illustrations.jsx)
// ─────────────────────────────────────────────────────────────
const PAL = {
  green: '#22a85a', greenDark: '#0a4d28', greenMid: '#0f7a3e', greenLight: '#86dba6',
  navy: '#1c2a4e', red: '#8a1f2b', amber: '#f5b800', white: '#ffffff',
  ink: '#0b1a13', mist: 'rgba(255,255,255,0.6)', dim: 'rgba(255,255,255,0.35)',
};

function AnimatedCrest({ x, y, size = 280, progress = 1 }: { x: number; y: number; size?: number; progress?: number }) {
  const eased = Easing.easeOutCubic(Math.min(progress, 1));
  const t = useTime();
  const ringT = (t * 0.05) % 1;
  const r = size / 2;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={eased}>
      <circle r={r * 1.4} fill="url(#crestGlow)" opacity={0.7} />
      <g transform={`rotate(${ringT * 360})`}>
        <circle r={r * 1.1} fill="none" stroke={PAL.greenLight} strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" />
      </g>
      <g transform={`rotate(${-ringT * 360})`}>
        <circle r={r * 1.24} fill="none" stroke={PAL.green} strokeWidth="1" strokeDasharray="1 6" opacity="0.4" />
      </g>
      <circle r={r} fill={PAL.navy} />
      <circle r={r} fill="none" stroke={PAL.greenLight} strokeWidth="3" />
      <circle r={r * 0.92} fill="none" stroke={PAL.greenLight} strokeWidth="1" />
      <defs>
        <path id={`crestTopArc-${size}`} d={`M ${-r * 0.85} 0 A ${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.85} 0`} fill="none" />
        <path id={`crestBotArc-${size}`} d={`M ${-r * 0.78} 0 A ${r * 0.78} ${r * 0.78} 0 0 0 ${r * 0.78} 0`} fill="none" />
      </defs>
      <text fill={PAL.white} fontSize={size * 0.07} fontFamily="Prompt" fontWeight="700" style={{ letterSpacing: '0.08em' }}>
        <textPath href={`#crestTopArc-${size}`} startOffset="50%" textAnchor="middle">
          EEC ENGINEER LAEMCHABANG
        </textPath>
      </text>
      <text fill={PAL.white} fontSize={size * 0.05} fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
        <textPath href={`#crestBotArc-${size}`} startOffset="50%" textAnchor="middle">
          A. SRIRACHA · CHONBURI
        </textPath>
      </text>
      <g transform={`translate(0, ${size * 0.02})`}>
        <path d={`M ${-r * 0.5} ${-r * 0.4} L ${r * 0.5} ${-r * 0.4} L ${r * 0.5} ${r * 0.25} L 0 ${r * 0.55} L ${-r * 0.5} ${r * 0.25} Z`} fill={PAL.white} />
        <path d={`M ${-r * 0.5} ${-r * 0.4} L 0 ${-r * 0.4} L 0 ${-r * 0.08} L ${-r * 0.5} ${-r * 0.08} Z`} fill={PAL.greenMid} />
        <path d={`M 0 ${-r * 0.4} L ${r * 0.5} ${-r * 0.4} L ${r * 0.5} ${-r * 0.08} L 0 ${-r * 0.08} Z`} fill={PAL.red} />
        <path d={`M ${-r * 0.5} ${-r * 0.08} L 0 ${-r * 0.08} L 0 ${r * 0.25} L ${-r * 0.5} ${r * 0.25} Z`} fill={PAL.red} />
        <path d={`M 0 ${-r * 0.08} L ${r * 0.5} ${-r * 0.08} L ${r * 0.5} ${r * 0.25} L 0 ${r * 0.55} L 0 ${-r * 0.08} Z`} fill={PAL.greenMid} />
        <line x1={-r * 0.5} y1={-r * 0.08} x2={r * 0.5} y2={-r * 0.08} stroke={PAL.white} strokeWidth="3" />
        <line x1="0" y1={-r * 0.4} x2="0" y2={r * 0.55} stroke={PAL.white} strokeWidth="3" />
        <text x={-r * 0.25} y={-r * 0.2} textAnchor="middle" fill={PAL.white} fontSize={size * 0.06} fontFamily="Prompt" fontWeight="800">E.E.L.C</text>
        <g transform={`translate(${r * 0.25}, ${-r * 0.24})`}>
          <circle r={size * 0.07} fill="none" stroke={PAL.white} strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <rect key={i} x="-1.5" y={-size * 0.09} width="3" height={size * 0.025} fill={PAL.white} transform={`rotate(${a})`} />
          ))}
          <text textAnchor="middle" y={size * 0.025} fill={PAL.white} fontSize={size * 0.06} fontFamily="Prompt" fontWeight="800">E</text>
        </g>
        <g transform={`translate(${-r * 0.25}, ${r * 0.1})`} fill="none" stroke={PAL.white} strokeWidth="2">
          <path d={`M ${-size * 0.08} ${-size * 0.04} L ${-size * 0.08} ${size * 0.05} L 0 ${size * 0.03} L ${size * 0.08} ${size * 0.05} L ${size * 0.08} ${-size * 0.04} L 0 ${-size * 0.02} Z`} />
          <line x1="0" y1={-size * 0.02} x2="0" y2={size * 0.03} />
        </g>
        <g transform={`translate(${r * 0.22}, ${r * 0.15})`} fill={PAL.white}>
          <path d={`M 0 ${-size * 0.08} Q ${-size * 0.04} ${-size * 0.02} ${-size * 0.025} ${size * 0.02} Q 0 ${size * 0.005} ${size * 0.025} ${size * 0.02} Q ${size * 0.04} ${-size * 0.02} 0 ${-size * 0.08} Z`} fill={PAL.amber} />
          <rect x="-3" y={size * 0.015} width="6" height={size * 0.06} fill={PAL.white} />
        </g>
      </g>
      <g transform={`translate(0, ${-r * 0.55})`}>
        <path d={`M ${-r * 0.2} 0 L 0 ${-r * 0.08} L ${r * 0.2} 0 L 0 ${r * 0.08} Z`} fill={PAL.white} />
        <rect x={-r * 0.08} y={r * 0.04} width={r * 0.16} height={r * 0.08} fill={PAL.white} />
        <line x1={r * 0.18} y1="0" x2={r * 0.22} y2={r * 0.12} stroke={PAL.white} strokeWidth="2" />
        <circle cx={r * 0.22} cy={r * 0.14} r="3" fill={PAL.amber} />
      </g>
    </g>
  );
}

type TradeProps = { x: number; y: number; size?: number; t: number };

function TradeYon({ x, y, size = 200, t }: TradeProps) {
  const cog = (t * 60) % 360;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.greenDark} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <g transform={`rotate(${cog})`}>
        <circle r={size * 0.22} fill="none" stroke={PAL.greenLight} strokeWidth="3" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <rect key={i} x={-3} y={-size * 0.28} width="6" height={size * 0.12} fill={PAL.greenLight} transform={`rotate(${a})`} />
        ))}
        <circle r={size * 0.06} fill={PAL.amber} />
      </g>
      <g transform={`rotate(${-15 + Math.sin(t * 3) * 8}) translate(${size * 0.28}, 0)`}>
        <rect x="-4" y="-4" width={size * 0.3} height="8" fill={PAL.amber} rx="2" />
        <circle cx="0" cy="0" r="10" fill="none" stroke={PAL.amber} strokeWidth="4" />
      </g>
    </g>
  );
}

function TradeFaifaa({ x, y, size = 200, t }: TradeProps) {
  const pulse = (Math.sin(t * 4) + 1) / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.navy} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <g stroke={PAL.greenLight} strokeWidth="1.5" fill="none" opacity="0.5">
        <line x1={-size * 0.3} y1={-size * 0.2} x2={size * 0.3} y2={-size * 0.2} />
        <line x1={-size * 0.3} y1={size * 0.2} x2={size * 0.3} y2={size * 0.2} />
        <circle cx={-size * 0.3} cy={-size * 0.2} r="3" fill={PAL.greenLight} />
        <circle cx={size * 0.3} cy={-size * 0.2} r="3" fill={PAL.greenLight} />
        <circle cx={-size * 0.3} cy={size * 0.2} r="3" fill={PAL.greenLight} />
        <circle cx={size * 0.3} cy={size * 0.2} r="3" fill={PAL.greenLight} />
      </g>
      <path
        d={`M ${-size * 0.08} ${-size * 0.25} L ${size * 0.05} ${-size * 0.05} L ${-size * 0.04} ${-size * 0.05} L ${size * 0.1} ${size * 0.25} L ${-size * 0.02} ${size * 0.05} L ${size * 0.05} ${size * 0.05} Z`}
        fill={PAL.amber}
        opacity={0.7 + pulse * 0.3}
        style={{ filter: `drop-shadow(0 0 ${pulse * 12}px ${PAL.amber})` }}
      />
    </g>
  );
}

function TradeMecha({ x, y, size = 200, t }: TradeProps) {
  const swing = Math.sin(t * 1.5) * 40;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.red} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <rect x={-size * 0.15} y={size * 0.15} width={size * 0.3} height={size * 0.1} fill={PAL.amber} rx="3" />
      <circle cx="0" cy={size * 0.15} r={size * 0.06} fill={PAL.amber} />
      <g transform={`rotate(${-30 + swing * 0.5})`}>
        <rect x="-5" y={-size * 0.25} width="10" height={size * 0.4} fill={PAL.greenLight} rx="4" />
        <circle cx="0" cy={-size * 0.25} r={size * 0.05} fill={PAL.greenLight} />
        <g transform={`translate(0, ${-size * 0.25}) rotate(${swing})`}>
          <rect x="-4" y={-size * 0.2} width="8" height={size * 0.2} fill={PAL.amber} rx="3" />
          <g transform={`translate(0, ${-size * 0.2})`}>
            <rect x="-8" y="-6" width="6" height="14" fill={PAL.greenLight} rx="1" />
            <rect x="2" y="-6" width="6" height="14" fill={PAL.greenLight} rx="1" />
            <circle cx="0" cy="-2" r="3" fill={PAL.amber} />
          </g>
        </g>
      </g>
    </g>
  );
}

function TradeLogistics({ x, y, size = 200, t }: TradeProps) {
  const truckX = ((t * 60) % (size * 0.5)) - size * 0.25;
  const wheelR = (t * 5) % (Math.PI * 2);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.amber} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <line x1={-size * 0.4} y1={size * 0.2} x2={size * 0.4} y2={size * 0.2} stroke={PAL.greenDark} strokeWidth="3" />
      <line x1={-size * 0.4} y1={size * 0.2} x2={size * 0.4} y2={size * 0.2} stroke={PAL.white} strokeWidth="1" strokeDasharray="8 8" opacity="0.6" />
      <g transform={`translate(${truckX}, 0)`}>
        <rect x={-size * 0.18} y={-size * 0.05} width={size * 0.22} height={size * 0.2} fill={PAL.greenDark} rx="2" />
        <rect x={-size * 0.18} y={-size * 0.05} width={size * 0.22} height={size * 0.2} fill="none" stroke={PAL.greenLight} strokeWidth="1.5" />
        <rect x={size * 0.04} y={size * 0.02} width={size * 0.13} height={size * 0.13} fill={PAL.navy} rx="2" />
        <rect x={size * 0.06} y={size * 0.04} width={size * 0.07} height={size * 0.05} fill={PAL.greenLight} />
        <g transform={`translate(${-size * 0.1}, ${size * 0.18})`}>
          <circle r={size * 0.04} fill={PAL.ink} />
          <g transform={`rotate(${(wheelR * 180) / Math.PI})`}>
            <line x1="0" y1={-size * 0.03} x2="0" y2={size * 0.03} stroke={PAL.greenLight} strokeWidth="2" />
          </g>
        </g>
        <g transform={`translate(${size * 0.11}, ${size * 0.18})`}>
          <circle r={size * 0.04} fill={PAL.ink} />
          <g transform={`rotate(${(wheelR * 180) / Math.PI})`}>
            <line x1="0" y1={-size * 0.03} x2="0" y2={size * 0.03} stroke={PAL.greenLight} strokeWidth="2" />
          </g>
        </g>
      </g>
    </g>
  );
}

function TradeDigital({ x, y, size = 200, t }: TradeProps) {
  const lines = [0.55, 0.35, 0.65, 0.45, 0.7];
  const blink = Math.sin(t * 3) > 0;
  const typeProgress = (t * 1.2) % 1;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.greenMid} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <path d={`M ${-size * 0.32} ${size * 0.18} L ${size * 0.32} ${size * 0.18} L ${size * 0.28} ${size * 0.25} L ${-size * 0.28} ${size * 0.25} Z`} fill={PAL.ink} />
      <rect x={-size * 0.28} y={-size * 0.18} width={size * 0.56} height={size * 0.36} fill={PAL.navy} rx="3" />
      <rect x={-size * 0.26} y={-size * 0.16} width={size * 0.52} height={size * 0.32} fill={PAL.ink} rx="2" />
      <g>
        {lines.map((w, i) => {
          const lineW = size * 0.48 * w * Math.min(1, (typeProgress * lines.length) / (i + 1));
          return (
            <rect
              key={i}
              x={-size * 0.24}
              y={-size * 0.13 + i * size * 0.05}
              width={lineW}
              height={size * 0.025}
              fill={i % 2 === 0 ? PAL.greenLight : PAL.amber}
              rx="1"
              opacity="0.85"
            />
          );
        })}
        <rect
          x={-size * 0.24 + size * 0.48 * lines[Math.min(lines.length - 1, Math.floor(typeProgress * lines.length))] * 0.95}
          y={-size * 0.13 + Math.min(lines.length - 1, Math.floor(typeProgress * lines.length)) * size * 0.05}
          width="3"
          height={size * 0.025}
          fill={PAL.white}
          opacity={blink ? 1 : 0.2}
        />
      </g>
    </g>
  );
}

function TradeAccounting({ x, y, size = 200, t }: TradeProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.navy} opacity="0.85" />
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2" />
      <line x1={-size * 0.3} y1={size * 0.2} x2={size * 0.3} y2={size * 0.2} stroke={PAL.dim} strokeWidth="2" />
      <line x1={-size * 0.3} y1={size * 0.2} x2={-size * 0.3} y2={-size * 0.25} stroke={PAL.dim} strokeWidth="2" />
      {[
        { x: -0.22, h: 0.18, c: PAL.greenLight, delay: 0 },
        { x: -0.1, h: 0.28, c: PAL.green, delay: 0.2 },
        { x: 0.02, h: 0.22, c: PAL.amber, delay: 0.4 },
        { x: 0.14, h: 0.36, c: PAL.greenLight, delay: 0.6 },
      ].map((b, i) => {
        const local = Math.max(0, Math.min(1, (t - b.delay) % 2));
        const eased = Easing.easeOutBack(local);
        return (
          <rect
            key={i}
            x={size * b.x}
            y={size * 0.2 - size * b.h * eased}
            width={size * 0.08}
            height={size * b.h * eased}
            fill={b.c}
            rx="2"
          />
        );
      })}
      <path
        d={`M ${-size * 0.22} ${size * 0.06} L ${size * 0.18} ${-size * 0.18} L ${size * 0.13} ${-size * 0.13} M ${size * 0.18} ${-size * 0.18} L ${size * 0.18} ${-size * 0.1}`}
        stroke={PAL.amber}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

const TRADES: { name: string; Comp: (p: TradeProps) => ReactNode }[] = [
  { name: 'ช่างยนต์', Comp: TradeYon },
  { name: 'ช่างไฟฟ้า', Comp: TradeFaifaa },
  { name: 'เมคคาทรอนิกส์', Comp: TradeMecha },
  { name: 'โลจิสติกส์', Comp: TradeLogistics },
  { name: 'ดิจิทัล', Comp: TradeDigital },
  { name: 'บัญชี', Comp: TradeAccounting },
];

function ThailandMap({ x, y, scale = 1, highlight = null }: { x: number; y: number; scale?: number; highlight?: string | null }) {
  const path =
    'M 80 30 L 92 28 L 100 36 L 115 38 L 122 50 L 125 64 L 132 74 L 142 78 L 145 92 L 150 105 L 154 122 L 152 142 L 156 162 L 162 178 L 168 192 L 174 208 L 180 220 L 175 232 L 168 240 L 162 250 L 168 255 L 175 252 L 178 244 L 182 248 L 180 258 L 174 270 L 165 282 L 158 290 L 152 300 L 156 312 L 162 322 L 158 330 L 152 332 L 145 326 L 140 320 L 135 314 L 130 308 L 125 304 L 122 296 L 124 284 L 122 272 L 118 262 L 110 252 L 102 244 L 95 236 L 88 228 L 82 218 L 78 206 L 74 192 L 70 178 L 66 162 L 62 144 L 58 128 L 56 112 L 60 96 L 64 82 L 70 68 L 76 54 L 80 42 L 80 30 Z';
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path d={path} fill={PAL.greenDark} stroke={PAL.green} strokeWidth="1.5" opacity="0.9" />
      <ellipse cx="140" cy="200" rx="22" ry="14" fill={PAL.amber} opacity={highlight === 'eec' ? 0.6 : 0.25} transform="rotate(-20 140 200)" />
      <circle cx="142" cy="198" r="4" fill={PAL.amber} />
      <circle cx="142" cy="198" r="6" fill="none" stroke={PAL.amber} strokeWidth="2" />
    </g>
  );
}

function CollegePin({ t }: { t: number }) {
  const pulse = (t * 1.5) % 1;
  return (
    <g>
      <circle r={20 + pulse * 30} fill="none" stroke={PAL.amber} strokeWidth="2" opacity={1 - pulse} />
      <circle r={20 + pulse * 30 * 0.6} fill="none" stroke={PAL.amber} strokeWidth="1.5" opacity={(1 - pulse) * 0.6} />
      <circle r="14" fill={PAL.amber} />
      <circle r="14" fill="none" stroke={PAL.white} strokeWidth="2" />
      <circle r="5" fill={PAL.ink} />
      <text x="0" y="-30" textAnchor="middle" fill={PAL.amber} fontSize="14" fontFamily="Prompt" fontWeight="700">วิทยาลัย EEC</text>
    </g>
  );
}

function PartnerPing({ dx, dy, name, delay, t }: { dx: number; dy: number; name: string; delay: number; t: number }) {
  const local = t - delay;
  if (local < 0) return null;
  const pop = Easing.easeOutBack(Math.min(1, local * 2));
  const pulse = (local * 1.2) % 1;
  return (
    <g transform={`translate(${dx}, ${dy}) scale(${pop})`}>
      <circle r={12 + pulse * 20} fill="none" stroke={PAL.greenLight} strokeWidth="1.5" opacity={(1 - pulse) * 0.7} />
      <circle r="8" fill={PAL.green} />
      <circle r="8" fill="none" stroke={PAL.white} strokeWidth="1.5" />
      <rect x="-30" y="-32" width="60" height="20" rx="10" fill={PAL.ink} opacity="0.85" />
      <text x="0" y="-18" textAnchor="middle" fill={PAL.white} fontSize="11" fontFamily="Prompt" fontWeight="600">{name}</text>
    </g>
  );
}

function EECMap({ cx, cy, scale = 1, t = 0, showPartners = true }: { cx: number; cy: number; scale?: number; t?: number; showPartners?: boolean }) {
  const partners = [
    { name: 'Watsons', dx: 120, dy: -80, delay: 0 },
    { name: 'Toyota', dx: -110, dy: -50, delay: 0.6 },
    { name: 'Honda', dx: 140, dy: 60, delay: 1.2 },
    { name: 'PTT', dx: -150, dy: 30, delay: 1.8 },
    { name: 'SCG', dx: 60, dy: 130, delay: 2.4 },
    { name: 'WHA', dx: -100, dy: -130, delay: 3.0 },
    { name: 'Amata', dx: 180, dy: -20, delay: 3.6 },
    { name: 'Mitsubishi', dx: -180, dy: 90, delay: 4.2 },
  ];
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <rect x="0" y="-300" width="500" height="600" fill={PAL.navy} opacity="0.4" />
      <path d="M -400 -300 L 0 -280 C 20 -200 -10 -120 30 -60 C 60 0 40 60 80 120 C 100 180 60 240 0 280 L -400 300 Z" fill={PAL.greenDark} />
      <path d="M 0 -280 C 20 -200 -10 -120 30 -60 C 60 0 40 60 80 120 C 100 180 60 240 0 280" fill="none" stroke={PAL.green} strokeWidth="2" />
      <g stroke={PAL.dim} strokeWidth="1.5" strokeDasharray="6 4" fill="none">
        <path d="M -300 -100 L 30 -30 L 200 50" />
        <path d="M -250 100 L 10 60 L 180 -50" />
      </g>
      <text x="-180" y="-160" fill={PAL.mist} fontSize="16" fontFamily="Prompt">SRIRACHA</text>
      <text x="-180" y="60" fill={PAL.mist} fontSize="16" fontFamily="Prompt">CHONBURI</text>
      <text x="200" y="-200" fill={PAL.mist} fontSize="14" fontFamily="Prompt">GULF OF THAILAND</text>
      <CollegePin t={t} />
      {showPartners && partners.map((p, i) => <PartnerPing key={i} dx={p.dx} dy={p.dy} name={p.name} delay={p.delay} t={t} />)}
    </g>
  );
}

function Counter({ x, y, target, suffix = '', label, progress, fontSize = 120 }: { x: number; y: number; target: number; suffix?: string; label: string; progress: number; fontSize?: number }) {
  const eased = Easing.easeOutCubic(Math.max(0, Math.min(1, progress)));
  const value = Math.floor(target * eased);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text textAnchor="middle" fill={PAL.white} fontSize={fontSize} fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.04em' }}>
        {value.toLocaleString()}{suffix}
      </text>
      <text y={fontSize * 0.5} textAnchor="middle" fill={PAL.greenLight} fontSize={fontSize * 0.2} fontFamily="Prompt" fontWeight="500">
        {label}
      </text>
    </g>
  );
}

function PhilosophyPillar({ x, y, num, title, subtitle, delay, t }: { x: number; y: number; num: string; title: string; subtitle: string; delay: number; t: number }) {
  const local = Math.max(0, t - delay);
  const eased = Easing.easeOutCubic(Math.min(1, local * 1.5));
  const slideY = (1 - eased) * 30;
  return (
    <g transform={`translate(${x}, ${y + slideY})`} opacity={eased}>
      <rect x="-90" y="-80" width="180" height="160" rx="16" fill={PAL.ink} stroke={PAL.green} strokeWidth="2" opacity="0.85" />
      <text textAnchor="middle" y="-30" fill={PAL.green} fontSize="44" fontFamily="Prompt" fontWeight="800">{num}</text>
      <text textAnchor="middle" y="20" fill={PAL.white} fontSize="22" fontFamily="Prompt" fontWeight="700">{title}</text>
      <text textAnchor="middle" y="50" fill={PAL.greenLight} fontSize="12" fontFamily="Prompt">{subtitle}</text>
    </g>
  );
}

function BgMesh({ t, opacity = 0.5 }: { t: number; opacity?: number }) {
  const a = Math.sin(t * 0.3) * 100;
  const b = Math.cos(t * 0.25) * 100;
  return (
    <>
      <defs>
        <radialGradient id="mesh1" cx="0.3" cy="0.4">
          <stop offset="0" stopColor={PAL.green} stopOpacity="0.4" />
          <stop offset="1" stopColor={PAL.green} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mesh2" cx="0.7" cy="0.6">
          <stop offset="0" stopColor={PAL.greenMid} stopOpacity="0.3" />
          <stop offset="1" stopColor={PAL.greenMid} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="crestGlow">
          <stop offset="0" stopColor={PAL.green} stopOpacity="0.5" />
          <stop offset="1" stopColor={PAL.green} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g opacity={opacity}>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#mesh1)" transform={`translate(${a}, ${b})`} />
        <rect x="0" y="0" width="1920" height="1080" fill="url(#mesh2)" transform={`translate(${-a}, ${-b})`} />
      </g>
      <g opacity="0.05" stroke={PAL.green} strokeWidth="1">
        {[...Array(20)].map((_, i) => <line key={`v${i}`} x1={i * 96} y1="0" x2={i * 96} y2="1080" />)}
        {[...Array(12)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 90} x2="1920" y2={i * 90} />)}
      </g>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Scenes (ported from video-scenes.jsx)
// ─────────────────────────────────────────────────────────────

// ── Scene 1: Title card ─────────────────────────────────────
function Scene1_Title() {
  return (
    <Sprite start={0} end={7}>
      <Scene1Body />
    </Sprite>
  );
}
function Scene1Body() {
  const t = useTime();
  const labelOpacity = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const titleOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 0.6) * 1.5)));
  const titleY = (1 - titleOpacity) * 40;
  const subOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.6) * 1.5)));
  const subY = (1 - subOpacity) * 30;
  const crestOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 2.6) * 1.2)));
  const fadeOut = t > 6 ? Math.max(0, 1 - (t - 6) * 1.5) : 1;

  return (
    <g opacity={fadeOut}>
      <BgMesh t={t} />
      <g transform="translate(960, 360)" opacity={crestOpacity}>
        <AnimatedCrest x={0} y={0} size={300} progress={crestOpacity} />
      </g>
      <g transform="translate(960, 660)">
        <g opacity={labelOpacity}>
          <rect x="-110" y="-22" width="220" height="38" rx="19" fill="none" stroke={PAL.green} strokeWidth="1.5" />
          <text textAnchor="middle" y="4" fill={PAL.greenLight} fontSize="16" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.16em' }}>
            ทัวร์ 1 นาที · 1-MINUTE TOUR
          </text>
        </g>
        <g transform={`translate(0, ${50 + titleY})`} opacity={titleOpacity}>
          <text textAnchor="middle" fill={PAL.white} fontSize="72" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
            วิทยาลัยเทคโนโลยี อีอีซี เอ็นจิเนีย
          </text>
        </g>
        <g transform={`translate(0, ${130 + subY})`} opacity={subOpacity}>
          <text textAnchor="middle" fill={PAL.greenLight} fontSize="32" fontFamily="Prompt" fontWeight="500">
            แหลมฉบัง · ศรีราชา · ชลบุรี
          </text>
        </g>
      </g>
    </g>
  );
}

// ── Scene 2: Geographic establishing ────────────────────────
function Scene2_Geo() {
  return (
    <Sprite start={6.5} end={15}>
      <Scene2Body />
    </Sprite>
  );
}
function Scene2Body() {
  const globalT = useTime();
  const t = globalT - 6.5;
  const dur = 8.5;
  const phase = t < 4 ? 1 : 2;

  const captionOpacity = Easing.easeOutCubic(Math.min(1, t * 1));
  const captionY = (1 - captionOpacity) * 20;
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  const thailandScale = animate({ from: 1.5, to: 3.5, start: 0, end: 4, ease: Easing.easeInOutCubic })(t);
  const thailandOpacity = t < 4 ? 1 : Math.max(0, 1 - (t - 4) * 1.5);

  const eecOpacity = t < 3.5 ? 0 : Math.min(1, (t - 3.5) * 1);
  const eecScale = animate({ from: 0.7, to: 1.1, start: 3.5, end: 8, ease: Easing.easeOutCubic })(t);

  return (
    <g opacity={fadeOut}>
      <BgMesh t={globalT} opacity={0.3} />
      {phase === 1 && (
        <g opacity={thailandOpacity}>
          <ThailandMap x={960 - 100 * thailandScale} y={540 - 175 * thailandScale} scale={thailandScale} highlight="eec" />
          <g transform="translate(960, 540)" opacity={Math.min(1, t * 0.5)}>
            <rect x={-60} y={-40} width="120" height="80" fill="none" stroke={PAL.amber} strokeWidth="2" strokeDasharray="8 4" />
            <text textAnchor="middle" y="-50" fill={PAL.amber} fontSize="20" fontFamily="Prompt" fontWeight="700">EEC</text>
          </g>
        </g>
      )}
      {phase === 2 && (
        <g opacity={eecOpacity}>
          <EECMap cx={960} cy={540} scale={eecScale} t={t - 3.5} showPartners={false} />
        </g>
      )}
      <g transform={`translate(960, 940)`}>
        <g opacity={captionOpacity} transform={`translate(0, ${captionY})`}>
          <rect x="-280" y="-32" width="560" height="64" rx="32" fill={PAL.ink} stroke={PAL.green} strokeWidth="1.5" opacity="0.85" />
          <text textAnchor="middle" y="8" fill={PAL.white} fontSize="26" fontFamily="Prompt" fontWeight="600">
            ใจกลางเขตพัฒนาพิเศษภาคตะวันออก (EEC)
          </text>
        </g>
      </g>
    </g>
  );
}

// ── Scene 3: 18 majors showcase ─────────────────────────────
function Scene3_Trades() {
  return (
    <Sprite start={14.5} end={29}>
      <Scene3Body />
    </Sprite>
  );
}
function Scene3Body() {
  const globalT = useTime();
  const t = globalT - 14.5;
  const dur = 14.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  const positions = [
    { x: 480, y: 460 },
    { x: 760, y: 380 },
    { x: 1040, y: 380 },
    { x: 1320, y: 460 },
    { x: 760, y: 680 },
    { x: 1160, y: 680 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={globalT} opacity={0.4} />
      <g transform="translate(960, 180)">
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          OUR PROGRAMS
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="64" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          18 สาขาวิชา ครอบคลุมทุกสายอาชีพ
        </text>
      </g>
      {TRADES.map((trade, i) => {
        const delay = i * 0.25;
        const localT = t - delay;
        if (localT < 0) return null;
        const pop = Easing.easeOutBack(Math.min(1, localT * 1.5));
        const { Comp, name } = trade;
        return (
          <g key={i} transform={`translate(${positions[i].x}, ${positions[i].y}) scale(${pop})`}>
            <Comp x={0} y={0} size={220} t={globalT} />
            <text textAnchor="middle" y={130} fill={PAL.white} fontSize="24" fontFamily="Prompt" fontWeight="700">{name}</text>
          </g>
        );
      })}
      <g transform="translate(960, 940)" opacity={Math.max(0, Math.min(1, (t - 4) * 1))}>
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="20" fontFamily="Prompt">
          + อีก 10 สาขา ระดับ ปวช. / ปวส. / ป.ตรี
        </text>
      </g>
    </g>
  );
}

// ── Scene 4: EEC partner map ────────────────────────────────
function Scene4_Partners() {
  return (
    <Sprite start={28.5} end={40}>
      <Scene4Body />
    </Sprite>
  );
}
function Scene4Body() {
  const globalT = useTime();
  const t = globalT - 28.5;
  const dur = 11.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;
  const captionOpacity = Easing.easeOutCubic(Math.min(1, t * 1.5));

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={globalT} opacity={0.3} />
      <g transform="translate(960, 180)" opacity={captionOpacity}>
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          INDUSTRY PARTNERSHIPS
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="64" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          ทวิภาคีกับองค์กรชั้นนำ
        </text>
      </g>
      <EECMap cx={960} cy={620} scale={1.4} t={t} showPartners />
      <g transform="translate(960, 980)" opacity={Math.max(0, Math.min(1, (t - 5) * 1))}>
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="500">
          50+ พันธมิตรในนิคมอุตสาหกรรม · ฝึกงานจริง · มีรายได้ระหว่างเรียน
        </text>
      </g>
    </g>
  );
}

// ── Scene 5: Stats counters ─────────────────────────────────
function Scene5_Stats() {
  return (
    <Sprite start={39.5} end={50}>
      <Scene5Body />
    </Sprite>
  );
}
function Scene5Body() {
  const globalT = useTime();
  const t = globalT - 39.5;
  const dur = 10.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  const counters = [
    { x: 360, y: 540, target: 30, suffix: '+', label: 'ปีแห่งประสบการณ์', delay: 0 },
    { x: 760, y: 540, target: 16, suffix: '', label: 'สาขาวิชา', delay: 0.4 },
    { x: 1160, y: 540, target: 12000, suffix: '+', label: 'ศิษย์เก่า', delay: 0.8 },
    { x: 1560, y: 540, target: 100, suffix: '%', label: 'อัตรามีงานทำ', delay: 1.2 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={globalT} opacity={0.3} />
      <g transform="translate(960, 200)">
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          BY THE NUMBERS
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="64" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          ความเชื่อมั่นที่พิสูจน์ได้
        </text>
      </g>
      {counters.map((c, i) => {
        const localT = t - c.delay;
        if (localT < 0) return null;
        const progress = Math.min(1, localT / 2);
        return (
          <g key={i}>
            <Counter x={c.x} y={c.y} target={c.target} suffix={c.suffix} label={c.label} progress={progress} fontSize={120} />
          </g>
        );
      })}
      <g transform="translate(960, 820)" opacity={Math.max(0, Math.min(1, (t - 3.5) * 1))}>
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="26" fontFamily="Prompt" fontWeight="500" style={{ letterSpacing: '-0.01em' }}>
          เริ่มต้น พ.ศ. 2538 · สร้างช่างฝีมือคุณภาพต่อเนื่อง
        </text>
      </g>
    </g>
  );
}

// ── Scene 6: Philosophy ─────────────────────────────────────
function Scene6_Philosophy() {
  return (
    <Sprite start={49.5} end={55}>
      <Scene6Body />
    </Sprite>
  );
}
function Scene6Body() {
  const globalT = useTime();
  const t = globalT - 49.5;
  const dur = 5.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 2));
  const fadeOut = t > dur - 0.7 ? Math.max(0, 1 - (t - (dur - 0.7)) * 2) : 1;

  const pillars = [
    { num: '01', title: 'มุ่งสร้างคนดี', subtitle: 'ทั้งต่อตนเองและสังคม', delay: 0 },
    { num: '02', title: 'มีระเบียบวินัย', subtitle: 'แบบแผนการปฏิบัติตน', delay: 0.3 },
    { num: '03', title: 'ก้าวไกลเทคโนโลยี', subtitle: 'พัฒนาทันยุคทันสมัย', delay: 0.6 },
    { num: '04', title: 'ฝีมือเยี่ยม', subtitle: 'ทักษะวิชาชีพระดับสูง', delay: 0.9 },
    { num: '05', title: 'เปี่ยมคุณธรรม', subtitle: 'มีจริยธรรมและค่านิยมที่ดี', delay: 1.2 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={globalT} opacity={0.3} />
      <g transform="translate(960, 200)">
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          PHILOSOPHY · ปรัชญาวิทยาลัย
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="56" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          มุ่งสร้างคนดี มีระเบียบวินัย
        </text>
      </g>
      {pillars.map((p, i) => {
        const x = 360 + i * 312;
        return <PhilosophyPillar key={i} x={x} y={620} num={p.num} title={p.title} subtitle={p.subtitle} delay={p.delay} t={t} />;
      })}
    </g>
  );
}

// ── Scene 7: CTA outro ──────────────────────────────────────
function Scene7_CTA() {
  return (
    <Sprite start={54.5} end={60}>
      <Scene7Body />
    </Sprite>
  );
}
function Scene7Body() {
  const globalT = useTime();
  const t = globalT - 54.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const crestScale = animate({ from: 0.6, to: 1, start: 0, end: 1.5, ease: Easing.easeOutBack })(t);
  const titleOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 0.8) * 1.5)));
  const titleY = (1 - titleOpacity) * 30;
  const ctaOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.8) * 1.5)));
  const ctaScale = 1 + Math.sin(t * 4) * 0.04 * Math.min(1, (t - 2) * 0.5);
  const ctaY = (1 - ctaOpacity) * 20;

  return (
    <g opacity={fadeIn}>
      <BgMesh t={globalT} opacity={0.5} />
      <g transform={`translate(960, 380) scale(${crestScale})`} style={{ transformOrigin: '0 0' }}>
        <AnimatedCrest x={0} y={0} size={280} progress={1} />
      </g>
      <g transform={`translate(960, 680)`} opacity={titleOpacity}>
        <text textAnchor="middle" y={titleY} fill={PAL.white} fontSize="60" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          พร้อมเริ่มต้นอนาคต?
        </text>
        <text textAnchor="middle" y={titleY + 56} fill={PAL.greenLight} fontSize="24" fontFamily="Prompt" fontWeight="500">
          เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2569
        </text>
      </g>
      <g transform={`translate(960, 870) scale(${ctaScale})`} style={{ transformOrigin: '0 0' }} opacity={ctaOpacity}>
        <rect x={-200} y={-32 + ctaY} width="400" height="76" rx="38" fill={PAL.green} />
        <rect x={-200} y={-32 + ctaY} width="400" height="76" rx="38" fill="none" stroke={PAL.greenLight} strokeWidth="2" />
        <text textAnchor="middle" y={16 + ctaY} fill={PAL.white} fontSize="28" fontFamily="Prompt" fontWeight="700" style={{ letterSpacing: '-0.01em' }}>
          สมัครเรียนออนไลน์ →
        </text>
      </g>
      <g transform={`translate(960, 990)`} opacity={ctaOpacity * 0.7}>
        <text textAnchor="middle" fill={PAL.mist} fontSize="16" fontFamily="Prompt">
          eec-laemchabang.ac.th · 038-494-066
        </text>
      </g>
    </g>
  );
}

// ── Scene markers (updates root data attr with current second) ─
function SceneMarkers() {
  const t = useTime();
  const sec = Math.floor(t);
  useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [sec]);
  return null;
}

// ─────────────────────────────────────────────────────────────
// Stage + PlaybackBar (ported from animations.jsx)
// ─────────────────────────────────────────────────────────────
function IconButton({ children, onClick, title }: { children: ReactNode; onClick: () => void; title: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  );
}

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover,
}: {
  time: number;
  duration: number;
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSeek: (t: number) => void;
  onHover: (t: number | null) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const timeFromEvent = useCallback(
    (e: { clientX: number }) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      return x * duration;
    },
    [duration]
  );

  const onTrackMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) onSeek(t);
    else onHover(t);
  };

  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };

  const onTrackDown = (e: React.MouseEvent) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t: number) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor((total * 100) % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        background: 'rgba(20,20,20,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        width: '100%',
        maxWidth: 680,
        alignSelf: 'center',
        borderRadius: 8,
        color: '#f6f4ef',
        fontFamily: 'Inter, system-ui, sans-serif',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor" />
            <rect x="8" y="2" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor" />
          </svg>
        )}
      </IconButton>

      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: 'tabular-nums',
          width: 64,
          textAlign: 'right',
          color: '#f6f4ef',
        }}
      >
        {fmt(time)}
      </div>

      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={onTrackLeave}
        onMouseDown={onTrackDown}
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, background: 'oklch(72% 0.12 250)', borderRadius: 2 }} />
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            top: '50%',
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: '#fff',
            borderRadius: 6,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: 'tabular-nums',
          width: 64,
          textAlign: 'left',
          color: 'rgba(246,244,239,0.55)',
        }}
      >
        {fmt(duration)}
      </div>
    </div>
  );
}

function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}: {
  width?: number;
  height?: number;
  duration?: number;
  background?: string;
  loop?: boolean;
  autoplay?: boolean;
  persistKey?: string;
  children?: ReactNode;
}) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Restore persisted playhead after mount (hydration-safe — render starts at 0).
  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      if (isFinite(v)) setTime(clamp(v, 0, duration));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist playhead
  useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time));
    } catch {
      /* ignore */
    }
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44;
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;
          else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek, 0/Home = reset
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime((t) => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime((t) => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = useMemo<TimelineCtx>(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  );

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        <div
          style={{
            width,
            height,
            background,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <TimelineContext.Provider value={ctxValue}>{children}</TimelineContext.Provider>
        </div>
      </div>

      <PlaybackBar
        time={displayTime}
        duration={duration}
        playing={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onReset={() => setTime(0)}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  );
}

// ── Video app (the Stage content) ───────────────────────────
function VideoApp() {
  const svgStyle: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
  return (
    <Stage width={1920} height={1080} duration={60} loop background="#0b1a13" persistKey="eec-tour">
      <svg viewBox="0 0 1920 1080" style={svgStyle}>
        <defs>
          <radialGradient id="bgRoot" cx="0.5" cy="0.5" r="0.8">
            <stop offset="0" stopColor="#0f6634" />
            <stop offset="0.5" stopColor="#0a4d28" />
            <stop offset="1" stopColor="#04190d" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#bgRoot)" />
        <Scene1_Title />
        <Scene2_Geo />
        <Scene3_Trades />
        <Scene4_Partners />
        <Scene5_Stats />
        <Scene6_Philosophy />
        <Scene7_CTA />
      </svg>
      <SceneMarkers />
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────
// Page body — fixed cinematic shell with top bar + stage host
// (reproduces video.html's inline <style> shell; no Nav/Footer/CTA)
// ─────────────────────────────────────────────────────────────
export default function VideoBody() {
  return (
    <main className="video-shell" data-video-root data-screen-label="t=0s" style={videoShell}>
      <header className="video-bar" style={videoBar}>
        <div className="brand" style={barBrand}>
          <img src="/assets/logo.png" alt="" style={barBrandImg} />
          <div>
            <div className="name" style={barName}>วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง</div>
            <div className="tag" style={barTag}>ทัวร์วิทยาลัย · 1 นาที · กด ⎵ เพื่อหยุด/เล่น</div>
          </div>
        </div>
        <a href="/" className="back" style={barBack}>← กลับสู่เว็บไซต์</a>
      </header>
      <div id="stage-host" className="stage-host" style={stageHost}>
        <VideoApp />
      </div>
    </main>
  );
}

// Inline styles ported from video.html's <style> block.
const videoShell: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: '#0a0a0a',
};
const videoBar: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: 'white',
  zIndex: 10,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};
const barBrand: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const barBrandImg: CSSProperties = { width: 36, height: 36 };
const barName: CSSProperties = { fontWeight: 600, fontSize: 14 };
const barTag: CSSProperties = { fontSize: 11, color: 'rgba(255,255,255,0.6)' };
const barBack: CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 999,
  fontWeight: 500,
};
const stageHost: CSSProperties = { position: 'relative', flex: 1, minHeight: 0 };
