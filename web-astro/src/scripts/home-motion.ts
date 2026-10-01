// Standalone enhancement for /home-motion/. Native links work without JS.
const root = document.querySelector<HTMLElement>('.hm-page');

if (root) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = window.matchMedia('(min-width: 761px)');
  const toggle = root.querySelector<HTMLButtonElement>('.hm-motion-toggle');
  const hero = root.querySelector<HTMLElement>('.hm-hero');
  const orbit = [...root.querySelectorAll<HTMLElement>('[data-hm-parallax]')];
  const projectCards = [...root.querySelectorAll<HTMLElement>('[data-hm-project]')];
  const projectNumber = root.querySelector<HTMLElement>('[data-hm-project-number]');
  const progress = root.querySelector<HTMLElement>('.hm-project-progress');
  const campus = root.querySelector<HTMLElement>('.hm-campus');
  const ending = root.querySelector<HTMLElement>('.hm-ending');
  const endingPanel = root.querySelector<HTMLElement>('.hm-ending-panel');
  const nav = root.querySelector<HTMLElement>('.hm-nav');
  const endingViewport = window.matchMedia('(min-height: 620px)');
  const reveals = [...root.querySelectorAll<HTMLElement>('[data-hm-reveal]')];
  const counters = [...root.querySelectorAll<HTMLElement>('[data-hm-count]')];
  const counterFrames = new Map<HTMLElement, number>();
  const counted = new WeakSet<HTMLElement>();
  let paused = false;
  let frame = 0;
  let activeProject = -1;
  let endingProgress = 0;

  try { paused = sessionStorage.getItem('eec-home-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
  const motionAllowed = () => !paused && !reducedMotion.matches;
  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  function updateEndingMode() {
    const enabled = motionAllowed() && endingViewport.matches && !!ending && !!endingPanel;
    const changed = root!.classList.contains('hm-ending-motion') !== enabled;
    const keepBottom = changed && Math.abs(document.documentElement.scrollHeight - window.scrollY - window.innerHeight) <= 2;
    root!.classList.toggle('hm-ending-motion', enabled);
    if (!enabled) {
      root!.classList.remove('hm-end-active');
      endingProgress = 0;
    }
    if (keepBottom) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  }

  function finishCounters() {
    counterFrames.forEach((id, element) => {
      cancelAnimationFrame(id);
      element.textContent = element.dataset.hmCount || '';
    });
    counterFrames.clear();
  }

  function animateCounter(element: HTMLElement) {
    if (counted.has(element)) return;
    counted.add(element);
    const target = Number(element.dataset.hmCount);
    if (!motionAllowed() || !Number.isFinite(target)) return;
    // Keep the final number available to assistive technology during counting.
    const accessibleValue = document.createElement('span');
    accessibleValue.className = 'hm-sr-only';
    accessibleValue.textContent = String(target);
    element.setAttribute('aria-hidden', 'true');
    element.after(accessibleValue);
    const started = performance.now();
    function tick(now: number) {
      const fraction = Math.min((now - started) / 700, 1);
      element.textContent = String(Math.round(target * (1 - Math.pow(1 - fraction, 3))));
      if (fraction < 1 && motionAllowed()) {
        counterFrames.set(element, requestAnimationFrame(tick));
      } else {
        element.textContent = String(target);
        counterFrames.delete(element);
      }
    }
    counterFrames.set(element, requestAnimationFrame(tick));
  }

  function renderScroll() {
    frame = 0;
    const height = window.innerHeight;
    const canMove = motionAllowed() && desktopMotion.matches;
    const heroRect = hero?.getBoundingClientRect();
    const positions = projectCards.map((card) => card.getBoundingClientRect());
    const campusRect = campus?.getBoundingClientRect();
    const endingEnabled = root!.classList.contains('hm-ending-motion');
    const endingRect = endingEnabled ? ending?.getBoundingClientRect() : undefined;
    const panelRect = endingEnabled ? endingPanel?.getBoundingClientRect() : undefined;
    const navRect = endingEnabled ? nav?.getBoundingClientRect() : undefined;

    if (heroRect && heroRect.bottom > 0) {
      orbit.forEach((card) => {
        const offset = canMove ? Math.max(0, -heroRect.top) * Number(card.dataset.hmParallax) : 0;
        card.style.setProperty('--parallax-y', offset.toFixed(1) + 'px');
      });
    }
    let nextProject = 0;
    positions.forEach((rect, i) => {
      if (rect.top < height * .55) nextProject = i;
      if (rect.bottom > 0 && rect.top < height) {
        const amount = canMove ? Math.max(-16, Math.min(16, (rect.top - height * .25) * .025)) : 0;
        projectCards[i].style.setProperty('--project-photo-y', amount.toFixed(1) + 'px');
      }
    });
    if (nextProject !== activeProject) {
      activeProject = nextProject;
      if (projectNumber) projectNumber.textContent = String(nextProject + 1).padStart(2, '0');
      progress?.style.setProperty('--project-progress', String((nextProject + 1) / projectCards.length));
    }
    if (campusRect && campusRect.bottom > 0 && campusRect.top < height) {
      const amount = canMove ? Math.max(-25, Math.min(25, (campusRect.top - height * .2) * .035)) : 0;
      campus?.style.setProperty('--campus-y', amount.toFixed(1) + 'px');
    }
    if (endingRect && panelRect && navRect && endingPanel) {
      // Map ordinary document scrolling to a reversible nav-to-footer reveal.
      // No wheel/touch interception: End, Page Down and scrollbar dragging work.
      const nextProgress = clamp((height * .55 - endingRect.top) / Math.max(1, endingRect.height - height * .45));
      if (nextProgress === 0 && endingProgress === 0) return;
      const morph = nextProgress * nextProgress * (3 - 2 * nextProgress);
      const remaining = 1 - morph;
      const top = Math.max(0, navRect.top - panelRect.top) * remaining;
      const right = Math.max(0, panelRect.right - navRect.right) * remaining;
      const bottom = Math.max(0, panelRect.bottom - navRect.bottom) * remaining;
      const left = Math.max(0, navRect.left - panelRect.left) * remaining;
      const radius = (navRect.height / 2) * remaining + 24 * morph;
      const copy = clamp((nextProgress - .27) / .48);
      const footer = clamp((nextProgress - .68) / .32);
      endingProgress = nextProgress;
      endingPanel.style.setProperty('--end-clip', 'inset(' + [top, right, bottom, left].map((n) => n.toFixed(2) + 'px').join(' ') + ' round ' + radius.toFixed(2) + 'px)');
      endingPanel.style.setProperty('--end-opacity', nextProgress > 0 ? '1' : '0');
      endingPanel.style.setProperty('--end-copy-opacity', copy.toFixed(3));
      endingPanel.style.setProperty('--end-copy-y', ((1 - copy) * 35).toFixed(1) + 'px');
      endingPanel.style.setProperty('--end-footer-opacity', footer.toFixed(3));
      endingPanel.style.setProperty('--end-footer-y', ((1 - footer) * 20).toFixed(1) + 'px');
      endingPanel.style.setProperty('--end-photo-y', (remaining * 24).toFixed(1) + 'px');
      endingPanel.style.setProperty('--end-photo-scale', (1 + remaining * .12).toFixed(3));
      root!.classList.toggle('hm-end-active', nextProgress > 0);
    }
  }

  function scheduleScroll() {
    if (!frame) frame = requestAnimationFrame(renderScroll);
  }

  function updateMotion() {
    root!.classList.toggle('hm-motion-paused', paused);
    root!.classList.toggle('hm-reduced-motion', reducedMotion.matches);
    if (toggle) {
      // System reduced-motion takes precedence; no misleading playback control.
      toggle.hidden = reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      const symbol = toggle.querySelector('[data-hm-motion-symbol]');
      const label = toggle.querySelector('[data-hm-motion-label]');
      if (symbol) symbol.textContent = paused ? '▷' : 'Ⅱ';
      if (label) label.textContent = paused ? 'เปิดภาพเคลื่อนไหว' : 'หยุดภาพเคลื่อนไหว';
    }
    if (!motionAllowed()) {
      root!.classList.add('hm-hero-entered');
      finishCounters();
      reveals.forEach((element) => element.classList.add('hm-visible'));
    }
    updateEndingMode();
    scheduleScroll();
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add('hm-visible');
        element.querySelectorAll<HTMLElement>('[data-hm-count]').forEach(animateCounter);
        revealObserver.unobserve(element);
      });
    }, { threshold: .08, rootMargin: '0px 0px -28px 0px' });
    reveals.forEach((element) => revealObserver.observe(element));
    const heroObserver = new IntersectionObserver(([entry]) => {
      hero?.classList.toggle('hm-in-view', entry.isIntersecting);
    });
    if (hero) heroObserver.observe(hero);
    root.classList.add('hm-ready');
  } else {
    counters.forEach((element) => counted.add(element));
  }

  toggle?.addEventListener('click', () => {
    paused = !paused;
    try { sessionStorage.setItem('eec-home-motion-paused', String(paused)); } catch { /* Storage is optional. */ }
    updateMotion();
  });
  hero?.addEventListener('animationend', (event) => {
    if (event.animationName === 'hm-enter' && event.target === hero.querySelector('.hm-hero-content')?.lastElementChild) {
      root!.classList.add('hm-hero-entered');
    }
  });
  reducedMotion.addEventListener('change', updateMotion);
  endingViewport.addEventListener('change', () => {
    updateEndingMode();
    scheduleScroll();
  });
  desktopMotion.addEventListener('change', scheduleScroll);
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hero?.classList.remove('hm-in-view');
      finishCounters();
    } else {
      const rect = hero?.getBoundingClientRect();
      hero?.classList.toggle('hm-in-view', !!rect && rect.bottom > 0 && rect.top < innerHeight);
      scheduleScroll();
    }
  });

  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-hm-filter]')];
  const courseCards = [...root.querySelectorAll<HTMLElement>('[data-hm-course]')];
  const courseCount = root.querySelector<HTMLElement>('.hm-course-count');
  const filterGroup = root.querySelector<HTMLElement>('.hm-filters');
  function filterCourses(category: string, initial = false) {
    let shown = 0;
    const matching = courseCards.filter((card) => category === 'ทั้งหมด' || card.dataset.hmCourse === category);
    courseCards.forEach((card) => {
      const visible = matching.includes(card) && shown < 6;
      card.hidden = !visible;
      if (visible) {
        shown++;
        if (!initial) card.classList.add('hm-visible');
      }
    });
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.hmFilter === category)));
    if (courseCount) courseCount.textContent = 'แสดง ' + shown + ' จาก ' + matching.length + ' หลักสูตร';
    scheduleScroll();
  }
  filters.forEach((button) => button.addEventListener('click', () => filterCourses(button.dataset.hmFilter || 'ทั้งหมด')));
  if (filterGroup) filterGroup.hidden = false;
  filterCourses('ทั้งหมด', true);

  const menu = root.querySelector<HTMLDetailsElement>('.hm-mobile-menu');
  // Tabbing into a footer link reveals the complete panel before painting.
  // The links remain in their natural document order and are never duplicated.
  ending?.addEventListener('focusin', () => {
    if (root!.classList.contains('hm-ending-motion') && endingProgress < .999) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      if (frame) cancelAnimationFrame(frame);
      renderScroll();
    }
  });
  root.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a');
    if (link && menu?.contains(link)) menu.open = false;
    if (!link || !link.hash || link.pathname !== location.pathname) return;
    const destination = document.getElementById(link.hash.slice(1));
    if (!destination) return;
    event.preventDefault();
    destination.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'instant', block: 'start' });
    // Move keyboard focus to the destination without introducing extra tab stops.
    if (!destination.hasAttribute('tabindex')) {
      destination.setAttribute('tabindex', '-1');
      destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
    }
    destination.focus({ preventScroll: true });
    history.replaceState(null, '', link.hash);
  });
  document.addEventListener('click', (event) => {
    if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });
  updateMotion();
}
