<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "skill-card",
  props: {
    title: String,
    icon: String,
  }
})
</script>

<template>
  <div class="relative flex flex-col max-w-80 h-fit min-h-36 text-pretty outline outline-0 rounded-md overflow-clip outline-neutral-700 group-hover:outline-2 bg-neutral-900 transition-all duration-100 ease-in-out group">
    <span class="text-lg md:text-2xl border-b-2 border-secondary text-secondary font-bold pl-2 pr-8 mb-2 py-1 stripes">{{title}}</span>
    <span class="px-2"><slot/></span>
    <icon class="absolute size-3/4 -bottom-10 -right-20 -rotate-12 opacity-20 overflow-clip group-hover:-rotate-0 group-hover:-bottom-6 group-hover:-right-18 transition-all duration-300 ease-in-out" :name="icon"/>
  </div>
</template>

<style scoped>

</style>