import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('runtime plugin', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('creates request cache and attaches it to ssr event context', async () => {
    const cache = { id: 'server-cache' }
    const createCache = vi.fn(() => cache)
    const provideStyleContext = vi.fn()

    vi.doMock('#app', () => ({
      defineNuxtPlugin: (fn: unknown) => fn,
    }))
    vi.doMock('@antdv-next/cssinjs', () => ({
      createCache,
      provideStyleContext,
    }))

    const { default: plugin } = await import('../src/runtime/plugin')
    const context = {}

    plugin({
      vueApp: {},
      ssrContext: {
        event: {
          context,
        },
      },
    } as never)

    expect(createCache).toHaveBeenCalledTimes(1)
    expect(provideStyleContext).toHaveBeenCalledTimes(1)
    expect((context as Record<string, unknown>).__antdvCssInJsCache).toBe(cache)
  })

  it('still provides style context on client without touching event context', async () => {
    const createCache = vi.fn(() => ({ id: 'client-cache' }))
    const provideStyleContext = vi.fn()

    vi.doMock('#app', () => ({
      defineNuxtPlugin: (fn: unknown) => fn,
    }))
    vi.doMock('@antdv-next/cssinjs', () => ({
      createCache,
      provideStyleContext,
    }))

    const { default: plugin } = await import('../src/runtime/plugin')
    plugin({ vueApp: {} } as never)

    expect(createCache).toHaveBeenCalledTimes(1)
    expect(provideStyleContext).toHaveBeenCalledTimes(1)
  })
})

describe('nitro render hook', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('extracts styles from each request cache', async () => {
    const extractStyle = vi.fn((cache: { css: string }) => `<style>${cache.css}</style>`)

    vi.doMock('nitropack/runtime', () => ({
      defineNitroPlugin: (fn: unknown) => fn,
    }))
    vi.doMock('@antdv-next/cssinjs', () => ({
      extractStyle,
    }))

    const { default: plugin } = await import('../src/runtime/server')

    let renderHook: ((html: { head: string[] }, ctx: { event: { context: Record<string, unknown> } }) => void) | undefined
    plugin({
      hooks: {
        hook: (name: string, cb: typeof renderHook) => {
          if (name === 'render:html') {
            renderHook = cb
          }
        },
      },
    } as never)

    const firstHtml = { head: [] as string[] }
    const secondHtml = { head: [] as string[] }

    renderHook?.(firstHtml, {
      event: {
        context: {
          __antdvCssInJsCache: { css: '.ant-btn{color:red;}' },
        },
      },
    })

    renderHook?.(secondHtml, {
      event: {
        context: {
          __antdvCssInJsCache: { css: '.ant-card{color:blue;}' },
        },
      },
    })

    expect(extractStyle).toHaveBeenCalledTimes(2)
    expect(firstHtml.head[0]).toContain('.ant-btn')
    expect(secondHtml.head[0]).toContain('.ant-card')
  })

  it('skips render injection when request cache is missing', async () => {
    const extractStyle = vi.fn()

    vi.doMock('nitropack/runtime', () => ({
      defineNitroPlugin: (fn: unknown) => fn,
    }))
    vi.doMock('@antdv-next/cssinjs', () => ({
      extractStyle,
    }))

    const { default: plugin } = await import('../src/runtime/server')
    let renderHook: ((html: { head: string[] }, ctx: { event: { context: Record<string, unknown> } }) => void) | undefined

    plugin({
      hooks: {
        hook: (name: string, cb: typeof renderHook) => {
          if (name === 'render:html') {
            renderHook = cb
          }
        },
      },
    } as never)

    const html = { head: [] as string[] }
    renderHook?.(html, { event: { context: {} } })

    expect(extractStyle).not.toHaveBeenCalled()
    expect(html.head).toHaveLength(0)
  })
})
