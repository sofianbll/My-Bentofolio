import { describe, expect, test } from 'bun:test'
import { reduceScrollDirection, shouldHideNav, resolveMotionMode, startRouteTransition, shouldAnimateHero, planRouteTransition } from './motion.js'

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

describe('shouldAnimateHero', () => {
  test('full motion when nothing blocks it', () => {
    expect(shouldAnimateHero({ reducedMotion: false, isPreview: false })).toBe(true)
  })

  test('reduced motion disables the hero reveal', () => {
    expect(shouldAnimateHero({ reducedMotion: true, isPreview: false })).toBe(false)
  })

  test('preview frame disables the hero reveal', () => {
    expect(shouldAnimateHero({ reducedMotion: false, isPreview: true })).toBe(false)
  })

  test('reduced motion in a preview frame stays off', () => {
    expect(shouldAnimateHero({ reducedMotion: true, isPreview: true })).toBe(false)
  })
})

describe('planRouteTransition', () => {
  test('full mode with native support plans a transition', () => {
    expect(planRouteTransition({ mode: 'full', hasViewTransition: true })).toBe('transition')
  })

  test('full mode without support falls back to an instant swap', () => {
    expect(planRouteTransition({ mode: 'full', hasViewTransition: false })).toBe('instant')
  })

  test('reduced mode always swaps instantly', () => {
    expect(planRouteTransition({ mode: 'reduced', hasViewTransition: true })).toBe('instant')
  })

  test('off mode always swaps instantly', () => {
    expect(planRouteTransition({ mode: 'off', hasViewTransition: true })).toBe('instant')
  })
})

describe('startRouteTransition', () => {
  function makeDoc({ preview = false, hasViewTransition = true, throwOnVT = false } = {}) {
    const calls = { vtCalls: 0, commitRanInsideVT: false }
    const doc = {
      documentElement: { classList: { contains: () => preview } },
    }
    if (hasViewTransition) {
      doc.startViewTransition = (cb) => {
        calls.vtCalls += 1
        if (throwOnVT) throw new Error('VT unavailable')
        calls.commitRanInsideVT = true
        cb()
        return { finished: Promise.resolve() }
      }
    }
    return { doc, calls }
  }

  test('full mode runs commit inside startViewTransition', () => {
    let committed = false
    const { doc, calls } = makeDoc()
    const mode = startRouteTransition(doc, () => { committed = true })

    expect(mode).toBe('full')
    expect(calls.vtCalls).toBe(1)
    expect(calls.commitRanInsideVT).toBe(true)
    expect(committed).toBe(true)
  })

  test('commit runs synchronously even when wrapped (navigation never blocks)', () => {
    let committed = false
    const { doc } = makeDoc()
    startRouteTransition(doc, () => { committed = true })
    expect(committed).toBe(true)
  })

  test('off mode (preview frame) commits instantly and never calls startViewTransition', () => {
    let committed = false
    const { doc, calls } = makeDoc({ preview: true })
    const mode = startRouteTransition(doc, () => { committed = true })

    expect(mode).toBe('off')
    expect(calls.vtCalls).toBe(0)
    expect(committed).toBe(true)
  })

  test('reduced mode (no VT support) commits instantly', () => {
    let committed = false
    const { doc, calls } = makeDoc({ hasViewTransition: false })
    const mode = startRouteTransition(doc, () => { committed = true })

    expect(mode).toBe('reduced')
    expect(calls.vtCalls).toBe(0)
    expect(committed).toBe(true)
  })

  test('startViewTransition throwing still commits the route change', () => {
    let committed = false
    const { doc } = makeDoc({ throwOnVT: true })
    const mode = startRouteTransition(doc, () => { committed = true })

    expect(mode).toBe('full')
    expect(committed).toBe(true)
  })

  test('document without VT support reports reduced and commits instantly', () => {
    let committed = false
    const mode = startRouteTransition({}, () => { committed = true })
    expect(mode).toBe('reduced')
    expect(committed).toBe(true)
  })
})
