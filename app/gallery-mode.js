/* =============================================
   BENTOFOLIO — Projects gallery mode (T03)
   Pure resolution + safe persistence of the
   Stories / Index display mode. Unit-tested.
   ============================================= */

export const GALLERY_MODE_KEY = 'bentofolio:projects-view'

export const GALLERY_MODES = ['stories', 'index']

/**
 * Resolves the display mode from a raw stored value.
 * Anything unknown or corrupted falls back to 'stories' (the default).
 * @param {unknown} storedValue
 * @returns {'stories'|'index'}
 */
export function resolveGalleryMode(storedValue) {
  return storedValue === 'index' ? 'index' : 'stories'
}

/**
 * Reads the persisted mode from a Storage-like object without ever throwing
 * (storage can be unavailable in sandboxed previews or private browsing).
 * @param {Storage|null|undefined} storage
 * @param {string} [key]
 * @returns {'stories'|'index'}
 */
export function readStoredGalleryMode(storage, key = GALLERY_MODE_KEY) {
  try {
    return resolveGalleryMode(storage?.getItem?.(key))
  } catch {
    return 'stories'
  }
}

/**
 * Persists the mode, silently ignoring storage failures.
 * @param {Storage|null|undefined} storage
 * @param {unknown} mode
 * @param {string} [key]
 */
export function persistGalleryMode(storage, mode, key = GALLERY_MODE_KEY) {
  try {
    storage?.setItem?.(key, resolveGalleryMode(mode))
  } catch {
    // Persistence is best-effort; the toggle still works in-memory.
  }
}
