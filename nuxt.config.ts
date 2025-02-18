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
      "@prisma/nuxt",
      "nuxt-auth-utils"
    ],
    image: {},
    icon: {},
    fonts: {},
    tailwindcss: {},
    prisma: {
        autoSetupPrisma: true,
    },
    css: [
        "vue-final-modal/style.css"
    ],
    nitro: {
        experimental: {
            openAPI: true
        }
    }
})