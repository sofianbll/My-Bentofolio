/* =============================================
   BENTOFOLIO v5 — Motion runtime (ADR-0001)
   Pure scroll-direction logic + Lenis wiring.
   Runtime is OFF in admin preview and under
   prefers-reduced-motion. See docs/adr/0001.
   ============================================= */

/* ─── Pure logic (unit-tested) ─── */

/**
 * Reduces a scroll sample to a stable direction.
 * Only a delta beyond `threshold` flips the direction;
 * tiny deltas keep the previous one to avoid nav jitter.
 * @returns {{ dir: 'up'|'down', y: number }}
 */
export function reduceScrollDirection({ lastY, currentY, lastDir }, threshold = 4) {
  const delta = currentY - lastY;
  let dir = lastDir === 'down' ? 'down' : 'up';
  if (delta > threshold) dir = 'down';
  else if (delta < -threshold) dir = 'up';
  return { dir, y: currentY };
}

/**
 * The nav pill hides only when scrolling down past the page top.
 */
export function shouldHideNav(dir, scrollY, minScroll = 96) {
  return dir === 'down' && scrollY > minScroll;
}

/**
 * Resolves how much motion the runtime may use.
 * 'full'   → smooth scroll + view transitions
 * 'reduced'→ smooth scroll only (no view transitions support)
 * 'off'    → nothing (admin preview frame or reduced motion)
 */
export function resolveMotionMode({ isPreviewFrame, reducedMotion, viewTransitionsSupported }) {
  if (isPreviewFrame || reducedMotion) return 'off';
  return viewTransitionsSupported ? 'full' : 'reduced';
}

/* ─── Runtime wiring ─── */

/**
 * Initialises Lenis smooth scroll. Lenis is imported lazily so
 * this module stays importable in unit tests (no window at module scope).
 * @returns {Function} destroy function
 */
export function initSmoothScroll() {
  let lenis = null;
  let destroyed = false;
  import('lenis').then(({ default: Lenis }) => {
    if (destroyed) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
  }).catch(() => {
    // Smooth scroll is a progressive enhancement; never block the page.
  });
  return () => {
    destroyed = true;
    if (lenis) { lenis.destroy(); lenis = null; }
  };
}

/**
 * Stub route transition (Ticket 04 wires real morphing).
 * Gated through resolveMotionMode so T04 only swaps the commit wrapper.
 * @returns {'full'|'reduced'|'off'} the resolved motion mode
 */
export function startRouteTransition(documentRef, commit) {
  const root = documentRef || (typeof document !== 'undefined' ? document : null);
  const mode = resolveMotionMode({
    isPreviewFrame: root?.documentElement?.classList?.contains('is-preview') ?? false,
    reducedMotion: typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    viewTransitionsSupported: typeof root?.startViewTransition === 'function',
  });
  // T04: when mode === 'full', wrap commit in root.startViewTransition().
  commit();
  return mode;
}
