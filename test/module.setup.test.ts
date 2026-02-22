import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('module setup', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('always transpiles icon dependencies used by internal components', async () => {
    const addComponent = vi.fn()
    const addPlugin = vi.fn()
    const addServerPlugin = vi.fn()
    const addVitePlugin = vi.fn()

    vi.doMock('@nuxt/kit', () => ({
      defineNuxtModule: (module: unknown) => module,
      addComponent,
      addPlugin,
      addServerPlugin,
      addVitePlugin,
      createResolver: () => ({
        resolve: (id: string) => `/virtual/${id}`,
      }),
    }))

    const { default: module } = await import('../src/module')

    const nuxt = {
      options: {
        build: {
          transpile: [] as string[],
        },
        builder: '@nuxt/vite-builder',
      },
    } as never

    module.setup({ icon: false, prefix: 'A' }, nuxt)

    expect(nuxt.options.build.transpile).toEqual(
      expect.arrayContaining([
        'antdv-next',
        '@v-c/picker',
        'dayjs',
        '@antdv-next/icons',
        '@ant-design/icons-svg',
      ]),
    )
  })
})
