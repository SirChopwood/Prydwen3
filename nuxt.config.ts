// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    css: [
        "vue-final-modal/style.css"
    ],
    nitro: {
        experimental: {
            openAPI: true
        }
    },
    hub: {
      bindings: {
        observability: {
          logs: true,
        },
      },
    },
})
