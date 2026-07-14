// ─────────────────────────────────────────────────────────────
// chrome-lite — Icon + Reveal + useReveal extracted VERBATIM from
// web/app/components/chrome.tsx (Next.js). No next/* imports.
// Nav/Footer/StickyCTA live in .astro components instead.
// ─────────────────────────────────────────────────────────────

import { useEffect, type ReactNode, type CSSProperties } from 'react';

// ── Icon set (inline SVG, currentColor) ─────────────────────
export const Icon = ({
  name,
  className = '',
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) => {
  const paths: Record<string, ReactNode> = {
    arrow:        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    arrowDown:    <path d="M12 5v14M5 13l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    play:         <path d="M8 5v14l11-7z" fill="currentColor"/>,
    check:        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    star:         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>,
    quote:        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" fill="currentColor"/>,
    phone:        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    mail:         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4l8 5 8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    pin:          <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    facebook:     <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="currentColor"/>,
    youtube:      <path d="M23 7s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C17.1 3.5 12 3.5 12 3.5s-5.1 0-8.1.3c-.4.1-1.3.1-2.1 1C1.2 5.5 1 7 1 7S.8 8.8.8 10.6v1.8C.8 14.2 1 16 1 16s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.8.3 7.8.3s5.1 0 8.1-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.8.2-3.6v-1.8C23.2 8.8 23 7 23 7zM9.7 14.3V8.4l6.4 3-6.4 2.9z" fill="currentColor"/>,
    line:         <path d="M12 2C6.5 2 2 5.6 2 10c0 3.9 3.6 7.2 8.4 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.8c0 .3-.2 1 .9.5s5.7-3.4 7.8-5.8c1.5-1.6 2.1-3.3 2.1-4.9C22 5.6 17.5 2 12 2z" fill="currentColor"/>,
    menu:         <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    close:        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    chevronDown:  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    chevronRight: <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    plus:         <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    minus:        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    gear:         <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    bolt:         <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>,
    car:          <><path d="M5 17h14M5 17v-5l2-5h10l2 5v5M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M15 17v2a1 1 0 001 1h2a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></>,
    chip:         <><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    palette:      <><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/><path d="M12 2a10 10 0 100 20c.5 0 1-.4 1-1 0-.3-.1-.5-.3-.7-.2-.2-.3-.4-.3-.7 0-.5.4-1 1-1H15a5 5 0 005-5c0-5.5-4.5-10-10-10z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    cart:         <path d="M9 22a1 1 0 100-2 1 1 0 000 2zm11-2a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    robot:        <><rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M12 4v4M9 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    chart:        <path d="M3 3v18h18M7 14l4-4 4 4 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    network:      <><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 7v4M12 11l-5.5 6M12 11l5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    truck:        <><path d="M1 16V4h14v12M15 8h4l3 4v4h-7M5 20a2 2 0 100-4 2 2 0 000 4zM17 20a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
    sparkle:      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2zM18 4l.9 2.1L21 7l-2.1.9L18 10l-.9-2.1L15 7l2.1-.9L18 4z" fill="currentColor"/>,
    shield:       <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>,
    book:         <path d="M4 4h7a4 4 0 014 4v12a3 3 0 00-3-3H4V4zm16 0h-7a4 4 0 00-4 4v12a3 3 0 013-3h8V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>,
    users:        <><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 4a3 3 0 010 6M19 20c0-2-1.5-3.5-3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
    award:        <><circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8.2 14L6 22l6-3 6 3-2.2-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" fill="none"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ── Reveal-on-scroll hook ───────────────────────────────────
export function useReveal() {
  useEffect(() => {
    const markIn = (el: Element) => {
      void (el as HTMLElement).offsetHeight; // force reflow so transition fires
      el.classList.add('in');
    };
    const observe = () => {
      const els = document.querySelectorAll('.reveal:not(.in)');
      if (!els.length) return;
      try {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              markIn(e.target);
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        els.forEach((el) => io.observe(el));
        setTimeout(() => {
          document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight + 200) markIn(el);
          });
        }, 200);
        return () => io.disconnect();
      } catch {
        document.querySelectorAll('.reveal').forEach((el) => markIn(el));
      }
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(observe));
    const scrollHandler = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 40 && r.bottom > 0) markIn(el);
      });
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);
}

// ── Reveal wrapper ──────────────────────────────────────────
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  dir = 'up',
  className = '',
  style,
  ...rest
}: {
  children?: ReactNode;
  as?: React.ElementType;
  delay?: number;
  dir?: 'up' | 'left' | 'right' | 'scale';
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  const dirClass = dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : dir === 'scale' ? 'reveal-scale' : '';
  return (
    <Tag className={`reveal ${dirClass} ${className}`} style={{ ...style, '--reveal-delay': `${delay}s` }} {...rest}>
      {children}
    </Tag>
  );
}
