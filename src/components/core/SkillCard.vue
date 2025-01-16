<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SkillCard",
  props: {
    title: String,
    icon: String,
  }
})
</script>

<template>
  <div class="relative flex flex-col max-w-80 min-h-40 text-pretty outline outline-0 rounded-md overflow-clip outline-neutral-700 group-hover:outline-2 bg-neutral-900 transition-all duration-100 ease-in-out group">
    <span class="text-2xl border-b-2 border-secondary text-secondary font-bold pl-2 pr-8 mb-2 py-1 stripes">{{title}}</span>
    <span class="px-2"><slot/></span>
    <img class="absolute w-1/3 -bottom-8 -right-8 -rotate-12 opacity-20 h-auto overflow-clip group-hover:-rotate-0 group-hover:-bottom-4 group-hover:-right-4 transition-all duration-300 ease-in-out" :src="icon">
  </div>
</template>