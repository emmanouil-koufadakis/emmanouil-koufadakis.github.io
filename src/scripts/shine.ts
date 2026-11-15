/**
 * A shine that travels through a group of cards, like a TV app's idle highlight:
 * one card at a time, in order, then back to the first card.
 *
 * Groups:
 * - Rails ([data-rail] with [data-rail-item] cards) are interactive. When a card
 *   is under the mouse, or has keyboard focus, the sequence pauses and only that
 *   card shines, on a loop (.is-spotlit). When the mouse and keyboard focus leave
 *   the cards, the sequence starts again from the first visible card.
 * - Other groups ([data-shine-sequence] with [data-shine-item] cards, e.g. the
 *   certificates) just loop, whatever the visitor does.
 *
 * Only cards currently visible in a rail take part, so the shine never vanishes
 * into the scrolled-off part of the list. A group only runs while it is on
 * screen, and nothing runs for visitors who prefer reduced motion.
 */

/** Keep in sync with the shine-sweep duration on .is-shining in global.css. */
const SWEEP_MS = 900;
const GAP_MS = 120;
/** Rest after the last card before starting again from the first. */
const LOOP_PAUSE_MS = 1600;
const START_DELAY_MS = 400;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

interface Options {
  itemSelector: string;
  /** Hover and keyboard focus pause the sequence and spotlight one card. */
  interactive: boolean;
}

function setupGroup(group: HTMLElement, { itemSelector, interactive }: Options) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let last: HTMLElement | undefined;
  let inView = false;
  let hovered: HTMLElement | undefined;
  let focused: HTMLElement | undefined;
  let spotlit: HTMLElement | undefined;

  const items = () => Array.from(group.querySelectorAll<HTMLElement>(itemSelector));

  // A card counts as visible when most of its width is inside the group's box
  // (the scroll area, for rails).
  const isVisible = (item: HTMLElement) => {
    const r = group.getBoundingClientRect();
    const e = item.getBoundingClientRect();
    return Math.min(r.right, e.right) - Math.max(r.left, e.left) >= e.width * 0.6;
  };

  const canRun = () => inView && !spotlit && !reducedMotion.matches;

  function stop() {
    clearTimeout(timer);
    timer = undefined;
    for (const el of group.querySelectorAll('.is-shining')) el.classList.remove('is-shining');
  }

  function step() {
    stop();
    if (!canRun()) return;
    const all = items();
    const after = last ? all.indexOf(last) : -1;
    const card = all.find((el, i) => i > after && isVisible(el));
    if (!card) {
      // End of the pass (or nothing visible): rest, then start from the first card.
      last = undefined;
      timer = setTimeout(step, LOOP_PAUSE_MS);
      return;
    }
    card.classList.add('is-shining');
    last = card;
    timer = setTimeout(step, SWEEP_MS + GAP_MS);
  }

  function restart() {
    stop();
    last = undefined;
    if (canRun()) timer = setTimeout(step, START_DELAY_MS);
  }

  /** Show the looping shine on one card only, or none (which resumes the sequence). */
  function setSpotlight(item: HTMLElement | undefined) {
    if (item === spotlit) return;
    spotlit?.classList.remove('is-spotlit');
    spotlit = item;
    if (item) {
      stop();
      item.classList.add('is-spotlit');
    } else {
      restart();
    }
  }

  if (interactive) {
    for (const item of items()) {
      item.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        hovered = item;
        setSpotlight(item);
      });
      item.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'touch' || hovered !== item) return;
        hovered = undefined;
        setSpotlight(focused);
      });
    }
    // Keyboard focus only: a mouse click also focuses a card, but that card
    // should not keep the rail paused once the mouse moves away.
    group.addEventListener('focusin', (event) => {
      const item = (event.target as Element).closest<HTMLElement>(itemSelector);
      focused = item && item.matches(':focus-visible') ? item : undefined;
      setSpotlight(focused ?? hovered);
    });
    group.addEventListener('focusout', (event) => {
      if (group.contains(event.relatedTarget as Node | null)) return;
      focused = undefined;
      setSpotlight(hovered);
    });
  }

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      restart();
    },
    { threshold: 0.2 },
  ).observe(group);

  reducedMotion.addEventListener('change', restart);
}

export function initShine() {
  const groups: [string, Options][] = [
    ['[data-rail]', { itemSelector: '[data-rail-item]', interactive: true }],
    ['[data-shine-sequence]', { itemSelector: '[data-shine-item]', interactive: false }],
  ];
  for (const [selector, options] of groups) {
    for (const group of document.querySelectorAll<HTMLElement>(selector)) {
      if (group.dataset.shine === 'on') continue;
      group.dataset.shine = 'on';
      setupGroup(group, options);
    }
  }
}
