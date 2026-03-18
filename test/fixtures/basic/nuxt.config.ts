import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  antd: {
    include: ['Affix', 'Alert'],
  },
})
