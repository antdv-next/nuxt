import { defineNuxtModule, addPlugin, createResolver, addVitePlugin, addComponent, addServerPlugin } from '@nuxt/kit'
import dayjs from 'vite-plugin-dayjs'
import type { ComponentName } from './runtime/components'
import type { IconName } from './runtime/icons'
import components, { componentParentDependencies, resolveComponentRegistrationName } from './runtime/components'
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
const pickerLibName = '@v-c/picker'
const dayjsLibName = 'dayjs'

/**
 * Nuxt 4.3+ mirrors `build.transpile` string entries to the **client** dev
 * `optimizeDeps.exclude`, which disables pre-bundling and can explode HTTP
 * requests for large packages (e.g. `@ant-design/icons-svg`).
 *
 * Returning `false` for `isClient && isDev` keeps normal transpilation /
 * `ssr.noExternal` behaviour for server and production while allowing Vite
 * to pre-bundle on the client in development.
 *
 * @see https://github.com/nuxt/nuxt/blob/main/packages/vite/src/shared/client.ts
 */
type TranspileCtx = { isClient?: boolean; isServer?: boolean; isDev: boolean }

function transpileExceptViteClientDev(dep: string) {
  return (env: TranspileCtx) => (env.isClient === true && env.isDev ? false : dep)
}

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
    const pushTranspileFn = (fn: (env: TranspileCtx) => string | false) => {
      transpileList.push(fn)
    }

    // Large UI stack: use conditional transpile so Nuxt 4.3+ does not put
    // these into client dev `optimizeDeps.exclude`.
    if (_options.component !== false) {
      pushTranspileFn(transpileExceptViteClientDev(libName))
      pushTranspileFn(transpileExceptViteClientDev(pickerLibName))
      pushTranspileFn(transpileExceptViteClientDev(dayjsLibName))
    }

    // Only when icon components are enabled — `@ant-design/icons-svg` has
    // If you import icons in script with `icon: false`,
    if (_options.icon === true) {
      pushTranspileFn(transpileExceptViteClientDev(iconLibName))
      pushTranspileFn(transpileExceptViteClientDev(iconsSvgLibName))
    }

    // Register components
    if (_options.component !== false) {
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
      const registeredComponents = new Set(filteredComponents)
      const effectiveComponents = filteredComponents.filter((comp) => {
        const parent = componentParentDependencies[comp]
        return parent == null || registeredComponents.has(parent)
      })

      effectiveComponents.forEach((comp) => {
        addComponent({
          filePath: 'antdv-next',
          export: comp,
          name: _options.prefix + resolveComponentRegistrationName(comp),
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
