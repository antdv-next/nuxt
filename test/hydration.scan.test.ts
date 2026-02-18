import { existsSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { inspect } from 'node:util'
import { describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'

const localRequire = createRequire(import.meta.url)
const nuxtPkgPath = localRequire.resolve('nuxt/package.json')
const vueModulePath = localRequire.resolve('vue', { paths: [nuxtPkgPath] })
const serverRendererModulePath = localRequire.resolve('@vue/server-renderer', { paths: [nuxtPkgPath] })

const testDom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' })
const globalObject = globalThis as Record<string, unknown>

const setGlobal = (key: string, value: unknown) => {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  })
}

setGlobal('window', testDom.window)
setGlobal('document', testDom.window.document)
setGlobal('navigator', testDom.window.navigator)
setGlobal('Node', testDom.window.Node)
setGlobal('Element', testDom.window.Element)
setGlobal('HTMLElement', testDom.window.HTMLElement)
setGlobal('SVGElement', testDom.window.SVGElement)
setGlobal('ShadowRoot', testDom.window.ShadowRoot)
setGlobal('MutationObserver', testDom.window.MutationObserver)
setGlobal('requestAnimationFrame', testDom.window.requestAnimationFrame
  ? testDom.window.requestAnimationFrame.bind(testDom.window)
  : (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16))
setGlobal('cancelAnimationFrame', testDom.window.cancelAnimationFrame
  ? testDom.window.cancelAnimationFrame.bind(testDom.window)
  : (id: number) => clearTimeout(id))
setGlobal('getComputedStyle', testDom.window.getComputedStyle.bind(testDom.window))

if (!testDom.window.matchMedia) {
  testDom.window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  })) as typeof window.matchMedia
}
setGlobal('matchMedia', testDom.window.matchMedia.bind(testDom.window))

globalObject.ResizeObserver = class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

globalObject.IntersectionObserver = class IntersectionObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

const { createSSRApp, defineComponent, h, nextTick } = localRequire(vueModulePath) as typeof import('vue')
const { renderToString } = localRequire(serverRendererModulePath) as typeof import('@vue/server-renderer')

type RenderFn = () => ReturnType<typeof import('vue').h>

function createLoadErrorComponent(name: string, error: unknown) {
  return defineComponent({
    name: `LoadError_${name}`,
    setup() {
      throw error
    },
  })
}

function loadModule(path: string, name: string) {
  try {
    return localRequire(path)
  }
  catch (error) {
    return {
      __loadError: error,
      default: createLoadErrorComponent(name, error),
    }
  }
}

function pickExport(mod: Record<string, unknown>, key = 'default') {
  return (mod[key] || mod.default) as ReturnType<typeof defineComponent>
}

const Affix = pickExport(loadModule('antdv-next/dist/affix/index', 'Affix'))
const Alert = pickExport(loadModule('antdv-next/dist/alert/index', 'Alert'))
const Anchor = pickExport(loadModule('antdv-next/dist/anchor/index', 'Anchor'))
const App = pickExport(loadModule('antdv-next/dist/app/index', 'App'))
const AutoComplete = pickExport(loadModule('antdv-next/dist/auto-complete/index', 'AutoComplete'))
const Avatar = pickExport(loadModule('antdv-next/dist/avatar/index', 'Avatar'))
const Badge = pickExport(loadModule('antdv-next/dist/badge/index', 'Badge'))
const Breadcrumb = pickExport(loadModule('antdv-next/dist/breadcrumb/index', 'Breadcrumb'))
const Button = pickExport(loadModule('antdv-next/dist/button/index', 'Button'))
const Calendar = pickExport(loadModule('antdv-next/dist/calendar/index', 'Calendar'))
const Card = pickExport(loadModule('antdv-next/dist/card/index', 'Card'))
const Carousel = pickExport(loadModule('antdv-next/dist/carousel/index', 'Carousel'))
const Cascader = pickExport(loadModule('antdv-next/dist/cascader/index', 'Cascader'))
const Checkbox = pickExport(loadModule('antdv-next/dist/checkbox/index', 'Checkbox'))
const Collapse = pickExport(loadModule('antdv-next/dist/collapse/index', 'Collapse'))
const ColorPicker = pickExport(loadModule('antdv-next/dist/color-picker/index', 'ColorPicker'))
const ConfigProvider = pickExport(loadModule('antdv-next/dist/config-provider/index', 'ConfigProvider'))
const DatePicker = pickExport(loadModule('antdv-next/dist/date-picker/index', 'DatePicker'))
const Descriptions = pickExport(loadModule('antdv-next/dist/descriptions/index', 'Descriptions'))
const Divider = pickExport(loadModule('antdv-next/dist/divider/index', 'Divider'))
const Drawer = pickExport(loadModule('antdv-next/dist/drawer/index', 'Drawer'))
const Dropdown = pickExport(loadModule('antdv-next/dist/dropdown/index', 'Dropdown'))
const Empty = pickExport(loadModule('antdv-next/dist/empty/index', 'Empty'))
const Flex = pickExport(loadModule('antdv-next/dist/flex/index', 'Flex'))
const FloatButton = pickExport(loadModule('antdv-next/dist/float-button/index', 'FloatButton'))
const Image = pickExport(loadModule('antdv-next/dist/image/index', 'Image'))
const Input = pickExport(loadModule('antdv-next/dist/input/index', 'Input'))
const InputNumber = pickExport(loadModule('antdv-next/dist/input-number/index', 'InputNumber'))
const Masonry = pickExport(loadModule('antdv-next/dist/masonry/index', 'Masonry'))
const Mentions = pickExport(loadModule('antdv-next/dist/mentions/index', 'Mentions'))
const Menu = pickExport(loadModule('antdv-next/dist/menu/index', 'Menu'))
const Modal = pickExport(loadModule('antdv-next/dist/modal/index', 'Modal'))
const Pagination = pickExport(loadModule('antdv-next/dist/pagination/index', 'Pagination'))
const Popconfirm = pickExport(loadModule('antdv-next/dist/popconfirm/index', 'Popconfirm'))
const Popover = pickExport(loadModule('antdv-next/dist/popover/index', 'Popover'))
const Progress = pickExport(loadModule('antdv-next/dist/progress/index', 'Progress'))
const QRCode = pickExport(loadModule('antdv-next/dist/qrcode/index', 'QRCode'))
const Radio = pickExport(loadModule('antdv-next/dist/radio/index', 'Radio'))
const Rate = pickExport(loadModule('antdv-next/dist/rate/index', 'Rate'))
const Result = pickExport(loadModule('antdv-next/dist/result/index', 'Result'))
const Segmented = pickExport(loadModule('antdv-next/dist/segmented/index', 'Segmented'))
const Select = pickExport(loadModule('antdv-next/dist/select/index', 'Select'))
const Skeleton = pickExport(loadModule('antdv-next/dist/skeleton/index', 'Skeleton'))
const Slider = pickExport(loadModule('antdv-next/dist/slider/index', 'Slider'))
const Space = pickExport(loadModule('antdv-next/dist/space/index', 'Space'))
const Spin = pickExport(loadModule('antdv-next/dist/spin/index', 'Spin'))
const Statistic = pickExport(loadModule('antdv-next/dist/statistic/index', 'Statistic'))
const Steps = pickExport(loadModule('antdv-next/dist/steps/index', 'Steps'))
const Switch = pickExport(loadModule('antdv-next/dist/switch/index', 'Switch'))
const Table = pickExport(loadModule('antdv-next/dist/table/index', 'Table'))
const Tabs = pickExport(loadModule('antdv-next/dist/tabs/index', 'Tabs'))
const Tag = pickExport(loadModule('antdv-next/dist/tag/index', 'Tag'))
const TimePicker = pickExport(loadModule('antdv-next/dist/time-picker/index', 'TimePicker'))
const Timeline = pickExport(loadModule('antdv-next/dist/timeline/index', 'Timeline'))
const Tooltip = pickExport(loadModule('antdv-next/dist/tooltip/index', 'Tooltip'))
const Tour = pickExport(loadModule('antdv-next/dist/tour/index', 'Tour'))
const Transfer = pickExport(loadModule('antdv-next/dist/transfer/index', 'Transfer'))
const Tree = pickExport(loadModule('antdv-next/dist/tree/index', 'Tree'))
const TreeSelect = pickExport(loadModule('antdv-next/dist/tree-select/index', 'TreeSelect'))
const Upload = pickExport(loadModule('antdv-next/dist/upload/index', 'Upload'))
const Watermark = pickExport(loadModule('antdv-next/dist/watermark/index', 'Watermark'))

const formModule = loadModule('antdv-next/dist/form/index', 'Form')
const Form = pickExport(formModule)
const FormItem = pickExport(formModule, 'FormItem')

const gridModule = loadModule('antdv-next/dist/grid/index', 'Grid')
const Row = pickExport(gridModule, 'Row')
const Col = pickExport(gridModule, 'Col')

const layoutModule = loadModule('antdv-next/dist/layout/index', 'Layout')
const Layout = pickExport(layoutModule)
const LayoutHeader = pickExport(layoutModule, 'LayoutHeader')
const LayoutContent = pickExport(layoutModule, 'LayoutContent')

const splitterModule = loadModule('antdv-next/dist/splitter/index', 'Splitter')
const Splitter = pickExport(splitterModule)
const SplitterPanel = pickExport(splitterModule, 'SplitterPanel')

const typographyModule = loadModule('antdv-next/dist/typography/index', 'Typography')
const TypographyTitle = pickExport(typographyModule, 'TypographyTitle')

const iconsModule = loadModule('@antdv-next/icons', 'Icons')
const HomeOutlined = pickExport(iconsModule, 'HomeOutlined')

interface ComponentCase {
  slug: string
  sourceDemo: string
  render: RenderFn
}

interface ScanResult {
  slug: string
  sourceDemo: string
  hydrationWarnings: string[]
  runtimeErrors: string[]
}

const SOURCE_COMPONENTS_DIR = new URL('../playground/pages/components', import.meta.url).pathname

const sourceComponentSlugs = readdirSync(SOURCE_COMPONENTS_DIR, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(item => item.name)
  .filter(name => name !== 'overview')
  .sort()

function resolveDemoSource(slug: string): string {
  const demoDir = join(SOURCE_COMPONENTS_DIR, slug, 'demo')
  const preferred = join(demoDir, 'basic.vue')
  if (existsSync(preferred)) {
    return preferred
  }

  const fallbacks = readdirSync(demoDir).filter(name => name.endsWith('.vue') && !name.startsWith('_')).sort()
  if (fallbacks.length > 0) {
    return join(demoDir, fallbacks[0]!)
  }

  return preferred
}

function renderMessage(): ReturnType<typeof h> {
  return h(App, null, {
    default: () => h(Button, { type: 'primary' }, { default: () => 'Message Demo Placeholder' }),
  })
}

function renderNotification(): ReturnType<typeof h> {
  return h(App, null, {
    default: () => h(Button, { type: 'primary' }, { default: () => 'Notification Demo Placeholder' }),
  })
}

const RENDERERS: Record<string, RenderFn> = {
  'affix': () => h(Affix, { offsetTop: 0 }, { default: () => h('button', 'Affix') }),
  'alert': () => h(Alert, { message: 'Hydration Alert Demo', type: 'success' }),
  'anchor': () => h(Anchor, { items: [{ key: '1', href: '#part-1', title: 'Part 1' }] }),
  'app': () => h(App, null, { default: () => h('div', 'App') }),
  'auto-complete': () => h(AutoComplete, { value: 'one', options: [{ value: 'one' }, { value: 'two' }] }),
  'avatar': () => h(Avatar, { src: 'https://via.placeholder.com/40' }),
  'badge': () => h(Badge, { count: 5 }, { default: () => h('span', 'Badge') }),
  'breadcrumb': () => h(Breadcrumb, { items: [{ title: 'Home' }, { title: 'Page' }] }),
  'button': () => h(Button, { type: 'primary' }, { default: () => 'Button' }),
  'calendar': () => h(Calendar, { fullscreen: false }),
  'card': () => h(Card, { title: 'Card Title' }, { default: () => 'Card Body' }),
  'carousel': () => h(Carousel, null, { default: () => [h('div', 'Slide 1'), h('div', 'Slide 2')] }),
  'cascader': () => h(Cascader, {
    value: ['zhejiang', 'hangzhou'],
    options: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{ value: 'hangzhou', label: 'Hangzhou' }],
      },
    ],
  }),
  'checkbox': () => h(Checkbox, { checked: true }, { default: () => 'Checkbox' }),
  'collapse': () => h(Collapse, { items: [{ key: '1', label: 'Panel', children: 'Panel content' }] }),
  'color-picker': () => h(ColorPicker, { value: '#1677ff' }),
  'config-provider': () => h(ConfigProvider, null, { default: () => h(Button, { type: 'primary' }, { default: () => 'Config' }) }),
  'date-picker': () => h(DatePicker, { open: false }),
  'descriptions': () => h(Descriptions, {
    title: 'User Info',
    items: [{ key: 'name', label: 'Name', children: 'Jack' }],
  }),
  'divider': () => h(Divider, null, { default: () => 'Divider' }),
  'drawer': () => h(Drawer, { open: false, title: 'Drawer' }),
  'dropdown': () => h(Dropdown, {
    menu: {
      items: [{ key: '1', label: 'First' }, { key: '2', label: 'Second' }],
    },
  }, {
    default: () => h(Button, { type: 'link' }, { default: () => 'Dropdown' }),
  }),
  'empty': () => h(Empty),
  'flex': () => h(Flex, { gap: 'small' }, {
    default: () => [
      h(Button, { type: 'default' }, { default: () => 'A' }),
      h(Button, { type: 'default' }, { default: () => 'B' }),
    ],
  }),
  'float-button': () => h(FloatButton, { description: 'Help' }),
  'form': () => h(Form, { layout: 'vertical' }, {
    default: () => h(FormItem, { label: 'Name', name: 'name' }, {
      default: () => h(Input, { value: 'Jack' }),
    }),
  }),
  'grid': () => h(Row, { gutter: 8 }, {
    default: () => [
      h(Col, { span: 12 }, { default: () => 'Left' }),
      h(Col, { span: 12 }, { default: () => 'Right' }),
    ],
  }),
  'icon': () => h(HomeOutlined),
  'image': () => h(Image, { width: 120, src: 'https://via.placeholder.com/120x80' }),
  'input': () => h(Input, { value: 'Input' }),
  'input-number': () => h(InputNumber, { value: 3 }),
  'layout': () => h(Layout, { style: { height: '120px' } }, {
    default: () => [
      h(LayoutHeader, null, { default: () => 'Header' }),
      h(LayoutContent, null, { default: () => 'Content' }),
    ],
  }),
  'masonry': () => h(Masonry, { columns: 2 }, {
    default: () => [h('div', 'A'), h('div', 'B'), h('div', 'C')],
  }),
  'mentions': () => h(Mentions, {
    value: '@antdv-next',
    options: [{ value: 'antdv-next', label: 'antdv-next' }],
  }),
  'menu': () => h(Menu, {
    selectedKeys: ['1'],
    items: [{ key: '1', label: 'Menu 1' }, { key: '2', label: 'Menu 2' }],
  }),
  'message': renderMessage,
  'modal': () => h(Modal, { open: false, title: 'Modal title' }),
  'notification': renderNotification,
  'pagination': () => h(Pagination, { current: 1, pageSize: 10, total: 50 }),
  'popconfirm': () => h(Popconfirm, { title: 'Confirm?' }, {
    default: () => h(Button, { type: 'link' }, { default: () => 'Delete' }),
  }),
  'popover': () => h(Popover, { title: 'Title', content: 'Content' }, {
    default: () => h(Button, { type: 'link' }, { default: () => 'Hover' }),
  }),
  'progress': () => h(Progress, { percent: 35 }),
  'qr-code': () => h(QRCode, { value: 'https://www.antdv-next.com' }),
  'radio': () => h(Radio, { checked: true }, { default: () => 'Radio' }),
  'rate': () => h(Rate, { value: 3 }),
  'result': () => h(Result, { status: 'success', title: 'Success' }),
  'segmented': () => h(Segmented, { options: ['Daily', 'Weekly'], value: 'Daily' }),
  'select': () => h(Select, { value: 'a', open: false, options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }),
  'skeleton': () => h(Skeleton, { active: true }),
  'slider': () => h(Slider, { value: 30 }),
  'space': () => h(Space, null, {
    default: () => [
      h(Button, { type: 'default' }, { default: () => 'One' }),
      h(Button, { type: 'default' }, { default: () => 'Two' }),
    ],
  }),
  'spin': () => h(Spin, { spinning: true }, { default: () => h('div', 'Loading content') }),
  'splitter': () => h(Splitter, { style: { height: '100px' } }, {
    default: () => [
      h(SplitterPanel, { size: '50%' }, { default: () => 'Left Panel' }),
      h(SplitterPanel, { size: '50%' }, { default: () => 'Right Panel' }),
    ],
  }),
  'statistic': () => h(Statistic, { title: 'Active Users', value: 1128 }),
  'steps': () => h(Steps, { current: 1, items: [{ title: 'Start' }, { title: 'Process' }, { title: 'Done' }] }),
  'switch': () => h(Switch, { checked: true }),
  'table': () => h(Table, {
    pagination: false,
    columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
    dataSource: [{ key: '1', name: 'Jack' }],
  }),
  'tabs': () => h(Tabs, {
    items: [
      { key: '1', label: 'Tab 1', children: 'Tab content 1' },
      { key: '2', label: 'Tab 2', children: 'Tab content 2' },
    ],
  }),
  'tag': () => h(Tag, { color: 'blue' }, { default: () => 'Tag' }),
  'time-picker': () => h(TimePicker, { open: false }),
  'timeline': () => h(Timeline, { items: [{ children: 'Step 1' }, { children: 'Step 2' }] }),
  'tooltip': () => h(Tooltip, { title: 'Tooltip' }, { default: () => h('span', 'Hover me') }),
  'tour': () => h(Tour, {
    open: false,
    steps: [{ title: 'Step', description: 'Description', target: () => null }],
  }),
  'transfer': () => h(Transfer, {
    showSearch: false,
    targetKeys: ['1'],
    dataSource: [{ key: '1', title: 'Item 1' }, { key: '2', title: 'Item 2' }],
    render: (item: { title: string }) => item.title,
  }),
  'tree': () => h(Tree, {
    defaultExpandAll: true,
    treeData: [{ key: '0', title: 'Root', children: [{ key: '0-1', title: 'Child' }] }],
  }),
  'tree-select': () => h(TreeSelect, {
    value: '0-1',
    treeData: [{ value: '0', title: 'Root', children: [{ value: '0-1', title: 'Node' }] }],
  }),
  'typography': () => h(TypographyTitle, { level: 5 }, { default: () => 'Typography' }),
  'upload': () => h(Upload, { action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76' }, {
    default: () => h(Button, { type: 'default' }, { default: () => 'Upload' }),
  }),
  'watermark': () => h(Watermark, { content: 'Antdv' }, { default: () => h('div', 'Watermark content') }),
}

function pickHydrationMessages(messages: string[]) {
  return messages.filter(msg => /hydrat|mismatch|server rendered/i.test(msg))
}

function safeLogText(value: unknown) {
  if (typeof value === 'string')
    return value
  try {
    return inspect(value, { depth: 2, maxArrayLength: 20, breakLength: 120 })
  }
  catch {
    return '[Unserializable]'
  }
}

function collectCases(): ComponentCase[] {
  return sourceComponentSlugs
    .map((slug) => {
      const render = RENDERERS[slug]
      if (!render) {
        return null
      }
      return {
        slug,
        render,
        sourceDemo: resolveDemoSource(slug),
      } satisfies ComponentCase
    })
    .filter((item): item is ComponentCase => item !== null)
}

async function runHydrationScan(componentCase: ComponentCase): Promise<ScanResult> {
  const runtimeErrors: string[] = []
  const serverRoot = defineComponent({
    name: `HydrationCaseServer_${componentCase.slug}`,
    setup() {
      return () => componentCase.render()
    },
  })

  let serverHtml: string
  try {
    serverHtml = await renderToString(createSSRApp(serverRoot))
  }
  catch (error) {
    runtimeErrors.push(error instanceof Error ? error.stack || error.message : String(error))
    return {
      slug: componentCase.slug,
      sourceDemo: componentCase.sourceDemo,
      hydrationWarnings: [],
      runtimeErrors,
    }
  }

  testDom.window.document.body.innerHTML = `<div id="app">${serverHtml}</div>`

  const warnLogs: string[] = []
  const originalWarn = console.warn
  const originalError = console.error
  console.warn = (...args: unknown[]) => {
    warnLogs.push(args.map(safeLogText).join(' '))
  }
  console.error = (...args: unknown[]) => {
    runtimeErrors.push(args.map(safeLogText).join(' '))
  }

  try {
    const clientRoot = defineComponent({
      name: `HydrationCaseClient_${componentCase.slug}`,
      setup() {
        return () => componentCase.render()
      },
    })

    const app = createSSRApp(clientRoot)
    app.mount(testDom.window.document.querySelector('#app')!)
    await nextTick()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    app.unmount()
  }
  catch (error) {
    runtimeErrors.push(error instanceof Error ? error.stack || error.message : String(error))
  }
  finally {
    console.warn = originalWarn
    console.error = originalError
    testDom.window.document.body.innerHTML = ''
  }

  return {
    slug: componentCase.slug,
    sourceDemo: componentCase.sourceDemo,
    hydrationWarnings: pickHydrationMessages([...warnLogs, ...runtimeErrors]),
    runtimeErrors: runtimeErrors.filter(msg => !/hydrat|mismatch|server rendered/i.test(msg)),
  }
}

const describeHydrationScan = process.env.RUN_HYDRATION_SCAN === '1' ? describe : describe.skip

describeHydrationScan('component hydration scan', () => {
  it('checks one demo per component from playground list', async () => {
    const cases = collectCases()
    const results: ScanResult[] = []

    for (const componentCase of cases) {
      const result = await runHydrationScan(componentCase)
      results.push(result)
    }

    const hydrationProblemCases = results.filter(item => item.hydrationWarnings.length > 0)
    const runtimeProblemCases = results.filter(item => item.runtimeErrors.length > 0)

    const missingCases = sourceComponentSlugs.filter(slug => !cases.some(item => item.slug === slug))
    if (missingCases.length > 0) {
      throw new Error(`Missing hydration demo cases for: ${missingCases.join(', ')}`)
    }

    if (runtimeProblemCases.length > 0 || hydrationProblemCases.length > 0) {
      const issueText = [
        ...runtimeProblemCases.map((item) => {
          const firstError = item.runtimeErrors[0] ? item.runtimeErrors[0].split('\n')[0] : 'Unknown runtime error'
          return `[runtime] ${item.slug} (${item.sourceDemo}) -> ${firstError}`
        }),
        ...hydrationProblemCases.map(item => `[hydration] ${item.slug} (${item.sourceDemo}) -> ${item.hydrationWarnings.join(' | ')}`),
      ].join('\n')
      throw new Error(`Hydration scan found issues:\n${issueText}`)
    }

    expect(results.length).toBe(sourceComponentSlugs.length)
  }, 300_000)
})
