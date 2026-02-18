export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  devtools: { enabled: false },
  css: [
    '~/assets/entry.css',
  ],
  compatibilityDate: 'latest',
  antd: {
    icon: true,
    component: true,
  },
})
