// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        "/rrm/**": {ssr: false}
    },
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
      "@nuxt/image",
      "@nuxt/icon",
      "@nuxt/content",
      "@nuxt/fonts",
      "@nuxtjs/tailwindcss",
      "nuxt-auth-utils",
      "@nuxthub/core"
    ],
    image: {},
    icon: {},
    fonts: {},
    tailwindcss: {},
    nitro: {
        experimental: {
            openAPI: true,
            websocket: true
        },
        storage: {
            db: {
                driver: 'fs',
                base: './.data/db'
            }
        }
    },
    hub: {
      bindings: {
        observability: {
          logs: true,
        },
      },
      workers: true
    },
})
