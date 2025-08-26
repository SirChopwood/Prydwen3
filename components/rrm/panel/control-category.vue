<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "control-category",
  props: {
    title: String,
    subtitle: String,
  }
})
</script>

<template>
  <div class="w-full h-fit rounded-md text-left bg-neutral-900">
    <label class="relative flex flex-row justify-center justify-items-center text-pretty outline outline-0 rounded-md overflow-clip stripes peer">
      <input type="checkbox" class="peer size-0 opacity-0">
      <div ref="Title" class="grow text-xl text-secondary font-bold px-2 py-1 select-none">
        {{ title }}
      </div>
      <icon name="material-symbols:folder-open-outline" class="size-6 my-auto mx-4 peer-checked:hidden"/>
      <icon name="material-symbols:folder-limited-outline-rounded" class="size-6 my-auto mx-4 collapse peer-checked:visible"/>
    </label>
    <div class="px-2 pb-2 peer-has-[:checked]:hidden mt-2 text-neutral-200">
      <div class="italic">{{ subtitle }}</div>
      <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>