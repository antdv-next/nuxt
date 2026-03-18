import { beforeEach, describe, expect, it, vi } from 'vitest'
import components, { resolveComponentRegistrationName } from '../src/runtime/components'

function asSetupModule(module: unknown) {
  return module as {
    setup: (options: unknown, nuxt: { options: { build: { transpile: string[] }, builder: string } }) => void
  }
}

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

    const module = asSetupModule((await import('../src/module')).default)

    const nuxt = {
      options: {
        build: {
          transpile: [] as string[],
        },
        builder: '@nuxt/vite-builder',
      },
    }

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

  it('keeps the component list in sync with auto-import resolver coverage', () => {
    expect(components).toEqual(expect.arrayContaining([
      'CheckableTagGroup',
      'DescriptionsItem',
      'TimelineItem',
      'CollapsePanel',
      'SubMenu',
      'MenuItem',
      'MenuItemGroup',
      'MenuDivider',
      'BreadcrumbItem',
      'BreadcrumbSeparator',
    ]))

    expect(resolveComponentRegistrationName('BackTop')).toBe('FloatBackTop')
    expect(resolveComponentRegistrationName('DateRangePicker')).toBe('RangePicker')
    expect(resolveComponentRegistrationName('InputOTP')).toBe('InputOtp')
    expect(resolveComponentRegistrationName('QRCode')).toBe('Qrcode')
    expect(resolveComponentRegistrationName('TextArea')).toBe('Textarea')
  })

  it('registers resolver-compatible component aliases from the package root export', async () => {
    const addComponent = vi.fn()

    vi.doMock('@nuxt/kit', () => ({
      defineNuxtModule: (module: unknown) => module,
      addComponent,
      addPlugin: vi.fn(),
      addServerPlugin: vi.fn(),
      addVitePlugin: vi.fn(),
      createResolver: () => ({
        resolve: (id: string) => `/virtual/${id}`,
      }),
    }))

    const module = asSetupModule((await import('../src/module')).default)

    const nuxt = {
      options: {
        build: {
          transpile: [] as string[],
        },
        builder: '@nuxt/vite-builder',
      },
    }

    module.setup({
      component: true,
      icon: false,
      include: ['BackTop', 'DateRangePicker', 'InputOTP', 'QRCode', 'TextArea', 'SubMenu'],
      prefix: 'A',
    }, nuxt)

    expect(addComponent).toHaveBeenCalledTimes(6)
    expect(addComponent.mock.calls.map(([arg]) => arg)).toEqual(expect.arrayContaining([
      {
        filePath: 'antdv-next',
        export: 'BackTop',
        name: 'AFloatBackTop',
      },
      {
        filePath: 'antdv-next',
        export: 'DateRangePicker',
        name: 'ARangePicker',
      },
      {
        filePath: 'antdv-next',
        export: 'InputOTP',
        name: 'AInputOtp',
      },
      {
        filePath: 'antdv-next',
        export: 'QRCode',
        name: 'AQrcode',
      },
      {
        filePath: 'antdv-next',
        export: 'TextArea',
        name: 'ATextarea',
      },
      {
        filePath: 'antdv-next',
        export: 'SubMenu',
        name: 'ASubMenu',
      },
    ]))
  })
})
