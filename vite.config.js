import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import {plugin as Markdown, Mode} from 'vite-plugin-markdown'
import { globSync } from 'glob'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        Vue({
            include: [/\.vue$/],
        }),
        // Markdown({
        //     mode: [Mode.HTML],
        //     markdownIt: {
        //         linkify: true,
        //         typographer: true,
        //         html: true
        //   }
        // })
    ],
    build: {
        manifest: true,
        rollupOptions: {
            input: ['./src/main.js'], //, ...globSync("src/{assets,projects}/**/*.{png,jpg,jpeg,gif,svg,md})" , ...globSync("src/{assets,projects}/**/*.{md}")
        },
    },
    //publicDir: "./src/assets",
    assetsInclude: ['**/*.md'],
})
