// ─────────────────────────────────────────────────────────────
// Homepage App — composes sections + Tweaks panel
// ─────────────────────────────────────────────────────────────

const HOMEPAGE_DEFAULTS = /*EDITMODE-BEGIN*/{
  "animation": "full",
  "greenTone": "forest",
  "heroLayout": "slideshow",
  "cardStyle": "lift",
  "bgMode": "classic"
}/*EDITMODE-END*/;

// Apply theme on mount + every change
function applyTheme(t) {
  const root = document.documentElement;
  // animation multiplier
  const mult = t.animation === 'off' ? 0 : t.animation === 'subtle' ? 0.55 : 1;
  root.style.setProperty('--anim-mult', mult);

  // green tone palette
  const palettes = {
    forest: {
      g900: '#01231c', g800: '#013d33', g700: '#026451', g600: '#048269',
      g500: '#0aa183', g400: '#38c0a3', g300: '#7adac4', g200: '#b8ebde', g100: '#def5ee', g50: '#eef7f2',
      glow: 'rgba(2,100,81,0.35)', glow2: 'rgba(10,161,131,0.55)',
    },
    emerald: {
      g900: '#064e3b', g800: '#065f46', g700: '#047857', g600: '#059669',
      g500: '#10b981', g400: '#34d399', g300: '#6ee7b7', g200: '#a7f3d0', g100: '#d1fae5', g50: '#ecfdf5',
      glow: 'rgba(4,120,87,0.35)', glow2: 'rgba(16,185,129,0.55)',
    },
    fresh: {
      g900: '#14532d', g800: '#166534', g700: '#15803d', g600: '#16a34a',
      g500: '#22c55e', g400: '#4ade80', g300: '#86efac', g200: '#bbf7d0', g100: '#dcfce7', g50: '#f0fdf4',
      glow: 'rgba(21,128,61,0.35)', glow2: 'rgba(34,197,94,0.55)',
    },
    lime: {
      g900: '#365314', g800: '#3f6212', g700: '#4d7c0f', g600: '#65a30d',
      g500: '#84cc16', g400: '#a3e635', g300: '#bef264', g200: '#d9f99d', g100: '#ecfccb', g50: '#f7fee7',
      glow: 'rgba(77,124,15,0.35)', glow2: 'rgba(132,204,22,0.55)',
    },
    teal: {
      g900: '#134e4a', g800: '#115e59', g700: '#0f766e', g600: '#0d9488',
      g500: '#14b8a6', g400: '#2dd4bf', g300: '#5eead4', g200: '#99f6e4', g100: '#ccfbf1', g50: '#f0fdfa',
      glow: 'rgba(15,118,110,0.35)', glow2: 'rgba(20,184,166,0.55)',
    },
  };
  const p = palettes[t.greenTone] || palettes.forest;
  Object.entries(p).forEach(([k, v]) => {
    if (k.startsWith('g')) root.style.setProperty(`--green-${k.slice(1)}`, v);
    if (k === 'glow') root.style.setProperty('--green-glow', v);
    if (k === 'glow2') root.style.setProperty('--green-glow-strong', v);
  });
  root.style.setProperty('--grad-hero', `linear-gradient(135deg, ${p.g900} 0%, ${p.g700} 45%, ${p.g500} 100%)`);
  root.style.setProperty('--grad-mesh',
    `radial-gradient(at 20% 10%, ${p.g500}59 0px, transparent 50%),
     radial-gradient(at 90% 20%, ${p.g700}66 0px, transparent 55%),
     radial-gradient(at 60% 100%, ${p.g400}4D 0px, transparent 50%)`);
  root.style.setProperty('--grad-text', `linear-gradient(90deg, ${p.g700} 0%, ${p.g500} 100%)`);

  // Background mode (classic / cream — no white)
  const bgModes = {
    classic: { bg: '#ffffff',   alt: '#f3f3e9', surface: '#ffffff', dark: '#01231c' },
    cream:   { bg: '#f3f3e9',   alt: '#def5ee', surface: '#fffdf6', dark: '#01231c' },
  };
  const b = bgModes[t.bgMode] || bgModes.classic;
  root.style.setProperty('--bg', b.bg);
  root.style.setProperty('--bg-alt', b.alt);
  root.style.setProperty('--surface-card', b.surface);
  root.style.setProperty('--bg-dark', b.dark);
}

function HomepageApp() {
  const [t, setTweak] = useTweaks(HOMEPAGE_DEFAULTS);
  useReveal();
  useEffect(() => { applyTheme(t); }, [t]);

  return (
    <>
      <Nav active="home"/>
      <main>
        <Hero layout={t.heroLayout}/>
        <Highlights/>
        <StatsBar/>
        <Courses cardStyle={t.cardStyle}/>
        <About/>
        <PortfolioPreview/>
        <Testimonials/>
        <FAQ/>
        <CTABanner/>
      </main>
      <Footer/>
      <StickyCTA/>

      <TweaksPanel title="Tweaks · ปรับแต่งดีไซน์">
        <TweakSection label="ANIMATION">
          <TweakRadio
            label="ความเข้มข้น"
            value={t.animation}
            options={[
              { value: 'off', label: 'ปิด' },
              { value: 'subtle', label: 'น้อย' },
              { value: 'full', label: 'เต็ม' },
            ]}
            onChange={(v) => setTweak('animation', v)}
          />
        </TweakSection>

        <TweakSection label="BACKGROUND">
          <TweakRadio
            label="โหมดพื้นหลัง"
            value={t.bgMode}
            options={[
              { value: 'classic', label: 'ขาว' },
              { value: 'cream',   label: 'ครีม' },
            ]}
            onChange={(v) => setTweak('bgMode', v)}
          />
        </TweakSection>

        <TweakSection label="โทนสีเขียว">
          <TweakSelect
            label="พาเลตต์"
            value={t.greenTone}
            options={[
              { value: 'forest',  label: 'Forest (เริ่มต้น)' },
              { value: 'emerald', label: 'Emerald' },
              { value: 'fresh',   label: 'Fresh' },
              { value: 'lime',    label: 'Lime' },
              { value: 'teal',    label: 'Teal' },
            ]}
            onChange={(v) => setTweak('greenTone', v)}
          />
        </TweakSection>

        <TweakSection label="HERO LAYOUT">
          <TweakSelect
            label="แบบ Hero"
            value={t.heroLayout}
            options={[
              { value: 'parallax',  label: '1 · Parallax + Crest (เริ่มต้น)' },
              { value: 'video',     label: '2 · Video Highlight (วนลูป)' },
              { value: 'slideshow', label: '3 · Slideshow (สไลด์รูป)' },
              { value: 'split',     label: '4 · Split · ซ้าย-ขวา' },
              { value: 'spotlight', label: '5 · Spotlight · ดาร์ก' },
              { value: 'minimal',   label: '6 · Minimal · เรียบ' },
            ]}
            onChange={(v) => setTweak('heroLayout', v)}
          />
        </TweakSection>

        <TweakSection label="CARD หลักสูตร">
          <TweakSelect
            label="สไตล์การ์ด"
            value={t.cardStyle}
            options={[
              { value: 'lift',     label: 'Lift (เริ่มต้น)' },
              { value: 'flip',     label: 'Flip 3D' },
              { value: 'outline',  label: 'Outline + Pill' },
              { value: 'gradient', label: 'Gradient เต็มใบ' },
            ]}
            onChange={(v) => setTweak('cardStyle', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<HomepageApp/>);
