<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "panel"
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-white">
    <div id="Content" class="relative h-fit w-full">
      <slot />
    </div>
    <div class="grow min-h-2"></div>
    <page-footer name="Ramiris"/>
  </div>
</template>

<style scoped>

</style>