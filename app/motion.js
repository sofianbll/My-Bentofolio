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

/**
 * The hero entrance reveal may only run when motion is allowed at all.
 * Mirrors the CSS gating (prefers-reduced-motion + html.is-preview).
 */
export function shouldAnimateHero({ reducedMotion, isPreview }) {
  return !reducedMotion && !isPreview;
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

/* ─── Route transitions (T04, ADR-0001) ─── */

/**
 * Pure decision: does this route change get a View Transition or an
 * instant swap? Only 'full' mode with native support may transition.
 * @returns {'transition'|'instant'}
 */
export function planRouteTransition({ mode, hasViewTransition }) {
  return mode === 'full' && hasViewTransition ? 'transition' : 'instant';
}

/**
 * Detects the motion mode against a live (or mocked) document.
 * Single source of truth shared by startRouteTransition and the app shell.
 * @returns {'full'|'reduced'|'off'}
 */
export function detectMotionMode(root) {
  return resolveMotionMode({
    isPreviewFrame: root?.documentElement?.classList?.contains('is-preview') ?? false,
    reducedMotion: typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    viewTransitionsSupported: typeof root?.startViewTransition === 'function',
  });
}

/**
 * Runs `commit` (the actual DOM/route swap) inside a View Transition
 * when the resolved mode allows it, otherwise runs it instantly.
 * Robust: if startViewTransition throws, commit still runs so navigation
 * can never be blocked by the animation layer.
 * @returns {'full'|'reduced'|'off'} the resolved motion mode
 */
export function startRouteTransition(documentRef, commit) {
  const root = documentRef || (typeof document !== 'undefined' ? document : null);
  const mode = detectMotionMode(root);
  if (planRouteTransition({ mode, hasViewTransition: typeof root?.startViewTransition === 'function' }) === 'transition') {
    try {
      root.startViewTransition(commit);
      return mode;
    } catch (error) {
      // VT failed to start: fall through to an instant commit.
    }
  }
  commit();
  return mode;
}
