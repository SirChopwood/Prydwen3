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
  <div class="w-2/3 h-full mx-auto flex flex-col justify-center justify-items-center">
    <div ref="ButtonBox" v-if="page" class="flex flex-row gap-4 p-2 stripes-primary border-b-2 border-primary">
      <div class="text-5xl text-white font-bold" style="text-shadow:
    -2px -2px 0 #262626,
     0   -2px 0 #262626,
     2px -2px 0 #262626,
     2px  0   0 #262626,
     2px  2px 0 #262626,
     0    2px 0 #262626,
    -2px  2px 0 #262626,
    -2px  0   0 #262626;">{{page.title}}</div>
      <div class="grow"><!--Spacer--></div>
      <codeblock-button v-for="(text, index) in page.buttonTexts" :link="page.buttonLinks[index]">{{text}}</codeblock-button>
    </div>
    <ContentRenderer v-if="page" :value="page" class="prose flex flex-col justify-center justify-items-center"/>
  </div>
</template>

<style scoped>

</style>