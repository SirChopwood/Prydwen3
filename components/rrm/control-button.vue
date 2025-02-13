<script lang="ts">
import {defineComponent} from 'vue'

const ButtonClassPreset: Record<string, Array<string>> = {
  Blue: ["border-blue-800", "hover:bg-blue-600", "text-blue-400"],
  Yellow: ["border-yellow-800", "hover:bg-yellow-600", "text-yellow-400"],
  Red: ["border-red-800", "hover:bg-red-600", "text-red-400"],
  Green: ["border-green-800", "hover:bg-green-600", "text-green-400"],
  Purple: ["border-purple-900", "hover:bg-purple-950", "text-purple-700"]
}

export default defineComponent({
  name: "control-button",
  props: {
    colour: String,
    icon: String,
  },
  expose: ["Button", "ButtonClicked"],
  mounted() {
    ButtonClassPreset[this.colour].forEach(style => {
      this.$refs.Button.classList.add(style)
    })
  }
})
</script>

<template>
  <button ref="Button" @click="$emit('ButtonClicked')" class="border-2 -:border-neutral-700 -:bg-neutral-900 -:hover:bg-neutral-600 disabled:bg-neutral-900 disabled:border-neutral-600 disabled:text-neutral-400 -:text-neutral-400 hover:text-white py-1 px-2 mx-1 my-2 rounded-md transition-all duration-75">
    <icon v-if="icon" :name="icon" class="size-5 -translate-y-[1px] align-middle mr-1"/>
    <slot />
  </button>
</template>

<style scoped>

</style>