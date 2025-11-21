<script lang="ts" setup>
  const route = useRoute()
  const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('projects').path(route.path).first()
  })
  useSeoMeta({
    title: page.value!.title,
    ogTitle: page.value!.title,
    description: page.value!.description,
    ogDescription: page.value!.description,
    ogImage: `https://louismayes.xyz${page.value!.thumbnail}`,
    twitterImage: `https://louismayes.xyz${page.value!.thumbnail}`,
    twitterCard: 'summary_large_image',
    author: "Louis Mayes",
    articlePublishedTime: new Date(page.value!.timestamp).toString(),
    articleTag: page.value!.tags,
  })
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "[...slug]"
})
</script>

<template>
  <Title>{{ page.title }}</Title>
  <div class="px-4 w-full md:w-2/3 h-full md:mx-auto flex flex-col justify-center justify-items-center">
    <div ref="ButtonBox" v-if="page" class="p-2 stripes-primary border-b-2 border-primary">
      <div class="px-1 flex gap-1 flex-col">
        <div class="flex flex-row gap-4">
          <div class="codeblock w-fit">{{ new Date(Math.floor(page.timestamp*1000)).toLocaleString("EN-GB", {dateStyle: "short"}) }}</div>
          <div class="grow"><!--Spacer--></div>
          <codeblock-button v-for="(text, index) in page.buttonTexts" :link="page.buttonLinks[index]">
            <span class="after:content-['_↗'] text-nowrap">{{text}}</span>
          </codeblock-button>
        </div>
        <div class="text-xl md:text-5xl codeblock text-white font-bold px-1 pb-1 w-fit">{{page.title}}</div>
      </div>
    </div>
    <ContentRenderer v-if="page" :value="page" class="prose flex flex-col justify-center justify-items-center"/>
  </div>
</template>

<style scoped>

</style>