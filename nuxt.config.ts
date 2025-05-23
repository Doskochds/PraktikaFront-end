export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  app: {
    head: {
      meta: [
        { name: 'csrf-token', content: process.env.CSRF_TOKEN || '' }
      ]
    }
  },
  plugins: [
    '~/plugins/csrf-token.ts'
  ]
})
