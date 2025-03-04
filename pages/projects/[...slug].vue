<script lang="ts" setup>
  const route = useRoute()
  const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('projects').path(route.path).first()
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
    <div ref="ButtonBox" v-if="page" class="flex flex-row gap-4 p-2 stripes-primary border-b-2 border-primary">
      <div class="text-xl md:text-5xl text-white font-bold bg-neutral-800 px-1">{{page.title}}</div>
      <div class="grow"><!--Spacer--></div>
      <codeblock-button v-for="(text, index) in page.buttonTexts" :link="page.buttonLinks[index]">{{text}}</codeblock-button>
    </div>
    <ContentRenderer v-if="page" :value="page" class="prose flex flex-col justify-center justify-items-center"/>
  </div>
</template>

<style scoped>

</style>