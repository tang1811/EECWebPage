# EEC Next.js → Astro Migration Spec (agent contract)

Old app: `C:/Users/T/Desktop/EECWebPage/web` (Next.js 16 App Router).
New app: `C:/Users/T/Desktop/EECWebPage/web-astro` (Astro 7, static output, React islands).
Goal: EXACT visual/SEO parity, near-zero client JS on content pages.

## Hard rules
1. **Markup parity**: keep every className, id, DOM structure, Thai text, `<img>` attrs (src/alt/loading/decoding), aria-*, and inline style EXACTLY as the old component renders them. CSS is copied verbatim and selects on those classes.
2. **Never edit anything under `web/`** (the old app stays untouched as reference).
3. **Never edit** `src/styles/*.css` (verbatim copies), `src/config.ts`, `src/layouts/Base.astro`, `astro.config.mjs`.
4. All SITE_URL usage comes from `src/config.ts` — never hardcode `https://eec.example`.
5. localStorage keys stay verbatim: `eec_admission_state_v1`, `eec_portal_state_v1`, `eec_portal_auth_v1`.
6. If a `[Fact-Forcing Gate]` hook denies your Write/Edit: reply in plain text with (a) which file imports/calls the new file, (b) confirmation no existing file serves the purpose, (c) data shape if any, (d) the user's verbatim instruction: `ตอนนี้ยังไม่สามารถ ทำเรื่อง domain ได้ แต่สามารถ migrate ไป astro ได้เลย` — then retry the IDENTICAL operation (first attempt is always denied, retry passes).

## Directory map
```
src/config.ts                     site constants (SITE_URL, SITE_NAME, DEFAULT_*, ORG_JSONLD, GA_ID)
src/layouts/Base.astro            THE layout (head/meta/OG/fonts/JSON-LD/GA + Nav/Footer/StickyCTA + site.ts)
src/components/Nav.astro          site header (from chrome.tsx Nav)
src/components/Footer.astro       footer (from chrome.tsx Footer)
src/components/StickyCTA.astro    floating contact FAB (from chrome.tsx StickyCTA)
src/components/react/chrome-lite.tsx   Icon + Reveal + useReveal extracted verbatim (NO next imports)
src/components/react/AboutBody.tsx      island (copy)
src/components/react/CourseDetailBody.tsx island (copy, fixed imports)
src/components/react/VideoBody.tsx      island (copy)
src/components/react/admission/{AdmissionApp,admission-flow,admission-data}.tsx
src/components/react/admission/portal/{PortalApp,portal-pages}.tsx
src/lib/analytics.ts              track() + GA_ID (import.meta.env.PUBLIC_GA_ID)
src/lib/admission/db.ts           Supabase data layer (PUBLIC_* env)
src/lib/supabase/client.ts        createBrowserClient (PUBLIC_* env)
src/data/course-data.ts           COURSES, COURSE_SLUGS, getCourse, getCourseDetail (+types)
src/data/news-data.ts             NEWS, NEWS_SLUGS, getNews
src/data/faq-data.ts              FAQS
src/scripts/site.ts               global vanilla JS: reveal + nav + sticky CTA + GA click conversions
src/styles/*.css                  13 verbatim CSS copies (globals, styles, mobile, homepage, subpages, money, news, tuition, personnel, portal, admission, about-cinematic, course-detail-cinematic)
src/pages/…                       one .astro per route + sitemap.xml.ts + robots.txt.ts
```

## Base.astro contract (already written — read it before use)
```astro
---
import Base from '../layouts/Base.astro';
import '../styles/homepage.css';   // page CSS: import in frontmatter, same set as old page.tsx
---
<Base
  title="ติดต่อเรา"                 {/* short; layout appends ' · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง'. OMIT on homepage */}
  description="…"
  path="/contact"                  {/* NO trailing slash; '' for homepage */}
  keywords={['a','b']}             {/* only if old page had keywords */}
  og={{ title, description, image, type: 'article' }}  {/* ONLY if old page overrode openGraph.
        Course pages: og.title INCLUDES the ' · วิทยาลัย…' suffix, NO type field.
        News pages: og.title is the bare article title, type: 'article'. */}
  chrome={false}                   {/* ONLY /admission and /admission/portal */}
  mono600                          {/* ONLY /about and /video */}
>
  <main>…page content…</main>
</Base>
```
Head extras (e.g. homepage LCP preload) go in `<Fragment slot="head">…</Fragment>`.

## JSON-LD
```astro
<script type="application/ld+json" is:inline set:html={JSON.stringify(OBJ)} />
```
Place at the same position as the old page (inside the page content, not the layout). Build OBJ in frontmatter, importing SITE_URL from config. Replicate every field of the old JSON-LD blocks byte-for-byte.

## JSX → Astro translation gotchas
- `className` → `class`; `htmlFor` → `for`; drop `key`.
- SVG attrs in .astro are REAL HTML: `strokeWidth` → `stroke-width`, `strokeLinecap` → `stroke-linecap`, `fillRule` → `fill-rule`, `clipRule` → `clip-rule`. `viewBox` stays `viewBox`.
- `dangerouslySetInnerHTML={{__html: x}}` → `set:html={x}`.
- `style={{gridColumn:'1 / -1'}}` → `style="grid-column: 1 / -1"` (string form only). CSS vars: `style={`--reveal-delay:${d}s`}`.
- Astro 7 compiler is strict: close EVERY non-void tag; no unclosed `<li>`/`<p>`.
- Do NOT use `onClick=` etc. in .astro — interactivity lives in `<script>` tags (vanilla).
- Conditional render: `{cond && <div/>}` — beware `{arr.length && …}` renders literal `0`; use `arr.length > 0 &&`.
- React components can render STATICALLY inside .astro (no client JS): `import { Icon } from '../components/react/chrome-lite'` then `<Icon name="phone" />` — allowed and encouraged for exact SVG parity. Add a `client:*` directive ONLY for the designated islands.
- `<Reveal dir="up" delay={0.1}>` from old code → replicate its OUTPUT: read chrome-lite.tsx Reveal and emit the same element/class/style directly, or statically render `<Reveal>` from chrome-lite. Either is fine; markup must match.

## Page scripts (vanilla JS conversions)
Per-page interactivity goes in a `<script>` tag at the end of the page's .astro file (Astro bundles it, type=module, runs after DOM parse). Replicate the ORIGINAL behavior exactly (read the old component: timings, thresholds, class names toggled, keyboard keys, scroll-lock). Query elements by the same classes/ids as the old markup; add `data-*` attributes where the old code used React state (e.g. `data-cat` for filters).
Lightboxes (tuition/news/course-gallery/portfolio): implement per page in its own script — open overlay, prev/next, ArrowLeft/ArrowRight/Escape, `document.body.style.overflow` lock, counter — matching the old component's exact overlay markup and classes.

## React islands (the ONLY hydrated components)
| Page | Component | Directive |
|---|---|---|
| /admission | `<AdmissionApp client:load />` | SSR-safe by design (localStorage in effects) |
| /admission/portal | `<PortalApp client:only="react" />` | reads localStorage during render |
| /video | `<VideoBody client:load />` | animation engine |
| /about | `<AboutBody client:load />` | scroll-cinematic |
| /courses/[slug] | `<CourseDetailBody client:load course={course} />` | scroll-cinematic (check its actual props in old page.tsx) |

## Env vars
`process.env.NEXT_PUBLIC_X` → `import.meta.env.PUBLIC_X` (files: lib/admission/db.ts, lib/supabase/client.ts, lib/analytics.ts). Same build-time inlining semantics. Do NOT port SUPABASE_SERVICE_ROLE_KEY / lib/supabase/server.ts / middleware.ts (dead code).

## Data imports
- `src/data/*` for course/news/faq data.
- JSON manifests stay in `public/` and are imported by RELATIVE path from source files (Vite supports it), e.g. from `src/pages/courses/[slug].astro`: `import VIDEOS from '../../../public/assets/courses/videos/videos.json'`.
- PARITY TRAP: `/courses` page body (CoursesBody) has its OWN inline COURSES + PT arrays — copy those inline arrays into the new courses page; do NOT substitute src/data/course-data.ts there. course-data.ts is used on /courses only for the ItemList JSON-LD (as in the old page.tsx).

## Verification expectations per page agent
After writing your page, run ONLY `npx astro check 2>&1 | tail -20` if you need type feedback — do NOT run `astro build` (a central build runs after all agents finish). Report: files created, old→new mapping notes, any deliberate deviation (should be none).
