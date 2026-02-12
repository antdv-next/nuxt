import { defineNitroPlugin } from 'nitropack/runtime'
import { extractStyle } from '@antdv-next/cssinjs'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html, { event }) => {
    const cache = event.context.__antdvCssInJsCache
    if (cache) {
      html.head.unshift(extractStyle(cache))
    }
  })
})
