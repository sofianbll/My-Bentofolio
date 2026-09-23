import { describe, expect, test } from 'bun:test'
import { reduceScrollDirection, shouldHideNav, resolveMotionMode, startRouteTransition } from './motion.js'

describe('reduceScrollDirection', () => {
  test('clear downward movement beyond threshold returns down', () => {
    const state = reduceScrollDirection({ lastY: 0, currentY: 120, lastDir: 'up' })

    expect(state.dir).toBe('down')
    expect(state.y).toBe(120)
  })

  test('clear upward movement returns up', () => {
    const state = reduceScrollDirection({ lastY: 400, currentY: 100, lastDir: 'down' })

    expect(state.dir).toBe('up')
    expect(state.y).toBe(100)
  })

  test('tiny downward delta keeps previous direction', () => {
    const state = reduceScrollDirection({ lastY: 200, currentY: 203, lastDir: 'up' })

    expect(state.dir).toBe('up')
  })

  test('tiny delta exactly at threshold keeps previous direction', () => {
    const state = reduceScrollDirection({ lastY: 200, currentY: 204, lastDir: 'up' }, 4)

    expect(state.dir).toBe('up')
  })

  test('custom threshold is respected', () => {
    const state = reduceScrollDirection({ lastY: 0, currentY: 30, lastDir: 'up' }, 20)

    expect(state.dir).toBe('down')
  })

  test('delta beyond default threshold hides only on meaningful scroll', () => {
    const state = reduceScrollDirection({ lastY: 0, currentY: 50, lastDir: 'up' })

    expect(state.dir).toBe('down')
  })

  test('first sample with no lastDir defaults to up', () => {
    const state = reduceScrollDirection({ lastY: 0, currentY: 0, lastDir: undefined })

    expect(state.dir).toBe('up')
    expect(state.y).toBe(0)
  })
})

describe('shouldHideNav', () => {
  test('hides only when scrolling down past minimum scroll', () => {
    expect(shouldHideNav('down', 200)).toBe(true)
  })

  test('never hides near the top of the page', () => {
    expect(shouldHideNav('down', 50)).toBe(false)
  })

  test('never hides when scrolling up', () => {
    expect(shouldHideNav('up', 800)).toBe(false)
  })

  test('custom minScroll is respected', () => {
    expect(shouldHideNav('down', 120, 96)).toBe(true)
    expect(shouldHideNav('down', 90, 96)).toBe(false)
  })
})

describe('resolveMotionMode', () => {
  test('full motion when nothing blocks it and view transitions are supported', () => {
    expect(resolveMotionMode({ isPreviewFrame: false, reducedMotion: false, viewTransitionsSupported: true })).toBe('full')
  })

  test('preview frame disables the runtime entirely', () => {
    expect(resolveMotionMode({ isPreviewFrame: true, reducedMotion: false, viewTransitionsSupported: true })).toBe('off')
  })

  test('reduced motion disables the runtime entirely', () => {
    expect(resolveMotionMode({ isPreviewFrame: false, reducedMotion: true, viewTransitionsSupported: true })).toBe('off')
  })

  test('no view transitions support falls back to reduced mode', () => {
    expect(resolveMotionMode({ isPreviewFrame: false, reducedMotion: false, viewTransitionsSupported: false })).toBe('reduced')
  })
})

describe('startRouteTransition', () => {
  test('stub calls commit synchronously and reports the motion mode', () => {
    let committed = false
    const docRef = {
      documentElement: { classList: { contains: () => false } },
      startViewTransition: () => ({}),
    }
    const mode = startRouteTransition(docRef, () => { committed = true })

    expect(committed).toBe(true)
    expect(mode).toBe('full')
  })

  test('stub still commits instantly in off mode (preview / reduced motion)', () => {
    let committed = false
    const docRef = {
      documentElement: { classList: { contains: () => true } },
      startViewTransition: undefined,
    }
    const mode = startRouteTransition(docRef, () => { committed = true })

    expect(committed).toBe(true)
    expect(mode).toBe('off')
  })
})
