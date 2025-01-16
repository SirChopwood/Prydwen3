<script lang="ts">
import {defineComponent} from 'vue'
import HeaderButton from "./HeaderButton.vue";

export default defineComponent({
  name: "Header",
  components: {HeaderButton},
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
      <HeaderButton link="/#Root">
        ../<span class="text-primary">Louis_Mayes</span>/<span class="text-secondary">Game_Developer</span>
      </HeaderButton>
      <div class="grow"><!--Spacer--></div>
      <HeaderButton link="/#Projects">Portfolio</HeaderButton>
      <HeaderButton link="/about">About Me</HeaderButton>
      <HeaderButton link="/resume">My CV</HeaderButton>
      <HeaderButton link="https://x.com/LouisMayes2001">
        <svg class="h-6 w-auto fill-neutral-400 hover:fill-neutral-200" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 26 26">
          <path d="M 25.855469 5.574219 C 24.914063 5.992188 23.902344 6.273438 22.839844 6.402344 C 23.921875 5.75 24.757813 4.722656 25.148438 3.496094 C 24.132813 4.097656 23.007813 4.535156 21.8125 4.769531 C 20.855469 3.75 19.492188 3.113281 17.980469 3.113281 C 15.082031 3.113281 12.730469 5.464844 12.730469 8.363281 C 12.730469 8.773438 12.777344 9.175781 12.867188 9.558594 C 8.503906 9.339844 4.636719 7.246094 2.046875 4.070313 C 1.59375 4.847656 1.335938 5.75 1.335938 6.714844 C 1.335938 8.535156 2.261719 10.140625 3.671875 11.082031 C 2.808594 11.054688 2 10.820313 1.292969 10.425781 C 1.292969 10.449219 1.292969 10.46875 1.292969 10.492188 C 1.292969 13.035156 3.101563 15.15625 5.503906 15.640625 C 5.0625 15.761719 4.601563 15.824219 4.121094 15.824219 C 3.78125 15.824219 3.453125 15.792969 3.132813 15.730469 C 3.800781 17.8125 5.738281 19.335938 8.035156 19.375 C 6.242188 20.785156 3.976563 21.621094 1.515625 21.621094 C 1.089844 21.621094 0.675781 21.597656 0.265625 21.550781 C 2.585938 23.039063 5.347656 23.90625 8.3125 23.90625 C 17.96875 23.90625 23.25 15.90625 23.25 8.972656 C 23.25 8.742188 23.246094 8.515625 23.234375 8.289063 C 24.261719 7.554688 25.152344 6.628906 25.855469 5.574219"></path>
        </svg>
      </HeaderButton>
      <HeaderButton link="https://www.linkedin.com/in/louismayes/">
        <svg class="h-6 w-auto fill-neutral-400 hover:fill-neutral-200" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 26 26">
          <path d="M 21.125 0 L 4.875 0 C 2.183594 0 0 2.183594 0 4.875 L 0 21.125 C 0 23.816406 2.183594 26 4.875 26 L 21.125 26 C 23.816406 26 26 23.816406 26 21.125 L 26 4.875 C 26 2.183594 23.816406 0 21.125 0 Z M 8.039063 22.070313 L 4 22.070313 L 3.976563 9.976563 L 8.015625 9.976563 Z M 5.917969 8.394531 L 5.894531 8.394531 C 4.574219 8.394531 3.722656 7.484375 3.722656 6.351563 C 3.722656 5.191406 4.601563 4.3125 5.945313 4.3125 C 7.289063 4.3125 8.113281 5.191406 8.140625 6.351563 C 8.140625 7.484375 7.285156 8.394531 5.917969 8.394531 Z M 22.042969 22.070313 L 17.96875 22.070313 L 17.96875 15.5 C 17.96875 13.910156 17.546875 12.828125 16.125 12.828125 C 15.039063 12.828125 14.453125 13.558594 14.171875 14.265625 C 14.066406 14.519531 14.039063 14.867188 14.039063 15.222656 L 14.039063 22.070313 L 9.945313 22.070313 L 9.921875 9.976563 L 14.015625 9.976563 L 14.039063 11.683594 C 14.5625 10.875 15.433594 9.730469 17.519531 9.730469 C 20.105469 9.730469 22.039063 11.417969 22.039063 15.046875 L 22.039063 22.070313 Z"></path>
        </svg>
      </HeaderButton>
    </div>
    <div ref="StripeBox" class="stripes-primary w-full h-2 drop-shadow-lg"></div>
  </div>
</template>