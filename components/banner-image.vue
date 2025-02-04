<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "banner-image",
  props: {
    image: String,
    title: String,
    disabled: Boolean,
    link: String,
  }
})
</script>

<template>
  <div v-if="disabled || link === undefined" class="flex flex-col -:w-full h-auto outline outline-2 outline-neutral-800 hover:outline-neutral-700 rounded-md group transition-all duration-100 ease-in-out">
    <div class="object-none overflow-clip object-center">
      <nuxt-img class="w-full h-auto" :src="image" placeholder/>
    </div>
    <div class="w-full bg-neutral-900 border-t-2 border-neutral-800 flex flex-row items-center">
      <div class="text-primary font-bold border-r-2 border-secondary text-2xl px-4 py-1 mr-4 stripes">{{title}}</div>
      <div class="h-full px-4 py-1 truncate"><slot/></div>
    </div>
  </div>
  <a v-else :href="link" class="flex flex-col -:w-full h-auto outline outline-2 outline-neutral-800 hover:outline-primary rounded-md group transition-all duration-100 ease-in-out">
    <div class="object-none overflow-clip object-center">
      <nuxt-img class="w-full h-auto" :src="image" placeholder/>
    </div>
    <div class="w-full bg-neutral-900 border-t-2 border-neutral-800 flex flex-row items-center">
      <div class="text-primary font-bold border-r-2 border-secondary text-2xl px-4 py-1 mr-4 stripes">{{title}}</div>
      <div class="h-full px-4 py-1 truncate"><slot/></div>
    </div>
  </a>
</template>

<style scoped>

</style>