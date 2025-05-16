<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "page-header",
  components: {},
  mounted() {
  }
})
</script>

<template>
  <div ref="OuterBox" class="fixed top-0 z-30 w-full h-fit text-base md:text-lg bg-neutral-950 border-b-0 border-primary transition-all duration-200 ease-in-out flex flex-col">
    <div ref="ButtonBox" class="flex flex-row flex-wrap gap-1 md:gap-4 px-2 py-2 md:px-8 md:py-4 items-center justify-around">
      <codeblock-button link="/#Home" class="collapse hidden md:block md:visible">
        ../<span class="text-primary">Louis_Mayes</span>/<span class="text-secondary">Game_Developer</span>
      </codeblock-button>
      <div class="grow collapse md:visible hidden md:block"><!--Spacer--></div>
      <codeblock-button link="/#Projects" class="block">Portfolio</codeblock-button>
      <codeblock-button link="/about/">About Me</codeblock-button>
      <codeblock-button link="https://docs.google.com/document/d/e/2PACX-1vQR2-kWrB2AP7P29yfiA-OwDLkR5eT111ehCQF7gYD34HVrIs-DNCjhvSAPOfguYAmLlzhaz_YHUA9Z/pub">My CV</codeblock-button>
      <codeblock-button link="https://x.com/LouisMayes2001">
        <icon name="mdi:twitter" class="size-6 fill-neutral-400 hover:fill-neutral-200"/>
      </codeblock-button>
      <codeblock-button link="https://www.linkedin.com/in/louismayes/">
        <icon name="mdi:linkedin" class="size-6 fill-neutral-400 hover:fill-neutral-200"/>
      </codeblock-button>
    </div>
    <div ref="StripeBox" class="stripes-primary w-full h-1 md:h-2 drop-shadow-lg"></div>
  </div>
</template>

<style scoped>

</style>