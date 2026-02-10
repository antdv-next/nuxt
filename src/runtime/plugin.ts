import { defineNuxtPlugin } from '#app'
import { setStyleCollector } from '@antdv-next/cssinjs'

export default defineNuxtPlugin(
  (nuxtApp) => {
    const styles: string[] = []
    setStyleCollector({
      push(styleText: string) {
        styles.push(styleText)
      },
    })
    // 只在服务端 SSR 时挂载到 event.context 上（每请求隔离）
    if (import.meta.server && nuxtApp.ssrContext?.event) {
      nuxtApp.ssrContext.event.context.__antdvCssInJsStyles = styles
    }
  },
)
