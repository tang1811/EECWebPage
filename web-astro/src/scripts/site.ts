// ─────────────────────────────────────────────────────────────
// Global site behaviors — vanilla-TS port of the client logic in
// web/app/components/chrome.tsx (RevealInit/useReveal, Nav, StickyCTA)
// and web/app/components/Analytics.tsx (delegated GA4 conversion clicks).
// Loaded once by src/layouts/Base.astro on every page.
//
// MPA notes:
// - NO SPA page_view logic — gtag('config', …) in Base.astro fires the
//   default page_view on every full page load.
// - Elements React mounted conditionally are rendered hidden
//   (style="display:none") by Nav.astro / StickyCTA.astro; toggling
//   display retriggers their CSS entry animations exactly like a React
//   mount did (mnav-in, mnav-scrim-in, fab-pop, teaser-pop).
// - Every element access is guarded: /admission pages render no chrome.
// ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID: string | undefined = import.meta.env.PUBLIC_GA_ID;

// Tiny GA4 event helper (verbatim behavior of web/lib/analytics.ts track()).
// No-op when gtag isn't loaded (dev / GA id unset).
function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

// ── Reveal-on-scroll (chrome.tsx useReveal / RevealInit) ─────
function initReveal(): void {
  const markIn = (el: Element) => {
    void (el as HTMLElement).offsetHeight; // force reflow so transition fires
    el.classList.add('in');
  };
  const observe = () => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!els.length) return;
    try {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              markIn(e.target);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => io.observe(el));
      // 200ms sweep fallback: mark anything near the viewport that the
      // observer hasn't fired for yet.
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 200) markIn(el);
        });
      }, 200);
    } catch {
      document.querySelectorAll('.reveal').forEach((el) => markIn(el));
    }
  };
  // Double-rAF so initial layout settles before observing.
  requestAnimationFrame(() => requestAnimationFrame(observe));
  // Passive scroll fallback (covers content added after init, e.g. islands).
  const scrollHandler = () => {
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) markIn(el);
    });
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
}

// ── Nav (chrome.tsx Nav) ─────────────────────────────────────
function initNav(): void {
  const header = document.querySelector<HTMLElement>('header.nav');
  if (!header) return; // admission pages render no nav

  // 'scrolled' shadow past 12px.
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Desktop dropdowns — generic over every li.nav-li-dd (courses mega menu +
  // student mini menu, per the SchoolWebV2 chrome). Hover intent: open
  // immediately, close 120ms after mouseleave; click toggles without
  // navigating the trigger link. Panels live inside their <li>, so hovering
  // a panel keeps its trigger zone hovered.
  const dds = Array.from(header.querySelectorAll<HTMLElement>('li.nav-li-dd'));
  const ddOpen = new Map<HTMLElement, boolean>();
  const renderDds = () => {
    let any = false;
    dds.forEach((li) => {
      const open = ddOpen.get(li) ?? false;
      if (open) any = true;
      const link = li.querySelector<HTMLElement>('a.nav-link');
      const dd = li.querySelector<HTMLElement>('.nav-dd, .nav-mini-dd');
      if (link) {
        link.classList.toggle('is-open', open);
        link.setAttribute('aria-expanded', String(open));
      }
      if (dd) dd.classList.toggle('open', open);
    });
    header.classList.toggle('nav-dd-open', any);
  };
  const closeAllDds = () => {
    dds.forEach((li) => ddOpen.set(li, false));
    renderDds();
  };
  dds.forEach((li) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    li.addEventListener('mouseenter', () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      dds.forEach((x) => ddOpen.set(x, x === li));
      renderDds();
    });
    li.addEventListener('mouseleave', () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        ddOpen.set(li, false);
        renderDds();
      }, 120);
    });
    const link = li.querySelector<HTMLAnchorElement>('a.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const wasOpen = ddOpen.get(li) ?? false;
        dds.forEach((x) => ddOpen.set(x, false));
        ddOpen.set(li, !wasOpen);
        renderDds();
      });
    }
  });

  // Click outside or Escape closes any open desktop dropdown.
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement | null)?.closest?.('li.nav-li-dd')) closeAllDds();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDds();
  });

  // Mobile drawer (React portaled it while open; here it's inline + hidden).
  // Nav.astro renders the scrim/drawer as siblings of <header>, not inside it,
  // so query them from the document rather than from `header`.
  const burger = header.querySelector<HTMLButtonElement>('.nav-burger');
  const scrim = document.querySelector<HTMLElement>('.mnav-scrim');
  const drawer = document.querySelector<HTMLElement>('.mnav-drawer');
  const setDrawer = (open: boolean) => {
    if (scrim) scrim.style.display = open ? '' : 'none';
    if (drawer) drawer.style.display = open ? '' : 'none';
  };
  if (burger) burger.addEventListener('click', () => setDrawer(true));
  if (scrim) scrim.addEventListener('click', () => setDrawer(false));
  const mnavClose = drawer ? drawer.querySelector<HTMLButtonElement>('.mnav-close') : null;
  if (mnavClose) mnavClose.addEventListener('click', () => setDrawer(false));

  // Drawer accordions (React state mobileCoursesOpen / mobileStudentOpen).
  // Only the student button mirrored its open state onto `.active`
  // (data-mnav="student"); the courses button's `.active` is route-based.
  if (drawer) {
    drawer.querySelectorAll<HTMLButtonElement>('.mnav-item-btn').forEach((btn) => {
      let open = false;
      const sub = btn.nextElementSibling as HTMLElement | null; // .mnav-sub
      const chev = btn.querySelector('.mnav-chev');
      btn.addEventListener('click', () => {
        open = !open;
        btn.setAttribute('aria-expanded', String(open));
        if (chev) chev.classList.toggle('open', open);
        if (sub) sub.style.display = open ? '' : 'none';
        if (btn.dataset.mnav === 'student') btn.classList.toggle('active', open);
      });
    });
  }
}

// ── Sticky contact bubble (chrome.tsx StickyCTA) ─────────────
function initStickyCta(): void {
  const root = document.querySelector<HTMLElement>('.sticky-bubble');
  if (!root) return; // admission pages render no chrome

  const stack = root.querySelector<HTMLElement>('.bubble-stack');
  const teaser = root.querySelector<HTMLElement>('.bubble-teaser');
  const teaserX = root.querySelector<HTMLButtonElement>('.bubble-teaser-x');
  const trigger = root.querySelector<HTMLButtonElement>('.bubble-trigger');
  const closeIcon = trigger
    ? trigger.querySelector<SVGElement>(':scope > svg:not(.bubble-chat-icon)')
    : null;
  const chatIcon = trigger ? trigger.querySelector<SVGElement>('.bubble-chat-icon') : null;
  const onlineDot = trigger ? trigger.querySelector<HTMLElement>('.bubble-online-dot') : null;

  let open = false;
  let teaserOpen = false;

  const render = () => {
    root.classList.toggle('open', open);
    if (stack) stack.style.display = open ? '' : 'none';
    if (teaser) teaser.style.display = !open && teaserOpen ? '' : 'none';
    if (trigger) {
      trigger.setAttribute('aria-label', open ? 'ปิดเมนูติดต่อ' : 'เปิดเมนูติดต่อ');
      trigger.setAttribute('aria-expanded', String(open));
    }
    if (closeIcon) closeIcon.style.display = open ? '' : 'none';
    if (chatIcon) chatIcon.style.display = open ? 'none' : '';
    if (onlineDot) onlineDot.style.display = open ? 'none' : '';
  };

  if (trigger) {
    trigger.addEventListener('click', () => {
      open = !open;
      teaserOpen = false;
      render();
    });
  }
  if (teaser) {
    teaser.addEventListener('click', () => {
      open = true;
      render();
    });
  }
  if (teaserX) {
    teaserX.addEventListener('click', (e) => {
      e.stopPropagation();
      teaserOpen = false;
      render();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      open = false;
      render();
    }
  });
  // Teaser auto-appears after 6s (render() keeps it hidden while open).
  setTimeout(() => {
    teaserOpen = true;
    render();
  }, 6000);
}

// ── Delegated GA4 conversion clicks (Analytics.tsx) ──────────
function initConversionTracking(): void {
  if (!GA_ID) return; // site works without GA
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        track('Click_to_Call', { phone: href.replace('tel:', '') });
      } else if (/line\.me|^line:|@eec/i.test(href)) {
        track('Click_LINE_OA', { link: href });
      } else if (/facebook\.com|messenger/i.test(href)) {
        track('Click_Messenger', { link: href });
      } else if (href === '/admission' || href.startsWith('/admission?')) {
        track('Click_Apply', { from: window.location.pathname });
      } else if (href.startsWith('mailto:')) {
        track('Click_Email', {});
      }
    },
    { capture: true }
  );
}

function init(): void {
  initReveal();
  initNav();
  initStickyCta();
  initConversionTracking();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
