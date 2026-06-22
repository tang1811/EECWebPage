// ─────────────────────────────────────────────────────────────
// Video scenes — composes illustrations into a 60s timeline
// Each scene gates its visibility with a Sprite (start/end times)
// and internally uses useTime() to drive its own sub-animations.
// ─────────────────────────────────────────────────────────────

// Camera (subtle zoom on each scene to avoid static frames)
function Camera({ start, end, fromScale = 1.05, toScale = 1, fromX = 0, fromY = 0, toX = 0, toY = 0, children }) {
  const t = useTime();
  const dur = end - start;
  const local = Math.max(0, Math.min(1, (t - start) / dur));
  const eased = Easing.easeOutCubic(local);
  const scale = fromScale + (toScale - fromScale) * eased;
  const x = fromX + (toX - fromX) * eased;
  const y = fromY + (toY - fromY) * eased;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} style={{ transformOrigin: '960px 540px' }}>
      {children}
    </g>
  );
}

// ── Scene 1: Title card ─────────────────────────────────────
function Scene1_Title() {
  return (
    <Sprite start={0} end={7}>
      <Scene1Body/>
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
      <BgMesh t={t}/>
      <g transform="translate(960, 360)" opacity={crestOpacity}>
        <AnimatedCrest x={0} y={0} size={300} progress={crestOpacity}/>
      </g>
      <g transform="translate(960, 660)">
        <g opacity={labelOpacity}>
          <rect x="-110" y="-22" width="220" height="38" rx="19" fill="none" stroke={PAL.green} strokeWidth="1.5"/>
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
      <Scene2Body/>
    </Sprite>
  );
}
function Scene2Body() {
  const t = useTime() - 6.5;  // local time
  const dur = 8.5;
  // Phase 1 (0-2s): Thailand zoom in
  // Phase 2 (2-5s): EEC region zoom + partners begin
  // Phase 3 (5-8s): hold
  const phase = t < 4 ? 1 : 2;

  const captionOpacity = Easing.easeOutCubic(Math.min(1, t * 1));
  const captionY = (1 - captionOpacity) * 20;
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  // Phase 1: Thailand map zooming
  const thailandScale = animate({ from: 1.5, to: 3.5, start: 0, end: 4, ease: Easing.easeInOutCubic })(t);
  const thailandOpacity = t < 4 ? 1 : Math.max(0, 1 - (t - 4) * 1.5);

  // Phase 2: EEC close-up
  const eecOpacity = t < 3.5 ? 0 : Math.min(1, (t - 3.5) * 1);
  const eecScale = animate({ from: 0.7, to: 1.1, start: 3.5, end: 8, ease: Easing.easeOutCubic })(t);

  return (
    <g opacity={fadeOut}>
      <BgMesh t={useTime()} opacity={0.3}/>
      {phase === 1 && (
        <g opacity={thailandOpacity}>
          <ThailandMap x={960 - 100 * thailandScale} y={540 - 175 * thailandScale} scale={thailandScale} highlight="eec"/>
          {/* Zoom focus rectangle */}
          <g transform="translate(960, 540)" opacity={Math.min(1, t * 0.5)}>
            <rect x={-60} y={-40} width="120" height="80" fill="none" stroke={PAL.amber} strokeWidth="2" strokeDasharray="8 4"/>
            <text textAnchor="middle" y="-50" fill={PAL.amber} fontSize="20" fontFamily="Prompt" fontWeight="700">EEC</text>
          </g>
        </g>
      )}
      {phase === 2 && (
        <g opacity={eecOpacity}>
          <EECMap cx={960} cy={540} scale={eecScale} t={t - 3.5} showPartners={false}/>
        </g>
      )}
      <g transform={`translate(960, 940)`}>
        <g opacity={captionOpacity} transform={`translate(0, ${captionY})`}>
          <rect x="-280" y="-32" width="560" height="64" rx="32" fill={PAL.ink} stroke={PAL.green} strokeWidth="1.5" opacity="0.85"/>
          <text textAnchor="middle" y="8" fill={PAL.white} fontSize="26" fontFamily="Prompt" fontWeight="600">
            ใจกลางเขตพัฒนาพิเศษภาคตะวันออก (EEC)
          </text>
        </g>
      </g>
    </g>
  );
}

// ── Scene 3: 16 majors showcase ─────────────────────────────
function Scene3_Trades() {
  return (
    <Sprite start={14.5} end={29}>
      <Scene3Body/>
    </Sprite>
  );
}
function Scene3Body() {
  const t = useTime() - 14.5;
  const dur = 14.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  // Trade icons stagger in
  const positions = [
    { x: 480,  y: 460 },
    { x: 760,  y: 380 },
    { x: 1040, y: 380 },
    { x: 1320, y: 460 },
    { x: 760,  y: 680 },
    { x: 1160, y: 680 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={useTime()} opacity={0.4}/>
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
            <Comp x={0} y={0} size={220} t={useTime()}/>
            <text textAnchor="middle" y={130} fill={PAL.white} fontSize="24" fontFamily="Prompt" fontWeight="700">{name}</text>
          </g>
        );
      })}
      {/* Bottom caption */}
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
      <Scene4Body/>
    </Sprite>
  );
}
function Scene4Body() {
  const t = useTime() - 28.5;
  const dur = 11.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;
  const captionOpacity = Easing.easeOutCubic(Math.min(1, t * 1.5));

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={useTime()} opacity={0.3}/>
      <g transform="translate(960, 180)" opacity={captionOpacity}>
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          INDUSTRY PARTNERSHIPS
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="64" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          ทวิภาคีกับองค์กรชั้นนำ
        </text>
      </g>
      <EECMap cx={960} cy={620} scale={1.4} t={t} showPartners/>
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
      <Scene5Body/>
    </Sprite>
  );
}
function Scene5Body() {
  const t = useTime() - 39.5;
  const dur = 10.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const fadeOut = t > dur - 1 ? Math.max(0, 1 - (t - (dur - 1)) * 1.5) : 1;

  const counters = [
    { x: 360,  y: 540, target: 30,    suffix: '+',  label: 'ปีแห่งประสบการณ์', delay: 0   },
    { x: 760,  y: 540, target: 16,    suffix: '',   label: 'สาขาวิชา',         delay: 0.4 },
    { x: 1160, y: 540, target: 12000, suffix: '+',  label: 'ศิษย์เก่า',         delay: 0.8 },
    { x: 1560, y: 540, target: 100,   suffix: '%',  label: 'อัตรามีงานทำ',     delay: 1.2 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={useTime()} opacity={0.3}/>
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
            <Counter x={c.x} y={c.y} target={c.target} suffix={c.suffix} label={c.label} progress={progress} fontSize={120}/>
          </g>
        );
      })}
      {/* Caption */}
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
      <Scene6Body/>
    </Sprite>
  );
}
function Scene6Body() {
  const t = useTime() - 49.5;
  const dur = 5.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 2));
  const fadeOut = t > dur - 0.7 ? Math.max(0, 1 - (t - (dur - 0.7)) * 2) : 1;

  const pillars = [
    { num: '01', title: 'เปี่ยมคุณธรรม',     subtitle: 'มีจริยธรรมและค่านิยมที่ดี', delay: 0   },
    { num: '02', title: 'มุ่งสร้างคนดี',     subtitle: 'ทั้งต่อตนเองและสังคม',     delay: 0.3 },
    { num: '03', title: 'มีระเบียบวินัย',    subtitle: 'แบบแผนการปฏิบัติตน',       delay: 0.6 },
    { num: '04', title: 'ก้าวไกลเทคโนโลยี',  subtitle: 'พัฒนาทันยุคทันสมัย',       delay: 0.9 },
    { num: '05', title: 'ฝีมือเยี่ยม',       subtitle: 'ทักษะวิชาชีพระดับสูง',     delay: 1.2 },
  ];

  return (
    <g opacity={fadeIn * fadeOut}>
      <BgMesh t={useTime()} opacity={0.3}/>
      <g transform="translate(960, 200)">
        <text textAnchor="middle" fill={PAL.greenLight} fontSize="22" fontFamily="Prompt" fontWeight="600" style={{ letterSpacing: '0.12em' }}>
          PHILOSOPHY · ปรัชญาวิทยาลัย
        </text>
        <text textAnchor="middle" y="56" fill={PAL.white} fontSize="56" fontFamily="Prompt" fontWeight="800" style={{ letterSpacing: '-0.025em' }}>
          เปี่ยมคุณธรรม มุ่งสร้างคนดี
        </text>
      </g>
      {pillars.map((p, i) => {
        const x = 360 + i * 312;
        return <PhilosophyPillar key={i} x={x} y={620} num={p.num} title={p.title} subtitle={p.subtitle} delay={p.delay} t={t}/>;
      })}
    </g>
  );
}

// ── Scene 7: CTA outro ──────────────────────────────────────
function Scene7_CTA() {
  return (
    <Sprite start={54.5} end={60}>
      <Scene7Body/>
    </Sprite>
  );
}
function Scene7Body() {
  const t = useTime() - 54.5;
  const dur = 5.5;
  const fadeIn = Easing.easeOutCubic(Math.min(1, t * 1.5));
  const crestScale = animate({ from: 0.6, to: 1, start: 0, end: 1.5, ease: Easing.easeOutBack })(t);
  const titleOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 0.8) * 1.5)));
  const titleY = (1 - titleOpacity) * 30;
  const ctaOpacity = Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.8) * 1.5)));
  const ctaScale = 1 + Math.sin(t * 4) * 0.04 * Math.min(1, (t - 2) * 0.5);
  const ctaY = (1 - ctaOpacity) * 20;

  return (
    <g opacity={fadeIn}>
      <BgMesh t={useTime()} opacity={0.5}/>
      <g transform={`translate(960, 380) scale(${crestScale})`} style={{ transformOrigin: '0 0' }}>
        <AnimatedCrest x={0} y={0} size={280} progress={1}/>
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
        <rect x={-200} y={-32 + ctaY} width="400" height="76" rx="38" fill={PAL.green}/>
        <rect x={-200} y={-32 + ctaY} width="400" height="76" rx="38" fill="none" stroke={PAL.greenLight} strokeWidth="2"/>
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

// ── Scene markers (timeline reference) ──────────────────────
function SceneMarkers() {
  const t = useTime();
  // Update root data attr with current second
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) root.setAttribute('data-screen-label', `t=${t.toFixed(0)}s`);
  }, [Math.floor(t)]);
  return null;
}

Object.assign(window, {
  Camera, SceneMarkers,
  Scene1_Title, Scene2_Geo, Scene3_Trades, Scene4_Partners, Scene5_Stats, Scene6_Philosophy, Scene7_CTA,
});
