import { defineNuxtModule, addPlugin, createResolver, addVitePlugin, addComponent, addServerPlugin } from '@nuxt/kit'
import dayjs from 'vite-plugin-dayjs'
import type { ComponentName } from './runtime/components'
import type { IconName } from './runtime/icons'
import components from './runtime/components'
import icons from './runtime/icons'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable components
   * @default true
   */
  component?: boolean
  /**
   * Enable icons
   * @default false
   */
  icon?: boolean
  /**
   * Components to be included or excluded
   */
  exclude?: ComponentName[]
  /**
   * Components to be included only
   */
  include?: ComponentName[]
  /**
   * Icons to be excluded or included
   */
  excludeIcons?: IconName[]
  /**
   * Icons to be included only
   */
  includeIcons?: IconName[]
  /**
   * Component prefix
   * @default 'A'
   */
  prefix?: string
}

const libName = 'antdv-next'
const iconLibName = `@antdv-next/icons`
const iconsSvgLibName = '@ant-design/icons-svg'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@antdv-next/nuxt',
    configKey: 'antd',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    icon: false,
    component: true,
    prefix: 'A',
  },
  setup(_options, _nuxt) {
    // Skip if both components and icons are disabled
    if (_options.component === false && _options.icon !== true) {
      return
    }

    const transpileList = _nuxt.options.build.transpile
    const appendTranspile = (dep: string) => {
      if (!transpileList.includes(dep)) {
        transpileList.push(dep)
      }
    }

    // Keep icon definition modules in Nuxt transform pipeline to avoid
    // cold-start interop inconsistency in dev SSR/hydration.
    if (_options.component !== false) {
      appendTranspile(libName)
    }

    // Always transpile icon libs because users may import icons directly
    appendTranspile(iconLibName)
    appendTranspile(iconsSvgLibName)

    // Register components
    if (_options.component !== false) {
      const componentMap = {
        QRCode: 'Qrcode',
      }
      // Filter components based on include/exclude options
      const filteredComponents = components.filter((comp) => {
        if (_options.include?.length) {
          return _options.include.includes(comp)
        }
        if (_options.exclude?.length) {
          return !_options.exclude.includes(comp)
        }
        return true
      })

      filteredComponents.forEach((comp) => {
        let _comp: string = comp
        if (comp in componentMap) {
          _comp = componentMap[comp as keyof typeof componentMap]
        }
        addComponent({
          filePath: 'antdv-next',
          export: comp,
          name: _options.prefix + _comp,
        })
      })
    }

    // Register icons
    if (_options.icon === true) {
      // Filter icons based on include/exclude options
      const filteredIcons = icons.filter((icon) => {
        if (_options.includeIcons?.length) {
          return _options.includeIcons.includes(icon)
        }
        if (_options.excludeIcons?.length) {
          return !_options.excludeIcons.includes(icon)
        }
        return true
      })
      filteredIcons.forEach((icon) => {
        addComponent({
          filePath: iconLibName,
          export: icon,
          name: icon,
        })
      })
    }

    // Only add plugins when components are enabled
    if (_options.component !== false) {
      const resolver = createResolver(import.meta.url)

      // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
      addPlugin(resolver.resolve('./runtime/plugin'))
      addServerPlugin(resolver.resolve('./runtime/server'))

      // Check if the builder is Vite
      if (_nuxt.options.builder === '@nuxt/vite-builder') {
        addVitePlugin(dayjs())
      }
    }
  },
})
