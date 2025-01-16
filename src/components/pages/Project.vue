<script lang="ts">
import {defineComponent, defineAsyncComponent } from 'vue'
import Highlighter from 'highlight.js/lib/common'
import "highlight.js/styles/atom-one-dark-reasonable.min.css"
import HeaderButton from "../core/HeaderButton.vue";
import { marked } from "marked";
import fm from "front-matter";


export default defineComponent({
  name: "Project",
  components: {HeaderButton},
  props: {
    mdSource: String
  },
  mounted: async function() {
    const sourceFile = await fetch(String("./../../"+this.mdSource+".md"))
    const markdown = fm(await sourceFile.text());
    const data = markdown.attributes
    this.$data.sourceData = markdown.attributes
    this.$refs.Markdown.innerHTML = marked.parse(markdown.body)
    Highlighter.highlightAll()
  },
  data(vm) {
      return {
        sourceData: Object
      }
  },
})
</script>

<template>
    <div class="w-2/3 h-full mx-auto flex flex-col justify-center justify-items-center">
      <div ref="ButtonBox" v-if="sourceData" class="flex flex-row gap-4 p-2 stripes-primary border-b-2 border-primary">
        <div class="text-5xl text-white font-bold" style="text-shadow:
    -2px -2px 0 #262626,
     0   -2px 0 #262626,
     2px -2px 0 #262626,
     2px  0   0 #262626,
     2px  2px 0 #262626,
     0    2px 0 #262626,
    -2px  2px 0 #262626,
    -2px  0   0 #262626;">{{sourceData.title}}</div>
        <div class="grow"><!--Spacer--></div>
        <HeaderButton v-for="(text, index) in sourceData.buttonTexts" :link="sourceData.buttonLinks[index]">{{text}}</HeaderButton>
      </div>
      <div ref="Markdown" class="prose flex flex-col justify-center justify-items-center"/>
    </div>
</template>

<style scoped>

</style>