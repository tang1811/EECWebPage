// ─────────────────────────────────────────────────────────────
// Video illustrations — animated SVG trades, map of Thailand,
// EEC partner pings, animated crest
// Each component reads useSprite() and animates with progress.
// ─────────────────────────────────────────────────────────────

const { useRef } = React;

// ── COLORS ──────────────────────────────────────────────────
const PAL = {
  green: '#22a85a', greenDark: '#0a4d28', greenMid: '#0f7a3e', greenLight: '#86dba6',
  navy: '#1c2a4e', red: '#8a1f2b', amber: '#f5b800', white: '#ffffff',
  ink: '#0b1a13', mist: 'rgba(255,255,255,0.6)', dim: 'rgba(255,255,255,0.35)',
};

// ── Animated Crest (pure SVG — styled emblem) ───────────────
function AnimatedCrest({ x, y, size = 280, progress = 1 }) {
  const eased = Easing.easeOutCubic(Math.min(progress, 1));
  const t = useTime();
  const ringT = (t * 0.05) % 1;
  const r = size / 2;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={eased}>
      {/* Outer glow */}
      <circle r={r * 1.4} fill="url(#crestGlow)" opacity={0.7}/>
      {/* Rotating decorative rings */}
      <g transform={`rotate(${ringT * 360})`}>
        <circle r={r * 1.1} fill="none" stroke={PAL.greenLight} strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5"/>
      </g>
      <g transform={`rotate(${-ringT * 360})`}>
        <circle r={r * 1.24} fill="none" stroke={PAL.green} strokeWidth="1" strokeDasharray="1 6" opacity="0.4"/>
      </g>
      {/* Outer dark ring */}
      <circle r={r} fill={PAL.navy}/>
      <circle r={r} fill="none" stroke={PAL.greenLight} strokeWidth="3"/>
      <circle r={r * 0.92} fill="none" stroke={PAL.greenLight} strokeWidth="1"/>
      {/* Curved text top */}
      <defs>
        <path id={`crestTopArc-${size}`} d={`M ${-r * 0.85} 0 A ${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.85} 0`} fill="none"/>
        <path id={`crestBotArc-${size}`} d={`M ${-r * 0.78} 0 A ${r * 0.78} ${r * 0.78} 0 0 0 ${r * 0.78} 0`} fill="none"/>
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
      {/* Inner shield (4 quadrants) */}
      <g transform={`translate(0, ${size * 0.02})`}>
        <path
          d={`M ${-r * 0.5} ${-r * 0.4} L ${r * 0.5} ${-r * 0.4} L ${r * 0.5} ${r * 0.25} L 0 ${r * 0.55} L ${-r * 0.5} ${r * 0.25} Z`}
          fill={PAL.white}
        />
        <path
          d={`M ${-r * 0.5} ${-r * 0.4} L 0 ${-r * 0.4} L 0 ${-r * 0.08} L ${-r * 0.5} ${-r * 0.08} Z`}
          fill={PAL.greenMid}
        />
        <path
          d={`M 0 ${-r * 0.4} L ${r * 0.5} ${-r * 0.4} L ${r * 0.5} ${-r * 0.08} L 0 ${-r * 0.08} Z`}
          fill={PAL.red}
        />
        <path
          d={`M ${-r * 0.5} ${-r * 0.08} L 0 ${-r * 0.08} L 0 ${r * 0.25} L ${-r * 0.5} ${r * 0.25} Z`}
          fill={PAL.red}
        />
        <path
          d={`M 0 ${-r * 0.08} L ${r * 0.5} ${-r * 0.08} L ${r * 0.5} ${r * 0.25} L 0 ${r * 0.55} L 0 ${-r * 0.08} Z`}
          fill={PAL.greenMid}
        />
        {/* Center white cross */}
        <line x1={-r * 0.5} y1={-r * 0.08} x2={r * 0.5} y2={-r * 0.08} stroke={PAL.white} strokeWidth="3"/>
        <line x1="0" y1={-r * 0.4} x2="0" y2={r * 0.55} stroke={PAL.white} strokeWidth="3"/>
        {/* E.E.L.C. text in top-left */}
        <text x={-r * 0.25} y={-r * 0.2} textAnchor="middle" fill={PAL.white} fontSize={size * 0.06} fontFamily="Prompt" fontWeight="800">E.E.L.C</text>
        {/* Gear in top-right (with E inside) */}
        <g transform={`translate(${r * 0.25}, ${-r * 0.24})`}>
          <circle r={size * 0.07} fill="none" stroke={PAL.white} strokeWidth="2"/>
          {[0,60,120,180,240,300].map((a,i) => (
            <rect key={i} x="-1.5" y={-size*0.09} width="3" height={size*0.025} fill={PAL.white} transform={`rotate(${a})`}/>
          ))}
          <text textAnchor="middle" y={size * 0.025} fill={PAL.white} fontSize={size * 0.06} fontFamily="Prompt" fontWeight="800">E</text>
        </g>
        {/* Book in bottom-left */}
        <g transform={`translate(${-r * 0.25}, ${r * 0.1})`} fill="none" stroke={PAL.white} strokeWidth="2">
          <path d={`M ${-size*0.08} ${-size*0.04} L ${-size*0.08} ${size*0.05} L 0 ${size*0.03} L ${size*0.08} ${size*0.05} L ${size*0.08} ${-size*0.04} L 0 ${-size*0.02} Z`}/>
          <line x1="0" y1={-size*0.02} x2="0" y2={size*0.03}/>
        </g>
        {/* Torch in bottom-right */}
        <g transform={`translate(${r * 0.22}, ${r * 0.15})`} fill={PAL.white}>
          <path d={`M 0 ${-size*0.08} Q ${-size*0.04} ${-size*0.02} ${-size*0.025} ${size*0.02} Q 0 ${size*0.005} ${size*0.025} ${size*0.02} Q ${size*0.04} ${-size*0.02} 0 ${-size*0.08} Z`} fill={PAL.amber}/>
          <rect x="-3" y={size*0.015} width="6" height={size*0.06} fill={PAL.white}/>
        </g>
      </g>
      {/* Graduation cap at top */}
      <g transform={`translate(0, ${-r * 0.55})`}>
        <path d={`M ${-r * 0.2} 0 L 0 ${-r * 0.08} L ${r * 0.2} 0 L 0 ${r * 0.08} Z`} fill={PAL.white}/>
        <rect x={-r * 0.08} y={r * 0.04} width={r * 0.16} height={r * 0.08} fill={PAL.white}/>
        <line x1={r * 0.18} y1="0" x2={r * 0.22} y2={r * 0.12} stroke={PAL.white} strokeWidth="2"/>
        <circle cx={r * 0.22} cy={r * 0.14} r="3" fill={PAL.amber}/>
      </g>
    </g>
  );
}

// ── Trade illustration components ───────────────────────────
// Each trade has a unique animated SVG illustrating the work

function TradeYon({ x, y, size = 200, t }) {  // ช่างยนต์ - rotating engine wrench
  const cog = (t * 60) % 360;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.greenDark} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Wheel/engine */}
      <g transform={`rotate(${cog})`}>
        <circle r={size * 0.22} fill="none" stroke={PAL.greenLight} strokeWidth="3"/>
        {[0,60,120,180,240,300].map((a,i) => (
          <rect key={i} x={-3} y={-size*0.28} width="6" height={size*0.12} fill={PAL.greenLight} transform={`rotate(${a})`}/>
        ))}
        <circle r={size * 0.06} fill={PAL.amber}/>
      </g>
      {/* Wrench */}
      <g transform={`rotate(${-15 + Math.sin(t * 3) * 8}) translate(${size*0.28}, 0)`}>
        <rect x="-4" y="-4" width={size*0.3} height="8" fill={PAL.amber} rx="2"/>
        <circle cx="0" cy="0" r="10" fill="none" stroke={PAL.amber} strokeWidth="4"/>
      </g>
    </g>
  );
}

function TradeFaifaa({ x, y, size = 200, t }) {  // ช่างไฟฟ้า - lightning + circuit
  const pulse = (Math.sin(t * 4) + 1) / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.navy} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Circuit grid */}
      <g stroke={PAL.greenLight} strokeWidth="1.5" fill="none" opacity="0.5">
        <line x1={-size*0.3} y1={-size*0.2} x2={size*0.3} y2={-size*0.2}/>
        <line x1={-size*0.3} y1={size*0.2} x2={size*0.3} y2={size*0.2}/>
        <circle cx={-size*0.3} cy={-size*0.2} r="3" fill={PAL.greenLight}/>
        <circle cx={size*0.3} cy={-size*0.2} r="3" fill={PAL.greenLight}/>
        <circle cx={-size*0.3} cy={size*0.2} r="3" fill={PAL.greenLight}/>
        <circle cx={size*0.3} cy={size*0.2} r="3" fill={PAL.greenLight}/>
      </g>
      {/* Lightning bolt */}
      <path
        d={`M ${-size*0.08} ${-size*0.25} L ${size*0.05} ${-size*0.05} L ${-size*0.04} ${-size*0.05} L ${size*0.1} ${size*0.25} L ${-size*0.02} ${size*0.05} L ${size*0.05} ${size*0.05} Z`}
        fill={PAL.amber}
        opacity={0.7 + pulse * 0.3}
        style={{ filter: `drop-shadow(0 0 ${pulse * 12}px ${PAL.amber})` }}
      />
    </g>
  );
}

function TradeMecha({ x, y, size = 200, t }) {  // เมคคาทรอนิกส์ - robot arm
  const swing = Math.sin(t * 1.5) * 40;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.red} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Base */}
      <rect x={-size*0.15} y={size*0.15} width={size*0.3} height={size*0.1} fill={PAL.amber} rx="3"/>
      <circle cx="0" cy={size*0.15} r={size*0.06} fill={PAL.amber}/>
      {/* Arm 1 */}
      <g transform={`rotate(${-30 + swing * 0.5})`}>
        <rect x="-5" y={-size*0.25} width="10" height={size*0.4} fill={PAL.greenLight} rx="4"/>
        <circle cx="0" cy={-size*0.25} r={size*0.05} fill={PAL.greenLight}/>
        {/* Arm 2 */}
        <g transform={`translate(0, ${-size*0.25}) rotate(${swing})`}>
          <rect x="-4" y={-size*0.2} width="8" height={size*0.2} fill={PAL.amber} rx="3"/>
          {/* Gripper */}
          <g transform={`translate(0, ${-size*0.2})`}>
            <rect x="-8" y="-6" width="6" height="14" fill={PAL.greenLight} rx="1"/>
            <rect x="2" y="-6" width="6" height="14" fill={PAL.greenLight} rx="1"/>
            <circle cx="0" cy="-2" r="3" fill={PAL.amber}/>
          </g>
        </g>
      </g>
    </g>
  );
}

function TradeLogistics({ x, y, size = 200, t }) {  // โลจิสติกส์ - truck moving
  const truckX = ((t * 60) % (size * 0.5)) - size * 0.25;
  const wheelR = (t * 5) % (Math.PI * 2);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.amber} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Road */}
      <line x1={-size*0.4} y1={size*0.2} x2={size*0.4} y2={size*0.2} stroke={PAL.greenDark} strokeWidth="3"/>
      <line x1={-size*0.4} y1={size*0.2} x2={size*0.4} y2={size*0.2} stroke={PAL.white} strokeWidth="1" strokeDasharray="8 8" opacity="0.6"/>
      {/* Truck */}
      <g transform={`translate(${truckX}, 0)`}>
        {/* Cargo */}
        <rect x={-size*0.18} y={-size*0.05} width={size*0.22} height={size*0.2} fill={PAL.greenDark} rx="2"/>
        <rect x={-size*0.18} y={-size*0.05} width={size*0.22} height={size*0.2} fill="none" stroke={PAL.greenLight} strokeWidth="1.5"/>
        {/* Cab */}
        <rect x={size*0.04} y={size*0.02} width={size*0.13} height={size*0.13} fill={PAL.navy} rx="2"/>
        <rect x={size*0.06} y={size*0.04} width={size*0.07} height={size*0.05} fill={PAL.greenLight}/>
        {/* Wheels */}
        <g transform={`translate(${-size*0.1}, ${size*0.18})`}>
          <circle r={size*0.04} fill={PAL.ink}/>
          <g transform={`rotate(${wheelR * 180 / Math.PI})`}>
            <line x1="0" y1={-size*0.03} x2="0" y2={size*0.03} stroke={PAL.greenLight} strokeWidth="2"/>
          </g>
        </g>
        <g transform={`translate(${size*0.11}, ${size*0.18})`}>
          <circle r={size*0.04} fill={PAL.ink}/>
          <g transform={`rotate(${wheelR * 180 / Math.PI})`}>
            <line x1="0" y1={-size*0.03} x2="0" y2={size*0.03} stroke={PAL.greenLight} strokeWidth="2"/>
          </g>
        </g>
      </g>
    </g>
  );
}

function TradeDigital({ x, y, size = 200, t }) {  // ดิจิทัล - laptop with code
  const lines = [0.55, 0.35, 0.65, 0.45, 0.7];
  const blink = Math.sin(t * 3) > 0;
  const typeProgress = (t * 1.2) % 1;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.greenMid} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Laptop base */}
      <path d={`M ${-size*0.32} ${size*0.18} L ${size*0.32} ${size*0.18} L ${size*0.28} ${size*0.25} L ${-size*0.28} ${size*0.25} Z`} fill={PAL.ink}/>
      {/* Screen */}
      <rect x={-size*0.28} y={-size*0.18} width={size*0.56} height={size*0.36} fill={PAL.navy} rx="3"/>
      <rect x={-size*0.26} y={-size*0.16} width={size*0.52} height={size*0.32} fill={PAL.ink} rx="2"/>
      {/* Code lines */}
      <g>
        {lines.map((w, i) => {
          const visible = (i + 1) / lines.length;
          const lineW = size * 0.48 * w * Math.min(1, typeProgress * lines.length / (i + 1));
          return (
            <rect key={i}
              x={-size*0.24}
              y={-size*0.13 + i * size*0.05}
              width={lineW}
              height={size*0.025}
              fill={i % 2 === 0 ? PAL.greenLight : PAL.amber}
              rx="1"
              opacity="0.85"/>
          );
        })}
        {/* Cursor */}
        <rect
          x={-size*0.24 + size*0.48 * lines[Math.min(lines.length-1, Math.floor(typeProgress * lines.length))] * 0.95}
          y={-size*0.13 + Math.min(lines.length-1, Math.floor(typeProgress * lines.length)) * size*0.05}
          width="3" height={size*0.025}
          fill={PAL.white} opacity={blink ? 1 : 0.2}/>
      </g>
    </g>
  );
}

function TradeAccounting({ x, y, size = 200, t }) {  // บัญชี - chart bars rising
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size * 0.45} fill={PAL.navy} opacity="0.85"/>
      <circle r={size * 0.45} fill="none" stroke={PAL.green} strokeWidth="2"/>
      {/* Axes */}
      <line x1={-size*0.3} y1={size*0.2} x2={size*0.3} y2={size*0.2} stroke={PAL.dim} strokeWidth="2"/>
      <line x1={-size*0.3} y1={size*0.2} x2={-size*0.3} y2={-size*0.25} stroke={PAL.dim} strokeWidth="2"/>
      {/* Bars */}
      {[
        { x: -0.22, h: 0.18, c: PAL.greenLight, delay: 0 },
        { x: -0.10, h: 0.28, c: PAL.green,      delay: 0.2 },
        { x:  0.02, h: 0.22, c: PAL.amber,      delay: 0.4 },
        { x:  0.14, h: 0.36, c: PAL.greenLight, delay: 0.6 },
      ].map((b, i) => {
        const local = Math.max(0, Math.min(1, (t - b.delay) % 2));
        const eased = Easing.easeOutBack(local);
        return (
          <rect key={i}
            x={size * b.x} y={size * 0.2 - size * b.h * eased}
            width={size * 0.08} height={size * b.h * eased}
            fill={b.c} rx="2"/>
        );
      })}
      {/* Trend arrow */}
      <path d={`M ${-size*0.22} ${size*0.06} L ${size*0.18} ${-size*0.18} L ${size*0.13} ${-size*0.13} M ${size*0.18} ${-size*0.18} L ${size*0.18} ${-size*0.1}`}
            stroke={PAL.amber} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );
}

// Trade collection (used by Scene 3)
const TRADES = [
  { name: 'ช่างยนต์', Comp: TradeYon },
  { name: 'ช่างไฟฟ้า', Comp: TradeFaifaa },
  { name: 'เมคคาทรอนิกส์', Comp: TradeMecha },
  { name: 'โลจิสติกส์', Comp: TradeLogistics },
  { name: 'ดิจิทัล', Comp: TradeDigital },
  { name: 'บัญชี', Comp: TradeAccounting },
];

// ── Thailand map (simplified SVG) ───────────────────────────
// Stylized outline approximation centered around viewport
function ThailandMap({ x, y, scale = 1, highlight = null }) {
  // Highly-simplified path of Thailand
  const path = "M 80 30 L 92 28 L 100 36 L 115 38 L 122 50 L 125 64 L 132 74 L 142 78 L 145 92 L 150 105 L 154 122 L 152 142 L 156 162 L 162 178 L 168 192 L 174 208 L 180 220 L 175 232 L 168 240 L 162 250 L 168 255 L 175 252 L 178 244 L 182 248 L 180 258 L 174 270 L 165 282 L 158 290 L 152 300 L 156 312 L 162 322 L 158 330 L 152 332 L 145 326 L 140 320 L 135 314 L 130 308 L 125 304 L 122 296 L 124 284 L 122 272 L 118 262 L 110 252 L 102 244 L 95 236 L 88 228 L 82 218 L 78 206 L 74 192 L 70 178 L 66 162 L 62 144 L 58 128 L 56 112 L 60 96 L 64 82 L 70 68 L 76 54 L 80 42 L 80 30 Z";
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path d={path} fill={PAL.greenDark} stroke={PAL.green} strokeWidth="1.5" opacity="0.9"/>
      {/* EEC region highlight */}
      <ellipse cx="140" cy="200" rx="22" ry="14" fill={PAL.amber} opacity={highlight === 'eec' ? 0.6 : 0.25} transform="rotate(-20 140 200)"/>
      {/* College marker */}
      <circle cx="142" cy="198" r="4" fill={PAL.amber}/>
      <circle cx="142" cy="198" r="6" fill="none" stroke={PAL.amber} strokeWidth="2"/>
    </g>
  );
}

// ── EEC region close-up map ─────────────────────────────────
function EECMap({ cx, cy, scale = 1, t = 0, showPartners = true }) {
  // Coastline curve + Sriracha bay
  const partners = [
    { name: 'Watsons',   dx:  120, dy: -80,  delay: 0 },
    { name: 'Toyota',    dx: -110, dy: -50,  delay: 0.6 },
    { name: 'Honda',     dx:  140, dy:  60,  delay: 1.2 },
    { name: 'PTT',       dx: -150, dy:  30,  delay: 1.8 },
    { name: 'SCG',       dx:   60, dy:  130, delay: 2.4 },
    { name: 'WHA',       dx: -100, dy: -130, delay: 3.0 },
    { name: 'Amata',     dx:  180, dy: -20,  delay: 3.6 },
    { name: 'Mitsubishi',dx: -180, dy:  90,  delay: 4.2 },
  ];
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Sea (right side) */}
      <rect x="0" y="-300" width="500" height="600" fill={PAL.navy} opacity="0.4"/>
      {/* Land mass */}
      <path
        d="M -400 -300 L 0 -280 C 20 -200 -10 -120 30 -60 C 60 0 40 60 80 120 C 100 180 60 240 0 280 L -400 300 Z"
        fill={PAL.greenDark}
      />
      {/* Coastline */}
      <path
        d="M 0 -280 C 20 -200 -10 -120 30 -60 C 60 0 40 60 80 120 C 100 180 60 240 0 280"
        fill="none" stroke={PAL.green} strokeWidth="2"
      />
      {/* Roads */}
      <g stroke={PAL.dim} strokeWidth="1.5" strokeDasharray="6 4" fill="none">
        <path d="M -300 -100 L 30 -30 L 200 50"/>
        <path d="M -250 100 L 10 60 L 180 -50"/>
      </g>
      {/* Sriracha label */}
      <text x="-180" y="-160" fill={PAL.mist} fontSize="16" fontFamily="Prompt">SRIRACHA</text>
      <text x="-180" y="60" fill={PAL.mist} fontSize="16" fontFamily="Prompt">CHONBURI</text>
      <text x="200" y="-200" fill={PAL.mist} fontSize="14" fontFamily="Prompt">GULF OF THAILAND</text>
      {/* College pin (center) */}
      <CollegePin t={t}/>
      {/* Partner pings */}
      {showPartners && partners.map((p, i) => (
        <PartnerPing key={i} dx={p.dx} dy={p.dy} name={p.name} delay={p.delay} t={t}/>
      ))}
    </g>
  );
}

function CollegePin({ t }) {
  const pulse = (t * 1.5) % 1;
  return (
    <g>
      {/* Pulse ring */}
      <circle r={20 + pulse * 30} fill="none" stroke={PAL.amber} strokeWidth="2" opacity={1 - pulse}/>
      <circle r={20 + pulse * 30 * 0.6} fill="none" stroke={PAL.amber} strokeWidth="1.5" opacity={(1 - pulse) * 0.6}/>
      {/* Pin */}
      <circle r="14" fill={PAL.amber}/>
      <circle r="14" fill="none" stroke={PAL.white} strokeWidth="2"/>
      <circle r="5" fill={PAL.ink}/>
      <text x="0" y="-30" textAnchor="middle" fill={PAL.amber} fontSize="14" fontFamily="Prompt" fontWeight="700">วิทยาลัย EEC</text>
    </g>
  );
}

function PartnerPing({ dx, dy, name, delay, t }) {
  const local = t - delay;
  if (local < 0) return null;
  const pop = Easing.easeOutBack(Math.min(1, local * 2));
  const pulse = (local * 1.2) % 1;
  return (
    <g transform={`translate(${dx}, ${dy}) scale(${pop})`}>
      <circle r={12 + pulse * 20} fill="none" stroke={PAL.greenLight} strokeWidth="1.5" opacity={(1 - pulse) * 0.7}/>
      <circle r="8" fill={PAL.green}/>
      <circle r="8" fill="none" stroke={PAL.white} strokeWidth="1.5"/>
      <rect x="-30" y="-32" width="60" height="20" rx="10" fill={PAL.ink} opacity="0.85"/>
      <text x="0" y="-18" textAnchor="middle" fill={PAL.white} fontSize="11" fontFamily="Prompt" fontWeight="600">{name}</text>
    </g>
  );
}

// ── Counter (count-up number) ───────────────────────────────
function Counter({ x, y, target, suffix = '', label, progress, fontSize = 120 }) {
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

// ── Philosophy pillar ───────────────────────────────────────
function PhilosophyPillar({ x, y, num, title, subtitle, delay, t }) {
  const local = Math.max(0, t - delay);
  const eased = Easing.easeOutCubic(Math.min(1, local * 1.5));
  const slideY = (1 - eased) * 30;
  return (
    <g transform={`translate(${x}, ${y + slideY})`} opacity={eased}>
      <rect x="-90" y="-80" width="180" height="160" rx="16" fill={PAL.ink} stroke={PAL.green} strokeWidth="2" opacity="0.85"/>
      <text textAnchor="middle" y="-30" fill={PAL.green} fontSize="44" fontFamily="Prompt" fontWeight="800">{num}</text>
      <text textAnchor="middle" y="20" fill={PAL.white} fontSize="22" fontFamily="Prompt" fontWeight="700">{title}</text>
      <text textAnchor="middle" y="50" fill={PAL.greenLight} fontSize="12" fontFamily="Prompt">{subtitle}</text>
    </g>
  );
}

// ── Background mesh (subtle moving gradient) ────────────────
function BgMesh({ t, opacity = 0.5 }) {
  const a = Math.sin(t * 0.3) * 100;
  const b = Math.cos(t * 0.25) * 100;
  return (
    <>
      <defs>
        <radialGradient id="mesh1" cx="0.3" cy="0.4">
          <stop offset="0" stopColor={PAL.green} stopOpacity="0.4"/>
          <stop offset="1" stopColor={PAL.green} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="mesh2" cx="0.7" cy="0.6">
          <stop offset="0" stopColor={PAL.greenMid} stopOpacity="0.3"/>
          <stop offset="1" stopColor={PAL.greenMid} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="crestGlow">
          <stop offset="0" stopColor={PAL.green} stopOpacity="0.5"/>
          <stop offset="1" stopColor={PAL.green} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g opacity={opacity}>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#mesh1)" transform={`translate(${a}, ${b})`}/>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#mesh2)" transform={`translate(${-a}, ${-b})`}/>
      </g>
      {/* Grid */}
      <g opacity="0.05" stroke={PAL.green} strokeWidth="1">
        {[...Array(20)].map((_, i) => <line key={`v${i}`} x1={i * 96} y1="0" x2={i * 96} y2="1080"/>)}
        {[...Array(12)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 90} x2="1920" y2={i * 90}/>)}
      </g>
    </>
  );
}

// Export to window
Object.assign(window, {
  PAL, AnimatedCrest,
  TradeYon, TradeFaifaa, TradeMecha, TradeLogistics, TradeDigital, TradeAccounting, TRADES,
  ThailandMap, EECMap, CollegePin, PartnerPing,
  Counter, PhilosophyPillar, BgMesh,
});
