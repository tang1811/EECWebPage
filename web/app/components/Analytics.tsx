'use client';

// GA4 loader + SPA pageviews + delegated conversion-event tracking.
// Loads only when NEXT_PUBLIC_GA_ID is set (so the site works without it).
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_ID, track } from '../../lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  // SPA page_view on route change
  useEffect(() => {
    if (GA_ID && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: pathname });
    }
  }, [pathname]);

  // Delegated conversion tracking — works across every link on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
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
        track('Click_Apply', { from: pathname });
      } else if (href.startsWith('mailto:')) {
        track('Click_Email', {});
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions);
  }, [pathname]);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
      </Script>
    </>
  );
}
