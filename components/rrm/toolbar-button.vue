<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "toolbar-button",
  props: {},
  expose: ["Button", "ButtonClicked"]
})
</script>

<template>
  <button ref="Button" @click="$emit('ButtonClicked')" class="relative px-4 min-h-10 -:enabled:hover:bg-neutral-700 -:enabled:hover:text-primary transition-all duration-75 -:bg-neutral-800 -:text-neutral-200 text-lg">
    <slot/>
  </button>
</template>

<style scoped>

</style>