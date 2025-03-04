<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "page-footer",
  props: {
    name: String
  }
})
</script>

<template>
  <div ref="OuterBox" class="bottom-0 w-full h-fit stripes border-t-2 border-primary">
    <div class="px-10 py-2 w-full flex-row justify-center justify-items-center gap-8 text-lg font-jetbrains text-neutral-400 collapse hidden md:flex md:visible">
      <div>Website by <span class="text-primary">{{name}}</span> <img class="size-6 align-middle scale-125 inline" src="/images/misc/ramiris.png" alt="Ramiris Logo"></div>
      <div>Written in <span class="text-[#41B883]">Vue <icon name="mdi:vuejs" class="size-6 align-middle"/></span></div>
      <div>Styled with <span class="text-[#38BDF8]">Tailwind <icon name="mdi:tailwind" class="size-6 align-middle"/></span></div>
      <div>Built using <span class="text-[#41B883]">Nuxt / Hub <icon name="mdi:nuxt" class="size-6 align-middle"/></span></div>
    </div>
    <div class="flex flex-col visible md:hidden md:collapse justify-center justify-items-center w-full text-center">
      <div>Website by</div>
      <div class="text-primary">{{name}} <img class="size-6 align-middle scale-125 inline" src="/images/misc/ramiris.png" alt="Ramiris Logo"></div>
    </div>
  </div>
</template>

<style scoped>

</style>