import { describe, expect, test } from 'bun:test'
import {
  GALLERY_MODE_KEY,
  GALLERY_MODES,
  resolveGalleryMode,
  readStoredGalleryMode,
  persistGalleryMode,
} from './gallery-mode.js'

describe('resolveGalleryMode', () => {
  test('valid stored values resolve to themselves', () => {
    expect(resolveGalleryMode('stories')).toBe('stories')
    expect(resolveGalleryMode('index')).toBe('index')
  })

  test('absent value falls back to stories (the default)', () => {
    expect(resolveGalleryMode(null)).toBe('stories')
    expect(resolveGalleryMode(undefined)).toBe('stories')
  })

  test('corrupted or unknown values fall back to stories', () => {
    expect(resolveGalleryMode('')).toBe('stories')
    expect(resolveGalleryMode('grid')).toBe('stories')
    expect(resolveGalleryMode('STORIES')).toBe('stories')
    expect(resolveGalleryMode('{"mode":"index"}')).toBe('stories')
    expect(resolveGalleryMode(42)).toBe('stories')
    expect(resolveGalleryMode(['index'])).toBe('stories')
  })

  test('both modes are whitelisted', () => {
    for (const mode of GALLERY_MODES) {
      expect(resolveGalleryMode(mode)).toBe(mode)
    }
  })
})

describe('readStoredGalleryMode', () => {
  test('reads a valid persisted value', () => {
    const storage = { getItem: () => 'index' }
    expect(readStoredGalleryMode(storage)).toBe('index')
  })

  test('returns stories when nothing is stored', () => {
    const storage = { getItem: () => null }
    expect(readStoredGalleryMode(storage)).toBe('stories')
  })

  test('never throws on corrupted storage', () => {
    const throwing = { getItem: () => { throw new Error('denied') } }
    expect(readStoredGalleryMode(throwing)).toBe('stories')

    expect(readStoredGalleryMode(null)).toBe('stories')
    expect(readStoredGalleryMode(undefined)).toBe('stories')
    expect(readStoredGalleryMode({})).toBe('stories')
  })

  test('honours a custom key', () => {
    const storage = { getItem: (k) => (k === 'custom' ? 'index' : null) }
    expect(readStoredGalleryMode(storage, 'custom')).toBe('index')
    expect(readStoredGalleryMode(storage)).toBe('stories')
  })

  test('exposes an explicit storage key', () => {
    expect(GALLERY_MODE_KEY).toBe('bentofolio:projects-view')
  })
})

describe('persistGalleryMode', () => {
  test('writes the resolved mode under the explicit key', () => {
    const calls = []
    const storage = { setItem: (k, v) => calls.push([k, v]) }
    persistGalleryMode(storage, 'index')
    expect(calls).toEqual([['bentofolio:projects-view', 'index']])
  })

  test('normalises invalid modes before writing', () => {
    const calls = []
    const storage = { setItem: (k, v) => calls.push([k, v]) }
    persistGalleryMode(storage, 'bogus')
    expect(calls).toEqual([['bentofolio:projects-view', 'stories']])
  })

  test('silently ignores storage failures and missing storage', () => {
    const throwing = { setItem: () => { throw new Error('quota') } }
    expect(() => persistGalleryMode(throwing, 'index')).not.toThrow()
    expect(() => persistGalleryMode(null, 'index')).not.toThrow()
    expect(() => persistGalleryMode(undefined, 'stories')).not.toThrow()
  })
})
