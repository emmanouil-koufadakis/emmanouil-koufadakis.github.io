/**
 * TV-style focus for rails.
 * - Each [data-rail] gets a roving tabindex: Tab enters it once.
 * - ← → move along a rail, ↑ ↓ jump to the nearest card in the neighbouring rail.
 * - Home / End jump to the ends of a rail.
 * - Mouse users get prev/next buttons that page the rail.
 */

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemsOf = (rail: HTMLElement) => Array.from(rail.querySelectorAll<HTMLElement>('[data-rail-item]'));

function setActive(rail: HTMLElement, active: HTMLElement) {
  for (const item of itemsOf(rail)) item.tabIndex = item === active ? 0 : -1;
}

function focusItem(rail: HTMLElement, item: HTMLElement) {
  setActive(rail, item);
  item.focus({ preventScroll: true });
  item.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
}

function centreX(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.left + r.width / 2;
}

function nearestItem(rail: HTMLElement, x: number) {
  let best: HTMLElement | undefined;
  let bestDist = Infinity;
  for (const item of itemsOf(rail)) {
    const d = Math.abs(centreX(item) - x);
    if (d < bestDist) {
      bestDist = d;
      best = item;
    }
  }
  return best;
}

function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const current = (event.target as HTMLElement).closest<HTMLElement>('[data-rail-item]');
  const rail = current?.closest<HTMLElement>('[data-rail]');
  if (!current || !rail) return;

  const items = itemsOf(rail);
  const index = items.indexOf(current);
  let target: HTMLElement | undefined;
  let targetRail = rail;

  switch (event.key) {
    case 'ArrowRight':
      target = items[index + 1];
      break;
    case 'ArrowLeft':
      target = items[index - 1];
      break;
    case 'Home':
      target = items[0];
      break;
    case 'End':
      target = items[items.length - 1];
      break;
    case 'ArrowUp':
    case 'ArrowDown': {
      const rails = Array.from(document.querySelectorAll<HTMLElement>('[data-rail]'));
      const next = rails[rails.indexOf(rail) + (event.key === 'ArrowDown' ? 1 : -1)];
      if (!next) return; // no rail there: let the page scroll normally
      targetRail = next;
      target = nearestItem(next, centreX(current));
      break;
    }
    default:
      return;
  }

  event.preventDefault();
  if (target) focusItem(targetRail, target);
}

function initRail(rail: HTMLElement) {
  const items = itemsOf(rail);
  if (items.length) setActive(rail, items[0]);

  rail.addEventListener('keydown', onKeydown);
  rail.addEventListener('focusin', (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-rail-item]');
    if (item) setActive(rail, item);
  });

  const body = rail.closest<HTMLElement>('[data-rail-body]');
  const prev = body?.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = body?.querySelector<HTMLButtonElement>('[data-rail-next]');
  if (!prev || !next) return;

  const page = (dir: 1 | -1) =>
    rail.scrollBy({ left: dir * rail.clientWidth * 0.85, behavior: reducedMotion() ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));

  let ticking = false;
  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    prev.hidden = rail.scrollLeft <= 4;
    next.hidden = rail.scrollLeft >= max - 4;
    ticking = false;
  };
  const schedule = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  rail.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(schedule).observe(rail);
  update();
}

export function initRails() {
  for (const rail of document.querySelectorAll<HTMLElement>('[data-rail]')) {
    if (rail.dataset.railReady) continue;
    rail.dataset.railReady = 'true';
    initRail(rail);
  }
}
