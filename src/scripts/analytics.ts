/**
 * Named events for GoatCounter, on top of its automatic page views.
 * Every call is a no-op when stats are off (no site code) or the visitor blocks them.
 */

interface GoatCounter {
  count: (options: { path: string; title?: string; event?: boolean }) => void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

/** Count an event such as "download-cv". */
export function trackEvent(name: string, title = name) {
  try {
    window.goatcounter?.count?.({ path: name, title, event: true });
  } catch {
    // Stats must never break the page.
  }
}

/** One click listener for the actions worth knowing about while job hunting. */
export function initEventTracking() {
  document.addEventListener(
    'click',
    (event) => {
      const el = (event.target as Element | null)?.closest?.('a, button');
      if (!el) return;

      // Anything marked data-track="name" counts as that event, e.g. the "Book a call" button.
      const tracked = el.closest<HTMLElement>('[data-track]');
      if (tracked) {
        trackEvent(tracked.dataset.track!);
        return;
      }

      const opener = el.closest<HTMLElement>('[data-dialog-open]');
      if (opener) {
        trackEvent(`role/${opener.dataset.dialogOpen!.replace(/^dlg-/, '')}`, 'Role details opened');
        return;
      }
      if (!(el instanceof HTMLAnchorElement)) return;

      const href = el.getAttribute('href') ?? '';
      if (href.endsWith('.pdf')) trackEvent('download-cv', 'CV downloaded');
      else if (href.startsWith('mailto:')) trackEvent('email-click', 'Email link clicked');
      else if (href.includes('linkedin.com')) trackEvent('linkedin-click', 'LinkedIn link clicked');
    },
    { capture: true },
  );
}
