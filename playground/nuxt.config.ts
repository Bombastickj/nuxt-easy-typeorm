export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2024-10-25',
  typescript: {
    shim: false,
    typeCheck: true,
    strict: true,
  },
  // typeorm: {
  //   srcDir: 'my-typeorm',
  // },
})
