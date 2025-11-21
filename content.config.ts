import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        projects: defineCollection({
            type: "page",
            source: 'projects/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                thumbnail: z.string(),
                timestamp: z.number(),
                tags: z.array(z.string()),
                buttonTexts: z.array(z.string()),
                buttonLinks: z.array(z.string()),
                hidden: z.string(),
            })
        })
    }
})