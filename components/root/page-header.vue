<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "page-header",
  components: {},
  mounted() {
    window.onscroll = () => {
      if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        // Vertical Padding
        this.$refs.ButtonBox.classList.remove("py-4")
        this.$refs.ButtonBox.classList.add("py-2")
        // Text Size
        this.$refs.OuterBox.classList.add("text-base")
        this.$refs.OuterBox.classList.remove("text-lg")
        // Stripe Box
        this.$refs.StripeBox.classList.add("h-1")
        this.$refs.StripeBox.classList.remove("h-2")
      } else {
        // Vertical Padding
        this.$refs.ButtonBox.classList.add("py-4")
        this.$refs.ButtonBox.classList.remove("py-2")
        // Text Size
        this.$refs.OuterBox.classList.remove("text-base")
        this.$refs.OuterBox.classList.add("text-lg")
        // Stripe Box
        this.$refs.StripeBox.classList.add("h-2")
        this.$refs.StripeBox.classList.remove("h-1")
      }
    }
  }
})
</script>

<template>
  <div ref="OuterBox" class="fixed top-0 z-30 w-full h-fit text-lg bg-neutral-950 border-b-0 border-primary transition-all duration-200 ease-in-out flex flex-col">
    <div ref="ButtonBox" class="flex flex-row gap-4 px-8 py-4">
      <root-header-button link="/#Root">
        ../<span class="text-primary">Louis_Mayes</span>/<span class="text-secondary">Game_Developer</span>
      </root-header-button>
      <div class="grow"><!--Spacer--></div>
      <root-header-button link="/#Projects">Portfolio</root-header-button>
      <root-header-button link="/about">About Me</root-header-button>
      <root-header-button link="https://docs.google.com/document/d/e/2PACX-1vQR2-kWrB2AP7P29yfiA-OwDLkR5eT111ehCQF7gYD34HVrIs-DNCjhvSAPOfguYAmLlzhaz_YHUA9Z/pub">My CV</root-header-button>
      <root-header-button link="https://x.com/LouisMayes2001">
        <icon name="mdi:twitter" class="size-6 fill-neutral-400 hover:fill-neutral-200"/>
      </root-header-button>
      <root-header-button link="https://www.linkedin.com/in/louismayes/">
        <icon name="mdi:linkedin" class="size-6 fill-neutral-400 hover:fill-neutral-200"/>
      </root-header-button>
    </div>
    <div ref="StripeBox" class="stripes-primary w-full h-2 drop-shadow-lg"></div>
  </div>
</template>

<style scoped>

</style>