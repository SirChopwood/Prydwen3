<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "page-footer"
})
</script>

<template>
  <div ref="OuterBox" class="bottom-0 w-full h-fit stripes border-t-2 border-primary">
    <div class="px-10 py-2 w-full flex flex-row justify-center justify-items-center gap-8 text-lg font-jetbrains text-neutral-400">
      <div>Website by <span class="text-primary">Louis Mayes</span> <img class="size-6 align-middle scale-125 inline" src="/images/misc/ramiris.png" alt="Ramiris Logo"></div>
      <div>Written in <span class="text-[#41B883]">Vue <icon name="mdi:vuejs" class="size-6 align-middle"/></span></div>
      <div>Styled with <span class="text-[#38BDF8]">Tailwind <icon name="mdi:tailwind" class="size-6 align-middle"/></span></div>
<!--      <div>Built using <span class="text-[#926CFF]">Vite</span></div>-->
      <div>Built using <span class="text-[#41B883]">Nuxt <icon name="mdi:nuxt" class="size-6 align-middle"/></span></div>
    </div>
  </div>
</template>

<style scoped>

</style>